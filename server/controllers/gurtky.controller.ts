import { Request, RequestHandler } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import sharp from "sharp";
import { Gurtky, Napryam } from "../models/gurtky.model";
import {ScheduleItem} from "../enums/Schedule-time-interface";

const PUBLIC_DIR = path.join(process.cwd(), "public");
const UPLOAD_DIR = path.join(PUBLIC_DIR, "uploads", "gurtky");

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
        files: 5,
    },
    fileFilter,
}).fields([
    {
        name: "pictograma",
        maxCount: 1,
    },
    {
        name: "photos",
        maxCount: 4,
    },
]);

const parseId = (id: string | string[]): number | null => {
    const raw = Array.isArray(id) ? id[0] : id;
    const parsed = Number(raw);

    return isNaN(parsed) ? null : parsed;
};

const generateFileName = (ext: string) =>
    `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;

const getFullImageUrl = (req: Request, imagePath: string) =>
    `${req.protocol}://${req.get("host")}${imagePath}`;

const processAndSaveImage = async (
    file: Express.Multer.File,
    outputName: string
): Promise<string> => {
    const outputPath = path.join(UPLOAD_DIR, outputName);

    if (file.mimetype === "image/svg+xml") {
        await fs.promises.writeFile(outputPath, file.buffer);
    } else {
        await sharp(file.buffer)
            .resize({
                width: 1280,
                withoutEnlargement: true,
            })
            .webp({
                quality: 82,
            })
            .toFile(outputPath);
    }

    return `/uploads/gurtky/${outputName}`;
};

const removeFile = async (filePath: string) => {
    await fs.promises.unlink(path.join(PUBLIC_DIR, filePath)).catch(() => null);
};

interface MulterFiles {
    [fieldname: string]: Express.Multer.File[];
}

interface GurtkyResponse {
    id: number;
    name: string;
    teacher: string;
    napryam: Napryam;
    vikova_grupa: string;
    description: string | null;
    long_description: string | null;
    classrom: string | null;
    pictograma: string;
    photos: string[];
    createdAt?: Date;
    updatedAt?: Date;
    schedule: ScheduleItem
}

class GurtkyController {
    createGurtky: RequestHandler = (req, res) => {
        upload(req, res, async (err: any) => {
            if (err) {
                const status =
                    err instanceof multer.MulterError
                        ? 400
                        : err.message.includes("Only images")
                            ? 400
                            : 500;

                res.status(status).json({
                    message: err.message,
                });

                return;
            }

            const {
                name,
                teacher,
                napryam,
                vikova_grupa,
                description,
                long_description,
                classrom,
                schedule,
            } = req.body;

            const files = req.files as MulterFiles;

            const pictogramaFile = files["pictograma"]?.[0];
            const photoFiles = files["photos"] || [];

            if (
                !name ||
                !teacher ||
                !napryam ||
                !vikova_grupa
            ) {
                res.status(400).json({
                    message:
                        "Name, teacher, direction and age group are required!",
                });

                return;
            }

            if (!pictogramaFile) {
                res.status(400).json({
                    message: "Pictograma photo is required",
                });

                return;
            }

            try {
                const ext =
                    pictogramaFile.mimetype === "image/svg+xml"
                        ? ".svg"
                        : ".webp";

                const [pictogramaPath, ...photoPaths] = await Promise.all([
                    processAndSaveImage(
                        pictogramaFile,
                        generateFileName(ext)
                    ),

                    ...photoFiles.map((file) => {
                        const e =
                            file.mimetype === "image/svg+xml"
                                ? ".svg"
                                : ".webp";

                        return processAndSaveImage(
                            file,
                            generateFileName(e)
                        );
                    }),
                ]);

                const gurtky = await Gurtky.create({
                    name,
                    teacher,
                    napryam,
                    vikova_grupa,
                    description: description || null,
                    long_description: long_description || null,
                    classrom: classrom || null,
                    schedule: schedule ? JSON.parse(schedule) : null,
                    pictograma: pictogramaPath,
                    photos: photoPaths.join(","),
                });

                const responseData: {
                    pictograma: string;
                    schedule: ScheduleItem[] | null;
                    teacher: string;
                    napryam: Napryam;
                    name: string;
                    description: string;
                    id: number;
                    long_description: string;
                    vikova_grupa: string;
                    classrom: string;
                    photos: string[]
                } = {
                    ...gurtky.get(),
                    pictograma: getFullImageUrl(req, pictogramaPath),
                    photos: photoPaths.map((p) =>
                        getFullImageUrl(req, p)
                    ),
                };

                res.status(201).json(responseData);
            } catch (e) {
                console.error("Error creating gurtky:", e);

                res.status(500).json({
                    message: "Error creating gurtky",
                });
            }
        });
    };

