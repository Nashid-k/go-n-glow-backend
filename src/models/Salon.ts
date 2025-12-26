import mongoose, { Document, Schema } from 'mongoose';

export interface ISalon extends Document {
    name: string;
    description: string;
    location: {
        address: string;
        city: string;
        coordinates?: {
            lat: number;
            lng: number;
        };
    };
    images: string[];
    rating: number;
    reviewCount: number;
    openingHours: {
        [key: string]: {
            open: string;
            close: string;
        };
    };
    services: mongoose.Types.ObjectId[];
    availability: Array<{
        date: Date;
        slots: string[];
    }>;
    createdAt: Date;
    updatedAt: Date;
}

const salonSchema = new Schema<ISalon>(
    {
        name: {
            type: String,
            required: [true, 'Please add a salon name'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Please add a description'],
        },
        location: {
            address: {
                type: String,
                required: [true, 'Please add an address'],
            },
            city: {
                type: String,
                required: [true, 'Please add a city'],
            },
            coordinates: {
                lat: Number,
                lng: Number,
            },
        },
        images: {
            type: [String],
            default: ['/placeholder-salon.jpg'],
        },
        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        reviewCount: {
            type: Number,
            default: 0,
        },
        openingHours: {
            type: Map,
            of: {
                open: String,
                close: String,
            },
            default: {
                monday: { open: '09:00', close: '20:00' },
                tuesday: { open: '09:00', close: '20:00' },
                wednesday: { open: '09:00', close: '20:00' },
                thursday: { open: '09:00', close: '20:00' },
                friday: { open: '09:00', close: '20:00' },
                saturday: { open: '10:00', close: '18:00' },
                sunday: { open: '10:00', close: '18:00' },
            },
        },
        services: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Service',
            },
        ],
        availability: [
            {
                date: Date,
                slots: [String],
            },
        ],
    },
    {
        timestamps: true,
    }
);

// Create index for location-based search
salonSchema.index({ 'location.city': 1 });
salonSchema.index({ rating: -1 });

export default mongoose.model<ISalon>('Salon', salonSchema);
