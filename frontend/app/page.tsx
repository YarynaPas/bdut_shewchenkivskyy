import MainBannerComponent from "@/components/mainBunner/MainBannerComponent";
import DepartmentsBlock from "@/components/DepartmentsBlock/DepartmentsBlock";
import DepartmentsSection from "@/components/DepartmentsSection/DepartmentsSection";
import './globals.css';
import AdvantagesComponent from "@/components/AdvantagesComponent/AdvantagesComponent";
import MapSectionComponent from "@/components/MapSectionComponent/MapSectionComponent";
import NewsEventsSection from "@/components/NewsEventsSection/NewsEventsSection";
import SocialsComponent from "@/components/SocialsComponent/SocialsComponent";

export default function HomePage() {
    return (
        <>
            <MainBannerComponent />
            <AdvantagesComponent/>
            <DepartmentsBlock/>
            <MapSectionComponent/>
            <NewsEventsSection/>
            <SocialsComponent/>
        </>
    );
}