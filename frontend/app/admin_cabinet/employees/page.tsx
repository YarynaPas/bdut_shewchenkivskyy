"use client";

import {
    useCallback,
    useEffect,
    useState,
} from "react";

import Link from "next/link";

import styles from "./EmployeesAdmin.module.css";

import {
    AdminEmployee,
    deleteEmployee,
    getAdminEmployees,
} from "@/services/employeesApi";


export default function EmployeesAdminPage() {

    const [employees, setEmployees] =
        useState<AdminEmployee[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    const [deletingId, setDeletingId] =
        useState<number | null>(null);


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
    /* LOAD */
    /* ========================================= */

    const loadEmployees =
        useCallback(async () => {

            try {

                setLoading(true);

                setError("");

                const data =
                    await getAdminEmployees();

                setEmployees(data);

            } catch (err) {

                console.error(
                    "Load employees error:",
                    err
                );

                setError(
                    err instanceof Error
                        ? err.message
                        : "Не вдалося завантажити працівників."
                );

            } finally {

                setLoading(false);

            }

        }, []);


    useEffect(() => {

        loadEmployees();

    }, [loadEmployees]);


    /* ========================================= */
    /* DELETE */
    /* ========================================= */

    const handleDelete = async (
        employee: AdminEmployee
    ) => {

        const confirmed =
            window.confirm(
                `Ви точно хочете видалити працівника "${employee.full_name}"?\n\nЦю дію неможливо скасувати.`
            );


        if (!confirmed) {

            return;

        }


        try {

            setDeletingId(
                employee.id
            );

            setError("");

            setSuccess("");


            await deleteEmployee(
                employee.id
            );


            setEmployees(
                previous =>
                    previous.filter(
                        item =>
                            item.id !== employee.id
                    )
            );


            setSuccess(
                `Працівника "${employee.full_name}" успішно видалено.`
            );


            setTimeout(() => {

                setSuccess("");

            }, 3000);

        } catch (err) {

            console.error(
                "Delete employee error:",
                err
            );


            setError(
                err instanceof Error
                    ? err.message
                    : "Не вдалося видалити працівника."
            );

        } finally {

            setDeletingId(
                null
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
                        Завантаження працівників...
                    </span>

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

                    <div>

                        <Link
                            href="/admin_cabinet"
                            className={styles.back}
                        >
                            ← Кабінет адміністратора
                        </Link>


                        <span
                            className={
                                styles.overline
                            }
                        >
                            КЕРУВАННЯ КОНТЕНТОМ
                        </span>


                        <h1>
                            Працівники
                        </h1>


                        <p>
                            Додавайте, редагуйте та
                            видаляйте працівників закладу.
                        </p>

                    </div>


                    <Link
                        href={
                            "/admin_cabinet/employees/create"
                        }
                        className={
                            styles.addButton
                        }
                    >

                        <span>
                            +
                        </span>

                        Додати працівника

                    </Link>

                </header>


                {/* ================================= */}
                {/* ERROR */}
                {/* ================================= */}

                {error && (

                    <div
                        className={
                            styles.error
                        }
                    >

                        <span>
                            !
                        </span>


                        <p>
                            {error}
                        </p>


                        <button
                            type="button"
                            onClick={() => {

                                setError("");

                                loadEmployees();

                            }}
                        >
                            Повторити
                        </button>

                    </div>

                )}


                {/* ================================= */}
                {/* SUCCESS */}
                {/* ================================= */}

                {success && (

                    <div
                        className={
                            styles.success
                        }
                    >

                        <span>
                            ✓
                        </span>


                        <p>
                            {success}
                        </p>

                    </div>

                )}


                {/* ================================= */}
                {/* EMPTY */}
                {/* ================================= */}

                {!error &&
                employees.length === 0 ? (

                    <div
                        className={
                            styles.empty
                        }
                    >

                        <div
                            className={
                                styles.emptyIcon
                            }
                        >
                            👤
                        </div>


                        <h2>
                            Працівників поки немає
                        </h2>


                        <p>
                            Додайте першого працівника
                            до сайту.
                        </p>


                        <Link
                            href={
                                "/admin_cabinet/employees/create"
                            }
                            className={
                                styles.emptyButton
                            }
                        >
                            + Додати працівника
                        </Link>

                    </div>

                ) : (

                    /* ================================= */
                    /* EMPLOYEES */
                    /* ================================= */

                    <section
                        className={
                            styles.grid
                        }
                    >

                        {employees.map(
                            employee => (

                                <article
                                    key={
                                        employee.id
                                    }
                                    className={
                                        styles.card
                                    }
                                >

                                    {/* PHOTO */}

                                    <div
                                        className={
                                            styles.photo
                                        }
                                    >

                                        <img
                                            src={
                                                getImageUrl(
                                                    employee.main_photo
                                                )
                                            }
                                            alt={
                                                employee.full_name
                                            }
                                        />

                                    </div>


                                    {/* INFO */}

                                    <div
                                        className={
                                            styles.info
                                        }
                                    >

                                        <span
                                            className={
                                                styles.id
                                            }
                                        >
                                            #{employee.id}
                                        </span>


                                        <h2>
                                            {
                                                employee.full_name
                                            }
                                        </h2>


                                        <p>
                                            {
                                                employee.position
                                            }
                                        </p>

                                    </div>


                                    {/* ACTIONS */}

                                    <div
                                        className={
                                            styles.actions
                                        }
                                    >

                                        <Link
                                            href={
                                                `/admin_cabinet/employees/${employee.id}/edit`
                                            }
                                            className={
                                                styles.edit
                                            }
                                        >
                                            ✎ Редагувати
                                        </Link>


                                        <button
                                            type="button"
                                            className={
                                                styles.delete
                                            }
                                            disabled={
                                                deletingId ===
                                                employee.id
                                            }
                                            onClick={() =>
                                                handleDelete(
                                                    employee
                                                )
                                            }
                                        >

                                            {deletingId ===
                                            employee.id ? (

                                                <>
                                                    <span
                                                        className={
                                                            styles.deleteSpinner
                                                        }
                                                    />

                                                    Видалення...
                                                </>

                                            ) : (

                                                <>
                                                    🗑 Видалити
                                                </>

                                            )}

                                        </button>

                                    </div>

                                </article>

                            )
                        )}

                    </section>

                )}

            </div>

        </main>

    );

}