import { Request, Response, RequestHandler } from 'express';
import { News } from '../models/news.model';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const UPLOAD_DIR = path.join(PUBLIC_DIR, 'uploads', 'news');

fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 },
}).fields([
    { name: 'main_photo', maxCount: 1 },
    { name: 'photos', maxCount: 6 }
]);

class NewsController {
    private getFullImageUrl(req: Request, filePath: string | null): string | null {
        if (!filePath) return null;
        return `${req.protocol}://${req.get('host')}${filePath}`;
    }

    private async processImage(buffer: Buffer): Promise<string> {
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.webp`;
        await sharp(buffer)
            .resize({ width: 1200, withoutEnlargement: true })
            .webp({ quality: 80 })
            .toFile(path.join(UPLOAD_DIR, fileName));
        return `/uploads/news/${fileName}`;
    }

    private async deleteFile(filePath: string): Promise<void> {
        const fullPath = path.join(PUBLIC_DIR, filePath);
        await fs.promises.unlink(fullPath).catch(() => null);
    }

    createNews: RequestHandler = (req, res) => {
        upload(req, res, async (err) => {
            if (err) return res.status(400).json({ message: err.message });

            const files = req.files as { [fieldname: string]: Express.Multer.File[] };
            const { title, description, short_description } = req.body;

            if (!title || !files['main_photo']?.[0]) {
                return res.status(400).json({ message: 'Title and main photo are required' });
            }

            try {
                const mainPhotoPath = await this.processImage(files['main_photo'][0].buffer);
                const otherPhotos = files['photos']
                    ? await Promise.all(files['photos'].map(f => this.processImage(f.buffer)))
                    : [];

                const news = await News.create({
                    title,
                    description,
                    short_description,
                    date: new Date(),
                    main_photo: mainPhotoPath,
                    photos: otherPhotos.join(','),
                });

                res.status(201).json(news);
            } catch (e) {
                res.status(500).json({ message: 'Error creating news' });
            }
        });
    };

    getAllNews: RequestHandler = async (req, res) => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const offset = (page - 1) * limit;

            const { count, rows } = await News.findAndCountAll({
                order: [['date', 'DESC']],
                limit,
                offset,
            });

            res.json({
                data: rows.map(item => ({
                    ...item.toJSON(),
                    main_photo: this.getFullImageUrl(req, item.main_photo),
                    photos: item.photos?.split(',').map(p => this.getFullImageUrl(req, p)) || [],
                })),
                total: count,
                page,
                pages: Math.ceil(count / limit),
            });
        } catch (e) {
            res.status(500).json({ message: 'Error fetching news' });
        }
    };

    getNewsById: RequestHandler = async (req, res) => {
        try {
            // FIX 1: явний Number() щоб уникнути string | string[]
            const id = Number(req.params.id);
            if (isNaN(id)) return res.status(400).json({ message: 'Invalid id' });

            const news = await News.findByPk(id);
            if (!news) return res.status(404).json({ message: 'News not found' });

            res.json({
                ...news.toJSON(),
                main_photo: this.getFullImageUrl(req, news.main_photo),
                photos: news.photos?.split(',').map(p => this.getFullImageUrl(req, p)) || [],
            });
        } catch (e) {
            res.status(500).json({ message: 'Error' });
        }
    };

    updateNews: RequestHandler = async (req, res) => {
        upload(req, res, async (err) => {
            try {
                // FIX 2: явний Number() щоб уникнути string | string[]
                const id = Number(req.params.id);
                if (isNaN(id)) return res.status(400).json({ message: 'Invalid id' });

                const news = await News.findByPk(id);
                if (!news) return res.status(404).json({ message: 'Not found' });

                const files = req.files as { [fieldname: string]: Express.Multer.File[] };
                let mainPhoto = news.main_photo;

                if (files['main_photo']?.[0]) {
                    // FIX 3: перевірка на null перед deleteFile
                    if (news.main_photo) await this.deleteFile(news.main_photo);
                    mainPhoto = await this.processImage(files['main_photo'][0].buffer);
                }

                await news.update({ ...req.body, main_photo: mainPhoto });
                res.json(news);
            } catch (e) {
                res.status(500).json({ message: 'Update error' });
            }
        });
    };

    deleteNews: RequestHandler = async (req, res) => {
        try {
            // FIX 4: явний Number() щоб уникнути string | string[]
            const id = Number(req.params.id);
            if (isNaN(id)) return res.status(400).json({ message: 'Invalid id' });

            const news = await News.findByPk(id);
            if (!news) return res.status(404).json({ message: 'Not found' });

            // FIX 5: filter type guard прибирає null зі списку файлів
            const files = [
                news.main_photo,
                ...(news.photos ? news.photos.split(',') : []),
            ].filter((f): f is string => !!f);

            await Promise.all(files.map(f => this.deleteFile(f)));
            await news.destroy();

            res.json({ message: 'Deleted' });
        } catch (e) {
            res.status(500).json({ message: 'Delete error' });
        }
    };
}

export const newsController = new NewsController();