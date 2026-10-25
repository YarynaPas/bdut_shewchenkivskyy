"use client";

import {
    ChangeEvent,
    FormEvent,
    useState,
} from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import styles from "./CreateEmployee.module.css";

import {
    createEmployee,
} from "@/services/employeesApi";


export default function CreateEmployeePage() {

    const router = useRouter();


    const [fullName, setFullName] =
        useState("");

    const [position, setPosition] =
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


    /* ========================================= */
    /* PHOTO */
    /* ========================================= */

    const handlePhotoChange = (
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
                "Фото повинно бути зображенням."
            );

            return;

        }


        if (
            file.size > 10 * 1024 * 1024
        ) {

            setError(
                "Розмір фото не може перевищувати 10 МБ."
            );

            return;

        }


        setError("");

        setMainPhoto(file);

        setPreview(
            URL.createObjectURL(file)
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


        if (!fullName.trim()) {

            setError(
                "ПІБ працівника є обов'язковим."
            );

            return;

        }


        if (!position.trim()) {

            setError(
                "Посада є обов'язковою."
            );

            return;

        }


        if (!mainPhoto) {

            setError(
                "Фото працівника є обов'язковим."
            );

            return;

        }


        try {

            setLoading(true);


            await createEmployee({

                full_name:
                    fullName.trim(),

                position:
                    position.trim(),

                main_photo:
                mainPhoto,

            });


            setSuccess(
                "Працівника успішно створено."
            );


            setTimeout(() => {

                router.push(
                    "/admin_cabinet/employees"
                );

            }, 700);

        } catch (err) {

            console.error(
                err
            );


            setError(
                err instanceof Error
                    ? err.message
                    : "Не вдалося створити працівника."
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
                        href="/admin_cabinet/employees"
                        className={styles.back}
                    >
                        ← Назад до працівників
                    </Link>


                    <span className={styles.overline}>
                        КЕРУВАННЯ ПРАЦІВНИКАМИ
                    </span>


                    <h1>
                        Додати працівника
                    </h1>


                    <p>
                        Додайте нового працівника
                        до сайту закладу.
                    </p>

                </header>


                {error && (

                    <div className={styles.error}>

                        <span>!</span>

                        <p>
                            {error}
                        </p>

                    </div>

                )}


                {success && (

                    <div className={styles.success}>

                        <span>✓</span>

                        <p>
                            {success}
                        </p>

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
                                    Інформація
                                </h2>

                                <p>
                                    Основні дані працівника.
                                </p>

                            </div>

                        </div>


                        <div className={styles.field}>

                            <div className={styles.labelRow}>

                                <label>
                                    ПІБ
                                </label>

                                <span className={styles.required}>
                                    Обов'язкове
                                </span>

                            </div>


                            <input
                                type="text"
                                value={fullName}
                                onChange={e =>
                                    setFullName(
                                        e.target.value
                                    )
                                }
                                placeholder="Наприклад: Іваненко Олена Петрівна"
                                disabled={loading}
                            />

                        </div>


                        <div className={styles.field}>

                            <div className={styles.labelRow}>

                                <label>
                                    Посада
                                </label>

                                <span className={styles.required}>
                                    Обов'язкове
                                </span>

                            </div>


                            <input
                                type="text"
                                value={position}
                                onChange={e =>
                                    setPosition(
                                        e.target.value
                                    )
                                }
                                placeholder="Наприклад: Директор"
                                disabled={loading}
                            />

                        </div>

                    </section>


                    {/* ================================= */}
                    {/* PHOTO */}
                    {/* ================================= */}

                    <section className={styles.card}>

                        <div className={styles.cardHeader}>

                            <div className={styles.number}>
                                02
                            </div>

                            <div>

                                <h2>
                                    Фотографія
                                </h2>

                                <p>
                                    Фото працівника.
                                </p>

                            </div>

                        </div>


                        <div className={styles.labelRow}>

                            <label>
                                Основне фото
                            </label>

                            <span className={styles.required}>
                                Обов'язкове
                            </span>

                        </div>


                        {preview ? (

                            <div className={styles.preview}>

                                <img
                                    src={preview}
                                    alt={fullName}
                                />

                                <button
                                    type="button"
                                    className={styles.remove}
                                    onClick={() => {

                                        setMainPhoto(null);

                                        setPreview(null);

                                    }}
                                >
                                    ×
                                </button>

                            </div>

                        ) : (

                            <label className={styles.upload}>

                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={
                                        handlePhotoChange
                                    }
                                    disabled={loading}
                                />


                                <span>
                                    ↑
                                </span>


                                <strong>
                                    Завантажити фото
                                </strong>


                                <small>
                                    JPG, PNG, GIF · до 10 МБ
                                </small>

                            </label>

                        )}

                    </section>


                    {/* ================================= */}
                    {/* ACTIONS */}
                    {/* ================================= */}

                    <div className={styles.actions}>

                        <Link
                            href="/admin_cabinet/employees"
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
                                    Додати працівника
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