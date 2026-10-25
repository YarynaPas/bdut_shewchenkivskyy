"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import styles from "./RozkladAdmin.module.css";

import {
    Rozklad,
    getAdminRozklad,
    deleteRozklad,
} from "@/services/rozkladApi";

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

export default function RozkladAdminPage() {
    const [rozklady, setRozklady] = useState<Rozklad[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [deleting, setDeleting] = useState(false);

    const loadRozklady = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getAdminRozklad();

            setRozklady(data);
        } catch (error) {
            console.error(error);

            setError(
                error instanceof Error
                    ? error.message
                    : "Не вдалося завантажити розклад"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRozklady();
    }, []);

    const handleDelete = async () => {
        if (!deleteId) return;

        try {
            setDeleting(true);
            setError("");

            await deleteRozklad(deleteId);

            setRozklady((prev) =>
                prev.filter((item) => item.id !== deleteId)
            );

            setDeleteId(null);
        } catch (error) {
            console.error(error);

            setError(
                error instanceof Error
                    ? error.message
                    : "Не вдалося видалити розклад"
            );
        } finally {
            setDeleting(false);
        }
    };

    return (
        <main className={styles.page}>
            <div className={styles.container}>

                {/* HEADER */}
                <header className={styles.header}>
                    <div>
                        <span className={styles.overline}>
                            АДМІНІСТРАТИВНА ПАНЕЛЬ
                        </span>

                        <h1>Розклад</h1>

                        <p>
                            Керування зображеннями розкладу
                        </p>
                    </div>

                    <Link
                        href="/admin_cabinet/rozklad/create"
                        className={styles.addButton}
                    >
                        <span>+</span>
                        Додати розклад
                    </Link>
                </header>


                {/* ERROR */}
                {error && (
                    <div className={styles.error}>
                        <span>!</span>
                        <p>{error}</p>
                    </div>
                )}


                {/* LOADING */}
                {loading && (
                    <div className={styles.loading}>
                        <div className={styles.spinner} />
                        <p>Завантаження...</p>
                    </div>
                )}


                {/* EMPTY */}
                {!loading && !error && rozklady.length === 0 && (
                    <div className={styles.empty}>
                        <div className={styles.emptyIcon}>
                            📅
                        </div>

                        <h2>Розкладу ще немає</h2>

                        <p>
                            Додайте перше зображення розкладу.
                        </p>

                        <Link
                            href="/admin_cabinet/rozklad/create"
                            className={styles.emptyButton}
                        >
                            Додати розклад
                        </Link>
                    </div>
                )}


                {/* GRID */}
                {!loading && rozklady.length > 0 && (
                    <div className={styles.grid}>
                        {rozklady.map((item) => (
                            <article
                                key={item.id}
                                className={styles.card}
                            >

                                <div className={styles.imageWrapper}>
                                    {item.photo ? (
                                        <img
                                            src={getFileUrl(item.photo)}
                                            alt={`Розклад ${item.id}`}
                                            className={styles.image}
                                        />
                                    ) : (
                                        <div className={styles.noImage}>
                                            Немає зображення
                                        </div>
                                    )}
                                </div>


                                <div className={styles.cardBody}>

                                    <div className={styles.cardTitle}>
                                        <span>
                                            Розклад
                                        </span>

                                        <strong>
                                            #{item.id}
                                        </strong>
                                    </div>


                                    <div className={styles.actions}>

                                        <button
                                            type="button"
                                            className={styles.deleteButton}
                                            onClick={() =>
                                                setDeleteId(item.id)
                                            }
                                        >
                                            Видалити
                                        </button>

                                    </div>

                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>


            {/* DELETE MODAL */}
            {deleteId !== null && (
                <div
                    className={styles.modalOverlay}
                    onClick={() =>
                        !deleting && setDeleteId(null)
                    }
                >
                    <div
                        className={styles.modal}
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >
                        <div className={styles.modalIcon}>
                            !
                        </div>

                        <h2>
                            Видалити розклад?
                        </h2>

                        <p>
                            Ви впевнені, що хочете видалити
                            це зображення? Цю дію неможливо
                            скасувати.
                        </p>

                        <div className={styles.modalActions}>

                            <button
                                type="button"
                                className={styles.cancelButton}
                                disabled={deleting}
                                onClick={() =>
                                    setDeleteId(null)
                                }
                            >
                                Скасувати
                            </button>

                            <button
                                type="button"
                                className={styles.confirmDelete}
                                disabled={deleting}
                                onClick={handleDelete}
                            >
                                {deleting
                                    ? "Видалення..."
                                    : "Видалити"}
                            </button>

                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}