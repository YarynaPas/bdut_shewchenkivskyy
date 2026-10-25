
"use client";

import {
    ChangeEvent,
    FormEvent,
    useEffect,
    useState,
} from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import styles from "./EditEvent.module.css";

import {
    getAdminEventById,
    updateEvent,
} from "@/services/eventsApi";

interface EventData {
    id: number;
    title: string;
    date: string;
    description: string | null;
    main_photo: string | null;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

function getFileUrl(
    path: string | null | undefined
): string {
    if (!path) return "";

    if (
        path.startsWith("http://") ||
        path.startsWith("https://")
    ) {
        return path;
    }

    return `${API_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

function formatDate(value: string | null | undefined): string {
    if (!value) return "";

    return value.slice(0, 10);
}

export default function EditEventPage() {
    const router = useRouter();
    const params = useParams();

    const id = Number(params.id);

    const [event, setEvent] = useState<EventData | null>(null);

    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [description, setDescription] = useState("");

    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    // Завантаження наявної події
    useEffect(() => {
        if (!Number.isInteger(id) || id <= 0) {
            setError("Некоректний ID події");
            setLoading(false);
            return;
        }

        let cancelled = false;

        const loadEvent = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getAdminEventById(id);

                if (cancelled) return;

                setEvent(data);
                setTitle(data.title ?? "");
                setDate(formatDate(data.date));
                setDescription(data.description ?? "");
            } catch (err) {
                console.error("Помилка завантаження події:", err);

                if (!cancelled) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : "Не вдалося завантажити подію"
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        loadEvent();

        return () => {
            cancelled = true;
        };
    }, [id]);

    // Попередній перегляд нового фото
    useEffect(() => {
        if (!file) {
            setPreview("");
            return;
        }

        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);

        return () => {
            URL.revokeObjectURL(objectUrl);
        };
    }, [file]);

    const handleFileChange = (
        e: ChangeEvent<HTMLInputElement>
    ) => {
        const selectedFile = e.target.files?.[0];

        if (!selectedFile) return;

        const allowedTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/gif",
        ];

        if (!allowedTypes.includes(selectedFile.type)) {
            setError("Дозволені формати: JPG, JPEG, PNG та GIF");
            e.target.value = "";
            return;
        }

        if (selectedFile.size > 10 * 1024 * 1024) {
            setError("Максимальний розмір фото — 10 МБ");
            e.target.value = "";
            return;
        }

        setError("");
        setFile(selectedFile);
    };

    const handleSubmit = async (
        e: FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();
        setError("");

        if (!title.trim()) {
            setError("Введіть назву події");
            return;
        }

        if (!date) {
            setError("Вкажіть дату події");
            return;
        }

        try {
            setSaving(true);

            await updateEvent(id, {
                title: title.trim(),
                date,
                description: description.trim(),
                main_photo: file,
            });

            router.push("/admin_cabinet/events");
            router.refresh();
        } catch (err) {
            console.error("Помилка оновлення події:", err);

            setError(
                err instanceof Error
                    ? err.message
                    : "Не вдалося оновити подію"
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <main className={styles.page}>
                <div className={styles.container}>
                    <div className={styles.loading}>
                        <span className={styles.spinner} />
                        Завантаження події...
                    </div>
                </div>
            </main>
        );
    }

    if (!event) {
        return (
            <main className={styles.page}>
                <div className={styles.container}>
                    <header className={styles.header}>
                        <Link
                            href="/admin_cabinet/events"
                            className={styles.back}
                        >
                            ← Назад до подій
                        </Link>

                        <h1>Подію не знайдено</h1>
                    </header>

                    {error && (
                        <div className={styles.error}>
                            <span>!</span>
                            <p>{error}</p>
                        </div>
                    )}
                </div>
            </main>
        );
    }

    return (
        <main className={styles.page}>
            <div className={styles.container}>
                <header className={styles.header}>
                    <Link
                        href="/admin_cabinet/events"
                        className={styles.back}
                    >
                        ← Назад до подій
                    </Link>

                    <span className={styles.overline}>
                        КЕРУВАННЯ ПОДІЯМИ
                    </span>

                    <h1>Редагувати подію</h1>

                    <p>
                        Змініть інформацію про подію та збережіть зміни.
                    </p>
                </header>

                {error && (
                    <div className={styles.error}>
                        <span>!</span>
                        <p>{error}</p>
                    </div>
                )}

                <form
                    className={styles.form}
                    onSubmit={handleSubmit}
                >
                    {/* Основна інформація */}
                    <section className={styles.card}>
                        <div className={styles.cardHeader}>
                            <div className={styles.number}>
                                01
                            </div>

                            <div>
                                <h2>Основна інформація</h2>
                                <p>Назва, дата та опис події.</p>
                            </div>
                        </div>

                        <div className={styles.field}>
                            <div className={styles.labelRow}>
                                <label htmlFor="title">
                                    Назва події
                                </label>

                                <span className={styles.required}>
                                    Обов'язкове
                                </span>
                            </div>

                            <input
                                id="title"
                                type="text"
                                value={title}
                                onChange={(e) =>
                                    setTitle(e.target.value)
                                }
                                placeholder="Введіть назву події"
                                className={styles.input}
                                required
                            />
                        </div>

                        <div className={styles.field}>
                            <div className={styles.labelRow}>
                                <label htmlFor="date">
                                    Дата події
                                </label>

                                <span className={styles.required}>
                                    Обов'язкове
                                </span>
                            </div>

                            <input
                                id="date"
                                type="date"
                                value={date}
                                onChange={(e) =>
                                    setDate(e.target.value)
                                }
                                className={styles.input}
                                required
                            />
                        </div>

                        <div className={styles.field}>
                            <div className={styles.labelRow}>
                                <label htmlFor="description">
                                    Опис події
                                </label>

                                <span className={styles.optional}>
                                    Необов'язкове
                                </span>
                            </div>

                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) =>
                                    setDescription(e.target.value)
                                }
                                placeholder="Введіть опис події"
                                className={styles.textarea}
                                rows={5}
                            />
                        </div>
                    </section>

                    {/* Фото */}
                    <section className={styles.card}>
                        <div className={styles.cardHeader}>
                            <div className={styles.number}>
                                02
                            </div>

                            <div>
                                <h2>Головне фото</h2>
                                <p>
                                    За потреби можна завантажити нове фото.
                                </p>
                            </div>
                        </div>

                        {(preview || event.main_photo) && (
                            <div className={styles.currentImage}>
                                <img
                                    src={
                                        preview ||
                                        getFileUrl(event.main_photo)
                                    }
                                    alt="Фото події"
                                />

                                <span>
                                    {file
                                        ? "Попередній перегляд нового фото"
                                        : "Поточне фото"}
                                </span>
                            </div>
                        )}

                        <div className={styles.field}>
                            <div className={styles.labelRow}>
                                <label htmlFor="main_photo">
                                    Замінити фото
                                </label>

                                <span className={styles.optional}>
                                    Необов'язкове
                                </span>
                            </div>

                            <label className={styles.upload}>
                                <input
                                    id="main_photo"
                                    type="file"
                                    accept="image/jpeg,image/jpg,image/png,image/gif"
                                    onChange={handleFileChange}
                                />

                                <span className={styles.uploadIcon}>
                                    ↑
                                </span>

                                <strong>
                                    Натисніть, щоб вибрати фото
                                </strong>

                                <small>
                                    JPG, JPEG, PNG або GIF · до 10 МБ
                                </small>
                            </label>

                            {file && (
                                <div className={styles.fileInfo}>
                                    <span className={styles.fileName}>
                                        {file.name}
                                    </span>

                                    <button
                                        type="button"
                                        className={styles.removeFile}
                                        onClick={() => setFile(null)}
                                    >
                                        Скасувати заміну
                                    </button>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Кнопки */}
                    <div className={styles.actions}>
                        <Link
                            href="/admin_cabinet/events"
                            className={styles.cancel}
                        >
                            Скасувати
                        </Link>

                        <button
                            type="submit"
                            className={styles.save}
                            disabled={saving}
                        >
                            {saving ? (
                                <>
                                    <span className={styles.buttonSpinner} />
                                    Збереження...
                                </>
                            ) : (
                                <>
                                    Зберегти зміни
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
