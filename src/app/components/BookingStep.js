"use client";
import React from 'react';
import { scheduleBlocksData } from '../data';

export default function BookingStep({ nextStep, prevStep, handleDataChange }){
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