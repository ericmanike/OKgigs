import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBundle extends Document {
    network: 'MTN' | 'Telecel' | 'AirtelTigo';
    name: string; // e.g. "1GB", "2.5GB"
    sizeValue: number; // Value in MB for sorting/calc if needed, e.g. 1024
    price: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const BundleSchema = new Schema<IBundle>(
    {
        network: { type: String, enum: ['MTN', 'Telecel', 'AirtelTigo'], required: true },
        name: { type: String, required: true },
        sizeValue: { type: Number, default: 0 },
        price: { type: Number, required: true },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

const Bundle: Model<IBundle> = mongoose.models.Bundle || mongoose.model<IBundle>('Bundle', BundleSchema);

export default Bundle;
