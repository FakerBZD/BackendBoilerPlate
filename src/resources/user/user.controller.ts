import { Router, Request, Response, NextFunction } from 'express';
import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import validationMiddleware from '@/middleware/validation.middleware';
import validate from '@/resources/user/user.validation';
import UserService from '@/resources/user/user.service';
import authenticated from '@/middleware/authenticated.middleware';
import DiskStorage from '@/utils/helpers/diskStorage';

class UserController implements Controller {
    public path = '/users';
    public router = Router();
    private UserService = new UserService();
    private DiskStorage = new DiskStorage('uploads/profileImages');
    constructor() {
        this.initialiseRoutes();
    }

    private initialiseRoutes(): void {
        this.router.post(
            `${this.path}/register`,
            validationMiddleware(validate.registerUser),
            this.register,
        );
        this.router.post(
            `${this.path}/login`,
            validationMiddleware(validate.loginUser),
            this.login,
        );
        this.router.get(`${this.path}`, authenticated, this.getUser);

        this.router.patch(
            `${this.path}/update_password`,
            authenticated,
            validationMiddleware(validate.updateUserPassword),
            this.updateUserPassword,
        );
        this.router.post(
            `${this.path}/update_profile_image`,
            authenticated,
            this.DiskStorage.diskMulter.single('file'),
            this.updateProfileImage,
        );
        this.router.post(
            `${this.path}/resetPassword_Email`,
            validationMiddleware(validate.resetPasswordEmail),
            this.resetPasswordEmail,
        );
        this.router.post(
            `${this.path}/confirmReset_Password`,
            validationMiddleware(validate.resetPasswordEmail),
            this.confirmResetPassword,
        );
    }

    private register = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response | void> => {
        try {
            const { name, email } = req.body;

            const token = await this.UserService.register(name, email, 'owner');
            res.status(201).json({ message: 'User registerd with sucess' });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };

    private login = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response | void> => {
        try {
            const { email, password } = req.body;

            const token = await this.UserService.login(email, password);

            res.status(200).json({ message: token });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };

    private getUser = (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Response | void => {
        if (!req.user) {
            return next(new HttpException(404, 'No logged in user'));
        }

        res.status(200).send({ data: req.user });
    };
    private updateUserPassword = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response | void> => {
        try {
            const userID = req.user._id;
            const { oldPassword, newPassword } = req.body;
            await this.UserService.updateUserPassword(
                userID,
                oldPassword,
                newPassword,
            );

            res.status(200).json({ message: 'Password updated with sucess' });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };
    private updateProfileImage = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response | void> => {
        try {
            if (!req.file)
                throw new HttpException(
                    400,
                    'Error occured during the image upload',
                );
            else {
                try {
                    const userID = req.user._id;
                    const imagePath = req.file.path;
                    await this.UserService.updateProfileImage(
                        imagePath,
                        userID,
                    );
                    res.send('image updated succ');
                } catch {}
            }
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };
    private resetPasswordEmail = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response | void> => {
        try {
            const { email } = req.body;
            const response = await this.UserService.resetPasswordEmail(email);
            res.send({ success: response });
        } catch (error: any) {
            throw new HttpException(400, error.message);
        }
    };
    private confirmResetPassword = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response | void> => {
        try {
            const { pinCode } = req.body;
            const response = await this.UserService.resetPasswordConfirmation(pinCode);
            res.send({ success: response });
        } catch (error: any) {
            throw new HttpException(400, error.message);
        }
    };
}

export default UserController;
