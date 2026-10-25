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
    { name: "main_photo", maxCount: 1 },
    { name: "photos", maxCount: 6 },
    { name: "video", maxCount: 1 }
]);
const VIDEO_TYPES = new Set([
    "video/mp4",
    "video/webm",
    "video/quicktime",
]);

class NewsController {
    private async processVideo(file: Express.Multer.File): Promise<string> {
        const ext = path.extname(file.originalname);

        const fileName =
            `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;

        await fs.promises.writeFile(
            path.join(UPLOAD_DIR, fileName),
            file.buffer
        );

        return `/uploads/news/${fileName}`;
    }
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
            if (err) {
                return res.status(400).json({
                    message: err.message,
                });
            }

            const files = req.files as {
                [fieldname: string]: Express.Multer.File[];
            };

            const {
                title,
                description,
                short_description,
            } = req.body;

            if (!title) {
                return res.status(400).json({
                    message: "Title is required",
                });
            }

            if (!files["main_photo"]?.[0]) {
                return res.status(400).json({
                    message: "Main photo is required",
                });
            }

            try {
                const mainPhotoFile = files["main_photo"][0];
                const photoFiles = files["photos"] || [];
                const videoFile = files["video"]?.[0];

                const mainPhotoPath = await this.processImage(
                    mainPhotoFile.buffer
                );

                const otherPhotos = await Promise.all(
                    photoFiles.map((file) =>
                        this.processImage(file.buffer)
                    )
                );

                let videoPath: string | null = null;

                if (videoFile) {
                    videoPath = await this.processVideo(videoFile);
                }

                const news = await News.create({
                    title,
                    description,
                    short_description,
                    date: new Date(),
                    main_photo: mainPhotoPath,
                    photos: otherPhotos.join(","),
                    video: videoPath,
                });

                res.status(201).json({
                    ...news.toJSON(),
                    main_photo: this.getFullImageUrl(
                        req,
                        news.main_photo
                    ),
                    photos: otherPhotos.map((photo) =>
                        this.getFullImageUrl(req, photo)
                    ),
                    video: this.getFullImageUrl(
                        req,
                        news.video
                    ),
                });
            } catch (e) {
                console.error(e);

                res.status(500).json({
                    message: "Error creating news",
                });
            }
        });
    };

    getAllNews: RequestHandler = async (req, res) => {
        try {
            const page = parseInt(req.query["page"] as string) || 1;
            const limit = parseInt(req.query["limit"] as string) || 10;
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
                    video: this.getFullImageUrl(req, item.video),
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

                main_photo:
                    this.getFullImageUrl(
                        req,
                        news.main_photo
                    ),

                photos:
                    news.photos
                        ?.split(",")
                        .map(p =>
                            this.getFullImageUrl(req, p)
                        ) || [],

                video:
                    this.getFullImageUrl(
                        req,
                        news.video
                    ),
            });
        } catch (e) {
            res.status(500).json({ message: 'Error' });
        }
    };
    updateNews: RequestHandler = async (req, res) => {

        upload(req, res, async (err) => {

            try {

                /* ========================================= */
                /* MULTER ERROR */
                /* ========================================= */

                if (err) {

                    console.error(
                        "Multer error:",
                        err
                    );

                    return res.status(400).json({
                        message:
                            err instanceof Error
                                ? err.message
                                : "Помилка завантаження файлу"
                    });

                }


                /* ========================================= */
                /* ID */
                /* ========================================= */

                const id =
                    Number(req.params.id);


                if (Number.isNaN(id)) {

                    return res.status(400).json({
                        message: "Invalid id"
                    });

                }


                /* ========================================= */
                /* FIND NEWS */
                /* ========================================= */

                const news =
                    await News.findByPk(id);


                if (!news) {

                    return res.status(404).json({
                        message: "Not found"
                    });

                }


                /* ========================================= */
                /* FILES */
                /* ========================================= */

                const files =
                    req.files as {
                        [fieldname: string]:
                            Express.Multer.File[]
                    };


                /* ========================================= */
                /* CURRENT MAIN PHOTO */
                /* ========================================= */

                let mainPhoto =
                    news.main_photo;


                /* ========================================= */
                /* NEW MAIN PHOTO */
                /* ========================================= */

                if (
                    files?.["main_photo"]?.[0]
                ) {

                    const file =
                        files["main_photo"][0];


                    /*
                     * Видаляємо старе фото
                     */

                    if (news.main_photo) {

                        await this.deleteFile(
                            news.main_photo
                        );

                    }


                    /*
                     * Обробляємо нове фото
                     */

                    mainPhoto =
                        await this.processImage(
                            file.buffer
                        );

                }


                /* ========================================= */
                /* UPDATE */
                /* ========================================= */

                await news.update({

                    title:
                        req.body.title ??
                        news.title,

                    description:
                        req.body.description ??
                        news.description,

                    short_description:
                        req.body.short_description ??
                        news.short_description,

                    main_photo:
                    mainPhoto,

                });


                /* ========================================= */
                /* RESPONSE */
                /* ========================================= */

                return res.status(200).json(
                    news
                );

            } catch (e) {

                console.error(
                    "Update news error:",
                    e
                );

                return res.status(500).json({
                    message:
                        "Update error"
                });

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

            const files = [
                news.main_photo,
                ...(news.photos ? news.photos.split(",") : []),
                news.video,
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