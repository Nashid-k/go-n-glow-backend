import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';

// Generate JWT Token
const generateToken = (id: string, role: string): string => {
    const jwtSecret = process.env.JWT_SECRET;\n    if (!jwtSecret) throw new Error('JWT_SECRET must be configured.');\n    return jwt.sign({ id, role }, jwtSecret, {
        expiresIn: '30d',
    });
};

// @desc    Register user
// @route   POST /api/auth/signup
// @access  Public
export const signup = async (req: Request, res: Response) => {
    try {
        const { name, email, password, phone, location } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            phone,
            location,
            role: 'user',
        });

        const token = generateToken(user._id.toString(), user.role);

        res.status(201).json({
            success: true,
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                token,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error instanceof Error ? error.message : 'Server error' });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Check for user
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const token = generateToken(user._id.toString(), user.role);

        res.status(200).json({
            success: true,
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                token,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error instanceof Error ? error.message : 'Server error' });
    }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: AuthRequest, res: Response) => {
    try {
        const user = await User.findById(req.user?.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error instanceof Error ? error.message : 'Server error' });
    }
};

// @desc    Forgot password (Mocked OTP)
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Mock OTP generation
        const mockOTP = '123456';
        console.log(`Mock OTP for ${email}: ${mockOTP}`);

        res.status(200).json({
            success: true,
            message: 'OTP sent to email (mocked)',
            data: { otp: mockOTP }, // In production, this should NOT be sent in response
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error instanceof Error ? error.message : 'Server error' });
    }
};

// @desc    Verify OTP and reset password (Mocked)
// @route   POST /api/auth/verify-otp
// @access  Public
export const verifyOTP = async (req: Request, res: Response) => {
    try {
        const { email, otp, newPassword } = req.body;

        // Mock OTP verification (in real app, check against stored OTP)
        if (otp !== '123456') {
            return res.status(400).json({ success: false, message: 'Invalid OTP' });
        }

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password reset successfully',
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error instanceof Error ? error.message : 'Server error' });
    }
};
