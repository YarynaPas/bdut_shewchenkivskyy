"use client";

import {
    ChangeEvent,
    FormEvent,
    useEffect,
    useState,
} from "react";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import styles from "./EditGurtok.module.css";

import {
    AdminGurtok,
    ScheduleItem,
    getAdminGurtokById,
    updateGurtok,
} from "@/services/gurtkyApi";


const DAYS = [
    "Пн",
    "Вт",
    "Ср",
    "Чт",
    "Пт",
    "Сб",
    "Нд",
];


export default function EditGurtokPage() {

    const params = useParams();

    const router = useRouter();

    const id =
        Number(params.id);


    const [gurtok, setGurtok] =
        useState<AdminGurtok | null>(null);


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


    const [schedule, setSchedule] =
        useState<ScheduleItem[]>([]);


    const [pictograma, setPictograma] =
        useState<File | null>(null);

    const [pictogramaPreview, setPictogramaPreview] =
        useState<string | null>(null);


    const [existingPhotos, setExistingPhotos] =
        useState<string[]>([]);

    const [newPhotos, setNewPhotos] =
        useState<File[]>([]);

    const [newPhotoPreviews, setNewPhotoPreviews] =
        useState<string[]>([]);


    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    /* ========================================= */
    /* LOAD */
    /* ========================================= */

    useEffect(() => {

        if (
            !id ||
            Number.isNaN(id)
        ) {

            setError(
                "Некоректний ID гуртка."
            );

            setLoading(false);

            return;

        }


        const load =
            async () => {

                try {

                    const data =
                        await getAdminGurtokById(
                            id
                        );


                    setGurtok(data);

                    setName(
                        data.name || ""
                    );

                    setTeacher(
                        data.teacher || ""
                    );

                    setNapryam(
                        data.napryam || ""
                    );

                    setVikovaGrupa(
                        data.vikova_grupa || ""
                    );

                    setDescription(
                        data.description || ""
                    );

                    setLongDescription(
                        data.long_description || ""
                    );

                    setClassrom(
                        data.classrom || ""
                    );


                    setSchedule(
                        Array.isArray(
                            data.schedule
                        )
                            ? data.schedule
                            : []
                    );


                    setPictogramaPreview(
                        data.pictograma || null
                    );


                    setExistingPhotos(
                        Array.isArray(
                            data.photos
                        )
                            ? data.photos
                            : []
                    );

                } catch (err) {

                    console.error(
                        err
                    );

                    setError(
                        err instanceof Error
                            ? err.message
                            : "Не вдалося завантажити гурток."
                    );

                } finally {

                    setLoading(false);

                }

            };


        load();

    }, [id]);


    /* ========================================= */
    /* PICTOGRAMA */
    /* ========================================= */

    const handlePictograma = (
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


        setPictogramaPreview(
            URL.createObjectURL(file)
        );

    };


    /* ========================================= */
    /* NEW PHOTOS */
    /* ========================================= */

    const handleNewPhotos = (
        event: ChangeEvent<HTMLInputElement>
    ) => {

        const files =
            Array.from(
                event.target.files || []
            );


        if (!files.length) {
            return;
        }


        const images =
            files.filter(
                file =>
                    file.type.startsWith(
                        "image/"
                    )
            );


        if (
            images.length !== files.length
        ) {

            setError(
                "Можна завантажувати тільки зображення."
            );

            return;

        }


        if (
            existingPhotos.length +
            images.length >
            4
        ) {

            setError(
                "Загальна кількість додаткових фото не може перевищувати 4."
            );

            return;

        }


        setError("");

        setNewPhotos(images);


        setNewPhotoPreviews(
            images.map(
                file =>
                    URL.createObjectURL(file)
            )
        );

    };


    /* ========================================= */
    /* REMOVE EXISTING PHOTO */
    /* ========================================= */

    const removeExistingPhoto = (
        index: number
    ) => {

        setExistingPhotos(
            previous =>
                previous.filter(
                    (_, i) =>
                        i !== index
                )
        );

    };


    /* ========================================= */
    /* REMOVE NEW PHOTO */
    /* ========================================= */

    const removeNewPhoto = (
        index: number
    ) => {

        const photos =
            newPhotos.filter(
                (_, i) =>
                    i !== index
            );


        setNewPhotos(
            photos
        );


        setNewPhotoPreviews(
            photos.map(
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
                    (item, i) =>
                        i === index
                            ? {
                                ...item,
                                [field]:
                                value,
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
                    (_, i) =>
                        i !== index
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


        if (!name.trim()) {

            setError(
                "Назва гуртка є обов'язковою."
            );

            return;

        }


        if (!teacher.trim()) {

            setError(
                "Керівник є обов'язковим."
            );

            return;

        }


        if (!napryam.trim()) {

            setError(
                "Напрям є обов'язковим."
            );

            return;

        }


        if (!vikovaGrupa.trim()) {

            setError(
                "Вікова група є обов'язковою."
            );

            return;

        }


        const invalidSchedule =
            schedule.some(
                item =>
                    !item.day.trim() ||
                    !item.time.trim()
            );


        if (invalidSchedule) {

            setError(
                "Заповніть усі поля розкладу або видаліть порожні рядки."
            );

            return;

        }


        try {

            setSaving(true);


            await updateGurtok(
                id,
                {

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

                    existing_photos:
                    existingPhotos,

                    photos:
                    newPhotos,

                }
            );


            setSuccess(
                "Гурток успішно оновлено!"
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
                    : "Помилка оновлення гуртка."
            );

        } finally {

            setSaving(false);

        }

    };


    /* ========================================= */
    /* LOADING */
    /* ========================================= */

    if (loading) {

        return (

            <main className={styles.page}>

                <div className={styles.loading}>

                    <div
                        className={
                            styles.spinner
                        }
                    />

                    Завантаження...

                </div>

            </main>

        );

    }


    if (!gurtok) {

        return (

            <main className={styles.page}>

                <div className={styles.notFound}>

                    <h1>
                        Гурток не знайдено
                    </h1>

                    <p>
                        {error}
                    </p>

                    <Link
                        href="/admin_cabinet/gurtky"
                    >
                        ← До гуртків
                    </Link>

                </div>

            </main>

        );

    }


    return (

        <main className={styles.page}>

            <div className={styles.container}>

                {/* HEADER */}

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
                        Редагувати гурток
                    </h1>

                    <p>
                        Змініть інформацію та
                        збережіть результат.
                    </p>

                </header>


                {error && (

                    <div className={styles.error}>
                        <span>!</span>
                        {error}
                    </div>

                )}


                {success && (

                    <div className={styles.success}>
                        <span>✓</span>
                        {success}
                    </div>

                )}


                <form
                    className={styles.form}
                    onSubmit={handleSubmit}
                >

                    {/* ================================= */}
                    {/* INFORMATION */}
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
                                    Основні дані гуртка.
                                </p>

                            </div>

                        </div>


                        <div className={styles.field}>

                            <div className={styles.labelRow}>

                                <label>
                                    Назва
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
                                disabled={saving}
                            />

                        </div>


                        <div className={styles.field}>

                            <div className={styles.labelRow}>

                                <label>
                                    Керівник
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
                                disabled={saving}
                            />

                        </div>


                        <div className={styles.field}>

                            <div className={styles.labelRow}>

                                <label>
                                    Напрям
                                </label>

                                <span className={styles.required}>
                                    Обов'язкове
                                </span>

                            </div>

                            <select
                                value={napryam}
                                onChange={e =>
                                    setNapryam(
                                        e.target.value
                                    )
                                }
                                disabled={saving}
                            >

                                <option value="">
                                    Оберіть напрям
                                </option>

                                <option value="Художньо-естетичний відділ">
                                    Художньо-естетичний відділ
                                </option>

                                <option value="Гуманітарний відділ">
                                    Гуманітарний відділ
                                </option>

                                <option value="Вокально-хореографічний відділ">
                                    Вокально-хореографічний відділ
                                </option>

                            </select>

                        </div>


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
                                disabled={saving}
                            />

                        </div>


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
                                disabled={saving}
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
                                    Інформація для сторінки
                                    гуртка.
                                </p>

                            </div>

                        </div>


                        <div className={styles.field}>

                            <div className={styles.labelRow}>

                                <label>
                                    Короткий опис
                                </label>

                                <span className={styles.optional}>
                                    Необов'язкове
                                </span>

                            </div>

                            <textarea
                                rows={5}
                                value={description}
                                onChange={e =>
                                    setDescription(
                                        e.target.value
                                    )
                                }
                                disabled={saving}
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
                                rows={12}
                                value={longDescription}
                                onChange={e =>
                                    setLongDescription(
                                        e.target.value
                                    )
                                }
                                disabled={saving}
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
                                    Необов'язкові дані.
                                </p>

                            </div>

                        </div>


                        {schedule.length === 0 ? (

                            <div className={styles.emptySchedule}>

                                <span>
                                    Розклад не вказано
                                </span>

                                <button
                                    type="button"
                                    onClick={
                                        addSchedule
                                    }
                                >
                                    + Додати
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

                                            <select
                                                value={item.day}
                                                onChange={e =>
                                                    updateSchedule(
                                                        index,
                                                        "day",
                                                        e.target.value
                                                    )
                                                }
                                                disabled={saving}
                                            >

                                                <option value="">
                                                    День
                                                </option>

                                                {DAYS.map(
                                                    day => (

                                                        <option
                                                            key={day}
                                                            value={day}
                                                        >
                                                            {day}
                                                        </option>

                                                    )
                                                )}

                                            </select>


                                            <input
                                                type="text"
                                                value={item.time}
                                                placeholder="18:00"
                                                onChange={e =>
                                                    updateSchedule(
                                                        index,
                                                        "time",
                                                        e.target.value
                                                    )
                                                }
                                                disabled={saving}
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
                                    onClick={
                                        addSchedule
                                    }
                                    disabled={
                                        schedule.length >= 7
                                    }
                                >
                                    + Додати заняття
                                </button>

                            </div>

                        )}

                    </section>


                    {/* ================================= */}
                    {/* PICTOGRAMA */}
                    {/* ================================= */}

                    <section className={styles.card}>

                        <div className={styles.cardHeader}>

                            <div className={styles.number}>
                                04
                            </div>

                            <div>

                                <h2>
                                    Піктограма
                                </h2>

                                <p>
                                    Основне зображення
                                    гуртка.
                                </p>

                            </div>

                        </div>


                        <div className={styles.labelRow}>

                            <label>
                                Піктограма
                            </label>

                            <span className={styles.required}>
                                Обов'язкове
                            </span>

                        </div>


                        {pictogramaPreview && (

                            <div
                                className={
                                    styles.pictogramaPreview
                                }
                            >

                                <img
                                    src={
                                        pictogramaPreview
                                    }
                                    alt={name}
                                />

                            </div>

                        )}


                        <label className={styles.upload}>

                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/gif,image/svg+xml"
                                onChange={
                                    handlePictograma
                                }
                                disabled={saving}
                            />

                            <span>
                                ↑
                            </span>

                            <strong>
                                Замінити піктограму
                            </strong>

                            <small>
                                JPG, PNG, GIF або SVG
                            </small>

                        </label>

                    </section>


                    {/* ================================= */}
                    {/* PHOTOS */}
                    {/* ================================= */}

                    <section className={styles.card}>

                        <div className={styles.cardHeader}>

                            <div className={styles.number}>
                                05
                            </div>

                            <div>

                                <h2>
                                    Фотогалерея
                                </h2>

                                <p>
                                    Максимум 4 додаткових
                                    фотографії.
                                </p>

                            </div>

                        </div>


                        <div className={styles.labelRow}>

                            <label>
                                Додаткові фото
                            </label>

                            <span className={styles.optional}>
                                Необов'язкове
                            </span>

                        </div>


                        {/* EXISTING */}

                        {existingPhotos.length > 0 && (

                            <div className={styles.photoGrid}>

                                {existingPhotos.map(
                                    (photo, index) => (

                                        <div
                                            key={
                                                `${photo}-${index}`
                                            }
                                            className={
                                                styles.photoItem
                                            }
                                        >

                                            <img
                                                src={
                                                    photo
                                                }
                                                alt={`${name} ${index + 1}`}
                                            />

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeExistingPhoto(
                                                        index
                                                    )
                                                }
                                            >
                                                ×
                                            </button>

                                        </div>

                                    )
                                )}

                            </div>

                        )}


                        {/* NEW */}

                        {newPhotoPreviews.length > 0 && (

                            <div
                                className={
                                    styles.photoGrid
                                }
                            >

                                {newPhotoPreviews.map(
                                    (photo, index) => (

                                        <div
                                            key={
                                                `${photo}-${index}`
                                            }
                                            className={
                                                styles.photoItem
                                            }
                                        >

                                            <img
                                                src={photo}
                                                alt=""
                                            />

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeNewPhoto(
                                                        index
                                                    )
                                                }
                                            >
                                                ×
                                            </button>

                                            <span
                                                className={
                                                    styles.newBadge
                                                }
                                            >
                                                НОВЕ
                                            </span>

                                        </div>

                                    )
                                )}

                            </div>

                        )}


                        {existingPhotos.length +
                            newPhotos.length <
                            4 && (

                                <label
                                    className={
                                        styles.upload
                                    }
                                >

                                    <input
                                        type="file"
                                        accept="image/jpeg,image/png,image/gif,image/svg+xml"
                                        multiple
                                        onChange={
                                            handleNewPhotos
                                        }
                                        disabled={
                                            saving
                                        }
                                    />

                                    <span>
                                    ↑
                                </span>

                                    <strong>
                                        Додати фотографії
                                    </strong>

                                    <small>
                                        Залишилось{" "}
                                        {4 -
                                            existingPhotos.length -
                                            newPhotos.length}{" "}
                                        місць
                                    </small>

                                </label>

                            )}

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
                            disabled={saving}
                        >

                            {saving ? (
                                <>
                                    <span
                                        className={
                                            styles.buttonSpinner
                                        }
                                    />

                                    Збереження...
                                </>
                            ) : (
                                <>
                                    Зберегти зміни

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