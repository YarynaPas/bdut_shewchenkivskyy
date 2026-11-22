
import { adminFetch } from './adminApi';


/* ========================================= */
/* CITIZEN APPEAL IMAGE */
/* ========================================= */

export interface CitizenAppealImage {
    id: number;
    title: string;
    image_path: string;
    sort_order: number;
    created_at: string;
}


/* ========================================= */
/* GET ALL IMAGES */
/* ========================================= */

export async function getCitizenAppealImages(): Promise<CitizenAppealImage[]> {

    const response = await adminFetch('/citizen');

    if (!response.ok) {
        const result = await response.json().catch(() => null);

        throw new Error(
            result?.message || 'Не вдалося завантажити зображення'
        );
    }

    return response.json();
}


/* ========================================= */
/* CREATE IMAGE */
/* ========================================= */

export interface CreateCitizenAppealImageData {
    title: string;
    sort_order?: number;
    image: File;
}

export async function createCitizenAppealImage(
    data: CreateCitizenAppealImageData
): Promise<CitizenAppealImage> {

    const formData = new FormData();

    formData.append('title', data.title);
    formData.append('sort_order', String(data.sort_order ?? 0));
    formData.append('image', data.image);

    const response = await adminFetch('/citizen', {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const result = await response.json().catch(() => null);

        throw new Error(
            result?.message || 'Не вдалося завантажити зображення'
        );
    }

    return response.json();
}


/* ========================================= */
/* UPDATE IMAGE */
/* ========================================= */

export interface UpdateCitizenAppealImageData {
    title?: string;
    sort_order?: number;
    image?: File | null;
}

export async function updateCitizenAppealImage(
    id: number,
    data: UpdateCitizenAppealImageData
): Promise<CitizenAppealImage> {

    const formData = new FormData();

    if (data.title !== undefined) {
        formData.append('title', data.title);
    }

    if (data.sort_order !== undefined) {
        formData.append('sort_order', String(data.sort_order));
    }

    if (data.image) {
        formData.append('image', data.image);
    }

    const response = await adminFetch(`/citizen/${id}`, {
        method: 'PUT',
        body: formData,
    });

    if (!response.ok) {
        const result = await response.json().catch(() => null);

        throw new Error(
            result?.message || 'Не вдалося оновити зображення'
        );
    }

    return response.json();
}


/* ========================================= */
/* DELETE IMAGE */
/* ========================================= */

export async function deleteCitizenAppealImage(
    id: number
): Promise<void> {

    const response = await adminFetch(`/citizen/${id}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        const result = await response.json().catch(() => null);

        throw new Error(
            result?.message || 'Не вдалося видалити зображення'
        );
    }
}
