import { Request, Response, RequestHandler } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import {Psychology} from "../models/psychology.model";
import {formatInTimeZone} from "date-fns-tz";

const publicDir = path.join(process.cwd(), 'public');
const uploadDir = path.join(publicDir, 'uploads', 'psychology');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, uniqueSuffix + ext);
    }
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|docx|doc/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

    const allowedMimeTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    const mimetype = allowedMimeTypes.includes(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error('Дозволені файли: зображення (jpeg, jpg, png, gif), PDF та Word документи (pdf, doc, docx)!'));
    }
};

// Об'єднано обидва варіанти завантаження в один
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
    fileFilter: fileFilter
}).fields([
    { name: 'main_photo', maxCount: 1 },
    { name: 'photos', maxCount: 6 }
]);

interface MulterFiles {
    [fieldname: string]: Express.Multer.File[];
}

interface PaginationResult {
    data: any[];
    total: number;
    page: number;
    pages: number;
    limit: number;
}

class PsychologyController {
    createPsychology: RequestHandler = (req, res, next) => {
        upload(req, res, async (err: any) => {
            if (err) {
                if (err instanceof multer.MulterError) {
                    res.status(400).json({ message: err.message });
                    return;
                } else if (err.message.includes('Дозволені тільки зображення')) {
                    res.status(400).json({ message: err.message });
                    return;
                }
                res.status(500).json({ message: 'Помилка при завантаженні файлу' });
                return;
            }

            const { title, description } = req.body;
            const files = req.files as MulterFiles;
            const mainPhotoFile = files['main_photo']?.[0];
            const additionalPhotos = files['photos'] || [];

            if (!title || !description ) {
                res.status(400).json({ message: 'Всі поля обов\'язкові для заповнення!' });
                return;
            }

            if (!mainPhotoFile) {
                res.status(400).json({ message: 'Головне фото обов\'язкове' });
                return;
            }

            try {
                const relativeMainPhotoPath = `/uploads/psychology/${mainPhotoFile.filename}`;
                const relativePhotoPaths = additionalPhotos.map(file => `/uploads/psychology/${file.filename}`);
                const ukraineDate = formatInTimeZone(new Date(), 'Europe/Kyiv', 'yyyy-MM-dd HH:mm');

                const psychology = await Psychology.create({
                    title,
                    description,
                    date: new Date(),
                    main_photo: relativeMainPhotoPath,
                    photos: relativePhotoPaths.join(',')
                });

                res.status(201).json({
                    ...psychology.get(),
                    main_photo: this.getFullImageUrl(req, relativeMainPhotoPath),
                    photos: relativePhotoPaths.map(photo => this.getFullImageUrl(req, photo))
                });
            } catch (e) {
                if (mainPhotoFile?.path && fs.existsSync(mainPhotoFile.path)) {
                    fs.unlinkSync(mainPhotoFile.path);
                }
                additionalPhotos.forEach(photo => {
                    if (photo.path && fs.existsSync(photo.path)) {
                        fs.unlinkSync(photo.path);
                    }
                });
                console.error('Помилка при створенні новини:', e);
                res.status(500).json({ message: 'Помилка при створенні новини' });
            }
        });
    };

    getAllPsychology: RequestHandler = async (req, res, next) => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 5;
            const offset = (page - 1) * limit;

            const { count, rows } = await Psychology.findAndCountAll({
                order: [['date', 'DESC']],
                limit,
                offset
            });

            const result: PaginationResult = {
                data: rows.map(item => ({
                    ...item.get(),
                    main_photo: this.getFullImageUrl(req, item.main_photo),
                    photos: item.photos?.split(',').map(photo => this.getFullImageUrl(req, photo)) || []
                })),
                total: count,
                page,
                pages: Math.ceil(count / limit),
                limit
            };

            res.status(200).json(result);
        } catch (e) {
            console.error('Помилка при отриманні новин:', e);
            res.status(500).json({ message: 'Помилка при отриманні новин' });
        }
    };

    getPsychologyById: RequestHandler = async (req, res, next) => {
        const { id } = req.params;

        try {
            const psychology = await Psychology.findByPk(id);
            if (!psychology) {
                res.status(404).json({ message: 'Новину не знайдено' });
                return;
            }

            res.status(200).json({
                ...psychology.get(),
                main_photo: this.getFullImageUrl(req, psychology.main_photo),
                photos: psychology.photos?.split(',').map(photo => this.getFullImageUrl(req, photo)) || []
            });
        } catch (e) {
            console.error('Помилка при отриманні новини:', e);
            res.status(500).json({ message: 'Помилка при отриманні новини' });
        }
    };

    deletePsychology: RequestHandler = async (req, res, next) => {
        const { id } = req.params;

        try {
            const psychology = await Psychology.findByPk(id);
            if (!psychology) {
                res.status(404).json({ message: 'Новину не знайдено' });
                return;
            }

            if (psychology.main_photo) {
                const filePath = path.join(publicDir, psychology.main_photo);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }

            psychology.photos?.split(',').forEach(photo => {
                if (photo) {
                    const filePath = path.join(publicDir, photo);
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                    }
                }
            });

            await psychology.destroy();
            res.status(200).json({ message: 'Новину успішно видалено' });
        } catch (e) {
            console.error('Помилка при видаленні новини:', e);
            res.status(500).json({ message: 'Помилка при видаленні новини' });
        }
    };

    private getFullImageUrl(req: Request, imagePath: string | null): string | null {
        if (!imagePath) return null;
        return `${req.protocol}://${req.get('host')}${imagePath}`;
    }
}

export const psychologyController = new PsychologyController();