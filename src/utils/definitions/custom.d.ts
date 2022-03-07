import User from '@/resources/user/user.interface';

declare global {
    namespace Express {
        export interface Request {
            user: User;
        }
    }
}
declare global {
    interface String {
        pick(min: number, max?: number): string;
    }
}
declare global {
    interface String {
        shuffle(): string;
    }
}
