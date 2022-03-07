import { Document } from 'mongoose';

interface User extends Document {
    email: string;
    name: string;
    imagePath: string;
    password: string;
    role: string;

    isValidPassword(password: string): Promise<Error | boolean>;
    changeUserPassword(password: string): Promise<boolean | Error>;
    updateProfileImage(imagePath: string): Promise<boolean | Error>;
    resetPasswordCode(digits: number): Promise<boolean | Error>;
}
export default User;
