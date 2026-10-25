"use client";

import {
    ChangeEvent,
    FormEvent,
    useEffect,
    useState,
} from "react";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import styles from "./EditPsychology.module.css";

import {
    AdminPsychology,
    getAdminPsychologyById,
    updatePsychology,
} from "@/services/psychologyApi";


export default function EditPsychologyPage() {

    const params = useParams();

    const router = useRouter();

    const id = Number(params.id);


    /* ========================================= */
    /* DATA */
    /* ========================================= */

    const [item, setItem] =
        useState<AdminPsychology | null>(null);


    /* ========================================= */
    /* TEXT */
    /* ========================================= */

    const [title, setTitle] =
        useState("");

    const [description, setDescription] =
        useState("");

    const [longDescription, setLongDescription] =
        useState("");


    /* ========================================= */
    /* MAIN PHOTO */
    /* ========================================= */

    const [mainPhoto, setMainPhoto] =
        useState<File | null>(null);

    const [mainPreview, setMainPreview] =
        useState<string | null>(null);


    /* ========================================= */
    /* EXISTING PHOTOS */
    /* ========================================= */

    const [existingPhotos, setExistingPhotos] =
        useState<string[]>([]);


    /* ========================================= */
    /* NEW PHOTOS */
    /* ========================================= */

    const [newPhotos, setNewPhotos] =
        useState<File[]>([]);

    const [newPhotoPreviews, setNewPhotoPreviews] =
        useState<string[]>([]);


    /* ========================================= */
    /* STATE */
    /* ========================================= */

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    /* ========================================= */
    /* FILE URL */
    /* ========================================= */

    const getFileUrl = (
        file: string | null | undefined
    ): string => {

        if (!file) {

            return "/placeholder.png";

        }


        if (
            file.startsWith("http://") ||
            file.startsWith("https://")
        ) {

            return file;

        }


        const api =
            process.env.NEXT_PUBLIC_API_URL
                ?.replace(/\/$/, "");


        if (!api) {

            return file;

        }


        return `${api}${
            file.startsWith("/")
                ? file
                : `/${file}`
        }`;

    };


    /* ========================================= */
    /* LOAD */
    /* ========================================= */

    useEffect(() => {

        if (
            !id ||
            Number.isNaN(id)
        ) {

            setError(
                "Некоректний ID матеріалу."
            );

            setLoading(false);

            return;
        }


        const load =
            async () => {

                try {

                    const data =
                        await getAdminPsychologyById(
                            id
                        );


                    setItem(data);


                    setTitle(
                        data.title || ""
                    );


                    setDescription(
                        data.description || ""
                    );


                    setLongDescription(
                        data.long_description || ""
                    );


                    setMainPreview(
                        getFileUrl(
                            data.main_photo
                        )
                    );


                    setExistingPhotos(
                        Array.isArray(
                            data.photos
                        )
                            ? data.photos
                            : []
                    );

                } catch (err) {

                    console.error(
                        err
                    );

                    setError(
                        err instanceof Error
                            ? err.message
                            : "Не вдалося завантажити матеріал."
                    );

                } finally {

                    setLoading(false);

                }

            };


        load();

    }, [id]);


    /* ========================================= */
    /* MAIN PHOTO */
    /* ========================================= */

    const handleMainPhoto = (
        event: ChangeEvent<HTMLInputElement>
    ) => {

        const file =
            event.target.files?.[0];


        if (!file) {

            return;

        }


        if (
            !file.type.startsWith(
                "image/"
            )
        ) {

            setError(
                "Головне фото повинно бути зображенням."
            );

            return;

        }


        setError("");

        setMainPhoto(file);


        setMainPreview(
            URL.createObjectURL(
                file
            )
        );

    };


    /* ========================================= */
    /* NEW PHOTOS */
    /* ========================================= */

    const handleNewPhotos = (
        event: ChangeEvent<HTMLInputElement>
    ) => {

        const files =
            Array.from(
                event.target.files || []
            );


        if (!files.length) {

            return;

        }


        const imageFiles =
            files.filter(
                file =>
                    file.type.startsWith(
                        "image/"
                    )
            );


        if (
            imageFiles.length !== files.length
        ) {

            setError(
                "Додаткові файли повинні бути зображеннями."
            );

            return;

        }


        if (
            imageFiles.length > 6
        ) {

            setError(
                "Можна вибрати максимум 6 фотографій."
            );

            return;

        }


        setError("");

        setNewPhotos(
            imageFiles
        );


        setNewPhotoPreviews(
            imageFiles.map(
                file =>
                    URL.createObjectURL(
                        file
                    )
            )
        );

    };


    /* ========================================= */
    /* CLEAR NEW PHOTOS */
    /* ========================================= */

    const clearNewPhotos = () => {

        setNewPhotos([]);

        setNewPhotoPreviews([]);

    };


    /* ========================================= */
    /* SUBMIT */
    /* ========================================= */

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {

        event.preventDefault();


        setError("");

        setSuccess("");


        /* ================================= */
        /* VALIDATION */
        /* ================================= */

        if (!title.trim()) {

            setError(
                "Назва матеріалу є обов'язковою."
            );

            return;

        }


        if (!description.trim()) {

            setError(
                "Опис матеріалу є обов'язковим."
            );

            return;

        }


        try {

            setSaving(true);


            await updatePsychology(
                id,
                {

                    title:
                        title.trim(),

                    description:
                        description.trim(),

                    long_description:
                        longDescription.trim(),

                    main_photo:
                    mainPhoto,

                    /*
                     * Якщо нові фото не вибирали —
                     * передаємо undefined, тому backend
                     * залишить стару галерею.
                     *
                     * Якщо вибрали нові —
                     * backend повністю замінить
                     * стару галерею новими.
                     */

                    photos:
                        newPhotos.length > 0
                            ? newPhotos
                            : undefined,

                }
            );


            setSuccess(
                "Матеріал успішно оновлено!"
            );


            setTimeout(() => {

                router.push(
                    "/admin_cabinet/psychology"
                );

            }, 700);

        } catch (err) {

            console.error(
                err
            );


            setError(
                err instanceof Error
                    ? err.message
                    : "Не вдалося оновити матеріал."
            );

        } finally {

            setSaving(false);

        }

    };


    /* ========================================= */
    /* LOADING */
    /* ========================================= */

    if (loading) {

        return (

            <main className={styles.page}>

                <div className={styles.loading}>

                    <div className={styles.spinner} />

                    <span>
                        Завантаження матеріалу...
                    </span>

                </div>

            </main>

        );

    }


    /* ========================================= */
    /* NOT FOUND */
    /* ========================================= */

    if (!item) {

        return (

            <main className={styles.page}>

                <div className={styles.notFound}>

                    <div className={styles.notFoundIcon}>
                        !
                    </div>

                    <h1>
                        Матеріал не знайдено
                    </h1>

                    <p>
                        {error}
                    </p>

                    <Link
                        href="/admin_cabinet/psychology"
                        className={styles.backButton}
                    >
                        ← До психолога
                    </Link>

                </div>

            </main>

        );

    }


    return (

        <main className={styles.page}>

            <div className={styles.container}>

                {/* ================================= */}
                {/* HEADER */}
                {/* ================================= */}

                <header className={styles.header}>

                    <Link
                        href="/admin_cabinet/psychology"
                        className={styles.back}
                    >
                        ← Назад до психолога
                    </Link>


                    <span className={styles.overline}>
                        КЕРУВАННЯ КОНТЕНТОМ
                    </span>


                    <h1>
                        Редагувати матеріал
                    </h1>


                    <p>
                        Оновіть статтю, головне
                        фото або галерею.
                    </p>

                </header>


                {/* ================================= */}
                {/* ERROR */}
                {/* ================================= */}

                {error && (

                    <div className={styles.error}>

                        <span>
                            !
                        </span>

                        <p>
                            {error}
                        </p>

                    </div>

                )}


                {/* ================================= */}
                {/* SUCCESS */}
                {/* ================================= */}

                {success && (

                    <div className={styles.success}>

                        <span>
                            ✓
                        </span>

                        <p>
                            {success}
                        </p>

                    </div>

                )}


                <form
                    className={styles.form}
                    onSubmit={handleSubmit}
                >

                    {/* ================================= */}
                    {/* TEXT */}
                    {/* ================================= */}

                    <section className={styles.card}>

                        <div className={styles.cardHeader}>

                            <div className={styles.number}>
                                01
                            </div>

                            <div>

                                <h2>
                                    Основна інформація
                                </h2>

                                <p>
                                    Дані публікації.
                                </p>

                            </div>

                        </div>


                        {/* TITLE */}

                        <div className={styles.field}>

                            <div className={styles.labelRow}>

                                <label>
                                    Назва матеріалу
                                </label>

                                <span className={styles.required}>
                                    Обов'язкове
                                </span>

                            </div>


                            <input
                                type="text"
                                value={title}
                                onChange={e =>
                                    setTitle(
                                        e.target.value
                                    )
                                }
                                disabled={saving}
                            />

                        </div>


                        {/* DESCRIPTION */}

                        <div className={styles.field}>

                            <div className={styles.labelRow}>

                                <label>
                                    Короткий опис
                                </label>

                                <span className={styles.required}>
                                    Обов'язкове
                                </span>

                            </div>


                            <textarea
                                rows={6}
                                value={description}
                                onChange={e =>
                                    setDescription(
                                        e.target.value
                                    )
                                }
                                disabled={saving}
                            />

                        </div>


                        {/* LONG DESCRIPTION */}

                        <div className={styles.field}>

                            <div className={styles.labelRow}>

                                <label>
                                    Повний текст статті
                                </label>

                                <span className={styles.optional}>
                                    Необов'язкове
                                </span>

                            </div>


                            <textarea
                                rows={15}
                                value={longDescription}
                                onChange={e =>
                                    setLongDescription(
                                        e.target.value
                                    )
                                }
                                disabled={saving}
                            />

                        </div>

                    </section>


                    {/* ================================= */}
                    {/* MAIN PHOTO */}
                    {/* ================================= */}

                    <section className={styles.card}>

                        <div className={styles.cardHeader}>

                            <div className={styles.number}>
                                02
                            </div>

                            <div>

                                <h2>
                                    Головне фото
                                </h2>

                                <p>
                                    Поточне зображення
                                    матеріалу.
                                </p>

                            </div>

                        </div>


                        <div className={styles.labelRow}>

                            <label>
                                Головне фото
                            </label>

                            <span className={styles.required}>
                                Обов'язкове
                            </span>

                        </div>


                        {mainPreview && (

                            <div className={styles.mainPreview}>

                                <img
                                    src={
                                        mainPreview
                                    }
                                    alt={
                                        title
                                    }
                                />

                                {mainPhoto && (

                                    <span
                                        className={
                                            styles.newPhotoBadge
                                        }
                                    >
                                        НОВЕ
                                    </span>

                                )}

                            </div>

                        )}


                        <label className={styles.upload}>

                            <input
                                type="file"
                                accept="image/*"
                                onChange={
                                    handleMainPhoto
                                }
                                disabled={saving}
                            />

                            <span>
                                ↑
                            </span>

                            <strong>
                                Замінити головне фото
                            </strong>

                            <small>
                                JPG, PNG, GIF або SVG
                            </small>

                        </label>

                    </section>


                    {/* ================================= */}
                    {/* GALLERY */}
                    {/* ================================= */}

                    <section className={styles.card}>

                        <div className={styles.cardHeader}>

                            <div className={styles.number}>
                                03
                            </div>

                            <div>

                                <h2>
                                    Фотогалерея
                                </h2>

                                <p>
                                    Поточні або нові
                                    додаткові фотографії.
                                </p>

                            </div>

                        </div>


                        <div className={styles.labelRow}>

                            <label>
                                Додаткові фото
                            </label>

                            <span className={styles.optional}>
                                Необов'язкове · до 6
                            </span>

                        </div>


                        {/* CURRENT */}

                        <div className={styles.subheading}>
                            Поточні фотографії
                        </div>


                        {existingPhotos.length > 0 ? (

                            <div className={styles.photoGrid}>

                                {existingPhotos.map(
                                    (photo, index) => (

                                        <div
                                            key={
                                                `${photo}-${index}`
                                            }
                                            className={
                                                styles.photoItem
                                            }
                                        >

                                            <img
                                                src={
                                                    getFileUrl(
                                                        photo
                                                    )
                                                }
                                                alt=""
                                            />

                                        </div>

                                    )
                                )}

                            </div>

                        ) : (

                            <div className={styles.noPhotos}>
                                Додаткових фотографій
                                немає.
                            </div>

                        )}


                        {/* NEW */}

                        {newPhotos.length > 0 && (

                            <>
                                <div
                                    className={
                                        styles.subheading
                                    }
                                >
                                    Нові фотографії
                                </div>


                                <div
                                    className={
                                        styles.photoGrid
                                    }
                                >

                                    {newPhotoPreviews.map(
                                        (photo, index) => (

                                            <div
                                                key={
                                                    `${photo}-${index}`
                                                }
                                                className={
                                                    styles.photoItem
                                                }
                                            >

                                                <img
                                                    src={photo}
                                                    alt=""
                                                />

                                                <span
                                                    className={
                                                        styles.newPhotoBadge
                                                    }
                                                >
                                                    НОВЕ
                                                </span>

                                            </div>

                                        )
                                    )}

                                </div>


                                <button
                                    type="button"
                                    className={
                                        styles.clearButton
                                    }
                                    onClick={
                                        clearNewPhotos
                                    }
                                >
                                    Скасувати нові фото
                                </button>


                                <p
                                    className={
                                        styles.warning
                                    }
                                >
                                    Після збереження ці фото
                                    замінять поточну галерею.
                                </p>

                            </>

                        )}


                        <label
                            className={
                                styles.uploadSmall
                            }
                        >

                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={
                                    handleNewPhotos
                                }
                                disabled={saving}
                            />

                            <span>
                                +
                            </span>

                            <strong>
                                Вибрати нову галерею
                            </strong>

                            <small>
                                Максимум 6 фотографій
                            </small>

                        </label>

                    </section>


                    {/* ================================= */}
                    {/* ACTIONS */}
                    {/* ================================= */}

                    <div className={styles.actions}>

                        <Link
                            href="/admin_cabinet/psychology"
                            className={styles.cancel}
                        >
                            Скасувати
                        </Link>


                        <button
                            type="submit"
                            className={styles.save}
                            disabled={saving}
                        >

                            {saving ? (

                                <>
                                    <span
                                        className={
                                            styles.buttonSpinner
                                        }
                                    />

                                    Збереження...

                                </>

                            ) : (

                                <>
                                    Зберегти зміни
                                    <span>
                                        →
                                    </span>
                                </>

                            )}

                        </button>

                    </div>

                </form>

            </div>

        </main>

    );
}