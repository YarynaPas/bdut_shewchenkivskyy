"use client";

import { useEffect, useState } from "react";

import styles from "./NewsDetails.module.css";

interface Props {
    id: string;
}

interface News {

    id: number;

    title: string;

    short_description: string;

    description: string;

    main_photo: string;

    photos: string[];

    video: string | null;

    date: string;
}

/* ================================================= */
/* URL */
/* ================================================= */

const getFileUrl = (path: string | null) => {

    if (!path) {
        return "";
    }

    if (
        path.startsWith("http://") ||
        path.startsWith("https://")
    ) {
        return path;
    }

    const base =
        process.env.NEXT_PUBLIC_API_URL
            ?.replace(/\/$/, "") || "";

    return `${base}${
        path.startsWith("/")
            ? path
            : `/${path}`
    }`;
};

/* ================================================= */
/* VIDEO TYPE */
/* ================================================= */

const isDirectVideo = (url: string) => {

    return /\.(mp4|webm|mov|ogg)(\?.*)?$/i.test(
        url
    );

};

/* ================================================= */
/* COMPONENT */
/* ================================================= */

export default function NewsDetails({
                                        id,
                                    }: Props) {

    const [news, setNews] =
        useState<News | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState(false);

    useEffect(() => {

        const loadNews = async () => {

            try {

                setLoading(true);

                setError(false);

                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/news/${id}`
                );

                if (!response.ok) {

                    throw new Error(
                        `Помилка: ${response.status}`
                    );

                }

                const data: News =
                    await response.json();

                setNews(data);

            } catch (error) {

                console.error(
                    "Помилка завантаження новини:",
                    error
                );

                setError(true);

            } finally {

                setLoading(false);

            }

        };

        loadNews();

    }, [id]);

    /* ================================================= */
    /* LOADING */
    /* ================================================= */

    if (loading) {

        return (

            <section className={styles.loading}>

                <div className={styles.loader}></div>

                <span>
                    Завантаження...
                </span>

            </section>

        );

    }

    /* ================================================= */
    /* ERROR */
    /* ================================================= */

    if (error || !news) {

        return (

            <section className={styles.error}>

                <div className={styles.errorBox}>

                    <div className={styles.errorIcon}>
                        📰
                    </div>

                    <h1>
                        Новину не знайдено
                    </h1>

                    <a
                        href="/news"
                        className={styles.backButton}
                    >
                        ← До всіх новин
                    </a>

                </div>

            </section>

        );

    }

    /* ================================================= */
    /* DATA */
    /* ================================================= */

    const mainPhoto =
        getFileUrl(news.main_photo);

    const photos =
        Array.isArray(news.photos)
            ? news.photos
                .filter(Boolean)
                .map(photo =>
                    getFileUrl(photo)
                )
            : [];

    const video =
        getFileUrl(news.video);

    const formattedDate =
        new Date(news.date).toLocaleDateString(
            "uk-UA",
            {
                day: "2-digit",
                month: "long",
                year: "numeric",
            }
        );

    /* ================================================= */
    /* RENDER */
    /* ================================================= */

    return (

        <section className={styles.section}>

            <div className={styles.container}>

                {/* ================================ */}
                {/* BACK */}
                {/* ================================ */}

                <a
                    href="/news"
                    className={styles.back}
                >

                    <span>
                        ←
                    </span>

                    Усі новини

                </a>

                {/* ================================ */}
                {/* HERO */}
                {/* ================================ */}

                <article className={styles.article}>

                    <div className={styles.hero}>

                        <img
                            src={mainPhoto}
                            alt={news.title}
                            className={styles.heroImage}
                        />

                        <div
                            className={
                                styles.heroOverlay
                            }
                        />

                        <div
                            className={
                                styles.heroContent
                            }
                        >

                            <span
                                className={
                                    styles.date
                                }
                            >

                                📅 {formattedDate}

                            </span>

                            <h1>
                                {news.title}
                            </h1>

                        </div>

                    </div>

                    {/* ================================ */}
                    {/* ARTICLE TEXT */}
                    {/* ================================ */}

                    <div className={styles.articleContent}>

                        {news.short_description && (

                            <p
                                className={
                                    styles.short
                                }
                            >
                                {news.short_description}
                            </p>

                        )}

                        {news.description && (

                            <div
                                className={
                                    styles.text
                                }
                            >

                                {news.description}

                            </div>

                        )}

                    </div>

                    {/* ================================ */}
                    {/* GALLERY */}
                    {/* ================================ */}

                    {photos.length > 0 && (

                        <section
                            className={
                                styles.gallerySection
                            }
                        >

                            <div
                                className={
                                    styles.sectionHeading
                                }
                            >

                                <span>
                                    📷
                                </span>

                                <h2>
                                    Фотогалерея
                                </h2>

                            </div>

                            <div
                                className={
                                    styles.gallery
                                }
                            >

                                {photos.map(
                                    (photo, index) => (

                                        <div
                                            key={`${photo}-${index}`}
                                            className={
                                                styles.galleryCard
                                            }
                                        >

                                            <a
                                                href={photo}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={
                                                    styles.galleryImageLink
                                                }
                                            >

                                                <img
                                                    src={photo}
                                                    alt={`${news.title} — фото ${index + 1}`}
                                                    className={
                                                        styles.galleryImage
                                                    }
                                                />

                                                <div
                                                    className={
                                                        styles.zoom
                                                    }
                                                >
                                                    ↗
                                                </div>

                                            </a>

                                            <a
                                                href={photo}
                                                download
                                                className={
                                                    styles.downloadButton
                                                }
                                            >

                                                ↓

                                                <span>
                                                    Завантажити фото
                                                </span>

                                            </a>

                                        </div>

                                    )
                                )}

                            </div>

                        </section>

                    )}

                    {/* ================================ */}
                    {/* VIDEO */}
                    {/* ================================ */}

                    {video && (

                        <section
                            className={
                                styles.videoSection
                            }
                        >

                            <div
                                className={
                                    styles.sectionHeading
                                }
                            >

                                <span>
                                    ▶
                                </span>

                                <h2>
                                    Відео
                                </h2>

                            </div>

                            <div
                                className={
                                    styles.videoWrapper
                                }
                            >

                                {isDirectVideo(video) ? (

                                    <video
                                        className={
                                            styles.video
                                        }
                                        src={video}
                                        controls
                                        playsInline
                                        preload="metadata"
                                    />

                                ) : (

                                    <iframe
                                        src={video}
                                        title={
                                            news.title
                                        }
                                        className={
                                            styles.video
                                        }
                                        allowFullScreen
                                        allow={
                                            "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        }
                                    />

                                )}

                            </div>

                            <a
                                href={video}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={
                                    styles.videoLink
                                }
                            >

                                Відкрити відео окремо →

                            </a>

                        </section>

                    )}

                    {/* ================================ */}
                    {/* FOOTER */}
                    {/* ================================ */}

                    <div
                        className={
                            styles.bottom
                        }
                    >

                        <a
                            href="/news"
                            className={
                                styles.bottomButton
                            }
                        >

                            <span>
                                ←
                            </span>

                            До всіх новин

                        </a>

                    </div>

                </article>

            </div>

        </section>

    );

}