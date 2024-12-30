"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from "next/router";

export default function ResourceStep({ nextStep, prevStep, handleDataChange, formData }){
    const [resourceData, setResourceData] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { business_id } = router.query;
    useEffect(() => {
        const fetchResources = async () => {
            try {
                // Fetch services for the specific business owner by user_id
                const response = await fetch(`http://localhost:3001/resources/${business_id}`);
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

        if (business_id) {
            fetchResources();
        }
    }, [business_id]);

    if (loading) {
        return <p>Loading resources...</p>;
    }
    const handleSelectedResource = (resource) =>{
        handleDataChange("resource_id", resource.resource_id);
        nextStep();
    }
    return(
        <div className='flex flex-col'>
            <h1 className=''>Select a Resource</h1>
            {resourceData.length > 0 ? (
                resourceData.map((resource) => (
                    <button key={resource.resource_id} onClick={() => handleSelectedResource(resource)}>
                        {resource.name}
                    </button>
                ))
            ) : (
                <p>No resources available</p>
            )}
            <button onClick={prevStep}>Go Back</button>
        </div>
    )
}