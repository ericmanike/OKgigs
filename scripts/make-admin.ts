import { loadEnvConfig } from '@next/env';
import mongoose from 'mongoose';
import User from '../models/User';

// Load environment variables from .env.local
const projectDir = process.cwd();
loadEnvConfig(projectDir);

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('Error: MONGODB_URI is not defined in environment variables.');
    process.exit(1);
}

const makeAdmin = async () => {
    const email = process.argv[2];

    if (!email) {
        console.error('Please provide an email address.');
        console.log('Usage: npx tsx scripts/make-admin.ts <email>');
        process.exit(1);
    }

    try {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(MONGODB_URI);
            console.log('Connected to MongoDB.');
        }

        const user = await User.findOne({ email });

        if (!user) {
            console.error(`User with email "${email}" not found.`);
            process.exit(1);
        }

        user.role = 'admin';
        await user.save();

        console.log(`Success! User "${user.name}" (${user.email}) is now an Admin.`);
    } catch (error) {
        console.error('Error updating user:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
};

makeAdmin();
