"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function Services({ nextStep, handleDataChange, business }) {
    const [servicesData, setServicesData] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchServices = async () => {
            console.log("Business prop:", business);
            try {
                if (!business?.slug) {
                    console.error("Business slug not available");
                    return;
                }

                // Updated to use slug instead of ID
                const response = await fetch(`http://ec2-3-1-205-2.ap-southeast-1.compute.amazonaws.com:3001/api/services/${business.slug}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch services");
                }
                const data = await response.json();
                console.log("Services data:", data);
                setServicesData(data.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching services:", error);
                setLoading(false);
            }
        };

        fetchServices();
    }, [business]);

    if (loading) {
        return (
            <div className="flex justify-center items-center">
                <p className="text-gray-600">Loading services...</p>
            </div>
        );
    }

    const handleSelectedService = (service) => {
        handleDataChange("service", {
            id: service.service_id,
            name: service.name,
            price: service.price
        });
        nextStep();
    };

    return (
        <div className="flex flex-col justify-between items-center gap-4">
            <h1 className="text-xl font-semibold text-gray-800">Select a Service</h1>
            {servicesData.length > 0 ? (
                <div className="w-full space-y-3">
                    {servicesData.map((service) => (
                        <button
                            key={service.service_id}
                            onClick={() => handleSelectedService(service)}
                            className="w-full px-4 py-3 text-left border rounded-xl hover:bg-gray-50 transition-colors duration-200"
                        >
                            <div className="flex justify-between items-center">
                                <span className="text-gray-800">{service.name}</span>
                                <span className="text-gray-600">${service.price}</span>
                            </div>
                        </button>
                    ))}
                </div>
            ) : (
                <p className="text-gray-600">No services available</p>
            )}
        </div>
    );
}