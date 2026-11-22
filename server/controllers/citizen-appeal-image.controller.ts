
import { Request, Response, RequestHandler } from 'express';
import { CitizenAppealImage } from '../models/citizen-appeal-image.model';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const UPLOAD_DIR = path.join(PUBLIC_DIR, 'uploads', 'citizen-appeals');

fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.memoryStorage();

const fileFilter = (
    _req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
) => {
    const ALLOWED_MIME_TYPES = new Set([
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp',
        'image/gif',
    ]);

    ALLOWED_MIME_TYPES.has(file.mimetype)
        ? cb(null, true)
        : cb(new Error('Only images are allowed (jpeg, jpg, png, webp, gif)!'));
};

const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024,
        files: 1,
    },
    fileFilter,
}).single('image');

class CitizenAppealImageController {

    /* ========================================= */
    /* PROCESS IMAGE */
    /* ========================================= */

    private async processImage(buffer: Buffer): Promise<string> {
        const fileName =
            `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.webp`;

        await sharp(buffer)
            .rotate()
            .resize({
                width: 1600,
                withoutEnlargement: true,
            })
            .webp({
                quality: 85,
            })
            .toFile(path.join(UPLOAD_DIR, fileName));

        return `/uploads/citizen-appeals/${fileName}`;
    }


    /* ========================================= */
    /* DELETE FILE */
    /* ========================================= */

    private async deleteFile(filePath: string): Promise<void> {
        const fileName = path.basename(filePath);

        const fullPath = path.join(UPLOAD_DIR, fileName);

        await fs.promises.unlink(fullPath).catch((error) => {
            if (error.code !== 'ENOENT') {
                throw error;
            }
        });
    }


    /* ========================================= */
    /* FULL IMAGE URL */
    /* ========================================= */

    private getFullImageUrl(
        req: Request,
        imagePath: string | null
    ): string | null {
        if (!imagePath) return null;

        return `${req.protocol}://${req.get('host')}${imagePath}`;
    }


    /* ========================================= */
    /* CREATE IMAGE */
    /* ========================================= */

    createImage: RequestHandler = (req, res) => {

        upload(req, res, async (err) => {

            if (err) {
                return res.status(400).json({
                    message: err.message,
                });
            }

            const file = req.file;

            const title =
                typeof req.body.title === 'string'
                    ? req.body.title.trim()
                    : '';

            const sortOrder =
                req.body.sort_order !== undefined
                    ? Number(req.body.sort_order)
                    : 0;

            if (!title) {
                return res.status(400).json({
                    message: 'Title is required',
                });
            }

            if (!Number.isInteger(sortOrder) || sortOrder < 0) {
                return res.status(400).json({
                    message: 'Invalid sort_order',
                });
            }

            if (!file) {
                return res.status(400).json({
                    message: 'Image is required',
                });
            }

            let imagePath: string | null = null;

            try {

                imagePath = await this.processImage(file.buffer);

                const image = await CitizenAppealImage.create({
                    title,
                    image_path: imagePath,
                    sort_order: sortOrder,
                });

                return res.status(201).json({
                    ...image.get(),
                    image_path: this.getFullImageUrl(
                        req,
                        image.image_path
                    ),
                });

            } catch (e) {

                if (imagePath) {
                    await this.deleteFile(imagePath).catch(console.error);
                }

                console.error('Error creating citizen appeal image:', e);

                return res.status(500).json({
                    message: 'Error creating image',
                });
            }
        });
    };


    /* ========================================= */
    /* GET ALL IMAGES */
    /* ========================================= */

    getAllImages: RequestHandler = async (req, res) => {

        try {

            const images = await CitizenAppealImage.findAll({
                order: [
                    ['sort_order', 'ASC'],
                    ['created_at', 'DESC'],
                ],
            });

            return res.status(200).json(
                images.map(image => ({
                    ...image.get(),
                    image_path: this.getFullImageUrl(
                        req,
                        image.image_path
                    ),
                }))
            );

        } catch (e) {

            console.error('Error getting citizen appeal images:', e);

            return res.status(500).json({
                message: 'Error getting images',
            });
        }
    };


    /* ========================================= */
    /* UPDATE IMAGE */
    /* ========================================= */

    updateImage: RequestHandler = (req, res) => {

        upload(req, res, async (err) => {

            try {

                if (err) {
                    return res.status(400).json({
                        message: err.message,
                    });
                }

                const id = Number(req.params.id);

                if (Number.isNaN(id) || !Number.isInteger(id)) {
                    return res.status(400).json({
                        message: 'Invalid id',
                    });
                }

                const image = await CitizenAppealImage.findByPk(id);

                if (!image) {
                    return res.status(404).json({
                        message: 'Image not found',
                    });
                }

                const title =
                    req.body.title !== undefined
                        ? String(req.body.title).trim()
                        : image.title;

                const sortOrder =
                    req.body.sort_order !== undefined
                        ? Number(req.body.sort_order)
                        : image.sort_order;

                if (!title) {
                    return res.status(400).json({
                        message: 'Title is required',
                    });
                }

                if (!Number.isInteger(sortOrder) || sortOrder < 0) {
                    return res.status(400).json({
                        message: 'Invalid sort_order',
                    });
                }

                let imagePath = image.image_path;

                if (req.file) {

                    const newImagePath =
                        await this.processImage(req.file.buffer);

                    imagePath = newImagePath;

                    try {
                        await this.deleteFile(image.image_path);
                    } catch (deleteError) {
                        await this.deleteFile(newImagePath).catch(console.error);
                        throw deleteError;
                    }
                }

                await image.update({
                    title,
                    image_path: imagePath,
                    sort_order: sortOrder,
                });

                return res.status(200).json({
                    ...image.get(),
                    image_path: this.getFullImageUrl(
                        req,
                        image.image_path
                    ),
                });

            } catch (e) {

                console.error('Error updating citizen appeal image:', e);

                return res.status(500).json({
                    message: 'Error updating image',
                });
            }
        });
    };


    /* ========================================= */
    /* DELETE IMAGE */
    /* ========================================= */

    deleteImage: RequestHandler = async (req, res) => {

        try {

            const id = Number(req.params.id);

            if (Number.isNaN(id) || !Number.isInteger(id)) {
                return res.status(400).json({
                    message: 'Invalid id',
                });
            }

            const image = await CitizenAppealImage.findByPk(id);

            if (!image) {
                return res.status(404).json({
                    message: 'Image not found',
                });
            }

            await this.deleteFile(image.image_path);

            await image.destroy();

            return res.status(200).json({
                message: 'Image deleted successfully',
                id,
            });

        } catch (e) {

            console.error('Error deleting citizen appeal image:', e);

            return res.status(500).json({
                message: 'Error deleting image',
            });
        }
    };
}

export const citizenAppealImageController =
    new CitizenAppealImageController();
