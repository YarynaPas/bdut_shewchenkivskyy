"use client";

import {
    useEffect,
    useMemo,
    useState,
} from "react";

import styles from "./GurtkySection.module.css";

import CategoryTabs, {
    Department,
    GurtokDepartment,
} from "../ CategoryTabs/CategoryTabs";

import SearchFilter from "../SearchFilter/SearchFilter";

import GurtkyGrid from "../GurtkyGrid/GurtkyGrid";

import Pagination from "@/components/Gurtky/Pagination/Pagination";


export interface ScheduleItem {

    day: string;

    time: string;

}


export interface Gurtok {

    id: number;

    name: string;

    teacher: string;

    napryam: GurtokDepartment;

    vikova_grupa: string;

    description: string;

    long_description: string;

    classrom: string;

    pictograma: string;

    photos: string[];

    schedule:
        | ScheduleItem[]
        | null;

}


const ITEMS_PER_PAGE = 6;


export default function GurtkySection() {

    const [loading, setLoading] =
        useState(true);


    const [gurtky, setGurtky] =
        useState<Gurtok[]>([]);


    /* ========================================= */
    /* DEPARTMENT */
    /* ========================================= */

    const [department, setDepartment] =
        useState<Department>(
            "Усі відділи"
        );


    /* ========================================= */
    /* SEARCH */
    /* ========================================= */

    const [search, setSearch] =
        useState("");


    /* ========================================= */
    /* AGE */
    /* ========================================= */

    const [age, setAge] =
        useState("Усі вікові групи");


    /* ========================================= */
    /* PAGE */
    /* ========================================= */

    const [page, setPage] =
        useState(1);


    /* ========================================= */
    /* SHOW ALL */
    /* ========================================= */

    const [showAll, setShowAll] =
        useState(false);


    /* ========================================= */
    /* LOAD */
    /* ========================================= */

    useEffect(() => {

        const loadGurtky = async () => {

            try {

                setLoading(true);


                const response =
                    await fetch(
                        `${process.env.NEXT_PUBLIC_API_URL}/gurtky`
                    );


                if (!response.ok) {

                    throw new Error(
                        "Не вдалося завантажити гуртки"
                    );

                }


                const data =
                    await response.json();


                console.log(
                    "GURTKY:",
                    data
                );


                if (
                    Array.isArray(data)
                ) {

                    setGurtky(data);

                } else {

                    setGurtky([]);

                }

            } catch (error) {

                console.error(
                    "Gurtky error:",
                    error
                );

                setGurtky([]);

            } finally {

                setLoading(false);

            }

        };


        loadGurtky();

    }, []);


    /* ========================================= */
    /* RESET */
    /* ========================================= */

    useEffect(() => {

        setPage(1);

        setShowAll(false);

    }, [
        department,
        search,
        age,
    ]);


    /* ========================================= */
    /* FILTER */
    /* ========================================= */

    const filtered =
        useMemo(() => {

            const searchValue =
                search
                    .trim()
                    .toLowerCase();


            return gurtky.filter(
                (item) => {

                    /*
                     * УСІ ВІДДІЛИ
                     *
                     * Тут НЕ потрібно
                     * перевіряти item.napryam.
                     */

                    const departmentMatches =
                        department === "Усі відділи"
                        ||
                        item.napryam === department;


                    /*
                     * ПОШУК
                     */

                    const searchMatches =
                        !searchValue
                        ||
                        item.name
                            .toLowerCase()
                            .includes(
                                searchValue
                            );


                    /*
                     * ВІК
                     */

                    const ageMatches =
                        age === "Усі вікові групи"
                        ||
                        item.vikova_grupa === age;


                    return (
                        departmentMatches &&
                        searchMatches &&
                        ageMatches
                    );

                }
            );

        }, [
            gurtky,
            department,
            search,
            age,
        ]);


    /* ========================================= */
    /* DEBUG */
    /* ========================================= */

    console.log(
        "Department:",
        department
    );

    console.log(
        "All gurtky:",
        gurtky.length
    );

    console.log(
        "Filtered:",
        filtered.length
    );


    /* ========================================= */
    /* TOTAL PAGES */
    /* ========================================= */

    const totalPages =
        Math.ceil(
            filtered.length /
            ITEMS_PER_PAGE
        );

    const currentItems =
        showAll

            ? filtered

            : filtered.slice(
                (page - 1) *
                ITEMS_PER_PAGE,

                page *
                ITEMS_PER_PAGE
            );

    const toggleShowAll = () => {

        setShowAll(
            previous =>
                !previous
        );

        setPage(1);

    };


    /* ========================================= */
    /* LOADING */
    /* ========================================= */

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
                {/* DEPARTMENTS */}
                {/* ================================= */}

                <CategoryTabs
                    value={
                        department
                    }
                    onChange={
                        setDepartment
                    }
                />


                {/* ================================= */}
                {/* SEARCH / AGE */}
                {/* ================================= */}

                <SearchFilter
                    search={
                        search
                    }
                    onSearchChange={
                        setSearch
                    }
                    age={
                        age
                    }
                    onAgeChange={
                        setAge
                    }
                />


                {/* ================================= */}
                {/* GRID */}
                {/* ================================= */}

                <GurtkyGrid
                    gurtky={
                        currentItems
                    }
                />


                {/* ================================= */}
                {/* SHOW ALL */}
                {/* ================================= */}

                {filtered.length > 0 && (

                    <div
                        className={
                            styles.showAllWrapper
                        }
                    >

                        <button
                            type="button"
                            className={
                                styles.showAllButton
                            }
                            onClick={
                                toggleShowAll
                            }
                        >

                            <span>
                                {showAll
                                    ? "Показати менше"
                                    : "Показати всі"}
                            </span>


                            <span
                                className={
                                    styles.showAllArrow
                                }
                            >

                                {showAll
                                    ? "↑"
                                    : "↓"}

                            </span>

                        </button>

                    </div>

                )}


                {/* ================================= */}
                {/* PAGINATION */}
                {/* ================================= */}

                {!showAll &&
                    totalPages > 1 && (

                        <Pagination
                            currentPage={
                                page
                            }
                            totalPages={
                                totalPages
                            }
                            onPageChange={
                                setPage
                            }
                        />

                    )}

            </div>

        </section>

    );

}