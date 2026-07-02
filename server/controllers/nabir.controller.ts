import { Request, Response, RequestHandler } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Nabir } from "../models/nabir.model";

const publicDir = path.join(process.cwd(), 'public');
const uploadDir = path.join(publicDir, 'uploads', 'nabir');

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
    const allowedTypes = /jpeg|jpg|png|gif|svg/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error('Only images are allowed (jpeg, jpg, png, gif)!'));
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
    fileFilter: fileFilter
}).fields([
    { name: 'pictogram', maxCount: 1 }
]);

interface MulterFiles {
    [fieldname: string]: Express.Multer.File[];
}

class NabirController {
    createNabir: RequestHandler = (req, res) => {
        upload(req, res, async (err: any) => {
            if (err) {
                if (err instanceof multer.MulterError) {
                    res.status(400).json({ message: err.message });
                    return;
                } else if (err.message.includes('Only images are allowed')) {
                    res.status(400).json({ message: err.message });
                    return;
                }
                res.status(500).json({ message: 'File upload error' });
                return;
            }

            const { name, amount, number, vik, teacher, rozklad, auditory } = req.body;
            const files = req.files as MulterFiles;
            const pictogramFile = files['pictogram']?.[0];

            if (!name) {
                res.status(400).json({ message: 'Name is required!' });
                return;
            }

            try {
                const relativeImagePath = pictogramFile ? `/uploads/nabir/${pictogramFile.filename}` : null;

                const nabir = await Nabir.create({
                    name,
                    amount: amount || null,
                    number: number || null,
                    vik: vik || null,
                    teacher: teacher || null,
                    rozklad: rozklad || null,
                    auditory: auditory || null,
                    pictogram: relativeImagePath
                });

                res.status(201).json({
                    ...nabir.get(),
                    pictogram: pictogramFile ? this.getFullImageUrl(req, relativeImagePath) : null
                });
            } catch (e) {
                if (pictogramFile?.path && fs.existsSync(pictogramFile.path)) {
                    fs.unlinkSync(pictogramFile.path);
                }
                console.error('Error creating nabir:', e);
                res.status(500).json({ message: 'Error creating nabir' });
            }
        });
    };

    getAllNabir: RequestHandler = async (req, res) => {
        try {
            const nabir = await Nabir.findAll();
            res.status(200).json(nabir);
        } catch (e) {
            res.status(500).json({ message: 'Сталася помилка при отриманні набору.' });
        }
    };

    getNabirById: RequestHandler = async (req, res) => {
        const { id } = req.params;

        try {
            const nabir = await Nabir.findOne({ where: { id } });
            if (nabir) {
                res.status(200).json(nabir);
            } else {
                res.status(404).json({ message: 'Набір не знайдено.' });
            }
        } catch (e) {
            res.status(500).json({ message: 'Сталася помилка при отриманні набору.' });
        }
    };

    deleteNabir: RequestHandler = async (req, res) => {
        const { id } = req.params;

        try {
            const nabir = await Nabir.findOne({ where: { id } });
            if (!nabir) {
                res.status(404).json({ message: 'Набір не знайдено.' });
                return;
            }
            if (nabir.pictogram) {
                const filePath = path.join(publicDir, nabir.pictogram);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }

            await nabir.destroy();
            res.status(200).json({ message: 'Набір успішно видалено.' });
        } catch (e) {
            res.status(500).json({ message: 'Сталася помилка при видаленні набору.' });
        }
    };

    private getFullImageUrl(req: Request, imagePath: string | null): string | null {
        if (!imagePath) return null;
        return `${req.protocol}://${req.get('host')}${imagePath}`;
    }
}

export const nabirController = new NabirController();