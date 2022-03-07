import { Request } from 'express';
import multer, { FileFilterCallback, Multer } from 'multer';

class DiskStorage {
    public path: string;
    public diskMulter: Multer;

    constructor(path: string) {
        this.path = path;
        this.diskMulter = multer({
            storage: this.initialiseStorage(path),
            fileFilter: this.imageFilter(),
        });
    }

    private initialiseStorage(path: string): multer.StorageEngine {
        const storage = multer.diskStorage({
            destination: function (
                req: Request,
                file: Express.Multer.File,
                callback: (error: Error | null, destination: string) => void,
            ) {
                callback(null, path);
            },
            filename: function (
                req: Request,
                file: Express.Multer.File,
                callback: (error: Error | null, filename: string) => void,
            ) {
                callback(null, Date.now() + file.originalname);
            },
        });

        return storage;
    }
    private imageFilter() {
        return (
            request: Express.Request,
            file: Express.Multer.File,
            callback: FileFilterCallback,
        ) => {
            const acceptedTypes = file.mimetype.split('/');

            if (acceptedTypes[0] === 'image') {
                callback(null, true);
            } else {
                callback(null, false);
                callback(new Error('Only images allowed!'));
            }
        };
    }
}
export default DiskStorage;
