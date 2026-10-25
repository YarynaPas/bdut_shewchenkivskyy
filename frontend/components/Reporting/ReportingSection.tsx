"use client";

import Image from "next/image";
import {
    useEffect,
    useMemo,
    useState,
} from "react";

import styles from "./ReportingSection.module.css";

import {
    AccountingTypeEnum,
} from "@/interfaces/AccountingTypeEnum";


/* ================================================= */
/* INTERFACE */
/* ================================================= */

export interface AccountingItem {

    id: number;

    name: string;

    category: AccountingTypeEnum;

    pid_category: string | null;

    year: number;

    date: string;

    photos: string | null;

}


/* ================================================= */
/* ЗАХАРДКОДЖЕНІ ПІДКАТЕГОРІЇ */
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

        "Положення",

        "Стратегії розвитку",

        "Інші установчі документи",

    ],

};


/* ================================================= */
/* COMPONENT */
/* ================================================= */

export default function ReportingSection() {

    const [loading, setLoading] =
        useState(true);


    const [items, setItems] =
        useState<AccountingItem[]>([]);


    /* ============================================= */
    /* ACTIVE CATEGORY */
    /* ============================================= */

    const categories =
        Object.values(
            AccountingTypeEnum
        );


    const [activeCategory, setActiveCategory] =
        useState<AccountingTypeEnum>(
            categories[0]
        );


    /* ============================================= */
    /* ACTIVE SUBCATEGORY */
    /* ============================================= */

    const [activeSubcategory, setActiveSubcategory] =
        useState("");


    /* ============================================= */
    /* FILE URL */
    /* ============================================= */

    const getFileUrl = (
        filePath: string | null
    ): string => {

        if (!filePath) {

            return "#";

        }


        if (
            filePath.startsWith("http")
        ) {

            return filePath;

        }


        const base =
            process.env
                .NEXT_PUBLIC_API_URL
                ?.replace(/\/$/, "")
            || "";


        return `${base}${
            filePath.startsWith("/")
                ? filePath
                : `/${filePath}`
        }`;

    };


    /* ============================================= */
    /* LOAD */
    /* ============================================= */

    useEffect(() => {

        const loadAccounting =
            async () => {

                try {

                    const response =
                        await fetch(
                            `${process.env.NEXT_PUBLIC_API_URL}/accounting`
                        );


                    if (!response.ok) {

                        throw new Error(
                            "Не вдалося завантажити документи"
                        );

                    }


                    const data =
                        await response.json();


                    if (
                        Array.isArray(data)
                    ) {

                        setItems(data);

                    } else {

                        setItems([]);

                    }

                } catch (error) {

                    console.error(
                        "Accounting error:",
                        error
                    );

                    setItems([]);

                } finally {

                    setLoading(false);

                }

            };


        loadAccounting();

    }, []);


    /* ============================================= */
    /* SUBCATEGORIES */
    /* ============================================= */

    const subcategories =
        useMemo(() => {

            /*
             * 1. Беремо захардкоджені
             * підкатегорії.
             */

            const predefined =
                DEFAULT_SUBCATEGORIES[
                    activeCategory
                    ] || [];


            /*
             * 2. Беремо підкатегорії,
             * які реально прийшли з БД.
             */

            const fromDatabase =
                items
                    .filter(
                        item =>
                            item.category ===
                            activeCategory
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


            /*
             * 3. Об'єднуємо.
             *
             * Set прибирає дублікати.
             */

            return Array.from(
                new Set([
                    ...predefined,
                    ...fromDatabase,
                ])
            );

        }, [
            activeCategory,
            items,
        ]);


    /* ============================================= */
    /* RESET SUBCATEGORY */
    /* ============================================= */

    useEffect(() => {

        setActiveSubcategory("");

    }, [
        activeCategory,
    ]);


    /* ============================================= */
    /* FILTER DOCUMENTS */
    /* ============================================= */

    const filtered =
        useMemo(() => {

            return items.filter(
                item => {

                    /*
                     * Основна категорія
                     */

                    if (
                        item.category !==
                        activeCategory
                    ) {

                        return false;

                    }


                    /*
                     * Якщо підкатегорію
                     * не вибрано —
                     * показуємо всі документи.
                     */

                    if (
                        !activeSubcategory
                    ) {

                        return true;

                    }


                    /*
                     * Фільтр підкатегорії.
                     */

                    return (
                        item.pid_category ===
                        activeSubcategory
                    );

                }
            );

        }, [
            items,
            activeCategory,
            activeSubcategory,
        ]);


    /* ============================================= */
    /* GROUP BY YEAR */
    /* ============================================= */

    const grouped =
        useMemo(() => {

            return filtered.reduce(
                (
                    result,
                    item
                ) => {

                    const year =
                        item.year ||
                        new Date(
                            item.date
                        ).getFullYear();


                    if (!result[year]) {

                        result[year] = [];

                    }


                    result[year].push(
                        item
                    );


                    return result;

                },
                {} as Record<
                    number,
                    AccountingItem[]
                >
            );

        }, [
            filtered,
        ]);


    /* ============================================= */
    /* YEARS */
    /* ============================================= */

    const years =
        Object.keys(grouped)
            .map(Number)
            .sort(
                (a, b) =>
                    b - a
            );


    /* ============================================= */
    /* CHANGE CATEGORY */
    /* ============================================= */

    const handleCategoryChange = (
        category: AccountingTypeEnum
    ) => {

        setActiveCategory(
            category
        );

        setActiveSubcategory("");

    };


    /* ============================================= */
    /* LOADING */
    /* ============================================= */

    if (loading) {

        return (

            <section
                className={
                    styles.loading
                }
            >

                Завантаження...

            </section>

        );

    }


    /* ============================================= */
    /* RENDER */
    /* ============================================= */

    return (

        <section
            className={
                styles.section
            }
        >

            <div
                className={
                    styles.container
                }
            >

                {/* ================================= */}
                {/* CATEGORIES */}
                {/* ================================= */}

                <div
                    className={
                        styles.categoryTabs
                    }
                >

                    {categories.map(
                        category => {

                            const active =
                                activeCategory ===
                                category;


                            return (

                                <button
                                    key={
                                        category
                                    }
                                    type="button"
                                    className={`
                                        ${styles.categoryTab}
                                        ${
                                        active
                                            ? styles.categoryActive
                                            : ""
                                    }
                                    `}
                                    onClick={() =>
                                        handleCategoryChange(
                                            category
                                        )
                                    }
                                >

                                    {category}


                                    <span
                                        className={
                                            styles.categoryArrow
                                        }
                                    >

                                        {active
                                            ? "⌃"
                                            : "›"}

                                    </span>

                                </button>

                            );

                        }
                    )}

                </div>


                {/* ================================= */}
                {/* SUBCATEGORIES */}
                {/* ================================= */}

                {subcategories.length > 0 && (

                    <div
                        className={
                            styles.subcategoryWrapper
                        }
                    >

                        <div
                            className={
                                styles.subcategoryTitle
                            }
                        >

                            {activeCategory}

                        </div>


                        <div
                            className={
                                styles.subcategoryList
                            }
                        >

                            <button
                                type="button"
                                className={`
                                    ${styles.subcategory}
                                    ${
                                    activeSubcategory === ""
                                        ? styles.subcategoryActive
                                        : ""
                                }
                                `}
                                onClick={() =>
                                    setActiveSubcategory(
                                        ""
                                    )
                                }
                            >

                                Усі документи

                            </button>


                            {subcategories.map(
                                subcategory => (

                                    <button
                                        key={
                                            subcategory
                                        }
                                        type="button"
                                        className={`
                                            ${styles.subcategory}
                                            ${
                                            activeSubcategory ===
                                            subcategory
                                                ? styles.subcategoryActive
                                                : ""
                                        }
                                        `}
                                        onClick={() =>
                                            setActiveSubcategory(
                                                subcategory
                                            )
                                        }
                                    >

                                        {subcategory}

                                    </button>

                                )
                            )}

                        </div>

                    </div>

                )}


                {/* ================================= */}
                {/* TITLE */}
                {/* ================================= */}

                <div
                    className={
                        styles.contentHeader
                    }
                >

                    <h2
                        className={
                            styles.title
                        }
                    >

                        {activeSubcategory ||
                            activeCategory}

                    </h2>


                    <span
                        className={
                            styles.count
                        }
                    >

                        {filtered.length}{" "}
                        {filtered.length === 1
                            ? "документ"
                            : "документів"}

                    </span>

                </div>


                {/* ================================= */}
                {/* EMPTY */}
                {/* ================================= */}

                {years.length === 0 ? (

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

                            <Image
                                src="/icons8-document-100.png"
                                alt=""
                                width={54}
                                height={54}
                            />

                        </div>


                        <h3>

                            Документів поки що немає

                        </h3>


                        <p>

                            У цій категорії ще
                            не додано документів.

                        </p>

                    </div>

                ) : (

                    /* ================================= */
                    /* YEARS */
                    /* ================================= */

                    years.map(
                        year => (

                            <section
                                key={
                                    year
                                }
                                className={
                                    styles.yearBlock
                                }
                            >

                                <div
                                    className={
                                        styles.yearHeader
                                    }
                                >

                                    <span
                                        className={
                                            styles.yearBadge
                                        }
                                    >

                                        {year}

                                    </span>


                                    <span
                                        className={
                                            styles.yearText
                                        }
                                    >

                                        рік

                                    </span>


                                    <div
                                        className={
                                            styles.yearLine
                                        }
                                    />

                                </div>


                                <div
                                    className={
                                        styles.list
                                    }
                                >

                                    {grouped[
                                        year
                                        ].map(
                                        item => {

                                            const fileUrl =
                                                getFileUrl(
                                                    item.photos
                                                );


                                            return (

                                                <a
                                                    key={
                                                        item.id
                                                    }
                                                    href={
                                                        fileUrl
                                                    }
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={
                                                        styles.row
                                                    }
                                                >

                                                    <div
                                                        className={
                                                            styles.fileIcon
                                                        }
                                                    >

                                                        <Image
                                                            src="/icons8-document-100.png"
                                                            alt=""
                                                            width={
                                                                40
                                                            }
                                                            height={
                                                                40
                                                            }
                                                        />

                                                    </div>


                                                    <div
                                                        className={
                                                            styles.fileInfo
                                                        }
                                                    >

                                                        <h4>

                                                            {
                                                                item.name
                                                            }

                                                        </h4>


                                                        <span>

                                                            {
                                                                item.date
                                                            }

                                                        </span>

                                                    </div>


                                                    {item.pid_category && (

                                                        <span
                                                            className={
                                                                styles.badge
                                                            }
                                                        >

                                                            {
                                                                item.pid_category
                                                            }

                                                        </span>

                                                    )}


                                                    <div
                                                        className={
                                                            styles.download
                                                        }
                                                    >

                                                        →

                                                    </div>

                                                </a>

                                            );

                                        }
                                    )}

                                </div>

                            </section>

                        )
                    )

                )}

            </div>

        </section>

    );

}