"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import styles from "./PsychologyDetails.module.css";

interface PsychologyPost {
    id: number;

    title: string;

    description: string;

    long_description: string | null;

    date: string;

    main_photo: string;

    photos: string[];
}

interface Props {
    id: string;
}

export default function PsychologyDetails({
                                              id,
                                          }: Props) {

    const [post, setPost] =
        useState<PsychologyPost | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState(false);

    useEffect(() => {

        const loadPost = async () => {

            try {

                setLoading(true);

                setError(false);

                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/psychology/${id}`
                );

                if (!response.ok) {

                    throw new Error(
                        `Помилка: ${response.status}`
                    );

                }

                const data =
                    await response.json();

                setPost(data);

            } catch (error) {

                console.error(
                    "Помилка завантаження матеріалу:",
                    error
                );

                setError(true);

            } finally {

                setLoading(false);

            }

        };

        loadPost();

    }, [id]);

    /* ============================== */
    /* LOADING */
    /* ============================== */

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

    /* ============================== */
    /* ERROR */
    /* ============================== */

    if (error || !post) {

        return (

            <section className={styles.error}>

                <div className={styles.errorContent}>

                    <div className={styles.errorIcon}>
                        🧠
                    </div>

                    <h1>
                        Матеріал не знайдено
                    </h1>

                    <p>
                        На жаль, цей матеріал більше недоступний.
                    </p>

                    <Link
                        href="/psychology"
                        className={styles.backButton}
                    >

                        ← Повернутися до кабінету психолога

                    </Link>

                </div>

            </section>

        );

    }

    /* ============================== */
    /* DATE */
    /* ============================== */

    const formattedDate =
        new Date(post.date).toLocaleDateString(
            "uk-UA",
            {
                day: "2-digit",
                month: "long",
                year: "numeric",
            }
        );

    /* ============================== */
    /* PAGE */
    /* ============================== */

    return (

        <section className={styles.section}>

            <div className={styles.container}>

                {/* ============================== */}
                {/* BACK */}
                {/* ============================== */}

                <Link
                    href="/psychology"
                    className={styles.back}
                >

                    <span>
                        ←
                    </span>

                    Кабінет психолога

                </Link>

                {/* ============================== */}
                {/* ARTICLE */}
                {/* ============================== */}

                <article className={styles.article}>

                    {/* ============================== */}
                    {/* MAIN PHOTO */}
                    {/* ============================== */}

                    <div className={styles.mainImageWrapper}>

                        <img
                            src={post.main_photo}
                            alt={post.title}
                            className={styles.mainImage}
                        />

                        <div className={styles.imageOverlay}></div>

                        <div className={styles.imageInfo}>

                            <span className={styles.date}>

                                📅 {formattedDate}

                            </span>

                        </div>

                    </div>

                    {/* ============================== */}
                    {/* CONTENT */}
                    {/* ============================== */}

                    <div className={styles.content}>

                        <h1 className={styles.title}>

                            {post.title}

                        </h1>

                        {/* SHORT DESCRIPTION */}

                        {post.description && (

                            <p className={styles.shortDescription}>

                                {post.description}

                            </p>

                        )}

                        {/* LONG DESCRIPTION */}

                        {post.long_description && (

                            <div className={styles.longDescription}>

                                {post.long_description}

                            </div>

                        )}

                    </div>

                    {/* ============================== */}
                    {/* GALLERY */}
                    {/* ============================== */}

                    {post.photos &&
                        post.photos.length > 0 && (

                            <div className={styles.gallery}>

                                <h2>

                                    Галерея

                                </h2>

                                <div className={styles.galleryGrid}>

                                    {post.photos.map(
                                        (photo, index) => (

                                            <a
                                                key={`${photo}-${index}`}
                                                href={photo}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={styles.galleryItem}
                                            >

                                                <img
                                                    src={photo}
                                                    alt={`${post.title} — фото ${index + 1}`}
                                                />

                                            </a>

                                        )
                                    )}

                                </div>

                            </div>

                        )}

                    {/* ============================== */}
                    {/* BOTTOM BACK BUTTON */}
                    {/* ============================== */}

                    <div className={styles.bottom}>

                        <Link
                            href="/psychology"
                            className={styles.bottomButton}
                        >

                            ←

                            <span>
                                До всіх матеріалів
                            </span>

                        </Link>

                    </div>

                </article>

            </div>

        </section>

    );

}