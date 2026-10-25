"use client";

import styles from "./SearchFilter.module.css";
import Image from "next/image";

interface Props {
    search: string;
    onSearchChange: (value: string) => void;

    age: string;
    onAgeChange: (value: string) => void;
}

const ageGroups = [
    "Усі вікові групи",
    "4-6 років",
    "6-9 років",
    "9-12 років",
    "12-16 років",
    "16+ років",
];

export default function SearchFilter({
                                         search,
                                         onSearchChange,
                                         age,
                                         onAgeChange,
                                     }: Props) {

    return (

        <div className={styles.wrapper}>

            <div className={styles.selectWrapper}>

                <select
                    value={age}
                    onChange={(e) =>
                        onAgeChange(e.target.value)
                    }
                    className={styles.select}
                >

                    {ageGroups.map(item => (

                        <option
                            key={item}
                            value={item}
                        >
                            {item}
                        </option>

                    ))}

                </select>

            </div>

            <div className={styles.searchWrapper}>

                <input
                    type="text"
                    placeholder="Пошук гуртка..."
                    value={search}
                    onChange={(e) =>
                        onSearchChange(e.target.value)
                    }
                    className={styles.input}
                />

                <Image
                    src="/icons8-search-100.png"
                    alt=""
                    width={24}
                    height={24}
                    className={styles.searchIcon}
                />

            </div>

        </div>

    );

}