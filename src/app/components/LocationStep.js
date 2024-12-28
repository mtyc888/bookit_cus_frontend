"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from "next/router";
export default function LocationStep({ nextStep, prevStep, handleDataChange }){
    const [locationData, setLocationData] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { business_id } = router.query;
    useEffect(() => {
        //fetch locations data from backend via api
        const fetchLocations = async () =>{
            try{
                const response = await fetch(`http://localhost:3001/locations/${business_id}`);
                if(!response.ok){
                    throw new Error("Failed to fetch locations");
                }
                const data = await response.json();
                console.log(data);
                setLocationData(data);
                setLoading(false);
            }catch(error){
                console.error("Error fetching locations", error);
                setLoading(false);
            }
        }
        fetchLocations();
    },[])
    if(loading){
        return <p>Loading location...</p>
    }
    const handleSelectedLocation = (location) => {
        handleDataChange("location_id", location.location_id);
        nextStep();
    };
    return(
        <div className='flex flex-col'>
            <h1>Select a Location</h1>
            {locationData.data.length > 0 ? (
                locationData.data.map((location) => (
                    <button key={location.location_id} onClick={() => handleSelectedLocation(location)}>
                        {location.name}
                    </button>
                ))
            ) : (
                <p>No locations available</p>
            )}
            <button onClick={prevStep}>Go Back</button>
        </div>
    )
}