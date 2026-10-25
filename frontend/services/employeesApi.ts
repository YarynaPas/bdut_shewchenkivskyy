import { adminFetch } from "./adminApi";


/* ========================================= */
/* EMPLOYEE */
/* ========================================= */

export interface AdminEmployee {

    id: number;

    full_name: string;

    main_photo: string;

    position: string;

}


/* ========================================= */
/* GET ALL */
/* ========================================= */

export async function getAdminEmployees(): Promise<AdminEmployee[]> {

    const response =
        await adminFetch("/employee");


    if (!response.ok) {

        const result =
            await response
                .json()
                .catch(() => null);


        throw new Error(
            result?.message ||
            "Не вдалося завантажити працівників"
        );

    }


    return response.json();

}


/* ========================================= */
/* GET BY ID */
/* ========================================= */

export async function getAdminEmployeeById(
    id: number
): Promise<AdminEmployee> {

    const response =
        await adminFetch(
            `/employee/${id}`
        );


    if (!response.ok) {

        const result =
            await response
                .json()
                .catch(() => null);


        throw new Error(
            result?.message ||
            "Працівника не знайдено"
        );

    }


    return response.json();

}


/* ========================================= */
/* CREATE DATA */
/* ========================================= */

export interface CreateEmployeeData {

    full_name: string;

    position: string;

    main_photo: File;

}


/* ========================================= */
/* CREATE */
/* ========================================= */

export async function createEmployee(
    data: CreateEmployeeData
): Promise<AdminEmployee> {

    const formData =
        new FormData();


    formData.append(
        "full_name",
        data.full_name
    );


    formData.append(
        "position",
        data.position
    );


    formData.append(
        "main_photo",
        data.main_photo
    );


    const response =
        await adminFetch(
            "/employees",
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
            "Не вдалося створити працівника"
        );

    }


    return response.json();

}


/* ========================================= */
/* UPDATE DATA */
/* ========================================= */

export interface UpdateEmployeeData {

    full_name: string;

    position: string;

    main_photo?: File | null;

}


/* ========================================= */
/* UPDATE */
/* ========================================= */

export async function updateEmployee(
    id: number,
    data: UpdateEmployeeData
): Promise<AdminEmployee> {

    const formData =
        new FormData();


    formData.append(
        "full_name",
        data.full_name
    );


    formData.append(
        "position",
        data.position
    );


    if (data.main_photo) {

        formData.append(
            "main_photo",
            data.main_photo
        );

    }


    const response =
        await adminFetch(
            `/employees/${id}`,
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
            "Не вдалося оновити працівника"
        );

    }


    return response.json();

}


/* ========================================= */
/* DELETE */
/* ========================================= */

export async function deleteEmployee(
    id: number
): Promise<void> {

    const response =
        await adminFetch(
            `/employees/${id}`,
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
            "Не вдалося видалити працівника"
        );

    }

}