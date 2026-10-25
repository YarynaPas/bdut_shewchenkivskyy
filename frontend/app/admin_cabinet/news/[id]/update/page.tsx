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

    const router =
        useRouter();

    const params =
        useParams();

    const id =
        Number(params.id);


    /* ========================================= */
    /* DATA */
    /* ========================================= */

    const [news, setNews] =
        useState<AdminNews | null>(null);


    /* ========================================= */
    /* FORM */
    /* ========================================= */

    const [title, setTitle] =
        useState("");

    const [shortDescription, setShortDescription] =
        useState("");

    const [description, setDescription] =
        useState("");


    /* ========================================= */
    /* PHOTO */
    /* ========================================= */

    const [mainPhoto, setMainPhoto] =
        useState<File | null>(null);

    const [preview, setPreview] =
        useState<string | null>(null);


    /* ========================================= */
    /* STATUS */
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
        file: string
    ) => {

        if (
            file.startsWith("http://") ||
            file.startsWith("https://")
        ) {

            return file;

        }


        const api =
            process.env
                .NEXT_PUBLIC_API_URL
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
                "Некоректний ID новини."
            );

            setLoading(false);

            return;

        }


        const load =
            async () => {

                try {

                    setLoading(true);

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


                    if (
                        data.main_photo
                    ) {

                        setPreview(
                            getFileUrl(
                                data.main_photo
                            )
                        );

                    }

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


        load();

    }, [id]);


    /* ========================================= */
    /* PHOTO CHANGE */
    /* ========================================= */

    const handlePhotoChange = (
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
                "Можна завантажити тільки зображення."
            );

            return;

        }


        setError("");

        setMainPhoto(file);


        const objectUrl =
            URL.createObjectURL(
                file
            );


        setPreview(
            objectUrl
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
                    : "Помилка оновлення новини."
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

                <div
                    className={
                        styles.loading
                    }
                >

                    <div
                        className={
                            styles.spinner
                        }
                    />

                    <span>
                        Завантаження новини...
                    </span>

                </div>

            </main>

        );

    }


    /* ========================================= */
    /* NOT FOUND */
    /* ========================================= */

    if (!news) {

        return (

            <main className={styles.page}>

                <div
                    className={
                        styles.notFound
                    }
                >

                    <div>
                        !
                    </div>

                    <h1>
                        Новину не знайдено
                    </h1>

                    <p>
                        {error}
                    </p>

                    <Link
                        href="/admin_cabinet/news"
                    >
                        ← До списку новин
                    </Link>

                </div>

            </main>

        );

    }


    /* ========================================= */
    /* PAGE */
    /* ========================================= */

    return (

        <main className={styles.page}>

            <div
                className={
                    styles.container
                }
            >

                {/* HEADER */}

                <header
                    className={
                        styles.header
                    }
                >

                    <Link
                        href="/admin_cabinet/news"
                        className={
                            styles.back
                        }
                    >

                        ← Назад до новин

                    </Link>


                    <span
                        className={
                            styles.subtitle
                        }
                    >

                        КЕРУВАННЯ НОВИНАМИ

                    </span>


                    <h1>
                        Редагувати новину
                    </h1>


                    <p>
                        Змініть необхідну
                        інформацію та збережіть
                        результат.
                    </p>

                </header>


                {/* ERROR */}

                {error && (

                    <div
                        className={
                            styles.error
                        }
                    >

                        <span>
                            !
                        </span>

                        <p>
                            {error}
                        </p>

                    </div>

                )}


                {/* SUCCESS */}

                {success && (

                    <div
                        className={
                            styles.success
                        }
                    >

                        <span>
                            ✓
                        </span>

                        <p>
                            {success}
                        </p>

                    </div>

                )}


                <form
                    onSubmit={
                        handleSubmit
                    }
                    className={
                        styles.form
                    }
                >

                    {/* ================================= */}
                    {/* INFORMATION */}
                    {/* ================================= */}

                    <section
                        className={
                            styles.card
                        }
                    >

                        <div
                            className={
                                styles.cardHeader
                            }
                        >

                            <div
                                className={
                                    styles.number
                                }
                            >
                                01
                            </div>

                            <div>

                                <h2>
                                    Інформація
                                </h2>

                                <p>
                                    Основні дані
                                    новини.
                                </p>

                            </div>

                        </div>


                        {/* TITLE */}

                        <div
                            className={
                                styles.field
                            }
                        >

                            <div
                                className={
                                    styles.labelRow
                                }
                            >

                                <label>
                                    Назва
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
                                type="text"
                                value={title}
                                onChange={
                                    event =>
                                        setTitle(
                                            event.target.value
                                        )
                                }
                                placeholder="Назва новини"
                                disabled={
                                    saving
                                }
                            />

                        </div>


                        {/* SHORT DESCRIPTION */}

                        <div
                            className={
                                styles.field
                            }
                        >

                            <div
                                className={
                                    styles.labelRow
                                }
                            >

                                <label>
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
                                value={
                                    shortDescription
                                }
                                onChange={
                                    event =>
                                        setShortDescription(
                                            event.target.value
                                        )
                                }
                                rows={4}
                                placeholder="Короткий опис..."
                                disabled={
                                    saving
                                }
                            />

                        </div>


                        {/* DESCRIPTION */}

                        <div
                            className={
                                styles.field
                            }
                        >

                            <div
                                className={
                                    styles.labelRow
                                }
                            >

                                <label>
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
                                value={
                                    description
                                }
                                onChange={
                                    event =>
                                        setDescription(
                                            event.target.value
                                        )
                                }
                                rows={12}
                                placeholder="Повний текст новини..."
                                disabled={
                                    saving
                                }
                            />

                        </div>

                    </section>


                    {/* ================================= */}
                    {/* MAIN PHOTO */}
                    {/* ================================= */}

                    <section
                        className={
                            styles.card
                        }
                    >

                        <div
                            className={
                                styles.cardHeader
                            }
                        >

                            <div
                                className={
                                    styles.number
                                }
                            >
                                02
                            </div>

                            <div>

                                <h2>
                                    Головне фото
                                </h2>

                                <p>
                                    Замініть поточне
                                    зображення за
                                    необхідності.
                                </p>

                            </div>

                        </div>


                        <div
                            className={
                                styles.field
                            }
                        >

                            <div
                                className={
                                    styles.labelRow
                                }
                            >

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


                            {preview && (

                                <div
                                    className={
                                        styles.preview
                                    }
                                >

                                    <img
                                        src={
                                            preview
                                        }
                                        alt={
                                            title
                                        }
                                    />

                                    {mainPhoto && (

                                        <span
                                            className={
                                                styles.newBadge
                                            }
                                        >
                                            НОВЕ ФОТО
                                        </span>

                                    )}

                                </div>

                            )}


                            <label
                                className={
                                    styles.upload
                                }
                            >

                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={
                                        handlePhotoChange
                                    }
                                    disabled={
                                        saving
                                    }
                                />

                                <span>
                                    ↑
                                </span>

                                <strong>
                                    {mainPhoto
                                        ? "Вибрати інше фото"
                                        : "Замінити головне фото"}
                                </strong>

                                <small>
                                    JPG, PNG або WEBP
                                </small>

                            </label>

                        </div>

                    </section>


                    {/* ================================= */}
                    {/* ACTIONS */}
                    {/* ================================= */}

                    <div
                        className={
                            styles.actions
                        }
                    >

                        <Link
                            href="/admin_cabinet/news"
                            className={
                                styles.cancel
                            }
                        >
                            Скасувати
                        </Link>


                        <button
                            type="submit"
                            disabled={
                                saving
                            }
                            className={
                                styles.save
                            }
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