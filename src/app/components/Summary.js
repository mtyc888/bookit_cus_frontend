import React, { useState } from "react";

const Summary = ({ formData, prevStep, setStep, setFormData }) => {
  const [customerInfo, setCustomerInfo] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: ''
  });
  const [errors, setErrors] = useState({});
  const validationForm = () =>{
    const newErrors = {};
    if(!customerInfo.customer_name.trim()){
      newErrors.customer_name = 'Name is required';
    }
    if (!customerInfo.customer_phone.trim()){
      newErrors.customer_phone = 'Phone number is required';
    } else if(!/^\d{8,}$/.test(customerInfo.customer_phone.trim())){
      newErrors.customer_phone = 'Please enter a valid phone number';
    }

    if(!customerInfo.customer_email.trim()){
      newErrors.customer_email = 'Email is required';
    } else if(!/\S+@\S+\.\S+/.test(customerInfo.customer_email)){
      newErrors.customer_email = 'Please enter a valid email';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleFinish = () => {
        // Create a formatted summary string
        const summary = `
    Booking Summary:
    ----------------

    Customer Information:
    Name: ${customerInfo.customer_name}
    Phone: ${customerInfo.customer_phone}
    Email: ${customerInfo.customer_email}

    Booking Details:
    Service: ${formData.service?.name || 'Not selected'} - $${formData.service?.price || '0'}
    Location: ${formData.location?.name || 'Not selected'}
    Resource: ${formData.booking?.resource?.name || 'Not selected'}
    Schedule: ${formData.booking?.time || 'Not selected'}

    Start: ${formData.booking?.starts_at || 'Not selected'}
    End: ${formData.booking?.ends_at || 'Not selected'}

    Booking Details IDs:
    Service id: ${formData.service?.id}
    Location id: ${formData.location?.id}
    Resource id: ${formData.resource?.id}
    `;

        // Show the summary alert first
        alert(summary);        
        // Clear storage and reset state
        localStorage.removeItem("currentStep");
        localStorage.removeItem("formData");
        setStep(1);
        setFormData({ service: null, location: null, resource: null, booking: null });
    };

    const handleInputChange = (e) =>{
      const {name,value} = e.target;
      setCustomerInfo(prev => ({
        ...prev,
        [name]:value
      }));
      //clear error when user starts typing
      if(errors[name]){
        setErrors(prev => ({
          ...prev,
          [name]: ''
        }));
      }
    }

    return (
        <div className="flex flex-col items-center gap-4 p-8 text-black">
            <h2 className="text-2xl font-semibold mb-4">Booking Summary</h2>
            {/* Customer Information Form */}
            <div className="w-full max-w-md space-y-4 bg-white p-6 rounded-lg shadow mb-4">
                <h3 className="text-xl font-medium mb-4">Customer Information</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Name *</label>
                        <input
                            type="text"
                            name="customer_name"
                            value={customerInfo.customer_name}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your name"
                        />
                        {errors.customer_name && <p className="text-red-500 text-sm mt-1">{errors.customer_name}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Phone *</label>
                        <input
                            type="tel"
                            name="customer_phone"
                            value={customerInfo.customer_phone}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your phone number"
                        />
                        {errors.customer_phone && <p className="text-red-500 text-sm mt-1">{errors.customer_phone}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Email *</label>
                        <input
                            type="email"
                            name="customer_email"
                            value={customerInfo.customer_email}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your email"
                        />
                        {errors.customer_email && <p className="text-red-500 text-sm mt-1">{errors.customer_email}</p>}
                    </div>
                </div>
            </div>
            <div className="w-full max-w-md space-y-4 bg-white p-6 rounded-lg shadow">
                <p><strong>Service:</strong> {formData.service?.name}</p>
                <p><strong>Location:</strong> {formData.location?.name}</p>
                <p><strong>Resource:</strong> {formData.booking?.resource?.name}</p>
                <p><strong>Schedule:</strong> {formData.booking?.time}</p>
            </div>
            <div className="flex gap-4 mt-6">
                <button 
                    onClick={prevStep}
                    className="bg-gray-200 text-gray-800 py-2 px-6 rounded-lg hover:bg-gray-300 transition-colors"
                >
                    Go Back
                </button>
                <button 
                    onClick={handleFinish}
                    className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition-colors"
                >
                    Confirm Booking
                </button>
            </div>
        </div>
    );
};

export default Summary;