    getAllGurtky: RequestHandler = async (req, res) => {
        try {
            const list = await Gurtky.findAll();

            const responseData = list.map((g) => {
                const data = g.get();

                const photos = data.photos
                    ? data.photos
                        .split(",")
                        .map((p: string) =>
                            getFullImageUrl(req, p.trim())
                        )
                    : [];

                return {
                    ...data,
                    pictograma: getFullImageUrl(
                        req,
                        data.pictograma
                    ),
                    photos,
                };
            });

            res.status(200).json(responseData);
        } catch (e) {
            console.error("Error getting gurtky:", e);

            res.status(500).json({
                message: "Error getting gurtky",
            });
        }
    };

    getGurtkyById: RequestHandler = async (req, res) => {
        const id = parseId(req.params.id);

        if (!id) {
            res.status(400).json({
                message: "Invalid id",
            });

            return;
        }

        try {
            const gurtky = await Gurtky.findByPk(id);

            if (!gurtky) {
                res.status(404).json({
                    message: "Gurtky not found",
                });

                return;
            }

            const data = gurtky.get();

            const photos = data.photos
                ? data.photos
                    .split(",")
                    .map((p: string) =>
                        getFullImageUrl(req, p.trim())
                    )
                : [];

            res.status(200).json({
                ...data,
                pictograma: getFullImageUrl(
                    req,
                    data.pictograma
                ),
                photos,
            });        } catch (e) {
            console.error("Error getting gurtky:", e);

            res.status(500).json({
                message: "Error getting gurtky",
            });
        }
    };
    updateGurtky: RequestHandler = (req, res) => {

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
                                : "Помилка завантаження файлу",
                    });

                }


                /* ========================================= */
                /* ID */
                /* ========================================= */

                const id = parseId(
                    req.params.id
                );


                if (!id) {

                    return res.status(400).json({
                        message: "Invalid id",
                    });

                }


                /* ========================================= */
                /* FIND */
                /* ========================================= */

                const gurtky =
                    await Gurtky.findByPk(id);


                if (!gurtky) {

                    return res.status(404).json({
                        message: "Gurtky not found",
                    });

                }


                /* ========================================= */
                /* BODY */
                /* ========================================= */

                const {
                    name,
                    teacher,
                    napryam,
                    vikova_grupa,
                    description,
                    long_description,
                    classrom,
                    schedule,
                    existing_photos,
                } = req.body;


                /* ========================================= */
                /* REQUIRED */
                /* ========================================= */

                if (
                    !name ||
                    !teacher ||
                    !napryam ||
                    !vikova_grupa
                ) {

                    return res.status(400).json({
                        message:
                            "Name, teacher, direction and age group are required!",
                    });

                }


                /* ========================================= */
                /* FILES */
                /* ========================================= */

                const files =
                    req.files as MulterFiles;


                /* ========================================= */
                /* MAIN PHOTO */
                /* ========================================= */

                let pictograma =
                    gurtky.pictograma;


                const newPictograma =
                    files?.["pictograma"]?.[0];


                if (newPictograma) {

                    /*
                     * Видаляємо стару піктограму
                     */

                    if (gurtky.pictograma) {

                        await removeFile(
                            gurtky.pictograma
                        );

                    }


                    /*
                     * Визначаємо формат
                     */

                    const ext =
                        newPictograma.mimetype ===
                        "image/svg+xml"
                            ? ".svg"
                            : ".webp";


                    pictograma =
                        await processAndSaveImage(
                            newPictograma,
                            generateFileName(ext)
                        );

                }


                /* ========================================= */
                /* EXISTING PHOTOS */
                /* ========================================= */

                let oldPhotos: string[] = [];


                if (gurtky.photos) {

                    oldPhotos =
                        gurtky.photos
                            .split(",")
                            .map(
                                p => p.trim()
                            )
                            .filter(Boolean);

                }


                /*
                 * Якщо frontend передав existing_photos,
                 * це список фотографій, які потрібно
                 * залишити.
                 *
                 * Якщо параметра немає —
                 * залишаємо всі старі.
                 */

                let photosToKeep =
                    oldPhotos;


                if (
                    existing_photos !==
                    undefined
                ) {

                    try {

                        const parsed =
                            JSON.parse(
                                existing_photos
                            );


                        if (
                            Array.isArray(parsed)
                        ) {

                            photosToKeep =
                                parsed.filter(
                                    (photo): photo is string =>
                                        typeof photo === "string" &&
                                        photo.trim().length > 0
                                );

                        }

                    } catch {

                        return res.status(400).json({
                            message:
                                "Invalid existing_photos format",
                        });

                    }

                }


                /* ========================================= */
                /* DELETE REMOVED PHOTOS */
                /* ========================================= */

                const removedPhotos =
                    oldPhotos.filter(
                        photo =>
                            !photosToKeep.includes(
                                photo
                            )
                    );


                await Promise.all(
                    removedPhotos.map(
                        photo =>
                            removeFile(photo)
                    )
                );


                /* ========================================= */
                /* NEW PHOTOS */
                /* ========================================= */

                const newPhotoFiles =
                    files?.["photos"] || [];


                const newPhotoPaths =
                    await Promise.all(
                        newPhotoFiles.map(
                            async (file) => {

                                const ext =
                                    file.mimetype ===
                                    "image/svg+xml"
                                        ? ".svg"
                                        : ".webp";


                                return processAndSaveImage(
                                    file,
                                    generateFileName(ext)
                                );

                            }
                        )
                    );


                /* ========================================= */
                /* ALL PHOTOS */
                /* ========================================= */

                const allPhotos = [
                    ...photosToKeep,
                    ...newPhotoPaths,
                ];


                if (
                    allPhotos.length > 4
                ) {

                    /*
                     * Якщо перевищили ліміт —
                     * видаляємо щойно завантажені.
                     */

                    await Promise.all(
                        newPhotoPaths.map(
                            photo =>
                                removeFile(photo)
                        )
                    );


                    return res.status(400).json({
                        message:
                            "Maximum 4 additional photos are allowed",
                    });

                }


                /* ========================================= */
                /* SCHEDULE */
                /* ========================================= */

                let parsedSchedule =
                    gurtky.schedule;


                if (
                    schedule !== undefined &&
                    schedule !== ""
                ) {

                    try {

                        parsedSchedule =
                            JSON.parse(
                                schedule
                            );

                    } catch {

                        return res.status(400).json({
                            message:
                                "Invalid schedule format",
                        });

                    }

                }


                /* ========================================= */
                /* UPDATE */
                /* ========================================= */

                await gurtky.update({

                    name:
                        name.trim(),

                    teacher:
                        teacher.trim(),

                    napryam,

                    vikova_grupa:
                        vikova_grupa.trim(),

                    description:
                        description?.trim()
                        || null,

                    long_description:
                        long_description?.trim()
                        || null,

                    classrom:
                        classrom?.trim()
                        || null,

                    schedule:
                    parsedSchedule,

                    pictograma,

                    photos:
                        allPhotos.join(","),

                });


                /* ========================================= */
                /* RESPONSE */
                /* ========================================= */

                res.status(200).json({

                    ...gurtky.get(),

                    pictograma:
                        getFullImageUrl(
                            req,
                            pictograma
                        ),

                    photos:
                        allPhotos.map(
                            photo =>
                                getFullImageUrl(
                                    req,
                                    photo
                                )
                        ),

                });

            } catch (e) {

                console.error(
                    "Error updating gurtky:",
                    e
                );

                res.status(500).json({
                    message:
                        "Error updating gurtky",
                });

            }

        });

    };

    deleteGurtky: RequestHandler = async (req, res) => {
        const id = parseId(req.params.id);

        if (!id) {
            res.status(400).json({
                message: "Invalid id",
            });

            return;
        }

        try {
            const gurtky = await Gurtky.findByPk(id);

            if (!gurtky) {
                res.status(404).json({
                    message: "Gurtky not found",
                });

                return;
            }

            const data = gurtky.get();

            const filesToDelete = [
                data.pictograma,
                ...(data.photos
                    ? data.photos
                        .split(",")
                        .map((p: string) => p.trim())
                    : []),
            ].filter(Boolean);

            await Promise.all(filesToDelete.map(removeFile));

            await gurtky.destroy();

            res.status(200).json({
                message: "Gurtky deleted successfully",
            });
        } catch (e) {
            console.error("Error deleting gurtky:", e);

            res.status(500).json({
                message: "Error deleting gurtky",
            });
        }
    };
}

export const gurtkyController = new GurtkyController();