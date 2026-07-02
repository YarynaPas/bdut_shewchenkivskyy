import { Request, RequestHandler } from 'express';
import { Accounting } from '../models/accounting.model';
import { AccountingTypeEnum } from '../enums/accounting-type-enum';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const UPLOAD_DIR = path.join(PUBLIC_DIR, 'uploads', 'accounting');

fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// --- Константи ---
const ALLOWED_MIME_TYPES = new Set([
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

const IMAGE_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/gif']);

// --- Multer ---
const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    ALLOWED_MIME_TYPES.has(file.mimetype)
        ? cb(null, true)
        : cb(new Error('Дозволені файли: зображення (jpeg, jpg, png, gif), PDF та Word документи!'));
};

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024, files: 3 },
    fileFilter,
}).fields([
    { name: 'photos', maxCount: 3 },
]);

interface MulterFiles {
    [fieldname: string]: Express.Multer.File[];
}

// --- Хелпери ---

// Зображення стискаємо в WebP, документи (PDF/DOC) зберігаємо як є
const processAndSaveFile = async (file: Express.Multer.File): Promise<string> => {
    if (IMAGE_MIME_TYPES.has(file.mimetype)) {
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.webp`;
        await sharp(file.buffer)
            .resize({ width: 1280, withoutEnlargement: true })
            .webp({ quality: 82 })
            .toFile(path.join(UPLOAD_DIR, fileName));
        return `/uploads/accounting/${fileName}`;
    }

    // PDF / DOC / DOCX — зберігаємо без обробки
    const ext = path.extname(file.originalname).toLowerCase();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
    await fs.promises.writeFile(path.join(UPLOAD_DIR, fileName), file.buffer);
    return `/uploads/accounting/${fileName}`;
};

const deleteFile = async (filePath: string): Promise<void> => {
    await fs.promises.unlink(path.join(PUBLIC_DIR, filePath)).catch(() => null);
};

const getFullFileUrl = (req: Request, filePath: string | null): string | null => {
    if (!filePath) return null;
    return `${req.protocol}://${req.get('host')}${filePath}`;
};

const parseId = (id: string | string[]): number | null => {
    const raw = Array.isArray(id) ? id[0] : id;
    const parsed = Number(raw);
    return isNaN(parsed) ? null : parsed;
};

// --- Контролер ---
class AccountingController {
    createAccounting: RequestHandler = (req, res) => {
        upload(req, res, async (err: any) => {
            if (err) {
                const status = err instanceof multer.MulterError ? 400 : 500;
                res.status(status).json({ message: err.message });
                return;
            }

            const { category, name, year, pid_category } = req.body;
            const files = req.files as MulterFiles;
            const photoFile = files['photos']?.[0];

            if (!category || !name) {
                res.status(400).json({ message: 'Category and name are required!' });
                return;
            }

            try {
                const filePath = photoFile ? await processAndSaveFile(photoFile) : null;

                const accounting = await Accounting.create({
                    category,
                    name,
                    pid_category,
                    date: new Date(),
                    photos: filePath || '',
                    year: year || new Date().getFullYear(),
                });

                res.status(201).json({
                    ...accounting.get(),
                    photos: filePath ? getFullFileUrl(req, filePath) : null,
                });
            } catch (e) {
                console.error('Error creating accounting record:', e);
                res.status(500).json({ message: 'Error creating accounting record' });
            }
        });
    };

    getAllAccounting: RequestHandler = async (req, res) => {
        try {
            const { year, category } = req.query;
            const whereClause: any = {};

            if (year) whereClause.year = year;

            if (category && Object.values(AccountingTypeEnum).includes(category as AccountingTypeEnum)) {
                whereClause.category = category;
            }

            const records = await Accounting.findAll({
                where: whereClause,
                order: [['date', 'DESC']],
            });

            res.status(200).json(
                records.map(record => ({
                    ...record.get(),
                    photos: record.photos ? getFullFileUrl(req, record.photos) : null,
                }))
            );
        } catch (e) {
            console.error('Error getting accounting records:', e);
            res.status(500).json({ message: 'Error getting accounting records' });
        }
    };

    getAccountingById: RequestHandler = async (req, res) => {
        const id = parseId(req.params.id);
        if (!id) { res.status(400).json({ message: 'Invalid id' }); return; }

        try {
            const accounting = await Accounting.findByPk(id);
            if (!accounting) {
                res.status(404).json({ message: 'Accounting record not found' });
                return;
            }

            res.status(200).json({
                ...accounting.get(),
                photos: accounting.photos ? getFullFileUrl(req, accounting.photos) : null,
            });
        } catch (e) {
            console.error('Error getting accounting record:', e);
            res.status(500).json({ message: 'Error getting accounting record' });
        }
    };

    updateAccounting: RequestHandler = (req, res) => {
        upload(req, res, async (err: any) => {
            if (err) {
                const status = err instanceof multer.MulterError ? 400 : 500;
                res.status(status).json({ message: err.message });
                return;
            }

            const id = parseId(req.params.id);
            if (!id) { res.status(400).json({ message: 'Invalid id' }); return; }

            const { category, name, date, year } = req.body;
            const files = req.files as MulterFiles;
            const photoFile = files['photos']?.[0];

            try {
                const accounting = await Accounting.findByPk(id);
                if (!accounting) {
                    res.status(404).json({ message: 'Accounting record not found' });
                    return;
                }

                let filePath = accounting.photos;

                if (photoFile) {
                    if (accounting.photos) await deleteFile(accounting.photos);
                    filePath = await processAndSaveFile(photoFile);
                }

                await accounting.update({
                    category: category || accounting.category,
                    name: name || accounting.name,
                    date: date || accounting.date,
                    photos: filePath,
                    year: year || accounting.year,
                });

                res.status(200).json({
                    ...accounting.get(),
                    photos: filePath ? getFullFileUrl(req, filePath) : null,
                });
            } catch (e) {
                console.error('Error updating accounting record:', e);
                res.status(500).json({ message: 'Error updating accounting record' });
            }
        });
    };

    deleteAccounting: RequestHandler = async (req, res) => {
        const id = parseId(req.params.id);
        if (!id) { res.status(400).json({ message: 'Invalid id' }); return; }

        try {
            const accounting = await Accounting.findByPk(id);
            if (!accounting) {
                res.status(404).json({ message: 'Accounting record not found' });
                return;
            }

            if (accounting.photos) await deleteFile(accounting.photos);

            await accounting.destroy();
            res.status(200).json({ message: 'Accounting record deleted successfully' });
        } catch (e) {
            console.error('Error deleting accounting record:', e);
            res.status(500).json({ message: 'Error deleting accounting record' });
        }
    };
}

export const accountingController = new AccountingController();