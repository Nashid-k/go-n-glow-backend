import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
    user?: {
        id: string;
        role: string;
    };
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
        return res.status(500).json({ success: false, message: 'Authentication is not configured.' });
    }
    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }

    try {
        const decoded = jwt.verify(token, jwtSecret) as { id: string; role: string };
        req.user = decoded;
        return next();
    } catch {
        return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
};

export const authorize = (...roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ success: false, message: 'User role is not authorized to access this route' });
        }
        return next();
    };
};
