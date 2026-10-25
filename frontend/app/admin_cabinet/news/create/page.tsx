"use client";

import {
    ChangeEvent,
    FormEvent,
    useState,
} from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import styles from "./CreateNews.module.css";

import {
    createNews,
} from "@/services/newsApi";


export default function CreateNewsPage() {

    const router = useRouter();


    /* ========================================= */
    /* TEXT */
    /* ========================================= */

    const [title, setTitle] =
        useState("");

    const [shortDescription, setShortDescription] =
        useState("");

    const [description, setDescription] =
        useState("");


    /* ========================================= */
    /* FILES */
    /* ========================================= */

    const [mainPhoto, setMainPhoto] =
        useState<File | null>(null);

    const [photos, setPhotos] =
        useState<File[]>([]);

    const [video, setVideo] =
        useState<File | null>(null);


    /* ========================================= */
    /* PREVIEWS */
    /* ========================================= */

    const [mainPreview, setMainPreview] =
        useState<string | null>(null);

    const [photoPreviews, setPhotoPreviews] =
        useState<string[]>([]);


    /* ========================================= */
    /* STATE */
    /* ========================================= */

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


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

        if (!file.type.startsWith("image/")) {

            setError(
                "Головне фото повинно бути зображенням."
            );

            return;
        }

        setError("");

        setMainPhoto(file);

        const preview =
            URL.createObjectURL(file);

        setMainPreview(preview);
    };


    /* ========================================= */
    /* ADDITIONAL PHOTOS */
    /* ========================================= */

    const handlePhotos = (
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
                    file.type.startsWith("image/")
            );


        if (
            imageFiles.length !==
            files.length
        ) {

            setError(
                "Додаткові файли повинні бути зображеннями."
            );

            return;
        }


        const combined = [
            ...photos,
            ...imageFiles,
        ];


        if (combined.length > 6) {

            setError(
                "Можна додати максимум 6 додаткових фотографій."
            );

            return;
        }


        setError("");

        setPhotos(combined);

        const previews =
            combined.map(
                file =>
                    URL.createObjectURL(file)
            );

        setPhotoPreviews(
            previews
        );
    };


    /* ========================================= */
    /* REMOVE PHOTO */
    /* ========================================= */

    const removePhoto = (
        index: number
    ) => {

        const newPhotos =
            photos.filter(
                (_, i) =>
                    i !== index
            );

        setPhotos(
            newPhotos
        );

        setPhotoPreviews(
            newPhotos.map(
                file =>
                    URL.createObjectURL(file)
            )
        );
    };


    /* ========================================= */
    /* VIDEO */
    /* ========================================= */

    const handleVideo = (
        event: ChangeEvent<HTMLInputElement>
    ) => {

        const file =
            event.target.files?.[0];

        if (!file) {
            return;
        }

        setError("");

        setVideo(file);
    };


    /* ========================================= */
    /* REMOVE MAIN PHOTO */
    /* ========================================= */

    const removeMainPhoto = () => {

        setMainPhoto(null);

        setMainPreview(null);

    };


    /* ========================================= */
    /* REMOVE VIDEO */
    /* ========================================= */

    const removeVideo = () => {

        setVideo(null);

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


        /* ------------------------------------- */
        /* VALIDATION */
        /* ------------------------------------- */

        if (!title.trim()) {

            setError(
                "Введіть назву новини."
            );

            return;
        }


        if (!mainPhoto) {

            setError(
                "Головне фото є обов'язковим."
            );

            return;
        }


        try {

            setLoading(true);


            await createNews({

                title:
                    title.trim(),

                short_description:
                    shortDescription.trim(),

                description:
                    description.trim(),

                main_photo:
                mainPhoto,

                photos,

                video,

            });


            setSuccess(
                "Новину успішно створено!"
            );


            setTimeout(() => {

                router.push(
                    "/admin_cabinet/news"
                );

            }, 700);


        } catch (error) {

            console.error(
                error
            );

            setError(
                error instanceof Error
                    ? error.message
                    : "Не вдалося створити новину."
            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <main className={styles.page}>

            <div className={styles.container}>

                {/* ================================= */}
                {/* HEADER */}
                {/* ================================= */}

                <header className={styles.header}>

                    <Link
                        href="/admin_cabinet/news"
                        className={styles.back}
                    >
                        ← Назад до новин
                    </Link>

                    <span className={styles.subtitle}>
                        КЕРУВАННЯ КОНТЕНТОМ
                    </span>

                    <h1>
                        Додати новину
                    </h1>

                    <p>
                        Створіть нову публікацію
                        для сайту.
                    </p>

                </header>


                {/* ================================= */}
                {/* MESSAGES */}
                {/* ================================= */}

                {error && (

                    <div className={styles.error}>

                        <span>!</span>

                        <p>
                            {error}
                        </p>

                    </div>

                )}


                {success && (

                    <div className={styles.success}>

                        <span>✓</span>

                        <p>
                            {success}
                        </p>

                    </div>

                )}


                {/* ================================= */}
                {/* FORM */}
                {/* ================================= */}

                <form
                    className={styles.form}
                    onSubmit={handleSubmit}
                >

                    {/* ================================= */}
                    {/* BASIC INFORMATION */}
                    {/* ================================= */}

                    <section className={styles.section}>

                        <div className={styles.sectionHeader}>

                            <div className={styles.sectionNumber}>
                                01
                            </div>

                            <div>

                                <h2>
                                    Основна інформація
                                </h2>

                                <p>
                                    Дані, які будуть
                                    відображатися на сторінці
                                    новини.
                                </p>

                            </div>

                        </div>


                        {/* TITLE */}

                        <div className={styles.field}>

                            <div className={styles.labelRow}>

                                <label htmlFor="title">
                                    Назва новини
                                </label>

                                <span
                                    className={
                                        styles.required
                                    }
                                >
                                    Обов'язкове
                                </span>

                            </div>

                            <input
                                id="title"
                                type="text"
                                value={title}
                                onChange={(event) =>
                                    setTitle(
                                        event.target.value
                                    )
                                }
                                placeholder="Введіть назву новини"
                                disabled={loading}
                            />

                            <span className={styles.hint}>
                                Коротка та зрозуміла назва
                                публікації.
                            </span>

                        </div>


                        {/* SHORT DESCRIPTION */}

                        <div className={styles.field}>

                            <div className={styles.labelRow}>

                                <label htmlFor="shortDescription">
                                    Короткий опис
                                </label>

                                <span
                                    className={
                                        styles.optional
                                    }
                                >
                                    Необов'язкове
                                </span>

                            </div>

                            <textarea
                                id="shortDescription"
                                value={shortDescription}
                                onChange={(event) =>
                                    setShortDescription(
                                        event.target.value
                                    )
                                }
                                placeholder="Коротко опишіть новину..."
                                rows={4}
                                disabled={loading}
                            />

                            <span className={styles.hint}>
                                Цей текст можна використовувати
                                як анонс новини на головній
                                сторінці.
                            </span>

                        </div>


                        {/* DESCRIPTION */}

                        <div className={styles.field}>

                            <div className={styles.labelRow}>

                                <label htmlFor="description">
                                    Повний опис
                                </label>

                                <span
                                    className={
                                        styles.optional
                                    }
                                >
                                    Необов'язкове
                                </span>

                            </div>

                            <textarea
                                id="description"
                                value={description}
                                onChange={(event) =>
                                    setDescription(
                                        event.target.value
                                    )
                                }
                                placeholder="Напишіть повний текст новини..."
                                rows={10}
                                disabled={loading}
                            />

                            <span className={styles.hint}>
                                Основний текст статті.
                            </span>

                        </div>

                    </section>


                    {/* ================================= */}
                    {/* MAIN PHOTO */}
                    {/* ================================= */}

                    <section className={styles.section}>

                        <div className={styles.sectionHeader}>

                            <div className={styles.sectionNumber}>
                                02
                            </div>

                            <div>

                                <h2>
                                    Головне фото
                                </h2>

                                <p>
                                    Зображення, яке буде
                                    основним для новини.
                                </p>

                            </div>

                        </div>


                        <div className={styles.field}>

                            <div className={styles.labelRow}>

                                <label>
                                    Головне фото
                                </label>

                                <span
                                    className={
                                        styles.required
                                    }
                                >
                                    Обов'язкове
                                </span>

                            </div>


                            {!mainPreview ? (

                                <label
                                    className={
                                        styles.uploadBox
                                    }
                                >

                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={
                                            handleMainPhoto
                                        }
                                        disabled={loading}
                                    />

                                    <div
                                        className={
                                            styles.uploadIcon
                                        }
                                    >
                                        ↑
                                    </div>

                                    <strong>
                                        Натисніть,
                                        щоб вибрати фото
                                    </strong>

                                    <span>
                                        JPG, PNG, WEBP
                                    </span>

                                </label>

                            ) : (

                                <div
                                    className={
                                        styles.mainPreview
                                    }
                                >

                                    <img
                                        src={mainPreview}
                                        alt="Preview"
                                    />

                                    <button
                                        type="button"
                                        onClick={
                                            removeMainPhoto
                                        }
                                        className={
                                            styles.removeButton
                                        }
                                    >
                                        ×
                                    </button>

                                    <div
                                        className={
                                            styles.previewName
                                        }
                                    >
                                        {mainPhoto?.name}
                                    </div>

                                </div>

                            )}

                            <span className={styles.hint}>
                                Головне фото є обов'язковим
                                для створення новини.
                            </span>

                        </div>

                    </section>


                    {/* ================================= */}
                    {/* ADDITIONAL PHOTOS */}
                    {/* ================================= */}

                    <section className={styles.section}>

                        <div className={styles.sectionHeader}>

                            <div className={styles.sectionNumber}>
                                03
                            </div>

                            <div>

                                <h2>
                                    Галерея
                                </h2>

                                <p>
                                    Додаткові фотографії
                                    для сторінки новини.
                                </p>

                            </div>

                        </div>


                        <div className={styles.field}>

                            <div className={styles.labelRow}>

                                <label>
                                    Додаткові фото
                                </label>

                                <span
                                    className={
                                        styles.optional
                                    }
                                >
                                    Необов'язкове
                                </span>

                            </div>


                            <label
                                className={
                                    styles.smallUpload
                                }
                            >

                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={
                                        handlePhotos
                                    }
                                    disabled={
                                        loading ||
                                        photos.length >= 6
                                    }
                                />

                                <span>
                                    + Додати фотографії
                                </span>

                                <small>
                                    {photos.length}
                                    {" / 6"}
                                </small>

                            </label>


                            {photoPreviews.length > 0 && (

                                <div
                                    className={
                                        styles.photoGrid
                                    }
                                >

                                    {photoPreviews.map(
                                        (preview, index) => (

                                            <div
                                                key={
                                                    `${preview}-${index}`
                                                }
                                                className={
                                                    styles.photoItem
                                                }
                                            >

                                                <img
                                                    src={preview}
                                                    alt=""
                                                />

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removePhoto(
                                                            index
                                                        )
                                                    }
                                                >
                                                    ×
                                                </button>

                                            </div>

                                        )
                                    )}

                                </div>

                            )}

                            <span className={styles.hint}>
                                Можна додати до 6
                                додаткових фотографій.
                            </span>

                        </div>

                    </section>


                    {/* ================================= */}
                    {/* VIDEO */}
                    {/* ================================= */}

                    <section className={styles.section}>

                        <div className={styles.sectionHeader}>

                            <div className={styles.sectionNumber}>
                                04
                            </div>

                            <div>

                                <h2>
                                    Відео
                                </h2>

                                <p>
                                    Додайте відео,
                                    якщо воно є.
                                </p>

                            </div>

                        </div>


                        <div className={styles.field}>

                            <div className={styles.labelRow}>

                                <label>
                                    Відео
                                </label>

                                <span
                                    className={
                                        styles.optional
                                    }
                                >
                                    Необов'язкове
                                </span>

                            </div>


                            {!video ? (

                                <label
                                    className={
                                        styles.smallUpload
                                    }
                                >

                                    <input
                                        type="file"
                                        accept="video/*"
                                        onChange={
                                            handleVideo
                                        }
                                        disabled={loading}
                                    />

                                    <span>
                                        + Вибрати відео
                                    </span>

                                </label>

                            ) : (

                                <div
                                    className={
                                        styles.fileSelected
                                    }
                                >

                                    <div>

                                        <strong>
                                            🎬 {video.name}
                                        </strong>

                                        <small>
                                            {(
                                                video.size /
                                                1024 /
                                                1024
                                            ).toFixed(2)}
                                            {" MB"}
                                        </small>

                                    </div>

                                    <button
                                        type="button"
                                        onClick={
                                            removeVideo
                                        }
                                    >
                                        ×
                                    </button>

                                </div>

                            )}

                            <span className={styles.hint}>
                                Відео не є обов'язковим.
                            </span>

                        </div>

                    </section>


                    {/* ================================= */}
                    {/* ACTIONS */}
                    {/* ================================= */}

                    <div className={styles.actions}>

                        <Link
                            href="/admin_cabinet/news"
                            className={
                                styles.cancelButton
                            }
                        >
                            Скасувати
                        </Link>

                        <button
                            type="submit"
                            className={
                                styles.submitButton
                            }
                            disabled={loading}
                        >

                            {loading ? (

                                <>
                                    <span
                                        className={
                                            styles.spinner
                                        }
                                    />

                                    Публікуємо...

                                </>

                            ) : (

                                <>
                                    Опублікувати новину
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