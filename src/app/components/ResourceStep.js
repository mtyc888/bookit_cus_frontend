"use client";
import React, { useEffect, useState } from 'react';

export default function ResourceStep({ nextStep, prevStep, handleDataChange, formData, business }){
    const [resourceData, setResourceData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        
        const fetchResources = async () => {
            try {
                // Fetch services for the specific business owner by user_id
                const response = await fetch(`http://localhost:3001/api/resources/${business.slug}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch resources");
                }
                const data = await response.json();
                console.log(data)
                setResourceData(data.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching resouces:", error);
                setLoading(false);
            }
        };

        fetchResources();
    }, [business]);

    if (loading) {
        return <p className='text-black'>Loading resources...</p>;
    }
    const handleSelectedResource = (resource) =>{
        handleDataChange("resource",{
            id: resource.resource_id,
            name: resource.name
        }); 
        nextStep();
    }
    return(
        <div className='flex flex-col justify-between items-center gap-4'>
            <h1 className='text-xl font-semibold text-gray-800'>Select a Resource</h1>
            {resourceData.length > 0 ? (
                resourceData.map((resource) => (
                    <button 
                    key={resource.resource_id} 
                    onClick={() => handleSelectedResource(resource)} 
                    className='w-full px-4 py-3 text-left border rounded-xl hover:bg-gray-50 transition-colors duration-200'
                    >
                        <div className='flex flex-col'>
                            <span className='text-gray-800 font-medium'>{resource.name}</span>
                        </div>
                    </button>
                ))
            ) : (
                <p>No resources available</p>
            )}
            <button onClick={prevStep} className='text-black'>Go Back</button>
        </div>
    )
}