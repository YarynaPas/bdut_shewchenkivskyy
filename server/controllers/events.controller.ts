import { Request, RequestHandler } from 'express';
import { Event } from '../models/events.model';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const UPLOAD_DIR = path.join(PUBLIC_DIR, 'uploads', 'events');

fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.memoryStorage();

const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/gif']);
    ALLOWED_MIME_TYPES.has(file.mimetype)
        ? cb(null, true)
        : cb(new Error('Only images are allowed (jpeg, jpg, png, gif)!'));
};

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024, files: 1 },
    fileFilter,
}).fields([
    { name: 'main_photo', maxCount: 1 },
]);

interface MulterFiles {
    [fieldname: string]: Express.Multer.File[];
}

class EventsController {
    private async processImage(buffer: Buffer): Promise<string> {
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.webp`;
        await sharp(buffer)
            .resize({ width: 1280, withoutEnlargement: true })
            .webp({ quality: 82 })
            .toFile(path.join(UPLOAD_DIR, fileName));
        return `/uploads/events/${fileName}`;
    }

    private async deleteFile(filePath: string): Promise<void> {
        const fullPath = path.join(PUBLIC_DIR, filePath);
        await fs.promises.unlink(fullPath).catch(() => null);
    }

    private getFullImageUrl(req: Request, imagePath: string | null): string | null {
        if (!imagePath) return null;
        return `${req.protocol}://${req.get('host')}${imagePath}`;
    }

    createEvents: RequestHandler = (req, res) => {
        upload(req, res, async (err: any) => {
            if (err) {
                const status = err instanceof multer.MulterError ? 400
                    : err.message.includes('Only images') ? 400 : 500;
                res.status(status).json({ message: err.message });
                return;
            }

            const { title, date, description } = req.body;
            const files = req.files as MulterFiles;
            const mainPhotoFile = files['main_photo']?.[0];

            if (!title || !date) {
                res.status(400).json({ message: 'Title and date are required!' });
                return;
            }

            if (!mainPhotoFile) {
                res.status(400).json({ message: 'Main photo is required' });
                return;
            }

            try {
                const imagePath = await this.processImage(mainPhotoFile.buffer);

                const event = await Event.create({
                    title,
                    description: description || null,
                    date,
                    main_photo: imagePath,
                });

                res.status(201).json({
                    ...event.get(),
                    main_photo: this.getFullImageUrl(req, imagePath),
                });
            } catch (e) {
                console.error('Error creating event:', e);
                res.status(500).json({ message: 'Error creating event' });
            }
        });
    };

    getAllEvents: RequestHandler = async (req, res) => {
        try {
            const events = await Event.findAll();
            const currentDate = new Date();

            const pastEvents = events.filter(event => new Date(event.date) < currentDate);

            // Паралельне видалення минулих подій
            await Promise.all(
                pastEvents.map(async event => {
                    if (event.main_photo) await this.deleteFile(event.main_photo);
                    await event.destroy();
                })
            );

            const updatedEvents = await Event.findAll();
            res.status(200).json(
                updatedEvents.map(event => ({
                    ...event.get(),
                    main_photo: this.getFullImageUrl(req, event.main_photo),
                }))
            );
        } catch (e) {
            console.error('Error getting events:', e);
            res.status(500).json({ message: 'Error getting events' });
        }
    };

    getEventById: RequestHandler = async (req, res) => {
        try {
            // FIX 1: Number() щоб уникнути string | string[]
            const id = Number(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({ message: 'Invalid id' });
                return;
            }

            const event = await Event.findByPk(id);
            if (!event) {
                res.status(404).json({ message: 'Event not found' });
                return;
            }

            res.status(200).json({
                ...event.get(),
                main_photo: this.getFullImageUrl(req, event.main_photo),
            });
        } catch (e) {
            console.error('Error getting event:', e);
            res.status(500).json({ message: 'Error getting event' });
        }
    };

    deleteEvents: RequestHandler = async (req, res) => {
        try {
            // FIX 2: Number() щоб уникнути string | string[]
            const id = Number(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({ message: 'Invalid id' });
                return;
            }

            const event = await Event.findByPk(id);
            if (!event) {
                res.status(404).json({ message: 'Event not found' });
                return;
            }

            if (event.main_photo) await this.deleteFile(event.main_photo);

            await event.destroy();
            res.status(200).json({ message: 'Event deleted successfully' });
        } catch (e) {
            console.error('Error deleting event:', e);
            res.status(500).json({ message: 'Error deleting event' });
        }
    };
}

export const eventsController = new EventsController();