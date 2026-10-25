"use client";

import Image from "next/image";
import Link from "next/link";

import styles from "./GurtkyGrid.module.css";
import { Gurtok } from "../GurtkySection/GurtkySection";

interface Props {
    gurtky: Gurtok[];
}

export default function GurtkyGrid({
                                       gurtky,
                                   }: Props) {

    const getImage = (path: string) => {

        if (!path) {
            return "/placeholder.png";
        }

        if (
            path.startsWith("http://") ||
            path.startsWith("https://")
        ) {
            return path;
        }

        const base =
            process.env.NEXT_PUBLIC_API_URL
                ?.replace(/\/$/, "") || "";

        return `${base}${
            path.startsWith("/")
                ? path
                : `/${path}`
        }`;
    };

    const getDepartmentIcon = (
        department: string
    ) => {

        switch (department) {

            case "Художньо-естетичний відділ":
                return "/icons8-paint-palette-64.png";

            case "Гуманітарний відділ":
                return "/icons8-book-96.png";

            case "Вокально-хореографічний відділ":
                return "/icons8-dance-100.png";

            default:
                return "/icons8-stars-80.png";
        }
    };

    const getDepartmentColor = (
        department: string
    ) => {

        switch (department) {

            case "Художньо-естетичний відділ":
                return "#F5E4FC";

            case "Гуманітарний відділ":
                return "#E2F4FD";

            case "Вокально-хореографічний відділ":
                return "#FFF8D6";

            default:
                return "#FFFFFF";
        }
    };

    if (!gurtky.length) {

        return (
            <div className={styles.empty}>
                За вашим запитом нічого не знайдено.
            </div>
        );
    }

    return (

        <div className={styles.grid}>

            {gurtky.map((item) => (

                <article
                    key={item.id}
                    className={styles.card}
                >

                    {/* ================= PHOTO ================= */}

                    <Link
                        href={`/gurtky/${item.id}`}
                        className={styles.imageWrapper}
                    >

                        <img
                            src={getImage(item.pictograma)}
                            alt={item.name}
                            className={styles.image}
                        />

                        <div
                            className={styles.departmentIcon}
                            style={{
                                background:
                                    getDepartmentColor(
                                        item.napryam
                                    ),
                            }}
                        >

                            <Image
                                src={getDepartmentIcon(
                                    item.napryam
                                )}
                                alt=""
                                width={34}
                                height={34}
                            />

                        </div>

                        <div className={styles.ageBadge}>
                            {item.vikova_grupa}
                        </div>

                        <svg
                            className={styles.wave}
                            viewBox="0 0 500 80"
                            preserveAspectRatio="none"
                        >

                            <path
                                d="
                                    M0,35
                                    C120,90
                                    380,0
                                    500,45
                                    L500,80
                                    L0,80
                                    Z
                                "
                            />

                        </svg>

                    </Link>

                    {/* ================= CONTENT ================= */}

                    <div className={styles.content}>

                        <h3>
                            {item.name}
                        </h3>

                        <Link
                            href={`/gurtky/${item.id}`}
                            className={styles.button}
                        >

                            <span>
                                Детальніше
                            </span>

                            <span
                                className={styles.arrow}
                            >
                                →
                            </span>

                        </Link>

                    </div>

                </article>

            ))}

        </div>
    );
}