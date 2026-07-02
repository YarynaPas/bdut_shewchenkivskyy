import { Request, RequestHandler } from 'express';
import { Rozklad } from '../models/rozklad.model';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const UPLOAD_DIR = path.join(PUBLIC_DIR, 'uploads', 'rozklad');

fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/gif']);

const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    ALLOWED_MIME_TYPES.has(file.mimetype)
        ? cb(null, true)
        : cb(new Error('Only images are allowed (jpeg, jpg, png, gif)!'));
};

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024, files: 3 },
    fileFilter,
}).fields([{ name: 'photo', maxCount: 3 }]);

interface MulterFiles { [fieldname: string]: Express.Multer.File[] }

// --- Хелпери ---
const parseId = (id: string | string[]): number | null => {
    const raw = Array.isArray(id) ? id[0] : id;
    const parsed = Number(raw);
    return isNaN(parsed) ? null : parsed;
};

const getFullImageUrl = (req: Request, imagePath: string | null): string | null =>
    imagePath ? `${req.protocol}://${req.get('host')}${imagePath}` : null;

const processImage = async (buffer: Buffer): Promise<string> => {
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.webp`;
    await sharp(buffer)
        .resize({ width: 1280, withoutEnlargement: true })
        .webp({ quality: 82 })
        .toFile(path.join(UPLOAD_DIR, fileName));
    return `/uploads/rozklad/${fileName}`;
};

const deleteFile = async (filePath: string): Promise<void> => {
    await fs.promises.unlink(path.join(PUBLIC_DIR, filePath)).catch(() => null);
};

// --- Контролер ---
class RozkladController {
    createRozklad: RequestHandler = (req, res) => {
        upload(req, res, async (err: any) => {
            if (err) {
                const status = err instanceof multer.MulterError ? 400
                    : err.message.includes('Only images') ? 400 : 500;
                res.status(status).json({ message: err.message });
                return;
            }

            const files = req.files as MulterFiles;
            const photoFile = files['photo']?.[0];

            if (!photoFile) {
                res.status(400).json({ message: 'Photo is required' });
                return;
            }

            try {
                const imagePath = await processImage(photoFile.buffer);

                const rozklad = await Rozklad.create({ photo: imagePath });

                res.status(201).json({
                    ...rozklad.get(),
                    photo: getFullImageUrl(req, imagePath),
                });
            } catch (e) {
                console.error('Error creating rozklad:', e);
                res.status(500).json({ message: 'Error creating rozklad' });
            }
        });
    };

    getAllRozklad: RequestHandler = async (req, res) => {
        try {
            const rozklady = await Rozklad.findAll();
            res.status(200).json(rozklady.map(r => ({
                ...r.get(),
                photo: getFullImageUrl(req, r.photo),
            })));
        } catch (e) {
            console.error('Error getting rozklady:', e);
            res.status(500).json({ message: 'Error getting rozklady' });
        }
    };

    getRozkladById: RequestHandler = async (req, res) => {
        // FIX 1
        const id = parseId(req.params.id);
        if (!id) { res.status(400).json({ message: 'Invalid id' }); return; }

        try {
            const rozklad = await Rozklad.findByPk(id);
            if (!rozklad) {
                res.status(404).json({ message: 'Rozklad not found' });
                return;
            }

            res.status(200).json({
                ...rozklad.get(),
                photo: getFullImageUrl(req, rozklad.photo),
            });
        } catch (e) {
            console.error('Error getting rozklad:', e);
            res.status(500).json({ message: 'Error getting rozklad' });
        }
    };

    deleteRozklad: RequestHandler = async (req, res) => {
        // FIX 2
        const id = parseId(req.params.id);
        if (!id) { res.status(400).json({ message: 'Invalid id' }); return; }

        try {
            const rozklad = await Rozklad.findByPk(id);
            if (!rozklad) {
                res.status(404).json({ message: 'Rozklad not found' });
                return;
            }

            if (rozklad.photo) await deleteFile(rozklad.photo);

            await rozklad.destroy();
            res.status(200).json({ message: 'Rozklad deleted successfully' });
        } catch (e) {
            console.error('Error deleting rozklad:', e);
            res.status(500).json({ message: 'Error deleting rozklad' });
        }
    };
}

export const rozkladController = new RozkladController();