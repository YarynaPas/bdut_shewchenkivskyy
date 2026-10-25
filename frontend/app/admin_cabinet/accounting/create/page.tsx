"use client";

import {
    ChangeEvent,
    FormEvent,
    useState,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import styles from "./CreateAccounting.module.css";

import {
    AccountingTypeEnum,
    createAccounting,
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

export default function CreateAccountingPage() {
    const router = useRouter();


    /* ========================= */
    /* STATE */
    /* ========================= */

    const [category, setCategory] =
        useState<AccountingTypeEnum>(
            AccountingTypeEnum.Diyalnist
        );

    const [subcategory, setSubcategory] =
        useState("");

    const [useCustomSubcategory, setUseCustomSubcategory] =
        useState(false);

    const [name, setName] =
        useState("");

    const [year, setYear] =
        useState(String(new Date().getFullYear()));

    const [date, setDate] =
        useState("");

    const [file, setFile] =
        useState<File | null>(null);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    /* ========================= */
    /* ПІДКАТЕГОРІЇ */
    /* ========================= */

    const subcategories =
        DEFAULT_SUBCATEGORIES[category] || [];


    /* ========================= */
    /* CATEGORY CHANGE */
    /* ========================= */

    const handleCategoryChange = (
        value: AccountingTypeEnum
    ) => {
        setCategory(value);

        setSubcategory("");

        setUseCustomSubcategory(false);
    };


    /* ========================= */
    /* FILE CHANGE */
    /* ========================= */

    const handleFileChange = (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        const selectedFile =
            event.target.files?.[0];

        if (!selectedFile) {
            setFile(null);
            return;
        }

        setError("");

        /* Максимум 10 МБ */
        if (
            selectedFile.size >
            10 * 1024 * 1024
        ) {
            setError(
                "Максимальний розмір файлу — 10 МБ"
            );

            event.target.value = "";
            setFile(null);

            return;
        }

        setFile(selectedFile);
    };


    /* ========================= */
    /* REMOVE FILE */
    /* ========================= */

    const removeFile = () => {
        setFile(null);
    };


    /* ========================= */
    /* SUBMIT */
    /* ========================= */

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        setError("");
        setSuccess("");


        /* CATEGORY */

        if (!category) {
            setError(
                "Оберіть категорію документа"
            );

            return;
        }


        /* NAME */

        if (!name.trim()) {
            setError(
                "Введіть назву документа"
            );

            return;
        }


        /* FILE */

        if (!file) {
            setError(
                "Файл документа є обов'язковим"
            );

            return;
        }


        /* YEAR */

        let parsedYear: number | undefined;

        if (year.trim()) {
            parsedYear = Number(year);

            if (
                !Number.isInteger(parsedYear) ||
                parsedYear < 1900 ||
                parsedYear > 2100
            ) {
                setError(
                    "Рік повинен бути числом від 1900 до 2100"
                );

                return;
            }
        }


        /* SUBCATEGORY */

        const finalSubcategory =
            subcategory.trim();


        try {
            setLoading(true);


            await createAccounting({
                category,
                name: name.trim(),

                pid_category:
                    finalSubcategory ||
                    undefined,

                year: parsedYear,

                date:
                    date ||
                    undefined,

                file,
            });


            setSuccess(
                "Документ успішно додано"
            );


            setTimeout(() => {
                router.push(
                    "/admin_cabinet/accounting"
                );

                router.refresh();
            }, 500);

        } catch (error) {
            console.error(
                "Помилка створення документа:",
                error
            );

            setError(
                error instanceof Error
                    ? error.message
                    : "Не вдалося додати документ"
            );

        } finally {
            setLoading(false);
        }
    };


    /* ================================================= */
    /* RENDER */
    /* ================================================= */

    return (
        <main className={styles.page}>

            <div className={styles.container}>

                {/* ================= HEADER ================= */}

                <header className={styles.header}>

                    <Link
                        href="/admin_cabinet/accounting"
                        className={styles.back}
                    >
                        ← Назад до документів
                    </Link>


                    <span className={styles.overline}>
                        КЕРУВАННЯ ДОКУМЕНТАМИ
                    </span>


                    <h1>
                        Додати документ
                    </h1>


                    <p>
                        Додайте новий документ
                        до розділу звітності.
                    </p>

                </header>


                {/* ================= ERROR ================= */}

                {error && (
                    <div className={styles.error}>

                        <span className={styles.errorIcon}>
                            !
                        </span>

                        <p>
                            {error}
                        </p>

                    </div>
                )}


                {/* ================= SUCCESS ================= */}

                {success && (
                    <div className={styles.success}>

                        <span className={styles.successIcon}>
                            ✓
                        </span>

                        <p>
                            {success}
                        </p>

                    </div>
                )}


                {/* ================= FORM ================= */}

                <form
                    className={styles.form}
                    onSubmit={handleSubmit}
                >

                    {/* ================= CARD 01 ================= */}

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
                                    Дані документа.
                                </p>
                            </div>

                        </div>


                        {/* CATEGORY */}

                        <div className={styles.field}>

                            <div className={styles.labelRow}>

                                <label htmlFor="category">
                                    Категорія
                                </label>

                                <span className={styles.required}>
                                    Обов'язкове
                                </span>

                            </div>


                            <select
                                id="category"
                                value={category}
                                onChange={(event) =>
                                    handleCategoryChange(
                                        event.target.value as AccountingTypeEnum
                                    )
                                }
                                className={styles.select}
                            >

                                {Object.values(
                                    AccountingTypeEnum
                                ).map((item) => (
                                    <option
                                        key={item}
                                        value={item}
                                    >
                                        {item}
                                    </option>
                                ))}

                            </select>

                        </div>


                        {/* SUBCATEGORY */}

                        <div className={styles.field}>

                            <div className={styles.labelRow}>

                                <label htmlFor="subcategory">
                                    Підкатегорія
                                </label>

                                <span className={styles.optional}>
                                    Необов'язкове
                                </span>

                            </div>


                            {/* SELECT */}

                            {!useCustomSubcategory && (
                                <select
                                    id="subcategory"
                                    value={subcategory}
                                    onChange={(event) =>
                                        setSubcategory(
                                            event.target.value
                                        )
                                    }
                                    className={styles.select}
                                >

                                    <option value="">
                                        Оберіть підкатегорію
                                    </option>


                                    {subcategories.map(
                                        (item) => (
                                            <option
                                                key={item}
                                                value={item}
                                            >
                                                {item}
                                            </option>
                                        )
                                    )}

                                </select>
                            )}


                            {/* CUSTOM CHECKBOX */}

                            <label
                                className={styles.customToggle}
                            >

                                <input
                                    type="checkbox"
                                    checked={
                                        useCustomSubcategory
                                    }
                                    onChange={(event) => {

                                        const checked =
                                            event.target.checked;

                                        setUseCustomSubcategory(
                                            checked
                                        );

                                        if (checked) {
                                            setSubcategory("");
                                        }

                                    }}
                                />

                                <span>
                                    Ввести власну
                                    підкатегорію
                                </span>

                            </label>


                            {/* CUSTOM INPUT */}

                            {useCustomSubcategory && (
                                <input
                                    type="text"
                                    value={subcategory}
                                    onChange={(event) =>
                                        setSubcategory(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Наприклад: Інші документи"
                                    className={styles.input}
                                />
                            )}


                            <span className={styles.help}>
                                Можна вибрати готову
                                підкатегорію або
                                ввести власну.
                            </span>

                        </div>


                        {/* NAME */}

                        <div className={styles.field}>

                            <div className={styles.labelRow}>

                                <label htmlFor="name">
                                    Назва документа
                                </label>

                                <span className={styles.required}>
                                    Обов'язкове
                                </span>

                            </div>


                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(event) =>
                                    setName(
                                        event.target.value
                                    )
                                }
                                placeholder="Наприклад: Річний звіт"
                                className={styles.input}
                            />

                        </div>


                        {/* YEAR */}

                        <div className={styles.field}>

                            <div className={styles.labelRow}>

                                <label htmlFor="year">
                                    Рік
                                </label>

                                <span className={styles.optional}>
                                    Необов'язкове
                                </span>

                            </div>


                            <input
                                id="year"
                                type="number"
                                value={year}
                                onChange={(event) =>
                                    setYear(
                                        event.target.value
                                    )
                                }
                                min="1900"
                                max="2100"
                                placeholder="2026"
                                className={styles.input}
                            />

                        </div>


                        {/* DATE */}

                        <div className={styles.field}>

                            <div className={styles.labelRow}>

                                <label htmlFor="date">
                                    Дата документа
                                </label>

                                <span className={styles.optional}>
                                    Необов'язкове
                                </span>

                            </div>


                            <input
                                id="date"
                                type="date"
                                value={date}
                                onChange={(event) =>
                                    setDate(
                                        event.target.value
                                    )
                                }
                                className={styles.input}
                            />

                        </div>

                    </section>


                    {/* ================= CARD 02 ================= */}

                    <section className={styles.card}>

                        <div className={styles.cardHeader}>

                            <div className={styles.number}>
                                02
                            </div>

                            <div>
                                <h2>
                                    Файл документа
                                </h2>

                                <p>
                                    Завантажте файл,
                                    який буде доступний
                                    на сайті.
                                </p>
                            </div>

                        </div>


                        <div className={styles.field}>

                            <div className={styles.labelRow}>

                                <label>
                                    Файл
                                </label>

                                <span className={styles.required}>
                                    Обов'язкове
                                </span>

                            </div>


                            {!file ? (
                                <label
                                    className={styles.upload}
                                >

                                    <input
                                        type="file"
                                        onChange={
                                            handleFileChange
                                        }
                                    />


                                    <div
                                        className={
                                            styles.uploadIcon
                                        }
                                    >
                                        ↑
                                    </div>


                                    <strong>
                                        Натисніть,
                                        щоб вибрати файл
                                    </strong>


                                    <small>
                                        Максимальний
                                        розмір — 10 МБ
                                    </small>

                                </label>
                            ) : (
                                <div
                                    className={
                                        styles.selectedFile
                                    }
                                >

                                    <div
                                        className={
                                            styles.fileIcon
                                        }
                                    >
                                        📄
                                    </div>


                                    <div
                                        className={
                                            styles.fileInfo
                                        }
                                    >

                                        <strong>
                                            {file.name}
                                        </strong>

                                        <small>
                                            {(
                                                file.size /
                                                1024 /
                                                1024
                                            ).toFixed(2)}{" "}
                                            МБ
                                        </small>

                                    </div>


                                    <button
                                        type="button"
                                        className={
                                            styles.removeFile
                                        }
                                        onClick={removeFile}
                                    >
                                        ×
                                    </button>

                                </div>
                            )}

                        </div>

                    </section>


                    {/* ================= ACTIONS ================= */}

                    <div className={styles.actions}>

                        <Link
                            href="/admin_cabinet/accounting"
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
                                            styles.buttonSpinner
                                        }
                                    />

                                    Збереження...
                                </>
                            ) : (
                                <>
                                    Зберегти документ

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