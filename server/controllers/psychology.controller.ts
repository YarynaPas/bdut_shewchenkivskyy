import { Request, RequestHandler } from "express";
import { Psychology } from "../models/psychology.model";
import multer from "multer";
import path from "path";
import fs from "fs";
import sharp from "sharp";

const PUBLIC_DIR = path.join(process.cwd(), "public");
const UPLOAD_DIR = path.join(PUBLIC_DIR, "uploads", "psychology");

fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
}).fields([
    { name: "main_photo", maxCount: 1 },
    { name: "photos", maxCount: 6 },
]);

const SVG_TYPES = new Set([
    "image/svg+xml",
]);

class PsychologyController {

    private getFullImageUrl(req: Request, filePath: string | null): string | null {
        if (!filePath) return null;

        return `${req.protocol}://${req.get("host")}${filePath}`;
    }

    private async processImage(file: Express.Multer.File): Promise<string> {

        const isSvg = SVG_TYPES.has(file.mimetype);

        const extension = isSvg ? ".svg" : ".webp";

        const fileName =
            `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${extension}`;

        const fullPath = path.join(UPLOAD_DIR, fileName);

        if (isSvg) {

            await fs.promises.writeFile(
                fullPath,
                file.buffer
            );

        } else {

            await sharp(file.buffer)
                .resize({
                    width: 1200,
                    withoutEnlargement: true,
                })
                .webp({
                    quality: 82,
                })
                .toFile(fullPath);

        }

        return `/uploads/psychology/${fileName}`;
    }

    private async deleteFile(filePath: string): Promise<void> {

        const fullPath = path.join(
            PUBLIC_DIR,
            filePath
        );

        await fs.promises.unlink(fullPath).catch(() => null);

    }

    createPsychology: RequestHandler = (req, res) => {

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
                long_description,
            } = req.body;

            if (!title) {

                return res.status(400).json({
                    message: "Title is required",
                });

            }

            if (!description) {

                return res.status(400).json({
                    message: "Description is required",
                });

            }

            if (!files["main_photo"]?.[0]) {

                return res.status(400).json({
                    message: "Main photo is required",
                });

            }

            try {

                const mainPhoto =
                    await this.processImage(
                        files["main_photo"][0]
                    );

                const otherPhotos =
                    await Promise.all(

                        (files["photos"] || []).map(file =>
                            this.processImage(file)
                        )

                    );

                const psychology =
                    await Psychology.create({

                        title,

                        description,

                        date: new Date(),

                        main_photo: mainPhoto,

                        long_description,

                        photos: otherPhotos.join(","),

                    });

                res.status(201).json({

                    ...psychology.toJSON(),

                    main_photo: this.getFullImageUrl(
                        req,
                        psychology.main_photo
                    ),

                    photos: otherPhotos.map(photo =>
                        this.getFullImageUrl(
                            req,
                            photo
                        )
                    ),

                });

            } catch (e) {

                console.error(e);

                res.status(500).json({

                    message: "Error creating psychology",

                });

            }

        });

    };
    getAllPsychology: RequestHandler = async (req, res) => {

        try {

            const page =
                parseInt(req.query["page"] as string) || 1;

            const limit =
                parseInt(req.query["limit"] as string) || 10;

            const offset =
                (page - 1) * limit;

            const { count, rows } =
                await Psychology.findAndCountAll({

                    order: [["date", "DESC"]],

                    limit,

                    offset,

                });

            res.json({

                data: rows.map(item => ({

                    ...item.toJSON(),

                    main_photo: this.getFullImageUrl(
                        req,
                        item.main_photo
                    ),

                    photos:
                        item.photos
                            ?.split(",")
                            .map(photo =>
                                this.getFullImageUrl(
                                    req,
                                    photo.trim()
                                )
                            ) || [],

                })),

                total: count,

                page,

                pages: Math.ceil(count / limit),

            });

        } catch (e) {

            console.error(e);

            res.status(500).json({

                message: "Error fetching psychology",

            });

        }

    };

    getPsychologyById: RequestHandler = async (req, res) => {

        try {

            const id = Number(req.params.id);

            if (isNaN(id)) {

                return res.status(400).json({

                    message: "Invalid id",

                });

            }

            const psychology =
                await Psychology.findByPk(id);

            if (!psychology) {

                return res.status(404).json({

                    message: "Psychology not found",

                });

            }

            res.json({

                ...psychology.toJSON(),

                main_photo: this.getFullImageUrl(
                    req,
                    psychology.main_photo
                ),

                photos:
                    psychology.photos
                        ?.split(",")
                        .map(photo =>
                            this.getFullImageUrl(
                                req,
                                photo.trim()
                            )
                        ) || [],

            });

        } catch (e) {

            console.error(e);

            res.status(500).json({

                message: "Error fetching psychology",

            });

        }

    };

    updatePsychology: RequestHandler = async (req, res) => {

        upload(req, res, async (err) => {

            if (err) {

                return res.status(400).json({

                    message: err.message,

                });

            }

            try {

                const id =
                    Number(req.params.id);

                if (isNaN(id)) {

                    return res.status(400).json({

                        message: "Invalid id",

                    });

                }

                const psychology =
                    await Psychology.findByPk(id);

                if (!psychology) {

                    return res.status(404).json({

                        message: "Psychology not found",

                    });

                }

                const files =
                    req.files as {
                        [fieldname: string]: Express.Multer.File[];
                    };

                let mainPhoto =
                    psychology.main_photo;

                if (files["main_photo"]?.[0]) {

                    if (psychology.main_photo) {

                        await this.deleteFile(
                            psychology.main_photo
                        );

                    }

                    mainPhoto =
                        await this.processImage(
                            files["main_photo"][0]
                        );

                }

                let photos =
                    psychology.photos;

                if (
                    files["photos"] &&
                    files["photos"].length
                ) {

                    if (psychology.photos) {

                        await Promise.all(

                            psychology.photos
                                .split(",")
                                .map(photo =>
                                    this.deleteFile(
                                        photo.trim()
                                    )
                                )

                        );

                    }

                    const uploadedPhotos =
                        await Promise.all(

                            files["photos"].map(file =>
                                this.processImage(file)
                            )

                        );

                    photos =
                        uploadedPhotos.join(",");

                }

                await psychology.update({

                    ...req.body,

                    main_photo: mainPhoto,

                    photos,

                });

                res.json(psychology);

            } catch (e) {

                console.error(e);

                res.status(500).json({

                    message: "Update psychology error",

                });

            }

        });

    };
    deletePsychology: RequestHandler = async (req, res) => {

        try {

            const id = Number(req.params.id);

            if (isNaN(id)) {

                return res.status(400).json({
                    message: "Invalid id",
                });

            }

            const psychology = await Psychology.findByPk(id);

            if (!psychology) {

                return res.status(404).json({
                    message: "Psychology not found",
                });

            }

            const files = [

                psychology.main_photo,

                ...(psychology.photos
                    ? psychology.photos
                        .split(",")
                        .map(photo => photo.trim())
                    : []),

            ].filter(
                (file): file is string => !!file
            );

            await Promise.all(
                files.map(file =>
                    this.deleteFile(file)
                )
            );

            await psychology.destroy();

            res.json({
                message: "Psychology deleted successfully",
            });

        } catch (e) {

            console.error(e);

            res.status(500).json({
                message: "Delete psychology error",
            });

        }

    };

}

export const psychologyController = new PsychologyController();