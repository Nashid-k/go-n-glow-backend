import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    phone: string;
    role: 'user' | 'admin';
    location?: {
        city: string;
        coordinates?: {
            lat: number;
            lng: number;
        };
    };
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: [true, 'Please add a name'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Please add an email'],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, 'Please add a password'],
            minlength: 6,
            select: false,
        },
        phone: {
            type: String,
            required: [true, 'Please add a phone number'],
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
        location: {
            city: String,
            coordinates: {
                lat: Number,
                lng: Number,
            },
        },
    },
    {
        timestamps: true,
    }
);

// Create index for email
userSchema.index({ email: 1 });

export default mongoose.model<IUser>('User', userSchema);
