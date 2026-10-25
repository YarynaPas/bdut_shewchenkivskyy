"use client";

import {
    ChangeEvent,
    FormEvent,
    useEffect,
    useState,
} from "react";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import styles from "./EditEmployee.module.css";

import {
    AdminEmployee,
    getAdminEmployeeById,
    updateEmployee,
} from "@/services/employeesApi";


export default function EditEmployeePage() {

    const params = useParams();
    const router = useRouter();

    const id = Number(params.id);


    /* ========================================= */
    /* DATA */
    /* ========================================= */

    const [employee, setEmployee] =
        useState<AdminEmployee | null>(null);


    /* ========================================= */
    /* FORM */
    /* ========================================= */

    const [fullName, setFullName] =
        useState("");

    const [position, setPosition] =
        useState("");


    /* ========================================= */
    /* PHOTO */
    /* ========================================= */

    const [mainPhoto, setMainPhoto] =
        useState<File | null>(null);

    const [preview, setPreview] =
        useState<string | null>(null);


    /* ========================================= */
    /* STATE */
    /* ========================================= */

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    /* ========================================= */
    /* IMAGE URL */
    /* ========================================= */

    const getImageUrl = (
        image: string | null | undefined
    ): string => {

        if (!image) {

            return "/placeholder.png";

        }


        if (
            image.startsWith("http://") ||
            image.startsWith("https://")
        ) {

            return image;

        }


        const apiUrl =
            process.env.NEXT_PUBLIC_API_URL
                ?.replace(/\/$/, "");


        if (!apiUrl) {

            return image;

        }


        return `${apiUrl}${
            image.startsWith("/")
                ? image
                : `/${image}`
        }`;

    };


    /* ========================================= */
    /* LOAD EMPLOYEE */
    /* ========================================= */

    useEffect(() => {

        if (
            !id ||
            Number.isNaN(id)
        ) {

            setError(
                "Некоректний ID працівника."
            );

            setLoading(false);

            return;

        }


        const loadEmployee =
            async () => {

                try {

                    setError("");


                    const data =
                        await getAdminEmployeeById(
                            id
                        );


                    setEmployee(
                        data
                    );


                    setFullName(
                        data.full_name || ""
                    );


                    setPosition(
                        data.position || ""
                    );


                    setPreview(
                        getImageUrl(
                            data.main_photo
                        )
                    );

                } catch (err) {

                    console.error(
                        "Load employee error:",
                        err
                    );


                    setError(
                        err instanceof Error
                            ? err.message
                            : "Не вдалося завантажити працівника."
                    );

                } finally {

                    setLoading(false);

                }

            };


        loadEmployee();

    }, [id]);


    /* ========================================= */
    /* PHOTO CHANGE */
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
            !file.type.startsWith(
                "image/"
            )
        ) {

            setError(
                "Фото повинно бути зображенням."
            );

            return;

        }


        if (
            file.size >
            10 * 1024 * 1024
        ) {

            setError(
                "Розмір фото не може перевищувати 10 МБ."
            );

            return;

        }


        setError("");

        setMainPhoto(
            file
        );


        setPreview(
            URL.createObjectURL(
                file
            )
        );

    };


    /* ========================================= */
    /* CANCEL NEW PHOTO */
    /* ========================================= */

    const cancelNewPhoto = () => {

        setMainPhoto(
            null
        );


        if (employee?.main_photo) {

            setPreview(
                getImageUrl(
                    employee.main_photo
                )
            );

        } else {

            setPreview(
                null
            );

        }

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
        /* VALIDATION */
        /* ================================= */

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


        try {

            setSaving(
                true
            );


            await updateEmployee(
                id,
                {

                    full_name:
                        fullName.trim(),

                    position:
                        position.trim(),

                    main_photo:
                    mainPhoto,

                }
            );


            setSuccess(
                "Дані працівника успішно оновлено."
            );


            setTimeout(() => {

                router.push(
                    "/admin_cabinet/employees"
                );

            }, 700);

        } catch (err) {

            console.error(
                "Update employee error:",
                err
            );


            setError(
                err instanceof Error
                    ? err.message
                    : "Не вдалося оновити працівника."
            );

        } finally {

            setSaving(
                false
            );

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
                        className={styles.spinner}
                    />

                    <span>
                        Завантаження працівника...
                    </span>

                </div>

            </main>

        );

    }


    /* ========================================= */
    /* NOT FOUND */
    /* ========================================= */

    if (!employee) {

        return (

            <main className={styles.page}>

                <div className={styles.notFound}>

                    <div
                        className={
                            styles.notFoundIcon
                        }
                    >
                        !
                    </div>


                    <h1>
                        Працівника не знайдено
                    </h1>


                    <p>
                        {error}
                    </p>


                    <Link
                        href="/admin_cabinet/employees"
                        className={
                            styles.backButton
                        }
                    >
                        ← До працівників
                    </Link>

                </div>

            </main>

        );

    }


    return (

        <main className={styles.page}>

            <div className={styles.container}>

                {/* ================================= */}
                {/* HEADER */}
                {/* ================================= */}

                <header
                    className={styles.header}
                >

                    <Link
                        href="/admin_cabinet/employees"
                        className={styles.back}
                    >
                        ← Назад до працівників
                    </Link>


                    <span
                        className={
                            styles.overline
                        }
                    >
                        КЕРУВАННЯ ПРАЦІВНИКАМИ
                    </span>


                    <h1>
                        Редагувати працівника
                    </h1>


                    <p>
                        Змініть ПІБ, посаду або
                        фотографію.
                    </p>

                </header>


                {/* ================================= */}
                {/* ERROR */}
                {/* ================================= */}

                {error && (

                    <div className={styles.error}>

                        <span>
                            !
                        </span>


                        <p>
                            {error}
                        </p>

                    </div>

                )}


                {/* ================================= */}
                {/* SUCCESS */}
                {/* ================================= */}

                {success && (

                    <div className={styles.success}>

                        <span>
                            ✓
                        </span>


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

                        <div
                            className={
                                styles.cardHeader
                            }
                        >

                            <div
                                className={
                                    styles.number
                                }
                            >
                                01
                            </div>


                            <div>

                                <h2>
                                    Інформація
                                </h2>


                                <p>
                                    Основні дані
                                    працівника.
                                </p>

                            </div>

                        </div>


                        {/* FULL NAME */}

                        <div
                            className={
                                styles.field
                            }
                        >

                            <div
                                className={
                                    styles.labelRow
                                }
                            >

                                <label>
                                    ПІБ
                                </label>


                                <span
                                    className={
                                        styles.required
                                    }
                                >
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
                                disabled={saving}
                            />

                        </div>


                        {/* POSITION */}

                        <div
                            className={
                                styles.field
                            }
                        >

                            <div
                                className={
                                    styles.labelRow
                                }
                            >

                                <label>
                                    Посада
                                </label>


                                <span
                                    className={
                                        styles.required
                                    }
                                >
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
                                placeholder="Наприклад: Керівник гуртка"
                                disabled={saving}
                            />

                        </div>

                    </section>


                    {/* ================================= */}
                    {/* PHOTO */}
                    {/* ================================= */}

                    <section className={styles.card}>

                        <div
                            className={
                                styles.cardHeader
                            }
                        >

                            <div
                                className={
                                    styles.number
                                }
                            >
                                02
                            </div>


                            <div>

                                <h2>
                                    Фотографія
                                </h2>


                                <p>
                                    Поточне або нове фото
                                    працівника.
                                </p>

                            </div>

                        </div>


                        <div
                            className={
                                styles.labelRow
                            }
                        >

                            <label>
                                Основне фото
                            </label>


                            <span
                                className={
                                    styles.required
                                }
                            >
                                Обов'язкове
                            </span>

                        </div>


                        {preview && (

                            <div
                                className={
                                    styles.preview
                                }
                            >

                                <img
                                    src={
                                        preview
                                    }
                                    alt={
                                        fullName
                                    }
                                />


                                {mainPhoto && (

                                    <>
                                        <span
                                            className={
                                                styles.newBadge
                                            }
                                        >
                                            НОВЕ
                                        </span>


                                        <button
                                            type="button"
                                            className={
                                                styles.cancelPhoto
                                            }
                                            onClick={
                                                cancelNewPhoto
                                            }
                                            disabled={
                                                saving
                                            }
                                        >
                                            ×
                                        </button>

                                    </>

                                )}

                            </div>

                        )}


                        <label
                            className={
                                styles.upload
                            }
                        >

                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/gif"
                                onChange={
                                    handlePhotoChange
                                }
                                disabled={saving}
                            />


                            <span>
                                ↑
                            </span>


                            <strong>
                                Замінити фото
                            </strong>


                            <small>
                                JPG, PNG або GIF · до 10 МБ
                            </small>

                        </label>

                    </section>


                    {/* ================================= */}
                    {/* ACTIONS */}
                    {/* ================================= */}

                    <div
                        className={
                            styles.actions
                        }
                    >

                        <Link
                            href="/admin_cabinet/employees"
                            className={
                                styles.cancel
                            }
                        >
                            Скасувати
                        </Link>


                        <button
                            type="submit"
                            className={
                                styles.save
                            }
                            disabled={
                                saving
                            }
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