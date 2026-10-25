"use client";

import { useEffect, useState } from "react";

import ReportingSection from "@/components/Reporting/ReportingSection";
import Rozklad from "@/components/Rozklad/Rozklad";

import {
    getAdminRozklad,
    Rozklad as RozkladType,
} from "@/services/rozkladApi";

export default function ReportingPage() {
    const [rozklad, setRozklad] = useState<RozkladType[]>([]);

    useEffect(() => {
        const loadRozklad = async () => {
            try {
                const data = await getAdminRozklad();

                setRozklad(data);
            } catch (error) {
                console.error(
                    "Помилка завантаження розкладу:",
                    error
                );
            }
        };

        loadRozklad();
    }, []);

    return (
        <>
            <ReportingSection />

            <Rozklad items={rozklad} />
        </>
    );
}