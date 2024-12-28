"use client";
import React from 'react';
import { resourcesData } from '../data';

export default function ResourceStep({ nextStep, prevStep, handleDataChange }){
    const handleSelectedResource = (resource) =>{
        handleDataChange("resource", resource);
        nextStep();
    }
    return(
        <div className='flex flex-col'>
            <h1>Select a Resource</h1>
            {resourcesData.map((resource) => (
                <button key={resource.id} onClick={() => handleSelectedResource(resource)}>
                    {resource.name}
                </button>
            ))}
            <button onClick={prevStep}>Go Back</button>
        </div>
    )
}