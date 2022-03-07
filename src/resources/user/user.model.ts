import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import User from '@/resources/user/user.interface';

const UserSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        imagePath: {
            type: String,
        },
        password: {
            type: String,
        },
        status: {
            type: String,
        },
        permissions: {
            type: String,
            default: 'owner',
            enum: ['owner', 'products', 'finance', 'orders', 'purchases'],
            required: true,
        },
        resetCode: {
            type: Number,
        },
        resetCodeDate : {
            type: Date,
        },  
        confirmationToken: {
            type: String,
        },
        lastResetDate: {
            type: Date,
        },
    },
    { timestamps: true },
);

UserSchema.pre<User>('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    const hash = await bcrypt.hash(this.password, 10);

    this.password = hash;

    next();
});
UserSchema.methods.changeUserPassword = async function (
    password: string,
): Promise<typeof UserSchema | Error> {
    this.password = password;
    return await this.save();
};
UserSchema.methods.updateProfileImage = async function (
    imagePath: string,
): Promise<typeof UserSchema | Error> {
    this.imagePath = imagePath;
    return await this.save();
};
UserSchema.methods.resetPasswordCode = async function (
    digits: number,
): Promise<typeof UserSchema | Error> {
    this.resetCode = digits;
    this.lastResetDate = Date.now();
    return await this.save();
};
UserSchema.methods.resetPasswordCode = async function (
    digits: number,
): Promise<typeof UserSchema | Error> {
    if (new Date().toISOString() >   thisresetCodeDate   if (this.resetCode == digits) ;
    this.lastResetDate = Date.now();
    return await this.save();
};


UserSchema.methods.isValidPassword = async function (
    password: string,
): Promise<Error | boolean> {
    return await bcrypt.compare(password, this.password);
};
export default model<User>('User', UserSchema);
