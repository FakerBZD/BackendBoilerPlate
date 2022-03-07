import userModel from '@/resources/user/user.model';
import { createToken } from '@/utils/token';
import HttpException from '@/utils/exceptions/http.exception';
import generators from '@/utils/helpers/generators';
import sgMail from '@sendgrid/mail';
import { UserRegisterHtml } from '@/utils/helpers/emails/registerEmail';
import { UserResetPasswordHtml } from '@/utils/helpers/emails/resetPasswordEmail';

class UserService {
    public async register(
        name: string,
        email: string,
        role: string,
    ): Promise<string | Error> {
        try {
            const userExist = await userModel.findOne({ email: email });
            if (!userExist) {
                const password = generators.generatePassword();

                const newuser = await userModel.create({
                    name,
                    email,
                    password,
                    role,
                });
                return sgMail
                    .send({
                        to: email,
                        from: 'support@logistio-erp.com',
                        subject: 'Welcome to Logistio ERP',
                        text: 'Credentials',
                        html: UserRegisterHtml(name, email, password),
                    })
                    .then((response) => {
                        return 'Email sent with the login credentials ';
                    })
                    .catch((error) => {
                        throw new HttpException(
                            400,
                            'Error occured during the creation of your acccount please contact support@logitio-erp.com',
                        );
                    });
            } else throw new HttpException(400, 'User already exist');
        } catch (error: any) {
            throw error;
        }
    }

    public async login(
        email: string,
        password: string,
    ): Promise<string | Error> {
        try {
            const user = await userModel.findOne({ email });
            if (!user) {
                throw Error('Wrong credentials given');
            }

            if (await user.isValidPassword(password)) {
                return createToken(user);
            } else {
                throw new Error('Wrong credentials given');
            }
        } catch (error: any) {
            throw new Error(error || 'Unable to login the user');
        }
    }
    public async updateUserPassword(
        userID: string,
        oldPassword: string,
        newpassowrd: string,
    ): Promise<string | Error> {
        try {
            const user = await userModel.findById(userID);
            if (!user || !(await user.isValidPassword(oldPassword)))
                throw new HttpException(401, 'Wrong credentials given');
            await user.changeUserPassword(newpassowrd);
            return 'User password updated with success';
        } catch (error: any) {
            throw new Error(error || 'Unable to update the user');
        }
    }
    public async updateProfileImage(
        imagePath: string,
        userID: string,
    ): Promise<string | Error> {
        try {
            const user = await userModel.findById(userID);
            if (!user) throw new HttpException(401, 'User not found');
            try {
                await user.updateProfileImage(imagePath);
                return 'image saved successfully';
            } catch {
                throw new HttpException(
                    400,
                    'Error occured during saving image',
                );
            }
        } catch (error: any) {
            throw new Error(error || 'Unable to update the user');
        }
    }

    public async resetPasswordEmail(email: string): Promise<string | Error> {
        try {
            const userExist = await userModel.findOne({ email: email });
            if (userExist) {
                const digits = generators.generateDigits();
                await userExist.resetPasswordEmail(digits);

                return sgMail
                    .send({
                        to: email,
                        from: 'support@logistio-erp.com',
                        subject: 'Welcome to Logistio ERP',
                        text: 'Credentials',
                        html: UserResetPasswordHtml(digits),
                    })
                    .then((response) => {
                        return 'Email sent with the 6 digits ';
                    })
                    .catch((error) => {
                        throw new HttpException(
                            400,
                            'Error occured during sending the email please contact support@logitio-erp.com',
                        );
                    });
            } else throw new HttpException(400, 'User do not exist');
        } catch (error: any) {
            throw error;
        }
    }
    public async resetPasswordConfirmation(email: string, codePin: number): Promise<string | Error> {
        try {
            const userExist = await userModel.findOne({ email: email });
            if (userExist) {
                await userExist.resetPasswordCode(codePin);

           
            } else throw new HttpException(400, 'User do not exist');
        } catch (error: any) {
            throw error;
        }
    }

    
}

export default UserService;
