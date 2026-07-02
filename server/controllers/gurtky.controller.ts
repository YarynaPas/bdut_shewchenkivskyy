import { Request, RequestHandler } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import { Gurtky } from "../models/gurtky.model";

// --- Константи ---
const PUBLIC_DIR = path.join(process.cwd(), 'public');
const UPLOAD_DIR = path.join(PUBLIC_DIR, 'uploads', 'gurtky');
const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/svg+xml']);

fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    ALLOWED_MIME_TYPES.has(file.mimetype)
        ? cb(null, true)
        : cb(new Error('Only images are allowed (jpeg, jpg, png, gif, svg)!'));
};

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024, files: 5 },
    fileFilter,
}).fields([
    { name: 'pictograma', maxCount: 1 },
    { name: 'photos', maxCount: 4 },
]);

// --- Хелпери ---
const parseId = (id: string | string[]): number | null => {
    const raw = Array.isArray(id) ? id[0] : id;
    const parsed = Number(raw);
    return isNaN(parsed) ? null : parsed;
};

const generateFileName = (ext: string) =>
    `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;

const getFullImageUrl = (req: Request, imagePath: string) =>
    `${req.protocol}://${req.get('host')}${imagePath}`;

const processAndSaveImage = async (file: Express.Multer.File, outputName: string): Promise<string> => {
    const outputPath = path.join(UPLOAD_DIR, outputName);

    if (file.mimetype === 'image/svg+xml') {
        await fs.promises.writeFile(outputPath, file.buffer);
    } else {
        await sharp(file.buffer)
            .resize({ width: 1280, withoutEnlargement: true })
            .webp({ quality: 82 })
            .toFile(outputPath);
    }

    return `/uploads/gurtky/${outputName}`;
};

const removeFile = async (filePath: string) => {
    await fs.promises.unlink(path.join(PUBLIC_DIR, filePath)).catch(() => null);
};

// --- Інтерфейси ---
interface MulterFiles { [fieldname: string]: Express.Multer.File[] }

interface GurtkyResponse {
    id: number;
    name: string;
    description: string | null;
    long_description: string | null;
    classrom: string | null;
    teacher: string;
    pictograma: string;
    photos: string[];
    createdAt?: Date;
    updatedAt?: Date;
}

// --- Контролер ---
class GurtkyController {
    createGurtky: RequestHandler = (req, res) => {
        upload(req, res, async (err: any) => {
            if (err) {
                const status = err instanceof multer.MulterError ? 400
                    : err.message.includes('Only images') ? 400 : 500;
                res.status(status).json({ message: err.message });
                return;
            }

            const { name, teacher, description, long_description, classrom } = req.body;
            const files = req.files as MulterFiles;
            const pictogramaFile = files['pictograma']?.[0];
            const photoFiles = files['photos'] || [];

            if (!name || !teacher) {
                res.status(400).json({ message: 'Name and teacher are required!' });
                return;
            }
            if (!pictogramaFile) {
                res.status(400).json({ message: 'Pictograma photo is required' });
                return;
            }

            try {
                const ext = pictogramaFile.mimetype === 'image/svg+xml' ? '.svg' : '.webp';

                const [pictogramaPath, ...photoPaths] = await Promise.all([
                    processAndSaveImage(pictogramaFile, generateFileName(ext)),
                    ...photoFiles.map(f => {
                        const e = f.mimetype === 'image/svg+xml' ? '.svg' : '.webp';
                        return processAndSaveImage(f, generateFileName(e));
                    }),
                ]);

                const gurtky = await Gurtky.create({
                    name,
                    description: description || null,
                    long_description: long_description || null,
                    classrom: classrom || null,
                    teacher,
                    pictograma: pictogramaPath,
                    photos: photoPaths.join(','),
                });

                const responseData: GurtkyResponse = {
                    ...gurtky.get(),
                    pictograma: getFullImageUrl(req, pictogramaPath),
                    photos: photoPaths.map(p => getFullImageUrl(req, p)),
                };

                res.status(201).json(responseData);
            } catch (e) {
                console.error('Error creating gurtky:', e);
                res.status(500).json({ message: 'Error creating gurtky' });
            }
        });
    };

    getAllGurtky: RequestHandler = async (req, res) => {
        try {
            const list = await Gurtky.findAll();

            const responseData = list.map(g => {
                const data = g.get();
                const photos = data.photos
                    ? data.photos.split(',').map((p: string) => getFullImageUrl(req, p.trim()))
                    : [];
                return { ...data, pictograma: getFullImageUrl(req, data.pictograma), photos };
            });

            res.status(200).json(responseData);
        } catch (e) {
            console.error('Error getting gurtky:', e);
            res.status(500).json({ message: 'Error getting gurtky' });
        }
    };

    getGurtkyById: RequestHandler = async (req, res) => {
        // FIX 1
        const id = parseId(req.params.id);
        if (!id) { res.status(400).json({ message: 'Invalid id' }); return; }

        try {
            const gurtky = await Gurtky.findByPk(id);
            if (!gurtky) {
                res.status(404).json({ message: 'Gurtky not found' });
                return;
            }

            const data = gurtky.get();
            const photos = data.photos
                ? data.photos.split(',').map((p: string) => getFullImageUrl(req, p.trim()))
                : [];

            res.status(200).json({ ...data, pictograma: getFullImageUrl(req, data.pictograma), photos });
        } catch (e) {
            console.error('Error getting gurtky:', e);
            res.status(500).json({ message: 'Error getting gurtky' });
        }
    };

    deleteGurtky: RequestHandler = async (req, res) => {
        // FIX 2
        const id = parseId(req.params.id);
        if (!id) { res.status(400).json({ message: 'Invalid id' }); return; }

        try {
            const gurtky = await Gurtky.findByPk(id);
            if (!gurtky) {
                res.status(404).json({ message: 'Gurtky not found' });
                return;
            }

            const data = gurtky.get();

            const filesToDelete = [
                data.pictograma,
                ...(data.photos ? data.photos.split(',').map((p: string) => p.trim()) : []),
            ].filter(Boolean);

            await Promise.all(filesToDelete.map(removeFile));
            await gurtky.destroy();

            res.status(200).json({ message: 'Gurtky deleted successfully' });
        } catch (e) {
            console.error('Error deleting gurtky:', e);
            res.status(500).json({ message: 'Error deleting gurtky' });
        }
    };
}

export const gurtkyController = new GurtkyController();