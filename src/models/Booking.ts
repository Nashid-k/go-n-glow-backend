import mongoose, { Document, Schema } from 'mongoose';

export interface IBooking extends Document {
    userId: mongoose.Types.ObjectId;
    salonId: mongoose.Types.ObjectId;
    serviceIds: mongoose.Types.ObjectId[];
    date: Date;
    timeSlot: string;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    totalPrice: number;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        salonId: {
            type: Schema.Types.ObjectId,
            ref: 'Salon',
            required: true,
        },
        serviceIds: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Service',
                required: true,
            },
        ],
        date: {
            type: Date,
            required: [true, 'Please add a booking date'],
        },
        timeSlot: {
            type: String,
            required: [true, 'Please add a time slot'],
        },
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'cancelled', 'completed'],
            default: 'pending',
        },
        totalPrice: {
            type: Number,
            required: true,
            min: 0,
        },
        notes: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

// Create indexes for efficient querying
bookingSchema.index({ userId: 1, createdAt: -1 });
bookingSchema.index({ salonId: 1, date: 1 });
bookingSchema.index({ status: 1 });

export default mongoose.model<IBooking>('Booking', bookingSchema);
