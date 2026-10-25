import { adminFetch } from "./adminApi";


/* ========================================= */
/* EVENT */
/* ========================================= */

export interface AdminEvent {

    id: number;

    title: string;

    description: string | null;

    date: string;

    main_photo: string | null;

}


/* ========================================= */
/* GET ALL */
/* ========================================= */

export async function getAdminEvents(): Promise<AdminEvent[]> {

    const response =
        await adminFetch("/event");


    if (!response.ok) {

        const result =
            await response
                .json()
                .catch(() => null);

        throw new Error(
            result?.message ||
            "Не вдалося завантажити події"
        );

    }


    return response.json();

}


/* ========================================= */
/* GET BY ID */
/* ========================================= */

export async function getAdminEventById(
    id: number
): Promise<AdminEvent> {

    const response =
        await adminFetch(
            `/event/${id}`
        );


    if (!response.ok) {

        const result =
            await response
                .json()
                .catch(() => null);

        throw new Error(
            result?.message ||
            "Подію не знайдено"
        );

    }


    return response.json();

}


/* ========================================= */
/* CREATE */
/* ========================================= */

export interface CreateEventData {

    title: string;

    description?: string;

    date: string;

    main_photo: File;

}


export async function createEvent(
    data: CreateEventData
): Promise<AdminEvent> {

    const formData =
        new FormData();

    formData.append(
        "title",
        data.title
    );

    formData.append(
        "date",
        data.date
    );

    formData.append(
        "description",
        data.description || ""
    );

    formData.append(
        "main_photo",
        data.main_photo
    );


    const response =
        await adminFetch(
            "/event",
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
            "Не вдалося створити подію"
        );

    }


    return response.json();

}


/* ========================================= */
/* UPDATE */
/* ========================================= */

export interface UpdateEventData {

    title: string;

    description?: string;

    date: string;

    main_photo?: File | null;

}


export async function updateEvent(
    id: number,
    data: UpdateEventData
): Promise<AdminEvent> {

    const formData =
        new FormData();

    formData.append(
        "title",
        data.title
    );

    formData.append(
        "date",
        data.date
    );

    formData.append(
        "description",
        data.description || ""
    );

    if (data.main_photo) {

        formData.append(
            "main_photo",
            data.main_photo
        );

    }


    const response =
        await adminFetch(
            `/event/${id}`,
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
            "Не вдалося оновити подію"
        );

    }


    return response.json();

}


/* ========================================= */
/* DELETE */
/* ========================================= */


export async function deleteEvent(
    id: number
): Promise<void> {

    const response =
        await adminFetch(
            `/event/${id}`,
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
            "Не вдалося видалити подію"
        );

    }

}