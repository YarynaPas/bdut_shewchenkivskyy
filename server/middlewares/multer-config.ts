import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import slugify from 'slugify';
import sharp from 'sharp';

const UPLOAD_DIR = path.join(__dirname, '../../uploads');
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const ALLOWED_MIME_TYPES = new Set([
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/pdf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);
fs.mkdirSync(UPLOAD_DIR, { recursive: true });
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),

    filename: (_req, file, cb) => {
        const baseName = path.parse(file.originalname).name;
        const ext = path.extname(file.originalname).toLowerCase();

        const safeBase = slugify(baseName, {
            replacement: '-',
            lower: true,
            strict: true,
            locale: 'uk',
        });
        const uid: string = (crypto.randomBytes(6) as Buffer).toString('hex');

        cb(null, `${safeBase}-${uid}${ext}`);
    },
});

// --- File filter ---
const fileFilter: multer.Options['fileFilter'] = (_req, file, cb) => {
    // Перевірка по Set — O(1) замість includes() по масиву
    if (ALLOWED_MIME_TYPES.has(file.mimetype)) {
        cb(null, true);
    } else {
        cb(Object.assign(new Error('Unsupported file type'), { status: 415 }));
    }
};
export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: MAX_FILE_SIZE,
        files: 10,
    },
});

export async function compressImage(
    req: any,
    _res: any,
    next: (err?: unknown) => void,
): Promise<void> {
    const file: Express.Multer.File | undefined = req.file;

    if (!file || !file.mimetype.startsWith('image/')) {
        return next();
    }

    try {
        const outputPath = file.path.replace(/\.[^.]+$/, '.webp');

        await sharp(file.path)
            .resize({ width: 1920, withoutEnlargement: true })
            .webp({ quality: 82 })
            .toFile(outputPath);

        fs.unlinkSync(file.path);
        file.path = outputPath;
        file.filename = path.basename(outputPath);
        file.mimetype = 'image/webp';

        next();
    } catch (err) {
        next(err);
    }
}