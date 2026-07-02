import { Request, RequestHandler } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import sharp from "sharp";
import { Psychology } from "../models/psychology.model";

const PUBLIC_DIR = path.join(process.cwd(), "public");
const UPLOAD_DIR = path.join(PUBLIC_DIR, "uploads", "psychology");

const ALLOWED_MIME_TYPES = new Set([
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/svg+xml",
]);

fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const fileFilter = (
    _req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
) => {
    ALLOWED_MIME_TYPES.has(file.mimetype)
        ? cb(null, true)
        : cb(new Error("Only images are allowed (jpeg, jpg, png, gif, svg)!"));
};

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024,
        files: 7,
    },
    fileFilter,
}).fields([
    { name: "main_photo", maxCount: 1 },
    { name: "photos", maxCount: 6 },
]);

const parseId = (id: string | string[]): number | null => {
    const raw = Array.isArray(id) ? id[0] : id;
    const parsed = Number(raw);
    return isNaN(parsed) ? null : parsed;
};

const generateFileName = (extension: string) =>
    `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${extension}`;

const getFullImageUrl = (req: Request, imagePath: string | null): string | null => {
    if (!imagePath) return null;
    return `${req.protocol}://${req.get("host")}${imagePath}`;
};

const processAndSaveImage = async (file: Express.Multer.File, outputName: string): Promise<string> => {
    const outputPath = path.join(UPLOAD_DIR, outputName);

    if (file.mimetype === "image/svg+xml") {
        await fs.promises.writeFile(outputPath, file.buffer);
    } else {
        await sharp(file.buffer)
            .resize({ width: 1280, withoutEnlargement: true })
            .webp({ quality: 82 })
            .toFile(outputPath);
    }

    return `/uploads/psychology/${outputName}`;
};

const removeFile = async (filePath: string) => {
    await fs.promises.unlink(path.join(PUBLIC_DIR, filePath)).catch(() => null);
};

interface MulterFiles {
    [fieldname: string]: Express.Multer.File[];
}

interface PaginationResult {
    data: any[];
    total: number;
    page: number;
    pages: number;
    limit: number;
}

class PsychologyController {
    createPsychology: RequestHandler = (req, res) => {
        upload(req, res, async (err: any) => {
            if (err) {
                const status = err instanceof multer.MulterError
                    ? 400
                    : err.message.includes("Only images")
                        ? 400
                        : 500;

                res.status(status).json({ message: err.message });
                return;
            }

            const { title, description } = req.body;
            const files = req.files as MulterFiles;
            const mainPhotoFile = files["main_photo"]?.[0];
            const photoFiles = files["photos"] || [];

            if (!title || !description) {
                res.status(400).json({ message: "Title and description are required!" });
                return;
            }

            if (!mainPhotoFile) {
                res.status(400).json({ message: "Main photo is required!" });
                return;
            }

            try {
                const mainExt = mainPhotoFile.mimetype === "image/svg+xml" ? ".svg" : ".webp";

                const [mainPhotoPath, ...photoPaths] = await Promise.all([
                    processAndSaveImage(mainPhotoFile, generateFileName(mainExt)),
                    ...photoFiles.map(file => {
                        const ext = file.mimetype === "image/svg+xml" ? ".svg" : ".webp";
                        return processAndSaveImage(file, generateFileName(ext));
                    })
                ]);

                const psychology = await Psychology.create({
                    title,
                    description,
                    date: new Date(),
                    main_photo: mainPhotoPath,
                    photos: photoPaths.join(","),
                });

                res.status(201).json({
                    ...psychology.get(),
                    main_photo: getFullImageUrl(req, mainPhotoPath),
                    photos: photoPaths.map(photo => getFullImageUrl(req, photo)),
                });
            } catch (e) {
                console.error("Error creating psychology:", e);
                res.status(500).json({ message: "Error creating psychology" });
            }
        });
    };

    getAllPsychology: RequestHandler = async (req, res) => {
        try {
            const { page: page1, limit: limit1 } = req.query;
            const page = parseInt(page1 as string) || 1;
            const limit = parseInt(limit1 as string) || 5;
            const offset = (page - 1) * limit;

            const { count, rows } = await Psychology.findAndCountAll({
                order: [["date", "DESC"]],
                limit,
                offset,
            });

            const result: PaginationResult = {
                data: rows.map((item) => {
                    const data = item.get();
                    return {
                        ...data,
                        main_photo: getFullImageUrl(req, data.main_photo),
                        photos: data.photos
                            ? data.photos.split(",").map((photo: string) => getFullImageUrl(req, photo.trim()))
                            : [],
                    };
                }),
                total: count,
                page,
                pages: Math.ceil(count / limit),
                limit,
            };

            res.status(200).json(result);
        } catch (e) {
            console.error("Error getting psychology:", e);
            res.status(500).json({ message: "Error getting psychology" });
        }
    };

    getPsychologyById: RequestHandler = async (req, res) => {
        const id = parseId(req.params.id);

        if (!id) {
            res.status(400).json({ message: "Invalid id" });
            return;
        }

        try {
            const psychology = await Psychology.findByPk(id);

            if (!psychology) {
                res.status(404).json({ message: "Psychology not found" });
                return;
            }

            const data = psychology.get();

            res.status(200).json({
                ...data,
                main_photo: getFullImageUrl(req, data.main_photo),
                photos: data.photos
                    ? data.photos.split(",").map((photo: string) => getFullImageUrl(req, photo.trim()))
                    : [],
            });
        } catch (e) {
            console.error("Error getting psychology:", e);
            res.status(500).json({ message: "Error getting psychology" });
        }
    };

    deletePsychology: RequestHandler = async (req, res) => {
        const id = parseId(req.params.id);

        if (!id) {
            res.status(400).json({ message: "Invalid id" });
            return;
        }

        try {
            const psychology = await Psychology.findByPk(id);

            if (!psychology) {
                res.status(404).json({ message: "Psychology not found" });
                return;
            }

            const data = psychology.get();
            const filesToDelete = [
                data.main_photo,
                ...(data.photos ? data.photos.split(",").map((photo: string) => photo.trim()) : []),
            ].filter(Boolean);

            await Promise.all(filesToDelete.map(removeFile));
            await psychology.destroy();

            res.status(200).json({ message: "Psychology deleted successfully" });
        } catch (e) {
            console.error("Error deleting psychology:", e);
            res.status(500).json({ message: "Error deleting psychology" });
        }
    };
}

export const psychologyController = new PsychologyController();