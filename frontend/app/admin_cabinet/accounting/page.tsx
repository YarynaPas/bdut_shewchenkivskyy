"use client";

import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import Link from "next/link";

import styles from "./AccountingAdmin.module.css";

import {
    AdminAccounting,
    AccountingTypeEnum,
    deleteAccounting,
    getAdminAccounting,
} from "@/services/accountingApi";


/* ================================================= */
/* ПІДКАТЕГОРІЇ */
/* ================================================= */

const DEFAULT_SUBCATEGORIES: Partial<
    Record<AccountingTypeEnum, string[]>
> = {

    [AccountingTypeEnum.Diyalnist]: [
        "Навчальна",
        "Виховна",
        "Методична",
        "Дистанційна робота",
    ],

    [AccountingTypeEnum.Ustanovchi_documents]: [
        "Звіти",
        "Висновки",
        "Положення",
        "Стратегія розвитку",
    ],

};


/* ================================================= */
/* COMPONENT */
/* ================================================= */

export default function AccountingAdminPage() {

    const [items, setItems] =
        useState<AdminAccounting[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    const [deletingId, setDeletingId] =
        useState<number | null>(null);

    const [category, setCategory] =
        useState<
            AccountingTypeEnum | ""
        >("");


    /* ================================================= */
    /* LOAD */
    /* ================================================= */

    const loadItems =
        useCallback(async () => {

            try {

                setLoading(true);

                setError("");

                const data =
                    await getAdminAccounting(
                        undefined,
                        category || undefined
                    );

                setItems(data);

            } catch (err) {

                console.error(err);

                setError(
                    err instanceof Error
                        ? err.message
                        : "Помилка завантаження"
                );

            } finally {

                setLoading(false);

            }

        }, [category]);


    useEffect(() => {

        loadItems();

    }, [loadItems]);


    /* ================================================= */
    /* DELETE */
    /* ================================================= */

    const handleDelete = async (
        item: AdminAccounting
    ) => {

        const confirmed =
            window.confirm(
                `Ви точно хочете видалити "${item.name}"?\n\nЦю дію неможливо скасувати.`
            );


        if (!confirmed) {

            return;

        }


        try {

            setDeletingId(item.id);

            setError("");

            setSuccess("");


            await deleteAccounting(
                item.id
            );


            setItems(
                previous =>
                    previous.filter(
                        current =>
                            current.id !==
                            item.id
                    )
            );


            setSuccess(
                `Документ "${item.name}" успішно видалено.`
            );


            setTimeout(() => {

                setSuccess("");

            }, 3000);


        } catch (err) {

            console.error(err);

            setError(
                err instanceof Error
                    ? err.message
                    : "Не вдалося видалити документ."
            );

        } finally {

            setDeletingId(null);

        }

    };


    /* ================================================= */
    /* FILE NAME */
    /* ================================================= */

    const getFileName = (
        file: string | null
    ) => {

        if (!file) {

            return "";

        }

        return (
            file
                .split("/")
                .pop() ||
            file
        );

    };


    /* ================================================= */
    /* FILE TYPE */
    /* ================================================= */

    const getFileType = (
        file: string | null
    ) => {

        if (!file) {

            return "";

        }


        const extension =
            file
                .split(".")
                .pop()
                ?.toLowerCase();


        return extension || "";

    };


    /* ================================================= */
    /* SUBCATEGORIES */
    /* ================================================= */

    const subcategories = useMemo(() => {

        if (!category) {

            return [];

        }


        const predefined =
            DEFAULT_SUBCATEGORIES[
                category
                ] || [];


        const databaseCategories =
            items
                .filter(
                    item =>
                        item.category ===
                        category
                )
                .map(
                    item =>
                        item.pid_category
                )
                .filter(
                    (
                        value
                    ): value is string =>
                        Boolean(
                            value &&
                            value.trim()
                        )
                );


        return Array.from(
            new Set([
                ...predefined,
                ...databaseCategories,
            ])
        );

    }, [
        category,
        items,
    ]);


    /* ================================================= */
    /* LOADING */
    /* ================================================= */

    if (loading) {

        return (

            <main
                className={
                    styles.page
                }
            >

                <div
                    className={
                        styles.loading
                    }
                >

                    <div
                        className={
                            styles.spinner
                        }
                    />

                    <span>
                        Завантаження документів...
                    </span>

                </div>

            </main>

        );

    }


    /* ================================================= */
    /* RENDER */
    /* ================================================= */

    return (

        <main
            className={
                styles.page
            }
        >

            <div
                className={
                    styles.container
                }
            >

                {/* ===================================== */}
                {/* HEADER */}
                {/* ===================================== */}

                <header
                    className={
                        styles.header
                    }
                >

                    <div>

                        <Link
                            href="/admin_cabinet"
                            className={
                                styles.back
                            }
                        >

                            ← Кабінет адміністратора

                        </Link>


                        <span
                            className={
                                styles.overline
                            }
                        >

                            КЕРУВАННЯ ДОКУМЕНТАМИ

                        </span>


                        <h1>

                            Звітність

                        </h1>


                        <p>

                            Керування діяльністю,
                            установчими документами,
                            атестацією та наказами.

                        </p>

                    </div>


                    <Link
                        href="/admin_cabinet/accounting/create"
                        className={
                            styles.addButton
                        }
                    >

                        <span>
                            +
                        </span>

                        Додати документ

                    </Link>

                </header>


                {/* ===================================== */}
                {/* CATEGORY FILTER */}
                {/* ===================================== */}

                <div
                    className={
                        styles.categoryPanel
                    }
                >

                    <div
                        className={
                            styles.categoryPanelHeader
                        }
                    >

                        <div>

                            <span
                                className={
                                    styles.filterLabel
                                }
                            >
                                ФІЛЬТР
                            </span>

                            <h2>
                                Категорія документів
                            </h2>

                        </div>

                    </div>


                    <div
                        className={
                            styles.categoryButtons
                        }
                    >

                        <button
                            type="button"
                            className={
                                category === ""
                                    ? styles.categoryButtonActive
                                    : styles.categoryButton
                            }
                            onClick={() =>
                                setCategory("")
                            }
                        >

                            Усі

                        </button>


                        {Object.values(
                            AccountingTypeEnum
                        ).map(
                            value => (

                                <button
                                    key={value}
                                    type="button"
                                    className={
                                        category === value
                                            ? styles.categoryButtonActive
                                            : styles.categoryButton
                                    }
                                    onClick={() =>
                                        setCategory(
                                            value
                                        )
                                    }
                                >

                                    {value}

                                </button>

                            )
                        )}

                    </div>

                </div>


                {/* ===================================== */}
                {/* SUBCATEGORY INFO */}
                {/* ===================================== */}

                {category && (

                    <div
                        className={
                            styles.subcategoryPanel
                        }
                    >

                        <div
                            className={
                                styles.subcategoryHeader
                            }
                        >

                            <div>

                                <span>
                                    ПІДКАТЕГОРІЇ
                                </span>

                                <h3>

                                    {category}

                                </h3>

                            </div>


                            <span
                                className={
                                    styles.subcategoryHint
                                }
                            >

                                Підкатегорію можна
                                вибрати зі списку або
                                створити власну під
                                час додавання документа.

                            </span>

                        </div>


                        {subcategories.length > 0 ? (

                            <div
                                className={
                                    styles.subcategoryList
                                }
                            >

                                {subcategories.map(
                                    subcategory => (

                                        <span
                                            key={
                                                subcategory
                                            }
                                            className={
                                                styles.subcategoryTag
                                            }
                                        >

                                            {subcategory}

                                        </span>

                                    )
                                )}

                            </div>

                        ) : (

                            <div
                                className={
                                    styles.noSubcategories
                                }
                            >

                                Для цієї категорії
                                ще немає підкатегорій.

                                <br />

                                Її можна буде
                                ввести вручну
                                при створенні документа.

                            </div>

                        )}

                    </div>

                )}


                {/* ===================================== */}
                {/* ERROR */}
                {/* ===================================== */}

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
                            onClick={
                                loadItems
                            }
                        >

                            Повторити

                        </button>

                    </div>

                )}


                {/* ===================================== */}
                {/* SUCCESS */}
                {/* ===================================== */}

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


                {/* ===================================== */}
                {/* EMPTY */}
                {/* ===================================== */}

                {!error &&
                items.length === 0 ? (

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

                            📄

                        </div>


                        <h2>

                            Документів немає

                        </h2>


                        <p>

                            Додайте перший документ
                            до звітності.

                        </p>


                        <Link
                            href="/admin_cabinet/accounting/create"
                            className={
                                styles.emptyButton
                            }
                        >

                            + Додати документ

                        </Link>

                    </div>

                ) : (

                    <section
                        className={
                            styles.list
                        }
                    >

                        {items.map(
                            item => (

                                <article
                                    key={
                                        item.id
                                    }
                                    className={
                                        styles.card
                                    }
                                >

                                    {/* FILE */}

                                    <div
                                        className={
                                            styles.fileIcon
                                        }
                                    >

                                        <span>

                                            {
                                                getFileType(
                                                    item.photos
                                                ) === "pdf"
                                                    ? "PDF"
                                                    : "DOC"
                                            }

                                        </span>

                                    </div>


                                    {/* INFO */}

                                    <div
                                        className={
                                            styles.info
                                        }
                                    >

                                        <div
                                            className={
                                                styles.topRow
                                            }
                                        >

                                            <span
                                                className={
                                                    styles.category
                                                }
                                            >

                                                {
                                                    item.category
                                                }

                                            </span>


                                            {item.year && (

                                                <span
                                                    className={
                                                        styles.year
                                                    }
                                                >

                                                    {
                                                        item.year
                                                    }

                                                </span>

                                            )}

                                        </div>


                                        <h2>

                                            {
                                                item.name
                                            }

                                        </h2>


                                        {item.pid_category && (

                                            <p
                                                className={
                                                    styles.subcategory
                                                }
                                            >

                                                {
                                                    item.pid_category
                                                }

                                            </p>

                                        )}


                                        {item.photos && (

                                            <span
                                                className={
                                                    styles.fileName
                                                }
                                            >

                                                📎{" "}

                                                {
                                                    getFileName(
                                                        item.photos
                                                    )
                                                }

                                            </span>

                                        )}

                                    </div>


                                    {/* ACTIONS */}

                                    <div
                                        className={
                                            styles.actions
                                        }
                                    >

                                        {item.photos && (

                                            <a
                                                href={
                                                    item.photos
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={
                                                    styles.view
                                                }
                                            >

                                                Відкрити

                                            </a>

                                        )}


                                        <Link
                                            href={
                                                `/admin_cabinet/accounting/${item.id}/edit`
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
                                                item.id
                                            }
                                            onClick={() =>
                                                handleDelete(
                                                    item
                                                )
                                            }
                                        >

                                            {deletingId ===
                                            item.id
                                                ? "Видалення..."
                                                : "🗑 Видалити"}

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