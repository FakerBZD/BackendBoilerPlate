import express, { Application } from 'express';
import mongoose from 'mongoose';
import compression from 'compression';
import cors from 'cors';
import morgan from 'morgan';
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import Controller from '@/utils/interfaces/controller.interface';
import ErrorMiddleware from '@/middleware/error.middleware';
import helmet from 'helmet';
import sgMail from '@sendgrid/mail';

class App {
    public express: Application;
    public port: number;
    public mailSenderKey: string;
    public sentryKey: string;
    constructor(
        controllers: Controller[],
        port: number,
        mailSenderKey: string,
        sentryKey: string,
    ) {
        this.express = express();
        this.port = port;
        this.mailSenderKey = mailSenderKey;
        this.sentryKey = sentryKey;

        this.initialiseDatabaseConnection();
        this.initialiseSentry();
        this.initialiseMiddleware();
        this.initialiseControllers(controllers);
        this.initialiseErrorHandling();
        this.initialiseMailSender();
    }
    private initialiseMiddleware(): void {
        this.express.use(helmet());
        this.express.use(cors());
        this.express.use(morgan('dev'));
        this.express.use(express.json());
        this.express.use(express.urlencoded({ extended: false }));
        this.express.use(compression());
        this.express.use(Sentry.Handlers.errorHandler());
        this.express.use(Sentry.Handlers.requestHandler());
        this.express.use(Sentry.Handlers.tracingHandler());
    }
    private initialiseControllers(controllers: Controller[]): void {
        controllers.forEach((controller) => {
            this.express.use('/api', controller.router);
        });
    }

    private initialiseErrorHandling(): void {
        this.express.use(ErrorMiddleware);
    }

    private initialiseDatabaseConnection(): void {
        const { MONGO_USER, MONGO_PASSWORD, MONGO_PATH } = process.env;

        mongoose
            .connect(
                `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}`,
            )
            .then(() => {
                // eslint-disable-next-line no-console
                console.log('Database connected successfully');
            })
            .catch((error) => {
                // eslint-disable-next-line no-console
                console.log(
                    `Database fail to connect: \n code: ${error.code},\n codeName: ${error.codeName} \n message: ${error}`,
                );
            });
    }

    private initialiseMailSender(): void {
        sgMail.setApiKey(this.mailSenderKey);
    }
    private initialiseSentry(): void {
        const app = this.express;

        Sentry.init({
            dsn: `${this.sentryKey}`,
            integrations: [
                // enable HTTP calls tracing
                new Sentry.Integrations.Http({ tracing: true }),
                // enable Express.js middleware tracing
                new Tracing.Integrations.Express({ app }),
            ],

            // Set tracesSampleRate to 1.0 to capture 100%
            // of transactions for performance monitoring.
            // We recommend adjusting this value in production
            tracesSampleRate: 1.0,
        });
    }

    public listen(): void {
        this.express.listen(this.port, () => {
            // eslint-disable-next-line no-console
            console.log(`The app listing on port : ${this.port}`);
        });
    }
}
export default App;
