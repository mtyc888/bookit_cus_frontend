"use client";
import React, { useEffect, useState } from 'react';
import { scheduleBlocksData } from '../data';

export default function BookingStep({ nextStep, prevStep, handleDataChange, formData }){

    useEffect(() => {
        console.log("Selected Service ID:", formData.service_id);
        console.log("Selected Location ID:", formData.location_id);
        // Use formData.service_id as needed
    }, [formData.service_id]);
    const handleSelectedBooking = (booking) =>{
        handleDataChange("booking", booking);
        nextStep();
    }
    return(
        <div className='flex flex-col'>
            <h1>Select a Schedule Slot</h1>
            {scheduleBlocksData.map((booking) => (
                <button key={booking.id} onClick={() => handleSelectedBooking(booking)}>
                    {booking.time}
                </button>
            ))}
            <button onClick={prevStep}>Go Back</button>
        </div>
    )
}