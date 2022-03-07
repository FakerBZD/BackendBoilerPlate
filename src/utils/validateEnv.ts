import { cleanEnv, str, port } from 'envalid';
function validateEnv(): void {
    cleanEnv(process.env, {
        NODE_ENV: str({
            choices: ['development', 'production'],
        }),
        MONGO_USER: str(),
        MONGO_PASSWORD: str(),
        MONGO_PATH: str(),
        PORT: port({ default: 5000 }),
        JWT_SECRET: str(),
        SENDGRID_API_KEY: str(),
        SENTRYKEY: str(),
    });
}
export default validateEnv;
