"use client";
import React from 'react';
import { servicesData } from '../data';

export default function services({ nextStep, handleDataChange }){
    const handleSelectedService = (service) => {
        handleDataChange("service", service);
        nextStep();
    };
    return(
        <div className='flex flex-col'>
            <h1>Select a Service</h1>
            {servicesData.map((service) => (
                <button key={service.id} onClick={() => handleSelectedService(service)}>
                    {service.name}
                </button>
            ))}
        </div>
    )
}