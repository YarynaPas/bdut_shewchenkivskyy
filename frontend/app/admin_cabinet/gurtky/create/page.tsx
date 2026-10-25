"use client";

import {
    ChangeEvent,
    FormEvent,
    useState,
} from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import styles from "./CreateGurtok.module.css";

import {
    createGurtok,
    ScheduleItem,
} from "@/services/gurtkyApi";


export default function CreateGurtokPage() {

    const router = useRouter();


    /* ========================================= */
    /* FORM */
    /* ========================================= */

    const [name, setName] =
        useState("");

    const [teacher, setTeacher] =
        useState("");

    const [napryam, setNapryam] =
        useState("");

    const [vikovaGrupa, setVikovaGrupa] =
        useState("");

    const [description, setDescription] =
        useState("");

    const [longDescription, setLongDescription] =
        useState("");

    const [classrom, setClassrom] =
        useState("");


    /* ========================================= */
    /* SCHEDULE */
    /* ========================================= */

    const [schedule, setSchedule] =
        useState<ScheduleItem[]>([]);


    /* ========================================= */
    /* FILES */
    /* ========================================= */

    const [pictograma, setPictograma] =
        useState<File | null>(null);

    const [photos, setPhotos] =
        useState<File[]>([]);


    const [pictogramaPreview, setPictogramaPreview] =
        useState<string | null>(null);

    const [photoPreviews, setPhotoPreviews] =
        useState<string[]>([]);


    /* ========================================= */
    /* STATUS */
    /* ========================================= */

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    /* ========================================= */
    /* PICTOGRAMA */
    /* ========================================= */

    const handlePictogramaChange = (
        event: ChangeEvent<HTMLInputElement>
    ) => {

        const file =
            event.target.files?.[0];


        if (!file) {

            return;

        }


        if (
            !file.type.startsWith("image/")
        ) {

            setError(
                "Піктограма повинна бути зображенням."
            );

            return;

        }


        setError("");

        setPictograma(file);


        const url =
            URL.createObjectURL(file);


        setPictogramaPreview(url);

    };


    /* ========================================= */
    /* ADDITIONAL PHOTOS */
    /* ========================================= */

    const handlePhotosChange = (
        event: ChangeEvent<HTMLInputElement>
    ) => {

        const files =
            Array.from(
                event.target.files || []
            );


        if (!files.length) {

            return;

        }


        const imageFiles =
            files.filter(
                file =>
                    file.type.startsWith(
                        "image/"
                    )
            );


        if (
            imageFiles.length !== files.length
        ) {

            setError(
                "Усі додаткові файли повинні бути зображеннями."
            );

            return;

        }


        if (
            imageFiles.length > 4
        ) {

            setError(
                "Можна додати максимум 4 додаткові фото."
            );

            return;

        }


        setError("");

        setPhotos(imageFiles);


        setPhotoPreviews(
            imageFiles.map(
                file =>
                    URL.createObjectURL(file)
            )
        );

    };


    /* ========================================= */
    /* SCHEDULE */
    /* ========================================= */

    const addSchedule = () => {

        setSchedule(
            previous => [
                ...previous,
                {
                    day: "",
                    time: "",
                },
            ]
        );

    };


    const updateSchedule = (
        index: number,
        field: keyof ScheduleItem,
        value: string
    ) => {

        setSchedule(
            previous =>
                previous.map(
                    (item, itemIndex) =>
                        itemIndex === index
                            ? {
                                ...item,
                                [field]: value,
                            }
                            : item
                )
        );

    };


    const removeSchedule = (
        index: number
    ) => {

        setSchedule(
            previous =>
                previous.filter(
                    (_, itemIndex) =>
                        itemIndex !== index
                )
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
        /* REQUIRED */
        /* ================================= */

        if (!name.trim()) {

            setError(
                "Введіть назву гуртка."
            );

            return;

        }


        if (!teacher.trim()) {

            setError(
                "Введіть керівника гуртка."
            );

            return;

        }


        if (!napryam.trim()) {

            setError(
                "Вкажіть напрям гуртка."
            );

            return;

        }


        if (!vikovaGrupa.trim()) {

            setError(
                "Вкажіть вікову групу."
            );

            return;

        }


        if (!pictograma) {

            setError(
                "Завантажте піктограму гуртка."
            );

            return;

        }


        /* ================================= */
        /* CHECK SCHEDULE */
        /* ================================= */

        const invalidSchedule =
            schedule.some(
                item =>
                    !item.day.trim() ||
                    !item.time.trim()
            );


        if (invalidSchedule) {

            setError(
                "Заповніть день і час для кожного пункту розкладу або видаліть порожній пункт."
            );

            return;

        }


        try {

            setLoading(true);


            await createGurtok({

                name:
                    name.trim(),

                teacher:
                    teacher.trim(),

                napryam:
                    napryam.trim(),

                vikova_grupa:
                    vikovaGrupa.trim(),

                description:
                    description.trim(),

                long_description:
                    longDescription.trim(),

                classrom:
                    classrom.trim(),

                schedule,

                pictograma,

                photos,

            });


            setSuccess(
                "Гурток успішно створено!"
            );


            setTimeout(() => {

                router.push(
                    "/admin_cabinet/gurtky"
                );

            }, 700);


        } catch (err) {

            setError(
                err instanceof Error
                    ? err.message
                    : "Не вдалося створити гурток."
            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <main className={styles.page}>

            <div className={styles.container}>

                {/* ================================= */}
                {/* HEADER */}
                {/* ================================= */}

                <header className={styles.header}>

                    <Link
                        href="/admin_cabinet/gurtky"
                        className={styles.back}
                    >

                        ← Назад до гуртків

                    </Link>


                    <span className={styles.overline}>

                        КЕРУВАННЯ ГУРТКАМИ

                    </span>


                    <h1>
                        Додати гурток
                    </h1>


                    <p>
                        Заповніть інформацію про
                        новий гурток.
                    </p>

                </header>


                {/* ================================= */}
                {/* ERROR */}
                {/* ================================= */}

                {error && (

                    <div className={styles.error}>

                        <span>!</span>

                        {error}

                    </div>

                )}


                {/* ================================= */}
                {/* SUCCESS */}
                {/* ================================= */}

                {success && (

                    <div className={styles.success}>

                        <span>✓</span>

                        {success}

                    </div>

                )}


                <form
                    onSubmit={handleSubmit}
                    className={styles.form}
                >

                    {/* ================================= */}
                    {/* BASIC INFORMATION */}
                    {/* ================================= */}

                    <section className={styles.card}>

                        <div className={styles.cardHeader}>

                            <div className={styles.number}>
                                01
                            </div>

                            <div>

                                <h2>
                                    Основна інформація
                                </h2>

                                <p>
                                    Дані, які будуть
                                    відображатися на сторінці
                                    гуртка.
                                </p>

                            </div>

                        </div>


                        {/* NAME */}

                        <div className={styles.field}>

                            <div className={styles.labelRow}>

                                <label>
                                    Назва гуртка
                                </label>

                                <span className={styles.required}>
                                    Обов'язкове
                                </span>

                            </div>


                            <input
                                type="text"
                                value={name}
                                onChange={e =>
                                    setName(
                                        e.target.value
                                    )
                                }
                                placeholder="Наприклад: Образотворче мистецтво"
                                disabled={loading}
                            />

                        </div>


                        {/* TEACHER */}

                        <div className={styles.field}>

                            <div className={styles.labelRow}>

                                <label>
                                    Керівник гуртка
                                </label>

                                <span className={styles.required}>
                                    Обов'язкове
                                </span>

                            </div>


                            <input
                                type="text"
                                value={teacher}
                                onChange={e =>
                                    setTeacher(
                                        e.target.value
                                    )
                                }
                                placeholder="ПІБ керівника"
                                disabled={loading}
                            />

                        </div>


                        {/* DIRECTION */}

                        <div className={styles.field}>

                            <div className={styles.labelRow}>

                                <label>
                                    Напрям
                                </label>

                                <span className={styles.required}>
                                    Обов'язкове
                                </span>

                            </div>


                            <input
                                type="text"
                                value={napryam}
                                onChange={e =>
                                    setNapryam(
                                        e.target.value
                                    )
                                }
                                placeholder="Наприклад: Художньо-естетичний"
                                disabled={loading}
                            />

                        </div>


                        {/* AGE */}

                        <div className={styles.field}>

                            <div className={styles.labelRow}>

                                <label>
                                    Вікова група
                                </label>

                                <span className={styles.required}>
                                    Обов'язкове
                                </span>

                            </div>


                            <input
                                type="text"
                                value={vikovaGrupa}
                                onChange={e =>
                                    setVikovaGrupa(
                                        e.target.value
                                    )
                                }
                                placeholder="Наприклад: 6–10 років"
                                disabled={loading}
                            />

                        </div>


                        {/* CLASSROOM */}

                        <div className={styles.field}>

                            <div className={styles.labelRow}>

                                <label>
                                    Кабінет
                                </label>

                                <span className={styles.optional}>
                                    Необов'язкове
                                </span>

                            </div>


                            <input
                                type="text"
                                value={classrom}
                                onChange={e =>
                                    setClassrom(
                                        e.target.value
                                    )
                                }
                                placeholder="Наприклад: Кабінет №12"
                                disabled={loading}
                            />

                        </div>

                    </section>


                    {/* ================================= */}
                    {/* DESCRIPTION */}
                    {/* ================================= */}

                    <section className={styles.card}>

                        <div className={styles.cardHeader}>

                            <div className={styles.number}>
                                02
                            </div>

                            <div>

                                <h2>
                                    Опис
                                </h2>

                                <p>
                                    Коротка та розширена
                                    інформація про гурток.
                                </p>

                            </div>

                        </div>


                        <div className={styles.field}>

                            <div className={styles.labelRow}>

                                <label>
                                    Опис
                                </label>

                                <span className={styles.optional}>
                                    Необов'язкове
                                </span>

                            </div>


                            <textarea
                                value={description}
                                onChange={e =>
                                    setDescription(
                                        e.target.value
                                    )
                                }
                                rows={5}
                                placeholder="Короткий опис гуртка..."
                                disabled={loading}
                            />

                        </div>


                        <div className={styles.field}>

                            <div className={styles.labelRow}>

                                <label>
                                    Детальний опис
                                </label>

                                <span className={styles.optional}>
                                    Необов'язкове
                                </span>

                            </div>


                            <textarea
                                value={longDescription}
                                onChange={e =>
                                    setLongDescription(
                                        e.target.value
                                    )
                                }
                                rows={12}
                                placeholder="Розгорнута інформація про гурток..."
                                disabled={loading}
                            />

                        </div>

                    </section>


                    {/* ================================= */}
                    {/* SCHEDULE */}
                    {/* ================================= */}

                    <section className={styles.card}>

                        <div className={styles.cardHeader}>

                            <div className={styles.number}>
                                03
                            </div>

                            <div>

                                <h2>
                                    Розклад
                                </h2>

                                <p>
                                    Додайте дні та час
                                    проведення занять.
                                </p>

                            </div>

                        </div>


                        {schedule.length === 0 ? (

                            <div className={styles.emptySchedule}>

                                <span>
                                    Розклад ще не додано
                                </span>

                                <button
                                    type="button"
                                    onClick={addSchedule}
                                >
                                    + Додати заняття
                                </button>

                            </div>

                        ) : (

                            <div className={styles.scheduleList}>

                                {schedule.map(
                                    (item, index) => (

                                        <div
                                            key={index}
                                            className={
                                                styles.scheduleRow
                                            }
                                        >

                                            <div
                                                className={
                                                    styles.scheduleNumber
                                                }
                                            >
                                                {index + 1}
                                            </div>


                                            <input
                                                type="text"
                                                value={item.day}
                                                onChange={e =>
                                                    updateSchedule(
                                                        index,
                                                        "day",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="День, наприклад Понеділок"
                                                disabled={loading}
                                            />


                                            <input
                                                type="text"
                                                value={item.time}
                                                onChange={e =>
                                                    updateSchedule(
                                                        index,
                                                        "time",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Час, наприклад 15:00–16:30"
                                                disabled={loading}
                                            />


                                            <button
                                                type="button"
                                                className={
                                                    styles.removeSchedule
                                                }
                                                onClick={() =>
                                                    removeSchedule(
                                                        index
                                                    )
                                                }
                                                disabled={loading}
                                            >
                                                ×
                                            </button>

                                        </div>

                                    )
                                )}


                                <button
                                    type="button"
                                    className={
                                        styles.addSchedule
                                    }
                                    onClick={addSchedule}
                                    disabled={
                                        loading
                                    }
                                >
                                    + Додати ще заняття
                                </button>

                            </div>

                        )}

                    </section>


                    {/* ================================= */}
                    {/* IMAGES */}
                    {/* ================================= */}

                    <section className={styles.card}>

                        <div className={styles.cardHeader}>

                            <div className={styles.number}>
                                04
                            </div>

                            <div>

                                <h2>
                                    Зображення
                                </h2>

                                <p>
                                    Головна піктограма та
                                    додаткові фотографії.
                                </p>

                            </div>

                        </div>


                        {/* PICTOGRAMA */}

                        <div className={styles.field}>

                            <div className={styles.labelRow}>

                                <label>
                                    Піктограма
                                </label>

                                <span className={styles.required}>
                                    Обов'язкове
                                </span>

                            </div>


                            {pictogramaPreview && (

                                <div className={styles.pictogramaPreview}>

                                    <img
                                        src={
                                            pictogramaPreview
                                        }
                                        alt="Preview"
                                    />

                                </div>

                            )}


                            <label className={styles.upload}>

                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/gif,image/svg+xml"
                                    onChange={
                                        handlePictogramaChange
                                    }
                                    disabled={loading}
                                />

                                <span className={styles.uploadIcon}>
                                    ↑
                                </span>

                                <strong>
                                    {pictograma
                                        ? "Вибрати іншу піктограму"
                                        : "Завантажити піктограму"}
                                </strong>

                                <small>
                                    JPG, PNG, GIF або SVG
                                </small>

                            </label>

                        </div>


                        {/* PHOTOS */}

                        <div className={styles.field}>

                            <div className={styles.labelRow}>

                                <label>
                                    Додаткові фото
                                </label>

                                <span className={styles.optional}>
                                    Необов'язкове · до 4 фото
                                </span>

                            </div>


                            <label className={styles.upload}>

                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/gif,image/svg+xml"
                                    multiple
                                    onChange={
                                        handlePhotosChange
                                    }
                                    disabled={loading}
                                />

                                <span className={styles.uploadIcon}>
                                    ↑
                                </span>

                                <strong>
                                    Додати фотографії
                                </strong>

                                <small>
                                    Максимум 4 зображення
                                </small>

                            </label>


                            {photoPreviews.length > 0 && (

                                <div className={styles.photosPreview}>

                                    {photoPreviews.map(
                                        (photo, index) => (

                                            <div
                                                key={photo}
                                                className={
                                                    styles.photoPreview
                                                }
                                            >

                                                <img
                                                    src={photo}
                                                    alt={`Фото ${index + 1}`}
                                                />

                                            </div>

                                        )
                                    )}

                                </div>

                            )}

                        </div>

                    </section>


                    {/* ================================= */}
                    {/* ACTIONS */}
                    {/* ================================= */}

                    <div className={styles.actions}>

                        <Link
                            href="/admin_cabinet/gurtky"
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
                                    <span
                                        className={
                                            styles.spinner
                                        }
                                    />

                                    Створення...

                                </>

                            ) : (

                                <>
                                    Створити гурток

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