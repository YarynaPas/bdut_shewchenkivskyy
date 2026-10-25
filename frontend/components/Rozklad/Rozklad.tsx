"use client";

import { useEffect, useState } from "react";
import styles from "./Rozklad.module.css";

interface RozkladItem {
    id: number;
    photo: string;
}

interface RozkladProps {
    items: RozkladItem[];
}

const getFileUrl = (
    path: string | null | undefined
): string => {
    if (!path) return "";

    if (
        path.startsWith("http://") ||
        path.startsWith("https://")
    ) {
        return path;
    }

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

    return `${API_URL}${path}`;
};

export default function Rozklad({ items }: RozkladProps) {
    const [selectedImage, setSelectedImage] =
        useState<string | null>(null);

    // Забороняємо скролити сторінку,
    // коли відкрите збільшене фото
    useEffect(() => {
        if (selectedImage) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [selectedImage]);

    // Закриття по Escape
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setSelectedImage(null);
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener(
                "keydown",
                handleKeyDown
            );
        };
    }, []);

    if (!items || items.length === 0) {
        return null;
    }

    return (
        <>
            <section className={styles.section}>
                <div className={styles.container}>

                    <div className={styles.header}>
                        <span className={styles.label}>
                            РОЗКЛАД
                        </span>

                        <h2>
                            Розклад занять
                        </h2>

                        <p>
                            Натисніть на зображення,
                            щоб збільшити його
                        </p>
                    </div>


                    <div className={styles.images}>
                        {items.map((item) => {
                            const imageUrl =
                                getFileUrl(item.photo);

                            if (!imageUrl) return null;

                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    className={styles.imageButton}
                                    onClick={() =>
                                        setSelectedImage(imageUrl)
                                    }
                                    aria-label="Збільшити розклад"
                                >
                                    <img
                                        src={imageUrl}
                                        alt="Розклад занять"
                                        className={styles.image}
                                    />

                                    <span className={styles.zoom}>
                                        ⛶
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                </div>
            </section>


            {/* LIGHTBOX */}

            {selectedImage && (
                <div
                    className={styles.overlay}
                    onClick={() =>
                        setSelectedImage(null)
                    }
                >
                    <button
                        type="button"
                        className={styles.close}
                        onClick={() =>
                            setSelectedImage(null)
                        }
                        aria-label="Закрити"
                    >
                        ×
                    </button>

                    <div
                        className={styles.modalImageWrapper}
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >
                        <img
                            src={selectedImage}
                            alt="Розклад занять"
                            className={styles.modalImage}
                        />
                    </div>
                </div>
            )}
        </>
    );
}