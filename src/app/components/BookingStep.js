"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function BookingStep({ nextStep, prevStep, handleDataChange, formData }) {
    const [scheduleBlocks, setScheduleBlocks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [groupedSlots, setGroupedSlots] = useState({});

    useEffect(() => {
        const fetchScheduleSlots = async () => {
            if (!formData.service?.id || !formData.location?.id) {
                console.error("Service ID and Location ID are required to fetch bookable slots.");
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const from = new Date().toISOString();
                const to = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
                const response = await axios.get(
                    `http://ec2-3-1-205-2.ap-southeast-1.compute.amazonaws.com:3001/api/services/${formData.service.id}/bookable-slots`,
                    {
                        params: {
                            from,
                            to,
                            location: formData.location.id,
                        },
                    }
                );

                // Group slots by date
                const slots = response.data.data;
                const grouped = slots.reduce((acc, slot) => {
                    const date = new Date(slot.starts_at).toLocaleDateString();
                    if (!acc[date]) {
                        acc[date] = [];
                    }
                    acc[date].push(slot);
                    return acc;
                }, {});

                setGroupedSlots(grouped);
                setScheduleBlocks(slots);
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
            starts_at: booking.starts_at,
            ends_at: booking.ends_at,
            resource: {
                id: booking.resources[0]?.id,
                name: booking.resources[0]?.name || "Unknown Resource"
            }
        });
        nextStep();
    };

    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="flex flex-col items-center min-h-screen p-8 font-[family-name:var(--font-geist-sans)] text-black">
            <h1 className="text-2xl font-semibold mb-8">Select a Schedule Slot</h1>
            
            {loading && <p>Loading schedule slots...</p>}
            {error && <p className="text-red-500">{error}</p>}
            
            {!loading && !error && scheduleBlocks.length === 0 && (
                <p>No available schedule slots for the selected service and location.</p>
            )}

            {/* Date Selection */}
            {!loading && !error && scheduleBlocks.length > 0 && (
                <div className="w-full max-w-4xl mb-8">
                    <h2 className="text-lg font-medium mb-4">Select Date</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {Object.keys(groupedSlots).map((date) => (
                            <button
                                key={date}
                                onClick={() => setSelectedDate(date)}
                                className={`p-4 rounded-lg text-center transition-colors
                                    ${selectedDate === date 
                                        ? 'bg-blue-500 text-white' 
                                        : 'bg-gray-100 hover:bg-gray-200'}`}
                            >
                                {new Date(date).toLocaleDateString('en-US', {
                                    weekday: 'short',
                                    month: 'short',
                                    day: 'numeric'
                                })}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Time Slots */}
            {selectedDate && (
                <div className="w-full max-w-4xl">
                    <h2 className="text-lg font-medium mb-4">Select Time</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {groupedSlots[selectedDate]?.map((booking) => (
                            <button
                                key={booking.starts_at}
                                onClick={() => handleSelectedBooking(booking)}
                                className="bg-blue-500 text-white rounded-lg p-4 flex flex-col items-center justify-center text-center hover:bg-blue-600 transition-colors"
                            >
                                <span className="font-medium">
                                    {formatTime(booking.starts_at)}
                                </span>
                                <span className="text-sm">to</span>
                                <span className="font-medium">
                                    {formatTime(booking.ends_at)}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <button 
                onClick={prevStep} 
                className="bg-gray-200 text-gray-800 py-2 px-6 rounded-lg hover:bg-gray-300 transition-colors mt-8"
            >
                Go Back
            </button>
        </div>
    );
}