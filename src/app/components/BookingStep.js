"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function BookingStep({ nextStep, prevStep, handleDataChange, formData }) {
    const [scheduleBlocks, setScheduleBlocks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchScheduleSlots = async () => {
            if (!formData.service_id || !formData.location_id) {
                console.error("Service ID and Location ID are required to fetch bookable slots.");
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const from = new Date().toISOString(); // Example: Start from the current time
                const to = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // Example: 7 days from now
                const response = await axios.get(
                    `http://localhost:3001/services/${formData.service_id}/bookable-slots`,
                    {
                        params: {
                            from,
                            to,
                            location: formData.location_id,
                        },
                    }
                );

                // Update this line to correctly set the array of bookable slots
                setScheduleBlocks(response.data.data); // Assuming the actual slots are in the 'data' property of the response
            } catch (err) {
                console.error("Error fetching bookable slots:", err.message);
                setError("Failed to fetch bookable slots. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchScheduleSlots();
    }, [formData.service_id, formData.location_id]);

    const handleSelectedBooking = (booking) => {
        handleDataChange("booking", {
            time: `${new Date(booking.starts_at).toLocaleString()} - ${new Date(booking.ends_at).toLocaleString()}`,
            resource: booking.resources[0]?.name || "Unknown Resource",
        });
        nextStep();
    };
    

    return (
        <div className="flex items-center justify-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <h1 className="">Select a Schedule Slot</h1>
            {loading && <p>Loading schedule slots...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && !error && scheduleBlocks.length === 0 && (
                <p>No available schedule slots for the selected service and location.</p>
            )}
            {!loading &&
                !error &&
                scheduleBlocks.map((booking) => (
                    <button
                        key={booking.starts_at} // Use a unique identifier, e.g., starts_at
                        onClick={() => handleSelectedBooking(booking)}
                        className="bg-blue-500 text-white py-2 px-4 rounded m-2"
                    >
                        {new Date(booking.starts_at).toLocaleString()} - {new Date(booking.ends_at).toLocaleString()}
                    </button>
                ))}
            <button onClick={prevStep} className="bg-gray-500 text-white py-2 px-4 rounded mt-4">
                Go Back
            </button>
        </div>
    );
}
