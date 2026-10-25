"use client";

import {
    ChangeEvent,
    FormEvent,
    useEffect,
    useState,
} from "react";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import styles from "./EditNews.module.css";

import {
    AdminNews,
    getAdminNewsById,
    updateNews,
} from "@/services/newsApi";


export default function EditNewsPage() {

    const router = useRouter();

    const params = useParams();

    const id = Number(params.id);


    /* ========================================= */
    /* DATA */
    /* ========================================= */

    const [news, setNews] =
        useState<AdminNews | null>(null);


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
    /* MAIN PHOTO */
    /* ========================================= */

    const [mainPhoto, setMainPhoto] =
        useState<File | null>(null);

    const [mainPreview, setMainPreview] =
        useState<string | null>(null);


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
    /* LOAD NEWS */
    /* ========================================= */

    useEffect(() => {

        if (!id || Number.isNaN(id)) {

            setError(
                "Некоректний ID новини."
            );

            setLoading(false);

            return;
        }


        const loadNews =
            async () => {

                try {

                    setLoading(true);

                    setError("");

                    const data =
                        await getAdminNewsById(
                            id
                        );

                    setNews(data);

                    setTitle(
                        data.title || ""
                    );

                    setShortDescription(
                        data.short_description ||
                        ""
                    );

                    setDescription(
                        data.description ||
                        ""
                    );

                    setMainPreview(
                        data.main_photo
                            ? getFileUrl(
                                data.main_photo
                            )
                            : null
                    );

                } catch (error) {

                    console.error(
                        error
                    );

                    setError(
                        error instanceof Error
                            ? error.message
                            : "Не вдалося завантажити новину."
                    );

                } finally {

                    setLoading(false);

                }

            };


        loadNews();

    }, [id]);


    /* ========================================= */
    /* FILE URL */
    /* ========================================= */

    const getFileUrl = (
        path: string
    ): string => {

        if (
            path.startsWith("http://") ||
            path.startsWith("https://")
        ) {

            return path;

        }

        const base =
            process.env
                .NEXT_PUBLIC_API_URL
                ?.replace(/\/$/, "") ||
            "";

        return `${base}${
            path.startsWith("/")
                ? path
                : `/${path}`
        }`;

    };


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
    /* REMOVE NEW PHOTO */
    /* ========================================= */

    const removeNewPhoto = () => {

        setMainPhoto(null);

        if (news?.main_photo) {

            setMainPreview(
                getFileUrl(
                    news.main_photo
                )
            );

        } else {

            setMainPreview(null);

        }

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


        if (!title.trim()) {

            setError(
                "Назва новини є обов'язковою."
            );

            return;
        }


        try {

            setSaving(true);


            await updateNews(
                id,
                {
                    title:
                        title.trim(),

                    short_description:
                        shortDescription.trim(),

                    description:
                        description.trim(),

                    main_photo:
                    mainPhoto,
                }
            );


            setSuccess(
                "Новину успішно оновлено!"
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
                    : "Не вдалося оновити новину."
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

                    <div
                        className={styles.spinner}
                    />

                    <p>
                        Завантаження новини...
                    </p>

                </div>

            </main>

        );

    }


    /* ========================================= */
    /* ERROR WITHOUT DATA */
    /* ========================================= */

    if (!news) {

        return (

            <main className={styles.page}>

                <div className={styles.errorPage}>

                    <div>
                        !
                    </div>

                    <h1>
                        Новину не знайдено
                    </h1>

                    <p>
                        {error ||
                            "Не вдалося отримати дані новини."}
                    </p>

                    <Link
                        href="/admin_cabinet/news"
                        className={
                            styles.backButton
                        }
                    >
                        ← Повернутися до новин
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
                        href="/admin_cabinet/news"
                        className={styles.back}
                    >
                        ← Назад до новин
                    </Link>

                    <span className={styles.subtitle}>
                        КЕРУВАННЯ КОНТЕНТОМ
                    </span>

                    <h1>
                        Редагувати новину
                    </h1>

                    <p>
                        Внесіть необхідні зміни
                        та збережіть новину.
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

                            <div
                                className={
                                    styles.sectionNumber
                                }
                            >
                                01
                            </div>

                            <div>

                                <h2>
                                    Основна інформація
                                </h2>

                                <p>
                                    Редагування тексту
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
                                placeholder="Назва новини"
                                disabled={saving}
                            />

                            <span
                                className={styles.hint}
                            >
                                Поле обов'язкове для
                                збереження новини.
                            </span>

                        </div>


                        {/* SHORT DESCRIPTION */}

                        <div className={styles.field}>

                            <div className={styles.labelRow}>

                                <label
                                    htmlFor="shortDescription"
                                >
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
                                placeholder="Короткий опис..."
                                rows={4}
                                disabled={saving}
                            />

                        </div>


                        {/* DESCRIPTION */}

                        <div className={styles.field}>

                            <div className={styles.labelRow}>

                                <label
                                    htmlFor="description"
                                >
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
                                placeholder="Повний текст новини..."
                                rows={12}
                                disabled={saving}
                            />

                        </div>

                    </section>


                    {/* ================================= */}
                    {/* MAIN PHOTO */}
                    {/* ================================= */}

                    <section className={styles.section}>

                        <div className={styles.sectionHeader}>

                            <div
                                className={
                                    styles.sectionNumber
                                }
                            >
                                02
                            </div>

                            <div>

                                <h2>
                                    Головне фото
                                </h2>

                                <p>
                                    Можна залишити
                                    поточне фото або
                                    завантажити нове.
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


                            {mainPreview ? (

                                <div
                                    className={
                                        styles.mainPreview
                                    }
                                >

                                    <img
                                        src={
                                            mainPreview
                                        }
                                        alt={
                                            title
                                        }
                                    />

                                    {mainPhoto && (

                                        <button
                                            type="button"
                                            className={
                                                styles.removeButton
                                            }
                                            onClick={
                                                removeNewPhoto
                                            }
                                        >
                                            ×
                                        </button>

                                    )}

                                    <div
                                        className={
                                            styles.previewOverlay
                                        }
                                    >

                                        {mainPhoto
                                            ? "Нове фото"
                                            : "Поточне фото"}

                                    </div>

                                </div>

                            ) : null}


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
                                    disabled={
                                        saving
                                    }
                                />

                                <span>
                                    ↑
                                </span>

                                <strong>
                                    Замінити головне фото
                                </strong>

                                <small>
                                    JPG, PNG, WEBP
                                </small>

                            </label>

                        </div>

                    </section>


                    {/* ================================= */}
                    {/* EXISTING MEDIA */}
                    {/* ================================= */}

                    <section className={styles.section}>

                        <div className={styles.sectionHeader}>

                            <div
                                className={
                                    styles.sectionNumber
                                }
                            >
                                03
                            </div>

                            <div>

                                <h2>
                                    Додаткові матеріали
                                </h2>

                                <p>
                                    Поточні фото та відео
                                    новини.
                                </p>

                            </div>

                        </div>


                        {/* PHOTOS */}

                        <div className={styles.mediaBlock}>

                            <div
                                className={
                                    styles.labelRow
                                }
                            >

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


                            {news.photos &&
                            news.photos.length > 0 ? (

                                <div
                                    className={
                                        styles.photoGrid
                                    }
                                >

                                    {news.photos.map(
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

                                <div
                                    className={
                                        styles.noMedia
                                    }
                                >
                                    Додаткових фотографій
                                    немає.
                                </div>

                            )}

                            <p
                                className={
                                    styles.backendNote
                                }
                            >
                                Редагування додаткових
                                фотографій поки не
                                підтримується backend.
                            </p>

                        </div>


                        {/* VIDEO */}

                        <div className={styles.mediaBlock}>

                            <div
                                className={
                                    styles.labelRow
                                }
                            >

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


                            {news.video ? (

                                <video
                                    className={
                                        styles.video
                                    }
                                    controls
                                    src={
                                        getFileUrl(
                                            news.video
                                        )
                                    }
                                />

                            ) : (

                                <div
                                    className={
                                        styles.noMedia
                                    }
                                >
                                    Відео немає.
                                </div>

                            )}

                            <p
                                className={
                                    styles.backendNote
                                }
                            >
                                Редагування відео поки
                                не підтримується backend.
                            </p>

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
                            disabled={saving}
                        >

                            {saving ? (

                                <>
                                    <span
                                        className={
                                            styles.spinner
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