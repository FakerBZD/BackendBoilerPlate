import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import User from '@/resources/user/user.interface';
import { number } from 'joi';

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
UserSchema.methods.resetPasswordEmail = async function (
    digits: number,
): Promise<typeof UserSchema | Error> {
    this.resetCode = digits;
    this.lastResetDate = Date.now();
    return await this.save();
};
UserSchema.methods.resetPasswordCode = async function (
    digits: number,
    newPassword: string,
): Promise<typeof UserSchema | Error> {
    if (digits === this.resetCode) {
        const timeDiffrence: number =
            (Date.now() - this.lastResetDate.getTime()) / 60000;
        if (timeDiffrence <= 30) {
            this.password = newPassword;
            this.resetCode= null;
            return await this.save();
        } else {
            throw Error('fail to register new password ');
        }
    } else {
        throw Error('wrong digits number ');
    }
};

UserSchema.methods.isValidPassword = async function (
    password: string,
): Promise<Error | boolean> {
    return await bcrypt.compare(password, this.password);
};
export default model<User>('User', UserSchema);
