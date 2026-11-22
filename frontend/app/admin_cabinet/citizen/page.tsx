
"use client";

import {
    useCallback,
    useEffect,
    useState,
    ChangeEvent,
    FormEvent,
} from "react";

import styles from "./CitizenAdmin.module.css";

import {
    CitizenAppealImage,
    getCitizenAppealImages,
    createCitizenAppealImage,
    updateCitizenAppealImage,
    deleteCitizenAppealImage,
} from "@/services/citizenAppealImagesApi";


export default function CitizenAdminPage() {

    const [images, setImages] = useState<CitizenAppealImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const [title, setTitle] = useState("");
    const [sortOrder, setSortOrder] = useState("0");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const [editingId, setEditingId] = useState<number | null>(null);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    /* ========================================= */
    /* LOAD IMAGES */
    /* ========================================= */

    const loadImages = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getCitizenAppealImages();

            setImages(data);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Не вдалося завантажити зображення"
            );
        } finally {
            setLoading(false);
        }
    }, []);


    useEffect(() => {
        loadImages();
    }, [loadImages]);


    /* ========================================= */
    /* FILE CHANGE */
    /* ========================================= */

    const handleFileChange = (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0] || null;

        setSelectedFile(file);
        setError("");
    };


    /* ========================================= */
    /* RESET FORM */
    /* ========================================= */

    const resetForm = () => {
        setTitle("");
        setSortOrder("0");
        setSelectedFile(null);
        setEditingId(null);

        const fileInput = document.getElementById(
            "citizen-image-file"
        ) as HTMLInputElement | null;

        if (fileInput) {
            fileInput.value = "";
        }
    };


    /* ========================================= */
    /* SUBMIT FORM */
    /* ========================================= */

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        const trimmedTitle = title.trim();
        const order = Number(sortOrder);

        if (!trimmedTitle) {
            setError("Введіть назву зображення");
            return;
        }

        if (!Number.isInteger(order) || order < 0) {
            setError("Порядок має бути цілим невід'ємним числом");
            return;
        }

        if (!editingId && !selectedFile) {
            setError("Оберіть зображення для завантаження");
            return;
        }

        try {
            setSaving(true);

            if (editingId) {
                await updateCitizenAppealImage(editingId, {
                    title: trimmedTitle,
                    sort_order: order,
                    image: selectedFile,
                });

                setSuccess("Зображення успішно оновлено");
            } else if (selectedFile) {
                await createCitizenAppealImage({
                    title: trimmedTitle,
                    sort_order: order,
                    image: selectedFile,
                });

                setSuccess("Зображення успішно додано");
            }

            resetForm();
            await loadImages();

        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Не вдалося зберегти зображення"
            );
        } finally {
            setSaving(false);
        }
    };


    /* ========================================= */
    /* EDIT IMAGE */
    /* ========================================= */

    const handleEdit = (image: CitizenAppealImage) => {
        setEditingId(image.id);
        setTitle(image.title);
        setSortOrder(String(image.sort_order));
        setSelectedFile(null);

        const fileInput = document.getElementById(
            "citizen-image-file"
        ) as HTMLInputElement | null;

        if (fileInput) {
            fileInput.value = "";
        }

        setError("");
        setSuccess("");

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };


    /* ========================================= */
    /* DELETE IMAGE */
    /* ========================================= */

    const handleDelete = async (
        image: CitizenAppealImage
    ) => {
        const confirmed = window.confirm(
            `Ви точно хочете видалити зображення "${image.title}"?\n\nЦю дію неможливо скасувати.`
        );

        if (!confirmed) return;

        try {
            setDeletingId(image.id);
            setError("");
            setSuccess("");

            await deleteCitizenAppealImage(image.id);

            setImages(previous =>
                previous.filter(item => item.id !== image.id)
            );

            if (editingId === image.id) {
                resetForm();
            }

            setSuccess(`Зображення "${image.title}" видалено`);

        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Не вдалося видалити зображення"
            );
        } finally {
            setDeletingId(null);
        }
    };


    /* ========================================= */
    /* RENDER */
    /* ========================================= */

    return (
        <main className={styles.page}>
            <div className={styles.container}>

                <header className={styles.header}>
                    <div>
                        <span className={styles.subtitle}>
                            АДМІНІСТРАТИВНА ПАНЕЛЬ
                        </span>

                        <h1>Графік особистого прийому громадян</h1>

                        <p>
                            Керування зображеннями для публічного блоку сайту
                        </p>
                    </div>
                </header>


                {error && (
                    <div className={styles.error}>
                        {error}
                    </div>
                )}

                {success && (
                    <div className={styles.success}>
                        {success}
                    </div>
                )}


                {/* FORM */}

                <section className={styles.formCard}>
                    <h2>
                        {editingId
                            ? "Редагування зображення"
                            : "Додати зображення"}
                    </h2>

                    <form
                        className={styles.form}
                        onSubmit={handleSubmit}
                    >
                        <div className={styles.field}>
                            <label htmlFor="citizen-title">
                                Назва зображення
                            </label>

                            <input
                                id="citizen-title"
                                type="text"
                                value={title}
                                onChange={event =>
                                    setTitle(event.target.value)
                                }
                                placeholder="Наприклад: Графік особистого прийому громадян на листопад м-ць"
                                maxLength={255}
                                required
                            />
                        </div>


                        <div className={styles.field}>
                            <label htmlFor="citizen-sort">
                                Порядок відображення
                            </label>

                            <input
                                id="citizen-sort"
                                type="number"
                                min="0"
                                step="1"
                                value={sortOrder}
                                onChange={event =>
                                    setSortOrder(event.target.value)
                                }
                            />

                            <span className={styles.hint}>
                                Менше число — вище зображення у списку.
                            </span>
                        </div>


                        <div className={styles.field}>
                            <label htmlFor="citizen-image-file">
                                {editingId
                                    ? "Нове зображення (необов'язково)"
                                    : "Зображення"}
                            </label>

                            <input
                                id="citizen-image-file"
                                type="file"
                                accept="image/jpeg,image/png,image/webp,image/gif"
                                onChange={handleFileChange}
                                required={!editingId}
                            />

                            <span className={styles.hint}>
                                Максимальний розмір файлу — 10 МБ.
                            </span>
                        </div>


                        {selectedFile && (
                            <div className={styles.selectedFile}>
                                Обрано файл: {selectedFile.name}
                            </div>
                        )}


                        <div className={styles.formActions}>
                            <button
                                type="submit"
                                className={styles.primaryButton}
                                disabled={saving}
                            >
                                {saving
                                    ? "Збереження..."
                                    : editingId
                                        ? "Зберегти зміни"
                                        : "Завантажити зображення"}
                            </button>

                            {editingId && (
                                <button
                                    type="button"
                                    className={styles.secondaryButton}
                                    onClick={resetForm}
                                    disabled={saving}
                                >
                                    Скасувати
                                </button>
                            )}
                        </div>
                    </form>
                </section>


                {/* IMAGE LIST */}

                <section className={styles.listSection}>
                    <div className={styles.listHeader}>
                        <h2>Завантажені зображення</h2>

                        <span className={styles.count}>
                            {images.length}
                        </span>
                    </div>


                    {loading ? (
                        <div className={styles.status}>
                            Завантаження зображень...
                        </div>
                    ) : images.length === 0 ? (
                        <div className={styles.empty}>
                            <span className={styles.emptyIcon}>🖼️</span>

                            <h3>Поки немає зображень</h3>

                            <p>
                                Додайте перше зображення за допомогою форми вище.
                            </p>
                        </div>
                    ) : (
                        <div className={styles.grid}>
                            {images.map(image => (
                                <article
                                    key={image.id}
                                    className={styles.card}
                                >
                                    <div className={styles.imageWrapper}>
                                        <img
                                            src={image.image_path}
                                            alt={image.title}
                                            className={styles.image}
                                        />
                                    </div>

                                    <div className={styles.cardContent}>
                                        <h3>{image.title}</h3>

                                        <div className={styles.metadata}>
                                            <span>
                                                ID: {image.id}
                                            </span>

                                            <span>
                                                Порядок: {image.sort_order}
                                            </span>
                                        </div>

                                        <div className={styles.cardActions}>
                                            <button
                                                type="button"
                                                className={styles.editButton}
                                                onClick={() => handleEdit(image)}
                                            >
                                                Редагувати
                                            </button>

                                            <button
                                                type="button"
                                                className={styles.deleteButton}
                                                onClick={() => handleDelete(image)}
                                                disabled={deletingId === image.id}
                                            >
                                                {deletingId === image.id
                                                    ? "Видалення..."
                                                    : "Видалити"}
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>

            </div>
        </main>
    );
}
