"use client";

import {
    ChangeEvent,
    FormEvent,
    useEffect,
    useState,
} from "react";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import styles from "./EditAccounting.module.css";

import {
    AccountingTypeEnum,
    AdminAccounting,
    getAdminAccountingById,
    updateAccounting,
} from "@/services/accountingApi";


/* ================================================= */
/* ГОТОВІ ПІДКАТЕГОРІЇ */
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
/* PAGE */
/* ================================================= */

export default function EditAccountingPage() {

    const params = useParams();
    const router = useRouter();

    const id = Number(params.id);


    /* ================================================= */
    /* DATA */
    /* ================================================= */

    const [item, setItem] =
        useState<AdminAccounting | null>(null);


    /* ================================================= */
    /* FORM */
    /* ================================================= */

    const [category, setCategory] =
        useState<AccountingTypeEnum | "">("");


    const [subcategory, setSubcategory] =
        useState("");


    const [customSubcategory, setCustomSubcategory] =
        useState(false);


    const [customSubcategoryValue, setCustomSubcategoryValue] =
        useState("");


    const [name, setName] =
        useState("");


    const [year, setYear] =
        useState("");


    const [date, setDate] =
        useState("");


    /* ================================================= */
    /* FILE */
    /* ================================================= */

    const [file, setFile] =
        useState<File | null>(null);


    /* ================================================= */
    /* STATUS */
    /* ================================================= */

    const [loading, setLoading] =
        useState(true);


    const [saving, setSaving] =
        useState(false);


    const [error, setError] =
        useState("");


    const [success, setSuccess] =
        useState("");


    /* ================================================= */
    /* LOAD */
    /* ================================================= */

    useEffect(() => {

        if (
            !id ||
            Number.isNaN(id)
        ) {

            setError(
                "Некоректний ID документа."
            );

            setLoading(false);

            return;

        }


        const load =
            async () => {

                try {

                    const data =
                        await getAdminAccountingById(
                            id
                        );


                    setItem(data);


                    /* ========================= */
                    /* CATEGORY */
                    /* ========================= */

                    setCategory(
                        data.category
                    );


                    /* ========================= */
                    /* NAME */
                    /* ========================= */

                    setName(
                        data.name || ""
                    );


                    /* ========================= */
                    /* YEAR */
                    /* ========================= */

                    setYear(
                        data.year
                            ? String(data.year)
                            : ""
                    );


                    /* ========================= */
                    /* SUBCATEGORY */
                    /* ========================= */

                    const currentSubcategory =
                        data.pid_category || "";


                    const defaultCategories =
                        DEFAULT_SUBCATEGORIES[
                            data.category
                            ] || [];


                    if (
                        currentSubcategory &&
                        !defaultCategories.includes(
                            currentSubcategory
                        )
                    ) {

                        setCustomSubcategory(
                            true
                        );

                        setCustomSubcategoryValue(
                            currentSubcategory
                        );

                        setSubcategory("");

                    } else {

                        setCustomSubcategory(
                            false
                        );

                        setSubcategory(
                            currentSubcategory
                        );

                        setCustomSubcategoryValue(
                            ""
                        );

                    }


                    /* ========================= */
                    /* DATE */
                    /* ========================= */

                    if (data.date) {

                        const parsed =
                            new Date(
                                data.date
                            );


                        if (
                            !Number.isNaN(
                                parsed.getTime()
                            )
                        ) {

                            const local =
                                new Date(
                                    parsed.getTime()
                                    -
                                    parsed.getTimezoneOffset()
                                    * 60000
                                );


                            setDate(
                                local
                                    .toISOString()
                                    .slice(
                                        0,
                                        16
                                    )
                            );

                        }

                    }

                } catch (err) {

                    console.error(
                        err
                    );


                    setError(
                        err instanceof Error
                            ? err.message
                            : "Не вдалося завантажити документ."
                    );

                } finally {

                    setLoading(false);

                }

            };


        load();

    }, [id]);


    /* ================================================= */
    /* CHANGE CATEGORY */
    /* ================================================= */

    const handleCategoryChange = (
        value: string
    ) => {

        const newCategory =
            value as AccountingTypeEnum;


        setCategory(
            newCategory
        );


        const defaults =
            DEFAULT_SUBCATEGORIES[
                newCategory
                ] || [];


        if (defaults.length > 0) {

            setSubcategory(
                defaults[0]
            );

        } else {

            setSubcategory("");

        }


        setCustomSubcategory(
            false
        );


        setCustomSubcategoryValue("");

    };


    /* ================================================= */
    /* FILE */
    /* ================================================= */

    const handleFileChange = (
        event: ChangeEvent<HTMLInputElement>
    ) => {

        const selected =
            event.target.files?.[0];


        if (!selected) {

            return;

        }


        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/gif",
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ];


        if (
            !allowedTypes.includes(
                selected.type
            )
        ) {

            setError(
                "Дозволені JPG, PNG, GIF, PDF, DOC та DOCX."
            );

            return;

        }


        if (
            selected.size >
            10 * 1024 * 1024
        ) {

            setError(
                "Розмір файлу не може перевищувати 10 МБ."
            );

            return;

        }


        setError("");

        setFile(
            selected
        );

    };


    /* ================================================= */
    /* CLEAR FILE */
    /* ================================================= */

    const clearFile = () => {

        setFile(null);

    };


    /* ================================================= */
    /* SUBMIT */
    /* ================================================= */

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {

        event.preventDefault();


        setError("");
        setSuccess("");


        /* ========================= */
        /* CATEGORY */
        /* ========================= */

        if (!category) {

            setError(
                "Категорія є обов'язковою."
            );

            return;

        }


        /* ========================= */
        /* NAME */
        /* ========================= */

        if (!name.trim()) {

            setError(
                "Назва документа є обов'язковою."
            );

            return;

        }


        /* ========================= */
        /* SUBCATEGORY */
        /* ========================= */

        let finalSubcategory =
            "";


        if (customSubcategory) {

            if (
                !customSubcategoryValue.trim()
            ) {

                setError(
                    "Введіть власну підкатегорію."
                );

                return;

            }


            finalSubcategory =
                customSubcategoryValue.trim();

        } else {

            finalSubcategory =
                subcategory;

        }


        /* ========================= */
        /* YEAR */
        /* ========================= */

        let parsedYear:
            number | undefined;


        if (
            year.trim()
        ) {

            parsedYear =
                Number(year);


            if (
                Number.isNaN(
                    parsedYear
                )
            ) {

                setError(
                    "Рік повинен бути числом."
                );

                return;

            }

        }


        try {

            setSaving(true);


            await updateAccounting(
                id,
                {
                    category,

                    name:
                        name.trim(),

                    pid_category:
                        finalSubcategory ||
                        undefined,

                    date:
                        date ||
                        undefined,

                    year:
                    parsedYear,

                    file,
                }
            );


            setSuccess(
                "Документ успішно оновлено."
            );


            setTimeout(() => {

                router.push(
                    "/admin_cabinet/accounting"
                );

            }, 800);

        } catch (err) {

            console.error(
                err
            );


            setError(
                err instanceof Error
                    ? err.message
                    : "Не вдалося оновити документ."
            );

        } finally {

            setSaving(false);

        }

    };


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
                        Завантаження документа...
                    </span>

                </div>

            </main>

        );

    }


    /* ================================================= */
    /* NOT FOUND */
    /* ================================================= */

    if (!item) {

        return (

            <main
                className={
                    styles.page
                }
            >

                <div
                    className={
                        styles.notFound
                    }
                >

                    <div
                        className={
                            styles.notFoundIcon
                        }
                    >
                        !
                    </div>


                    <h1>
                        Документ не знайдено
                    </h1>


                    <p>
                        {error ||
                            "Документ не існує або був видалений."}
                    </p>


                    <Link
                        href="/admin_cabinet/accounting"
                    >
                        ← До звітності
                    </Link>

                </div>

            </main>

        );

    }


    /* ================================================= */
    /* CURRENT SUBCATEGORIES */
    /* ================================================= */

    const availableSubcategories =
        DEFAULT_SUBCATEGORIES[
            category as AccountingTypeEnum
            ] || [];


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

                {/* ================================= */}
                {/* HEADER */}
                {/* ================================= */}

                <header
                    className={
                        styles.header
                    }
                >

                    <Link
                        href="/admin_cabinet/accounting"
                        className={
                            styles.back
                        }
                    >
                        ← Назад до звітності
                    </Link>


                    <span
                        className={
                            styles.overline
                        }
                    >
                        КЕРУВАННЯ ДОКУМЕНТАМИ
                    </span>


                    <h1>
                        Редагувати документ
                    </h1>


                    <p>
                        Змініть категорію,
                        підкатегорію або інші
                        дані документа.
                    </p>

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


                <form
                    className={
                        styles.form
                    }
                    onSubmit={
                        handleSubmit
                    }
                >

                    {/* ================================= */}
                    {/* MAIN INFORMATION */}
                    {/* ================================= */}

                    <section
                        className={
                            styles.card
                        }
                    >

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
                                    Основна інформація
                                </h2>

                                <p>
                                    Категорія та
                                    назва документа.
                                </p>

                            </div>

                        </div>


                        {/* ================================= */}
                        {/* CATEGORY */}
                        {/* ================================= */}

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
                                    Категорія
                                </label>


                                <span
                                    className={
                                        styles.required
                                    }
                                >
                                    Обов'язкове
                                </span>

                            </div>


                            <select
                                value={
                                    category
                                }
                                onChange={
                                    e =>
                                        handleCategoryChange(
                                            e.target.value
                                        )
                                }
                                disabled={
                                    saving
                                }
                            >

                                <option
                                    value=""
                                >
                                    Оберіть категорію
                                </option>


                                {Object.values(
                                    AccountingTypeEnum
                                ).map(
                                    value => (

                                        <option
                                            key={
                                                value
                                            }
                                            value={
                                                value
                                            }
                                        >
                                            {value}
                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        {/* ================================= */}
                        {/* SUBCATEGORY */}
                        {/* ================================= */}

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
                                    Підкатегорія
                                </label>


                                <span
                                    className={
                                        styles.optional
                                    }
                                >
                                    Необов'язкове
                                </span>

                            </div>


                            {availableSubcategories.length >
                                0 &&
                                !customSubcategory && (

                                    <select
                                        value={
                                            subcategory
                                        }
                                        onChange={
                                            e =>
                                                setSubcategory(
                                                    e.target.value
                                                )
                                        }
                                        disabled={
                                            saving
                                        }
                                    >

                                        <option
                                            value=""
                                        >
                                            Без підкатегорії
                                        </option>


                                        {availableSubcategories.map(
                                            sub => (

                                                <option
                                                    key={
                                                        sub
                                                    }
                                                    value={
                                                        sub
                                                    }
                                                >
                                                    {sub}
                                                </option>

                                            )
                                        )}

                                    </select>

                                )}


                            {customSubcategory && (

                                <input
                                    type="text"
                                    value={
                                        customSubcategoryValue
                                    }
                                    onChange={
                                        e =>
                                            setCustomSubcategoryValue(
                                                e.target.value
                                            )
                                    }
                                    placeholder="Введіть власну підкатегорію"
                                    disabled={
                                        saving
                                    }
                                />

                            )}


                            <label
                                className={
                                    styles.customToggle
                                }
                            >

                                <input
                                    type="checkbox"
                                    checked={
                                        customSubcategory
                                    }
                                    onChange={
                                        e => {

                                            const checked =
                                                e.target.checked;


                                            setCustomSubcategory(
                                                checked
                                            );


                                            if (
                                                checked
                                            ) {

                                                setCustomSubcategoryValue(
                                                    subcategory
                                                );

                                            } else {

                                                setSubcategory(
                                                    customSubcategoryValue
                                                );

                                                setCustomSubcategoryValue(
                                                    ""
                                                );

                                            }

                                        }
                                    }
                                    disabled={
                                        saving
                                    }
                                />


                                <span>
                                    Ввести власну підкатегорію
                                </span>

                            </label>


                            <small
                                className={
                                    styles.help
                                }
                            >

                                Можна вибрати готову
                                підкатегорію або
                                ввести власну.

                            </small>

                        </div>


                        {/* ================================= */}
                        {/* NAME */}
                        {/* ================================= */}

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
                                    Назва документа
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
                                value={
                                    name
                                }
                                onChange={
                                    e =>
                                        setName(
                                            e.target.value
                                        )
                                }
                                placeholder="Наприклад: Наказ № 86"
                                disabled={
                                    saving
                                }
                            />

                        </div>


                        {/* ================================= */}
                        {/* YEAR */}
                        {/* ================================= */}

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
                                    Рік
                                </label>


                                <span
                                    className={
                                        styles.optional
                                    }
                                >
                                    Необов'язкове
                                </span>

                            </div>


                            <input
                                type="number"
                                value={
                                    year
                                }
                                min="2000"
                                max="2100"
                                onChange={
                                    e =>
                                        setYear(
                                            e.target.value
                                        )
                                }
                                placeholder="2026"
                                disabled={
                                    saving
                                }
                            />

                        </div>


                        {/* ================================= */}
                        {/* DATE */}
                        {/* ================================= */}

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
                                    Дата
                                </label>


                                <span
                                    className={
                                        styles.optional
                                    }
                                >
                                    Необов'язкове
                                </span>

                            </div>


                            <input
                                type="datetime-local"
                                value={
                                    date
                                }
                                onChange={
                                    e =>
                                        setDate(
                                            e.target.value
                                        )
                                }
                                disabled={
                                    saving
                                }
                            />

                        </div>

                    </section>


                    {/* ================================= */}
                    {/* FILE */}
                    {/* ================================= */}

                    <section
                        className={
                            styles.card
                        }
                    >

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
                                    Файл документа
                                </h2>

                                <p>
                                    Поточний файл
                                    та його заміна.
                                </p>

                            </div>

                        </div>


                        {/* CURRENT FILE */}

                        {item.photos && (

                            <div
                                className={
                                    styles.currentFile
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

                                    <span>
                                        Поточний файл
                                    </span>


                                    <strong>

                                        {
                                            item.photos
                                                .split("/")
                                                .pop()
                                        }

                                    </strong>

                                </div>


                                <a
                                    href={
                                        item.photos
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={
                                        styles.openFile
                                    }
                                >
                                    Відкрити
                                </a>

                            </div>

                        )}


                        {/* NEW FILE */}

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
                                    Замінити файл
                                </label>


                                <span
                                    className={
                                        styles.optional
                                    }
                                >
                                    Необов'язкове
                                </span>

                            </div>


                            {file ? (

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
                                        ✓
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
                                        onClick={
                                            clearFile
                                        }
                                    >
                                        ×
                                    </button>

                                </div>

                            ) : (

                                <label
                                    className={
                                        styles.upload
                                    }
                                >

                                    <input
                                        type="file"
                                        accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx"
                                        onChange={
                                            handleFileChange
                                        }
                                        disabled={
                                            saving
                                        }
                                    />


                                    <span>
                                        ↑
                                    </span>


                                    <strong>
                                        Вибрати новий файл
                                    </strong>


                                    <small>
                                        JPG, PNG, GIF,
                                        PDF, DOC, DOCX
                                        · до 10 МБ
                                    </small>

                                </label>

                            )}

                        </div>

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
                            href="/admin_cabinet/accounting"
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