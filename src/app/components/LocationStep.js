"use client";
import React, { useState, useEffect } from "react";

export default function Locations({ nextStep, prevStep, handleDataChange, business }) {
    const [locationsData, setLocationsData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                if (!business?.slug) {
                    console.error("Business slug not available");
                    return;
                }

                const response = await fetch(`http://ec2-3-1-205-2.ap-southeast-1.compute.amazonaws.com:3001/api/locations/${business.slug}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch locations");
                }
                const data = await response.json();
                console.log("Locations data:", data);
                setLocationsData(data.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching locations:", error);
                setLoading(false);
            }
        };

        fetchLocations();
    }, [business]);

    if (loading) {
        return (
            <div className="flex justify-center items-center">
                <p className="text-gray-600">Loading locations...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col justify-between items-center gap-4">
            <h1 className="text-xl font-semibold text-gray-800">Select a Location</h1>
            {locationsData && locationsData.length > 0 ? (
                <div className="w-full space-y-3">
                    {locationsData.map((location) => (
                        <button
                            key={location.location_id}
                            onClick={() => {
                                handleDataChange("location", {
                                    id: location.location_id,
                                    name: location.name,
                                    address: location.address
                                });
                                nextStep();
                            }}
                            className="w-full px-4 py-3 text-left border rounded-xl hover:bg-gray-50 transition-colors duration-200"
                        >
                            <div className="flex flex-col">
                                <span className="text-gray-800 font-medium">{location.name}</span>
                                <span className="text-gray-600 text-sm">{location.address}</span>
                            </div>
                        </button>
                    ))}
                </div>
            ) : (
                <p className="text-gray-600">No locations available</p>
            )}
            <button
                onClick={prevStep}
                className="mt-4 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
            >
                Go Back
            </button>
        </div>
    );
}