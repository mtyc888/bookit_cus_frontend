"use client";
import React from 'react';
import { locationsData } from '../data';

export default function LocationStep({ nextStep, prevStep, handleDataChange }){
    const handleSelectedLocation = (location) => {
        handleDataChange("location", location);
        nextStep();
    };
    return(
        <div className='flex flex-col'>
            <h1>Select a Location</h1>
            {locationsData.map((location) => (
                <button key={location.id} onClick={() => handleSelectedLocation(location)}>
                    {location.name}
                </button>
            ))}
            <button onClick={prevStep}>Go Back</button>
        </div>
    )
}