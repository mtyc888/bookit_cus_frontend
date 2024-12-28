import React from "react";

const Summary = ({ formData, prevStep, setStep, setFormData }) => {
    const handleFinish = () =>{
        alert("Booking confirmed");
        localStorage.removeItem("currentStep");
        localStorage.removeItem("formData");
        //reset state
        setStep(1);
        setFormData({ service: null, location: null, resource: null, booking: null });
    };
  return (
    <div className='flex flex-col'>
      <h2>Booking Summary</h2>
      <p><strong>Service:</strong> {formData.service?.name}</p>
      <p><strong>Location:</strong> {formData.location?.name}</p>
      <p><strong>Resource:</strong> {formData.resource?.name}</p>
      <p><strong>Schedule:</strong> {formData.booking?.time}</p>
      <button onClick={prevStep}>Go Back</button>
      <button onClick={handleFinish}>Confirm Booking</button>
    </div>
  );
};

export default Summary;
