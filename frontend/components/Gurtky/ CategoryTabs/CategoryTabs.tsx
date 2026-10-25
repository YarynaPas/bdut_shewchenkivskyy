"use client";

import Image from "next/image";

import styles from "./CategoryTabs.module.css";


/* ================================================= */
/* РЕАЛЬНІ ВІДДІЛИ ГУРТКІВ */
/* ================================================= */

export type GurtokDepartment =
    | "Художньо-естетичний відділ"
    | "Гуманітарний відділ"
    | "Вокально-хореографічний відділ";


/* ================================================= */
/* ЗНАЧЕННЯ ФІЛЬТРА */
/* ================================================= */

export type Department =
    | "Усі відділи"
    | GurtokDepartment;


interface Props {

    value: Department;

    onChange: (
        value: Department
    ) => void;

}


/* ================================================= */
/* DEPARTMENTS */
/* ================================================= */

const departments: {

    title: string;

    value: Department;

    icon: string;

    color: string;

    background: string;

    border: string;

}[] = [

    {
        title:
            "Усі\nвідділи",

        value:
            "Усі відділи",

        icon:
            "/icons8-stars-80.png",

        color:
            "#8f3bab",

        background:
            "#dfabed",

        border:
            "#d899f5",
    },

    {
        title:
            "Художньо-\nестетичний\nвідділ",

        value:
            "Художньо-естетичний відділ",

        icon:
            "/icons8-paint-palette-64.png",

        color:
            "#8f3bab",

        background:
            "#dfabed",

        border:
            "#d899f5",
    },

    {
        title:
            "Гуманітарний\nвідділ",

        value:
            "Гуманітарний відділ",

        icon:
            "/icons8-book-96.png",

        color:
            "#69bce9",

        background:
            "#aeddf4",

        border:
            "#8fd4f7",
    },

    {
        title:
            "Вокально-\nхореографічний\nвідділ",

        value:
            "Вокально-хореографічний відділ",

        icon:
            "/icons8-dance-100.png",

        color:
            "#d8c84a",

        background:
            "#faefc8",

        border:
            "#f0e78a",
    },

];


/* ================================================= */
/* COMPONENT */
/* ================================================= */

export default function CategoryTabs({

                                         value,

                                         onChange,

                                     }: Props) {

    return (

        <div className={styles.wrapper}>

            {departments.map(
                (item) => {

                    const active =
                        value ===
                        item.value;


                    return (

                        <button
                            key={
                                item.value
                            }
                            type="button"
                            onClick={() =>
                                onChange(
                                    item.value
                                )
                            }
                            className={`
                                ${styles.card}
                                ${
                                active
                                    ? styles.active
                                    : ""
                            }
                            `}
                            style={{
                                borderColor:
                                    active
                                        ? item.border
                                        : "#E7E7E7",

                                backgroundColor:
                                    active
                                        ? `${item.background}4D`
                                        : "#fff",
                            }}
                        >

                            <div
                                className={
                                    styles.iconWrapper
                                }
                            >

                                <Image
                                    src={
                                        item.icon
                                    }
                                    alt={
                                        item.title
                                            .replace(
                                                /\n/g,
                                                " "
                                            )
                                    }
                                    width={56}
                                    height={56}
                                    className={
                                        styles.icon
                                    }
                                />

                            </div>


                            <div
                                className={
                                    styles.text
                                }
                                style={{
                                    color:
                                        active
                                            ? item.color
                                            : "#1d1d1d",
                                }}
                            >

                                {item.title
                                    .split("\n")
                                    .map(
                                        (
                                            line,
                                            index
                                        ) => (

                                            <span
                                                key={
                                                    index
                                                }
                                            >

                                                {line}

                                                <br />

                                            </span>

                                        )
                                    )}

                            </div>

                        </button>

                    );

                }
            )}

        </div>

    );

}