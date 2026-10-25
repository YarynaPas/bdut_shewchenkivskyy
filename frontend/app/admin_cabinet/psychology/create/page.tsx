"use client";

import {
    ChangeEvent,
    FormEvent,
    useState,
} from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import styles from "./CreatePsychology.module.css";

import {
    createPsychology,
} from "@/services/psychologyApi";


export default function CreatePsychologyPage() {

    const router =
        useRouter();


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
    /* FILES */
    /* ========================================= */

    const [mainPhoto, setMainPhoto] =
        useState<File | null>(null);

    const [photos, setPhotos] =
        useState<File[]>([]);


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


        if (
            !file.type.startsWith("image/")
        ) {

            setError(
                "Головне фото повинно бути зображенням."
            );

            return;

        }


        setError("");

        setMainPhoto(file);


        setMainPreview(
            URL.createObjectURL(file)
        );

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


        const images =
            files.filter(
                file =>
                    file.type.startsWith(
                        "image/"
                    )
            );


        if (
            images.length !== files.length
        ) {

            setError(
                "Додаткові файли повинні бути зображеннями."
            );

            return;

        }


        if (
            images.length > 6
        ) {

            setError(
                "Можна додати максимум 6 додаткових фотографій."
            );

            return;

        }


        setError("");

        setPhotos(images);


        setPhotoPreviews(
            images.map(
                file =>
                    URL.createObjectURL(file)
            )
        );

    };


    /* ========================================= */
    /* REMOVE MAIN PHOTO */
    /* ========================================= */

    const removeMainPhoto = () => {

        setMainPhoto(null);

        setMainPreview(null);

    };


    /* ========================================= */
    /* REMOVE PHOTO */
    /* ========================================= */

    const removePhoto = (
        index: number
    ) => {

        const updatedPhotos =
            photos.filter(
                (_, photoIndex) =>
                    photoIndex !== index
            );


        setPhotos(
            updatedPhotos
        );


        setPhotoPreviews(
            updatedPhotos.map(
                file =>
                    URL.createObjectURL(file)
            )
        );

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


        if (!mainPhoto) {

            setError(
                "Головне фото є обов'язковим."
            );

            return;

        }


        try {

            setLoading(true);


            await createPsychology({

                title:
                    title.trim(),

                description:
                    description.trim(),

                long_description:
                    longDescription.trim(),

                main_photo:
                mainPhoto,

                photos,

            });


            setSuccess(
                "Матеріал успішно створено!"
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
                    : "Не вдалося створити матеріал."
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
                        href="/admin_cabinet/psychology"
                        className={styles.back}
                    >
                        ← Назад до психолога
                    </Link>


                    <span className={styles.overline}>
                        КЕРУВАННЯ ПСИХОЛОГОМ
                    </span>


                    <h1>
                        Додати матеріал
                    </h1>


                    <p>
                        Створіть нову статтю або
                        матеріал психолога.
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
                                    Дані матеріалу,
                                    які побачить користувач.
                                </p>

                            </div>

                        </div>


                        {/* TITLE */}

                        <div className={styles.field}>

                            <div className={styles.labelRow}>

                                <label>
                                    Назва матеріалу
                                </label>

                                <span
                                    className={styles.required}
                                >
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
                                placeholder="Наприклад: Як подолати тривожність"
                                disabled={loading}
                            />

                        </div>


                        {/* DESCRIPTION */}

                        <div className={styles.field}>

                            <div className={styles.labelRow}>

                                <label>
                                    Короткий опис
                                </label>

                                <span
                                    className={styles.required}
                                >
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
                                placeholder="Короткий опис матеріалу..."
                                disabled={loading}
                            />

                            <small>
                                Цей текст використовується
                                як короткий опис публікації.
                            </small>

                        </div>


                        {/* LONG DESCRIPTION */}

                        <div className={styles.field}>

                            <div className={styles.labelRow}>

                                <label>
                                    Повний текст статті
                                </label>

                                <span
                                    className={styles.optional}
                                >
                                    Необов'язкове
                                </span>

                            </div>


                            <textarea
                                rows={14}
                                value={longDescription}
                                onChange={e =>
                                    setLongDescription(
                                        e.target.value
                                    )
                                }
                                placeholder="Розгорнута стаття, рекомендації, поради психолога..."
                                disabled={loading}
                            />

                            <small>
                                Тут можна розмістити
                                повну статтю або великий
                                інформаційний матеріал.
                            </small>

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
                                    Зображення матеріалу.
                                </p>

                            </div>

                        </div>


                        <div className={styles.labelRow}>

                            <label>
                                Головне фото
                            </label>

                            <span
                                className={styles.required}
                            >
                                Обов'язкове
                            </span>

                        </div>


                        {mainPreview ? (

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
                                    className={
                                        styles.removeMain
                                    }
                                    onClick={
                                        removeMainPhoto
                                    }
                                >
                                    ×
                                </button>

                            </div>

                        ) : (

                            <label
                                className={
                                    styles.upload
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
                                    Завантажити головне фото
                                </strong>

                                <small>
                                    JPG, PNG, GIF або SVG
                                </small>

                            </label>

                        )}

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
                                    Додаткові зображення
                                    до матеріалу.
                                </p>

                            </div>

                        </div>


                        <div className={styles.labelRow}>

                            <label>
                                Додаткові фото
                            </label>

                            <span
                                className={styles.optional}
                            >
                                Необов'язкове · до 6
                            </span>

                        </div>


                        {photoPreviews.length > 0 && (

                            <div
                                className={
                                    styles.photoGrid
                                }
                            >

                                {photoPreviews.map(
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


                        {photos.length < 6 && (

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
                                        handlePhotos
                                    }
                                    disabled={loading}
                                />

                                <span>
                                    +
                                </span>

                                <strong>
                                    Додати фотографії
                                </strong>

                                <small>
                                    {photos.length} / 6
                                </small>

                            </label>

                        )}

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
                            disabled={loading}
                        >

                            {loading ? (

                                <>
                                    <span
                                        className={
                                            styles.spinner
                                        }
                                    />

                                    Створення...

                                </>

                            ) : (

                                <>
                                    Опублікувати матеріал
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