import 'dotenv/config';
import 'module-alias/register';
import validateEnv from '@/utils/validateEnv';
import App from './app';
import UserController from '@/resources/user/user.controller';
validateEnv();
const app = new App(
    [new UserController()],
    Number(process.env.PORT),
    String(process.env.SENDGRID_API_KEY),
    String(process.env.SENTRYKEY),
);
app.listen();
