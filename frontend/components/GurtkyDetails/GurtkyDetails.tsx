"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import styles from "./GurtkyDetails.module.css";

interface ScheduleItem {
    day: string;
    time: string;
}

interface Gurtok {

    id: number;

    name: string;

    teacher: string;

    napryam:
        | "Художньо-естетичний відділ"
        | "Гуманітарний відділ"
        | "Вокально-хореографічний відділ";

    vikova_grupa: string;

    description: string | null;

    long_description: string | null;

    classrom: string | null;

    pictograma: string;

    photos: string[];

    schedule: ScheduleItem[] | null;
}

interface Props {
    id: string;
}

export default function GurtkyDetails({
                                          id,
                                      }: Props) {

    const [gurtok, setGurtok] =
        useState<Gurtok | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState(false);

    const [activePhoto, setActivePhoto] =
        useState<string | null>(null);

    useEffect(() => {

        const loadGurtok = async () => {

            try {

                setLoading(true);

                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/gurtky/${id}`
                );

                if (!response.ok) {
                    throw new Error(
                        `Помилка: ${response.status}`
                    );
                }

                const data =
                    await response.json();

                setGurtok(data);

            } catch (error) {

                console.error(
                    "Помилка завантаження гуртка:",
                    error
                );

                setError(true);

            } finally {

                setLoading(false);

            }

        };

        loadGurtok();

    }, [id]);

    /* ========================================= */
    /* LOADING */
    /* ========================================= */

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

    /* ========================================= */
    /* ERROR */
    /* ========================================= */

    if (error || !gurtok) {

        return (
            <section className={styles.error}>

                <div className={styles.errorBox}>

                    <div className={styles.errorIcon}>
                        🎨
                    </div>

                    <h1>
                        Гурток не знайдено
                    </h1>

                    <p>
                        На жаль, інформація про цей гурток
                        недоступна.
                    </p>

                    <Link
                        href="/gurtky"
                        className={styles.backButton}
                    >
                        ← До всіх гуртків
                    </Link>

                </div>

            </section>
        );

    }

    /* ========================================= */
    /* DATA */
    /* ========================================= */

    const photos =
        Array.isArray(gurtok.photos)
            ? gurtok.photos.filter(Boolean)
            : [];

    const schedule =
        Array.isArray(gurtok.schedule)
            ? gurtok.schedule
            : [];

    /* ========================================= */
    /* PAGE */
    /* ========================================= */

    return (

        <main className={styles.page}>

            <div className={styles.background}></div>

            <div className={styles.container}>

                {/* ================================= */}
                {/* BACK */}
                {/* ================================= */}

                <Link
                    href="/gurtky"
                    className={styles.back}
                >

                    <span>
                        ←
                    </span>

                    Усі гуртки

                </Link>

                {/* ================================= */}
                {/* HERO */}
                {/* ================================= */}

                <section className={styles.hero}>

                    <div className={styles.heroImageBox}>

                        <img
                            src={gurtok.pictograma}
                            alt={gurtok.name}
                            className={styles.heroImage}
                        />

                    </div>

                    <div className={styles.heroContent}>

                        <span className={styles.department}>
                            {gurtok.napryam}
                        </span>

                        <h1>
                            {gurtok.name}
                        </h1>

                        <p className={styles.heroDescription}>
                            {gurtok.description}
                        </p>

                        <div className={styles.heroInfo}>

                            <div className={styles.heroInfoItem}>

                                <span>
                                    👥
                                </span>

                                <div>

                                    <small>
                                        Вікова група
                                    </small>

                                    <strong>
                                        {gurtok.vikova_grupa}
                                    </strong>

                                </div>

                            </div>

                            <div className={styles.heroInfoItem}>

                                <span>
                                    👨‍🏫
                                </span>

                                <div>

                                    <small>
                                        Керівник
                                    </small>

                                    <strong>
                                        {gurtok.teacher}
                                    </strong>

                                </div>

                            </div>

                        </div>

                    </div>

                </section>

                {/* ================================= */}
                {/* MAIN CONTENT */}
                {/* ================================= */}

                <div className={styles.contentGrid}>

                    {/* ================================= */}
                    {/* LEFT */}
                    {/* ================================= */}

                    <div className={styles.mainContent}>

                        {/* DESCRIPTION */}

                        <section className={styles.card}>

                            <div className={styles.cardTitle}>

                                <span>
                                    📖
                                </span>

                                <h2>
                                    Про гурток
                                </h2>

                            </div>

                            {gurtok.long_description ? (

                                <div
                                    className={
                                        styles.longDescription
                                    }
                                >

                                    {gurtok.long_description}

                                </div>

                            ) : (

                                <p className={styles.description}>

                                    {gurtok.description ||
                                        "Опис гуртка поки не додано."}

                                </p>

                            )}

                        </section>

                        {/* SCHEDULE */}

                        <section className={styles.card}>

                            <div className={styles.cardTitle}>

                                <span>
                                    📅
                                </span>

                                <h2>
                                    Розклад занять
                                </h2>

                            </div>

                            {schedule.length > 0 ? (

                                <div className={styles.schedule}>

                                    {schedule.map(
                                        (item, index) => (

                                            <div
                                                key={`${item.day}-${index}`}
                                                className={
                                                    styles.scheduleItem
                                                }
                                            >

                                                <div
                                                    className={
                                                        styles.day
                                                    }
                                                >

                                                    {item.day}

                                                </div>

                                                <div
                                                    className={
                                                        styles.time
                                                    }
                                                >

                                                    <span>
                                                        🕐
                                                    </span>

                                                    {item.time}

                                                </div>

                                            </div>

                                        )
                                    )}

                                </div>

                            ) : (

                                <div
                                    className={
                                        styles.emptySchedule
                                    }
                                >
                                    Розклад поки не вказано.
                                </div>

                            )}

                        </section>

                    </div>

                    {/* ================================= */}
                    {/* RIGHT SIDEBAR */}
                    {/* ================================= */}

                    <aside className={styles.sidebar}>

                        <div className={styles.infoCard}>

                            <h3>
                                Інформація
                            </h3>

                            <div className={styles.infoRow}>

                                <span className={styles.infoIcon}>
                                    👨‍🏫
                                </span>

                                <div>

                                    <small>
                                        Керівник гуртка
                                    </small>

                                    <strong>
                                        {gurtok.teacher}
                                    </strong>

                                </div>

                            </div>

                            <div className={styles.infoRow}>

                                <span className={styles.infoIcon}>
                                    👥
                                </span>

                                <div>

                                    <small>
                                        Вік
                                    </small>

                                    <strong>
                                        {gurtok.vikova_grupa}
                                    </strong>

                                </div>

                            </div>


                            <div className={styles.infoRow}>

                                <span
                                    className={
                                        styles.infoIcon
                                    }
                                >
                                    🎓
                                </span>

                                <div>

                                    <small>
                                        Напрям
                                    </small>

                                    <strong>
                                        {gurtok.napryam}
                                    </strong>

                                </div>

                            </div>

                        </div>

                        {/* CONTACT */}

                        <div className={styles.contactCard}>

                            <div className={styles.contactIcon}>
                                📞
                            </div>

                            <h3>
                                Хочете записатися?
                            </h3>

                            <p>
                                Зателефонуйте нам,
                                щоб дізнатися деталі
                                та записатися до гуртка.
                            </p>

                            <a
                                href="tel:+380966194472"
                                className={styles.contactButton}
                            >

                                <span>
                                    📞
                                </span>

                                Зателефонувати

                            </a>

                        </div>

                    </aside>

                </div>

                {/* ================================= */}
                {/* GALLERY */}
                {/* ================================= */}

                {photos.length > 0 && (

                    <section className={styles.gallerySection}>

                        <div className={styles.galleryTitle}>

                            <span>
                                📷
                            </span>

                            <div>

                                <h2>
                                    Фотогалерея
                                </h2>

                                <p>
                                    Фотографії з життя гуртка
                                </p>

                            </div>

                        </div>

                        <div className={styles.gallery}>

                            {photos.map(
                                (photo, index) => (

                                    <button
                                        key={`${photo}-${index}`}
                                        type="button"
                                        className={
                                            styles.photoButton
                                        }
                                        onClick={() =>
                                            setActivePhoto(
                                                photo
                                            )
                                        }
                                    >

                                        <img
                                            src={photo}
                                            alt={`${gurtok.name} — фото ${index + 1}`}
                                            className={
                                                styles.photo
                                            }
                                        />

                                        <span
                                            className={
                                                styles.zoom
                                            }
                                        >
                                            ↗
                                        </span>

                                    </button>

                                )
                            )}

                        </div>

                    </section>

                )}

            </div>

            {/* ================================= */}
            {/* LIGHTBOX */}
            {/* ================================= */}

            {activePhoto && (

                <div
                    className={styles.lightbox}
                    onClick={() =>
                        setActivePhoto(null)
                    }
                >

                    <button
                        type="button"
                        className={styles.close}
                        onClick={() =>
                            setActivePhoto(null)
                        }
                    >
                        ×
                    </button>

                    <img
                        src={activePhoto}
                        alt={gurtok.name}
                        className={styles.lightboxImage}
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    />

                </div>

            )}

        </main>
    );
}