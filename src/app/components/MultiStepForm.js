"use client";
import React, { useEffect, useState } from 'react';
import Services from './ServiceStep';
import Locations from './LocationStep';
import Resources from './ResourceStep';
import Booking from './BookingStep';
import Summary from './Summary';

export default function MultiStepForm({ business }) {
    
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        service_id: null,
        location_id: null,
        booking_id: null,
        resource_id: null
    });

    useEffect(() => {
        const savedStep = localStorage.getItem("currentStep");
        const savedFormData = localStorage.getItem("formData");
        if(savedStep){
            setStep(parseInt(savedStep, 10));
        }
        if(savedFormData){
            setFormData(JSON.parse(savedFormData));
        }
        setLoading(false);
    }, []);

    useEffect(() =>{
        if(!loading){
            localStorage.setItem("currentStep", step);
        }
    }, [step, loading]);

    useEffect(() =>{
        if(!loading){
            localStorage.setItem("formData", JSON.stringify(formData));
        }
    }, [formData, loading]);

    const nextStep = () => setStep((prev) => prev + 1);
    const prevStep = () => setStep((prev) => prev - 1);
    
    const handleDataChange = (field, value) => {
        setFormData({ ...formData, [field]:value})
    }

    if(loading){
        return(
            <div>Loading...</div>
        )
    }

    switch (step){
        case 1:
            return (
                <Services 
                    nextStep={nextStep} 
                    handleDataChange={handleDataChange} 
                    formData={formData}
                    business={business}
                />
            );
        case 2:
            return (
                <Locations 
                    nextStep={nextStep} 
                    prevStep={prevStep} 
                    handleDataChange={handleDataChange} 
                    formData={formData}
                    business={business} 
                />
            );
        case 3:
            return (
                <Resources 
                    nextStep={nextStep} 
                    prevStep={prevStep} 
                    handleDataChange={handleDataChange} 
                    formData={formData}
                    business={business} 
                />
            );
        case 4:
            return (
                <Booking 
                    nextStep={nextStep} 
                    prevStep={prevStep} 
                    handleDataChange={handleDataChange} 
                    formData={formData}
                    business={business}
                />
            );
        case 5:
            return (
                <Summary 
                    formData={formData} 
                    prevStep={prevStep} 
                    setStep={setStep} 
                    setFormData={setFormData}
                    business={business} 
                />
            );
    }
}