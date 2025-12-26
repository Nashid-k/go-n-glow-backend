import mongoose, { Document, Schema } from 'mongoose';

export interface IService extends Document {
    salonId: mongoose.Types.ObjectId;
    name: string;
    description: string;
    category: string;
    price: number;
    duration: number; // in minutes
    image: string;
    createdAt: Date;
    updatedAt: Date;
}

const serviceSchema = new Schema<IService>(
    {
        salonId: {
            type: Schema.Types.ObjectId,
            ref: 'Salon',
            required: true,
        },
        name: {
            type: String,
            required: [true, 'Please add a service name'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Please add a description'],
        },
        category: {
            type: String,
            required: [true, 'Please add a category'],
            enum: ['Hair', 'Nails', 'Facial', 'Spa', 'Makeup', 'Waxing', 'Massage', 'Other'],
        },
        price: {
            type: Number,
            required: [true, 'Please add a price'],
            min: 0,
        },
        duration: {
            type: Number,
            required: [true, 'Please add duration in minutes'],
            min: 15,
        },
        image: {
            type: String,
            default: '/placeholder-service.jpg',
        },
    },
    {
        timestamps: true,
    }
);

// Create indexes
serviceSchema.index({ salonId: 1 });
serviceSchema.index({ category: 1 });

export default mongoose.model<IService>('Service', serviceSchema);
