import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Salon from './models/Salon';
import Service from './models/Service';
import User from './models/User';
import bcrypt from 'bcryptjs';

dotenv.config();

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/go-n-glow');
        console.log('Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({});
        await Salon.deleteMany({});
        await Service.deleteMany({});
        console.log('Cleared existing data');

        // Create admin user
        const hashedPassword = await bcrypt.hash('admin123', 10);
        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@gonnglow.com',
            password: hashedPassword,
            phone: '+91 9876543210',
            role: 'admin',
            location: { city: 'Mumbai' }
        });
        console.log('Admin user created');

        // Create sample salons
        const salons = await Salon.insertMany([
            {
                name: 'Glamour Studio',
                description: 'Premium salon offering luxury beauty and grooming services',
                location: {
                    address: '123 MG Road',
                    city: 'Mumbai',
                },
                rating: 4.5,
                reviewCount: 120,
                images: ['/placeholder-salon.jpg'],
            },
            {
                name: 'Beauty Haven',
                description: 'Your one-stop destination for all beauty needs',
                location: {
                    address: '45 Connaught Place',
                    city: 'Delhi',
                },
                rating: 4.7,
                reviewCount: 95,
                images: ['/placeholder-salon.jpg'],
            },
            {
                name: 'Elegance Salon',
                description: 'Modern salon with expert stylists and latest trends',
                location: {
                    address: '78 Brigade Road',
                    city: 'Bangalore',
                },
                rating: 4.3,
                reviewCount: 78,
                images: ['/placeholder-salon.jpg'],
            },
            {
                name: 'Style Zone',
                description: 'Affordable beauty services with professional care',
                location: {
                    address: '56 Mount Road',
                    city: 'Chennai',
                },
                rating: 4.6,
                reviewCount: 110,
                images: ['/placeholder-salon.jpg'],
            },
            {
                name: 'The Glow Studio',
                description: 'Spa and salon services for complete relaxation',
                location: {
                    address: '90 FC Road',
                    city: 'Pune',
                },
                rating: 4.8,
                reviewCount: 145,
                images: ['/placeholder-salon.jpg'],
            }
        ]);
        console.log('Salons created');

        // Create services for each salon
        const serviceCategories = ['Hair', 'Nails', 'Facial', 'Spa', 'Makeup', 'Waxing'];

        for (const salon of salons) {
            const salonServices = [
                {
                    salonId: salon._id,
                    name: 'Haircut & Styling',
                    description: 'Professional haircut with expert styling',
                    category: 'Hair',
                    price: 500,
                    duration: 45,
                    image: '/placeholder-service.jpg'
                },
                {
                    salonId: salon._id,
                    name: 'Manicure & Pedicure',
                    description: 'Complete nail care treatment',
                    category: 'Nails',
                    price: 800,
                    duration: 60,
                    image: '/placeholder-service.jpg'
                },
                {
                    salonId: salon._id,
                    name: 'Facial Treatment',
                    description: 'Deep cleansing and rejuvenating facial',
                    category: 'Facial',
                    price: 1200,
                    duration: 75,
                    image: '/placeholder-service.jpg'
                },
                {
                    salonId: salon._id,
                    name: 'Full Body Massage',
                    description: 'Relaxing body massage with aromatherapy',
                    category: 'Spa',
                    price: 2000,
                    duration: 90,
                    image: '/placeholder-service.jpg'
                },
                {
                    salonId: salon._id,
                    name: 'Bridal Makeup',
                    description: 'Complete bridal makeup package',
                    category: 'Makeup',
                    price: 5000,
                    duration: 120,
                    image: '/placeholder-service.jpg'
                }
            ];

            const createdServices = await Service.insertMany(salonServices);

            // Update salon with service references
            await Salon.findByIdAndUpdate(salon._id, {
                $set: { services: createdServices.map((s: any) => s._id) }
            });
        }
        console.log('Services created and linked to salons');

        console.log('\n✅ Database seeded successfully!');
        console.log('\nTest Credentials:');
        console.log('Email: admin@gonnglow.com');
        console.log('Password: admin123');
        console.log('\nSalons created:', salons.length);
        console.log('Services per salon: 5');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
