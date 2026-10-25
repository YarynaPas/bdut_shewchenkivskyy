"use client";

import {
    ChangeEvent,
    FormEvent,
    useState,
} from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import styles from "./CreateEvent.module.css";

import {
    createEvent,
} from "@/services/eventsApi";


export default function CreateEventPage() {

    const router = useRouter();


    const [title, setTitle] =
        useState("");

    const [description, setDescription] =
        useState("");

    const [date, setDate] =
        useState("");

    const [mainPhoto, setMainPhoto] =
        useState<File | null>(null);

    const [preview, setPreview] =
        useState<string | null>(null);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    const handlePhoto = (
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
                "Головне фото повинно бути зображенням."
            );

            return;

        }


        setError("");

        setMainPhoto(file);

        setPreview(
            URL.createObjectURL(file)
        );

    };


    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {

        event.preventDefault();

        setError("");
        setSuccess("");


        if (!title.trim()) {

            setError(
                "Назва події є обов'язковою."
            );

            return;

        }


        if (!date) {

            setError(
                "Дата події є обов'язковою."
            );

            return;

        }


        if (!mainPhoto) {

            setError(
                "Головне фото є обов'язковим."
            );

            return;

        }


        try {

            setLoading(true);


            await createEvent({

                title:
                    title.trim(),

                description:
                    description.trim(),

                date,

                main_photo:
                mainPhoto,

            });


            setSuccess(
                "Подію успішно створено!"
            );


            setTimeout(() => {

                router.push(
                    "/admin_cabinet/events"
                );

            }, 700);

        } catch (err) {

            setError(
                err instanceof Error
                    ? err.message
                    : "Не вдалося створити подію."
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
                        href="/admin_cabinet/events"
                        className={styles.back}
                    >
                        ← Назад до подій
                    </Link>

                    <span className={styles.overline}>
                        КЕРУВАННЯ ПОДІЯМИ
                    </span>

                    <h1>
                        Додати подію
                    </h1>

                    <p>
                        Створіть нову подію
                        для сайту.
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

                    {/* INFORMATION */}

                    <section className={styles.card}>

                        <div className={styles.cardHeader}>

                            <div className={styles.number}>
                                01
                            </div>

                            <div>

                                <h2>
                                    Інформація
                                </h2>

                                <p>
                                    Основні дані події.
                                </p>

                            </div>

                        </div>


                        {/* TITLE */}

                        <div className={styles.field}>

                            <div className={styles.labelRow}>

                                <label>
                                    Назва події
                                </label>

                                <span className={styles.required}>
                                    Обов'язкове
                                </span>

                            </div>

                            <input
                                type="text"
                                value={title}
                                onChange={e =>
                                    setTitle(
                                        e.target.value
                                    )
                                }
                                placeholder="Наприклад: День відкритих дверей"
                                disabled={loading}
                            />

                        </div>


                        {/* DATE */}

                        <div className={styles.field}>

                            <div className={styles.labelRow}>

                                <label>
                                    Дата та час
                                </label>

                                <span className={styles.required}>
                                    Обов'язкове
                                </span>

                            </div>

                            <input
                                type="datetime-local"
                                value={date}
                                onChange={e =>
                                    setDate(
                                        e.target.value
                                    )
                                }
                                disabled={loading}
                            />

                        </div>


                        {/* DESCRIPTION */}

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
                                rows={10}
                                value={description}
                                onChange={e =>
                                    setDescription(
                                        e.target.value
                                    )
                                }
                                placeholder="Опишіть майбутню подію..."
                                disabled={loading}
                            />

                        </div>

                    </section>


                    {/* PHOTO */}

                    <section className={styles.card}>

                        <div className={styles.cardHeader}>

                            <div className={styles.number}>
                                02
                            </div>

                            <div>

                                <h2>
                                    Афіша
                                </h2>

                                <p>
                                    Головне зображення події.
                                </p>

                            </div>

                        </div>


                        <div className={styles.labelRow}>

                            <label>
                                Афіша / головне фото
                            </label>

                            <span className={styles.required}>
                                Обов'язкове
                            </span>

                        </div>


                        {preview && (

                            <div className={styles.preview}>

                                <img
                                    src={preview}
                                    alt="Preview"
                                />

                            </div>

                        )}


                        <label className={styles.upload}>

                            <input
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,image/gif"
                                onChange={handlePhoto}
                                disabled={loading}
                            />

                            <span>
                                ↑
                            </span>

                            <strong>
                                {mainPhoto
                                    ? "Вибрати іншу афішу"
                                    : "Завантажити афішу"}
                            </strong>

                            <small>
                                JPG, PNG або GIF
                            </small>

                        </label>

                    </section>


                    {/* ACTIONS */}

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
                            disabled={loading}
                        >

                            {loading ? (
                                <>
                                    <span
                                        className={styles.spinner}
                                    />
                                    Створення...
                                </>
                            ) : (
                                <>
                                    Створити подію
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