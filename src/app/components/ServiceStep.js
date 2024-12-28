"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function Services({ nextStep, handleDataChange }) {
    const [servicesData, setServicesData] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { business_id } = router.query; 

    useEffect(() => {
        const fetchServices = async () => {
            try {
                // Fetch services for the specific business owner by user_id
                const response = await fetch(`http://localhost:3001/services/${business_id}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch services");
                }
                const data = await response.json();
                console.log(data)
                setServicesData(data.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching services:", error);
                setLoading(false);
            }
        };

        if (business_id) {
            fetchServices();
        }
    }, [business_id]);

    if (loading) {
        return <p>Loading services...</p>;
    }

    const handleSelectedService = (service) => {
        handleDataChange("service_id", service.service_id);
        nextStep();
    };

    return (
        <div className="flex flex-col">
            <h1>Select a Service</h1>
            {servicesData.length > 0 ? (
                servicesData.map((service) => (
                    <button key={service.service_id} onClick={() => handleSelectedService(service)}>
                        {service.name} - ${service.price}
                    </button>
                ))
            ) : (
                <p>No services available</p>
            )}
        </div>
    );
}
