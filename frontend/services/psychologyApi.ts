import { adminFetch } from "./adminApi";


/* ========================================= */
/* PSYCHOLOGY */
/* ========================================= */

export interface AdminPsychology {

    id: number;

    title: string;

    description: string;

    long_description: string | null;

    date: string;

    main_photo: string | null;

    photos: string[];

}


/* ========================================= */
/* RESPONSE */
/* ========================================= */

export interface PsychologyResponse {

    data: AdminPsychology[];

    total: number;

    page: number;

    pages: number;

}


/* ========================================= */
/* GET ALL */
/* ========================================= */

export async function getAdminPsychology(
    page: number = 1,
    limit: number = 10
): Promise<PsychologyResponse> {

    const response =
        await adminFetch(
            `/psychology?page=${page}&limit=${limit}`
        );


    if (!response.ok) {

        const result =
            await response
                .json()
                .catch(() => null);


        throw new Error(
            result?.message ||
            "Не вдалося завантажити матеріали психолога"
        );

    }


    return response.json();

}


/* ========================================= */
/* GET BY ID */
/* ========================================= */

export async function getAdminPsychologyById(
    id: number
): Promise<AdminPsychology> {

    const response =
        await adminFetch(
            `/psychology/${id}`
        );


    if (!response.ok) {

        const result =
            await response
                .json()
                .catch(() => null);


        throw new Error(
            result?.message ||
            "Матеріал психолога не знайдено"
        );

    }


    return response.json();

}


/* ========================================= */
/* CREATE DATA */
/* ========================================= */

export interface CreatePsychologyData {

    title: string;

    description: string;

    long_description?: string;

    main_photo: File;

    photos?: File[];

}


/* ========================================= */
/* CREATE */
/* ========================================= */

export async function createPsychology(
    data: CreatePsychologyData
): Promise<AdminPsychology> {

    const formData =
        new FormData();


    formData.append(
        "title",
        data.title
    );


    formData.append(
        "description",
        data.description
    );


    if (
        data.long_description
    ) {

        formData.append(
            "long_description",
            data.long_description
        );

    }


    formData.append(
        "main_photo",
        data.main_photo
    );


    if (data.photos) {

        data.photos.forEach(
            photo => {

                formData.append(
                    "photos",
                    photo
                );

            }
        );

    }


    const response =
        await adminFetch(
            "/psychology",
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
            "Не вдалося створити матеріал"
        );

    }


    return response.json();

}


/* ========================================= */
/* UPDATE DATA */
/* ========================================= */

export interface UpdatePsychologyData {

    title: string;

    description: string;

    long_description?: string;

    main_photo?: File | null;

    photos?: File[];

}


/* ========================================= */
/* UPDATE */
/* ========================================= */

export async function updatePsychology(
    id: number,
    data: UpdatePsychologyData
): Promise<AdminPsychology> {

    const formData =
        new FormData();


    formData.append(
        "title",
        data.title
    );


    formData.append(
        "description",
        data.description
    );


    formData.append(
        "long_description",
        data.long_description || ""
    );


    if (
        data.main_photo
    ) {

        formData.append(
            "main_photo",
            data.main_photo
        );

    }


    if (data.photos) {

        data.photos.forEach(
            photo => {

                formData.append(
                    "photos",
                    photo
                );

            }
        );

    }


    const response =
        await adminFetch(
            `/psychology/${id}`,
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
            "Не вдалося оновити матеріал"
        );

    }


    return response.json();

}


/* ========================================= */
/* DELETE */
/* ========================================= */

export async function deletePsychology(
    id: number
): Promise<void> {

    const response =
        await adminFetch(
            `/psychology/${id}`,
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
            "Не вдалося видалити матеріал"
        );

    }

}