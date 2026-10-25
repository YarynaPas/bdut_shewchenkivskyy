import { adminFetch } from "./adminApi";


/* ========================================= */
/* ENUM / CATEGORY */
/* ========================================= */

export enum AccountingTypeEnum {

    Osnovny_documents =
        "Основні документи",

    Nakazy =
        "Накази",

    Atestacia =
        "Атестація",

}


/* ========================================= */
/* ACCOUNTING */
/* ========================================= */

export interface AdminAccounting {

    id: number;

    category: AccountingTypeEnum;

    name: string;

    pid_category: string | null;

    date: string;

    photos: string | null;

    year: number;

}


/* ========================================= */
/* GET ALL */
/* ========================================= */

export async function getAdminAccounting(
    year?: number,
    category?: AccountingTypeEnum
): Promise<AdminAccounting[]> {

    const params =
        new URLSearchParams();


    if (year) {

        params.append(
            "year",
            String(year)
        );

    }


    if (category) {

        params.append(
            "category",
            category
        );

    }


    const query =
        params.toString();


    const response =
        await adminFetch(
            `/accounting${
                query
                    ? `?${query}`
                    : ""
            }`
        );


    if (!response.ok) {

        const result =
            await response
                .json()
                .catch(() => null);


        throw new Error(
            result?.message ||
            "Не вдалося завантажити звітність"
        );

    }


    return response.json();

}


/* ========================================= */
/* GET BY ID */
/* ========================================= */

export async function getAdminAccountingById(
    id: number
): Promise<AdminAccounting> {

    const response =
        await adminFetch(
            `/accounting/${id}`
        );


    if (!response.ok) {

        const result =
            await response
                .json()
                .catch(() => null);


        throw new Error(
            result?.message ||
            "Документ не знайдено"
        );

    }


    return response.json();

}


/* ========================================= */
/* CREATE */
/* ========================================= */

export interface CreateAccountingData {

    category: AccountingTypeEnum;

    name: string;

    pid_category?: string;

    year?: number;

    file?: File | null;

}


export async function createAccounting(
    data: CreateAccountingData
): Promise<AdminAccounting> {

    const formData =
        new FormData();


    formData.append(
        "category",
        data.category
    );


    formData.append(
        "name",
        data.name
    );


    if (
        data.pid_category
    ) {

        formData.append(
            "pid_category",
            data.pid_category
        );

    }


    if (
        data.year
    ) {

        formData.append(
            "year",
            String(data.year)
        );

    }


    if (
        data.file
    ) {

        formData.append(
            "photos",
            data.file
        );

    }


    const response =
        await adminFetch(
            "/accounting",
            {
                method: "POST",
                body: formData,
            }
        );


    if (!response.ok) {

        const result =
            await response
                .json()
                .catch(() => null);


        throw new Error(
            result?.message ||
            "Не вдалося створити запис"
        );

    }


    return response.json();

}


/* ========================================= */
/* UPDATE */
/* ========================================= */

export interface UpdateAccountingData {

    category: AccountingTypeEnum;

    name: string;

    date?: string;

    year?: number;

    file?: File | null;

}


export async function updateAccounting(
    id: number,
    data: UpdateAccountingData
): Promise<AdminAccounting> {

    const formData =
        new FormData();


    formData.append(
        "category",
        data.category
    );


    formData.append(
        "name",
        data.name
    );


    if (
        data.date
    ) {

        formData.append(
            "date",
            data.date
        );

    }


    if (
        data.year
    ) {

        formData.append(
            "year",
            String(data.year)
        );

    }


    if (
        data.file
    ) {

        formData.append(
            "photos",
            data.file
        );

    }


    const response =
        await adminFetch(
            `/accounting/${id}`,
            {
                method: "PUT",
                body: formData,
            }
        );


    if (!response.ok) {

        const result =
            await response
                .json()
                .catch(() => null);


        throw new Error(
            result?.message ||
            "Не вдалося оновити документ"
        );

    }


    return response.json();

}


/* ========================================= */
/* DELETE */
/* ========================================= */

export async function deleteAccounting(
    id: number
): Promise<void> {

    const response =
        await adminFetch(
            `/accounting/${id}`,
            {
                method: "DELETE",
            }
        );


    if (!response.ok) {

        const result =
            await response
                .json()
                .catch(() => null);


        throw new Error(
            result?.message ||
            "Не вдалося видалити документ"
        );

    }

}