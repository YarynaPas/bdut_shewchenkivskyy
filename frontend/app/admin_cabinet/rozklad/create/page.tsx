"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import styles from "./CreateRozklad.module.css";

import { createRozklad } from "@/services/rozkladApi";

export default function CreateRozkladPage() {
    const router = useRouter();

    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleFileChange = (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        const selectedFile = event.target.files?.[0];

        if (!selectedFile) {
            setFile(null);
            setPreview(null);
            return;
        }

        if (!selectedFile.type.startsWith("image/")) {
            setError("Можна завантажувати тільки зображення");
            return;
        }

        if (selectedFile.size > 10 * 1024 * 1024) {
            setError("Максимальний розмір файлу — 10 МБ");
            return;
        }

        setError("");
        setFile(selectedFile);

        const url = URL.createObjectURL(selectedFile);
        setPreview(url);
    };

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        setError("");

        if (!file) {
            setError("Фото є обов'язковим");
            return;
        }

        try {
            setLoading(true);

            await createRozklad({
                photo: file,
            });

            router.push("/admin_cabinet/rozklad");
            router.refresh();
        } catch (error) {
            console.error(error);

            setError(
                error instanceof Error
                    ? error.message
                    : "Не вдалося додати розклад"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className={styles.page}>
            <div className={styles.container}>

                <header className={styles.header}>
                    <Link
                        href="/admin_cabinet/rozklad"
                        className={styles.back}
                    >
                        ← Назад до розкладу
                    </Link>

                    <span className={styles.overline}>
                        АДМІНІСТРАТИВНА ПАНЕЛЬ
                    </span>

                    <h1>
                        Додати розклад
                    </h1>

                    <p>
                        Завантажте зображення розкладу
                    </p>
                </header>


                {error && (
                    <div className={styles.error}>
                        <span>!</span>
                        {error}
                    </div>
                )}


                <form
                    className={styles.form}
                    onSubmit={handleSubmit}
                >
                    <section className={styles.card}>

                        <div className={styles.cardHeader}>
                            <div className={styles.number}>
                                01
                            </div>

                            <div>
                                <h2>
                                    Зображення
                                </h2>

                                <p>
                                    Основне зображення розкладу
                                </p>
                            </div>
                        </div>


                        <div className={styles.field}>

                            <div className={styles.labelRow}>
                                <label>
                                    Фото розкладу
                                </label>

                                <span className={styles.required}>
                                    Обов'язково
                                </span>
                            </div>


                            <label className={styles.upload}>
                                <input
                                    type="file"
                                    accept="image/jpeg,image/jpg,image/png,image/gif"
                                    onChange={handleFileChange}
                                />

                                {!preview ? (
                                    <>
                                        <div className={styles.uploadIcon}>
                                            ↑
                                        </div>

                                        <strong>
                                            Натисніть, щоб вибрати фото
                                        </strong>

                                        <small>
                                            JPG, JPEG, PNG або GIF · до 10 МБ
                                        </small>
                                    </>
                                ) : (
                                    <div className={styles.preview}>
                                        <img
                                            src={preview}
                                            alt="Попередній перегляд"
                                        />

                                        <span>
                                            Натисніть, щоб змінити
                                        </span>
                                    </div>
                                )}
                            </label>

                            {file && (
                                <div className={styles.fileInfo}>
                                    <span>✓</span>

                                    <div>
                                        <strong>
                                            {file.name}
                                        </strong>

                                        <small>
                                            {(
                                                file.size /
                                                1024 /
                                                1024
                                            ).toFixed(2)}{" "}
                                            МБ
                                        </small>
                                    </div>
                                </div>
                            )}

                        </div>

                    </section>


                    <div className={styles.actions}>

                        <Link
                            href="/admin_cabinet/rozklad"
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
                                    <span className={styles.spinner} />
                                    Збереження...
                                </>
                            ) : (
                                <>
                                    Зберегти
                                    <span>→</span>
                                </>
                            )}
                        </button>

                    </div>

                </form>

            </div>
        </main>
    );
}