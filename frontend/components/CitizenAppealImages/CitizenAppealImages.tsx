
"use client";

import { useEffect, useState } from "react";
import styles from "./CitizenAppealImages.module.css";

interface CitizenAppealImage {
    id: number;
    title: string;
    image_path: string;
    sort_order: number;
    created_at: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export default function CitizenAppealImages() {
    const [images, setImages] = useState<CitizenAppealImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedImage, setSelectedImage] =
        useState<CitizenAppealImage | null>(null);

    useEffect(() => {
        const loadImages = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(`${API_URL}/citizen`);

                if (!response.ok) {
                    throw new Error("Не вдалося завантажити графік прийому");
                }

                const data: CitizenAppealImage[] = await response.json();

                setImages(data);
            } catch (err) {
                console.error("Citizen images loading error:", err);

                setError(
                    err instanceof Error
                        ? err.message
                        : "Сталася помилка завантаження"
                );
            } finally {
                setLoading(false);
            }
        };

        loadImages();
    }, []);

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <header className={styles.header}>
                    <span className={styles.subtitle}>
                        ІНФОРМАЦІЯ ДЛЯ ГРОМАДЯН
                    </span>

                    <h2>Графік особистого прийому громадян</h2>

                    <p>
                        Інформація щодо графіка особистого прийому громадян
                    </p>
                </header>

                {loading && (
                    <div className={styles.status}>
                        Завантаження графіка...
                    </div>
                )}

                {!loading && error && (
                    <div className={styles.error}>
                        {error}
                    </div>
                )}

                {!loading && !error && images.length === 0 && (
                    <div className={styles.empty}>
                        Інформація про графік прийому наразі відсутня.
                    </div>
                )}

                {!loading && !error && images.length > 0 && (
                    <div className={styles.grid}>
                        {images.map((image) => (
                            <button
                                key={image.id}
                                type="button"
                                className={styles.imageButton}
                                onClick={() => setSelectedImage(image)}
                                aria-label={`Переглянути: ${image.title}`}
                            >
                                <img
                                    src={image.image_path}
                                    alt={image.title}
                                    className={styles.image}
                                    loading="lazy"
                                />

                                <span className={styles.imageTitle}>
                                    {image.title}
                                </span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {selectedImage && (
                <div
                    className={styles.modal}
                    onClick={() => setSelectedImage(null)}
                    role="presentation"
                >
                    <button
                        type="button"
                        className={styles.closeButton}
                        onClick={() => setSelectedImage(null)}
                        aria-label="Закрити перегляд"
                    >
                        ×
                    </button>

                    <div
                        className={styles.modalContent}
                        onClick={(event) => event.stopPropagation()}
                    >
                        <img
                            src={selectedImage.image_path}
                            alt={selectedImage.title}
                            className={styles.modalImage}
                        />

                        <p>{selectedImage.title}</p>
                    </div>
                </div>
            )}
        </section>
    );
}
