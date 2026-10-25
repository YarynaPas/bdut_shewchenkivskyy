"use client";

import styles from "./Pagination.module.css";

interface Props {

    currentPage: number;

    totalPages: number;

    onPageChange: (page: number) => void;

}

export default function Pagination({

                                       currentPage,

                                       totalPages,

                                       onPageChange,

                                   }: Props) {

    if (totalPages <= 1) {

        return null;

    }

    const pages = [];

    for (let i = 1; i <= totalPages; i++) {

        pages.push(i);

    }

    return (

        <div className={styles.wrapper}>

            <button
                className={styles.arrow}
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
            >

                ←

            </button>

            {pages.map(page => (

                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`${styles.page} ${
                        page === currentPage
                            ? styles.active
                            : ""
                    }`}
                >

                    {page}

                </button>

            ))}

            <button
                className={styles.arrow}
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
            >

                →

            </button>

        </div>

    );

}