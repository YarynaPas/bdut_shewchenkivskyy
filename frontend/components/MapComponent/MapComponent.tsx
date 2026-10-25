"use client";

import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import styles from "./MapComponent.module.css";

const center = {
    lat: 49.8722682,
    lng: 24.0549855,
};

const mapStyles: google.maps.MapTypeStyle[] = [
    {
        elementType: "geometry",
        stylers: [{ color: "#fcf9fd" }],
    },
    {
        elementType: "labels.text.fill",
        stylers: [{ color: "#6f5c7c" }],
    },
    {
        elementType: "labels.text.stroke",
        stylers: [{ color: "#ffffff" }],
    },
    {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#ffffff" }],
    },
    {
        featureType: "road",
        elementType: "geometry.stroke",
        stylers: [{ color: "#ead2f5" }],
    },
    {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [{ color: "#e2a9f1" }],
    },
    {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [{ color: "#cf8fe2" }],
    },
    {
        featureType: "poi",
        elementType: "geometry",
        stylers: [{ color: "#f7effb" }],
    },
    {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [{ color: "#f4ebf9" }],
    },
    {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#f2e6f8" }],
    },
];

const MapComponent = () => {
    const { isLoaded } = useJsApiLoader({
        id: "google-map-script",
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!,
    });

    if (!isLoaded) {
        return (
            <div className={styles.loader}>
                Завантаження карти...
            </div>
        );
    }

    return (
        <section className={styles.section}>
            <GoogleMap
                mapContainerClassName={styles.map}
                center={center}
                zoom={17}
                options={{
                    styles: mapStyles,
                    streetViewControl: false,
                    fullscreenControl: false,
                    mapTypeControl: false,
                    clickableIcons: false,
                    gestureHandling: "greedy",
                    zoomControl: true,
                }}
            >
                <Marker
                    position={center}
                    icon={{
                        url: "/marker.png",
                        scaledSize: new google.maps.Size(45, 45),
                    }}
                />
            </GoogleMap>
        </section>
    );
};

export default MapComponent;