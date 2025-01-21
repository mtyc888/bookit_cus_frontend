"use client";
import React, { useState } from "react";
import { useRouter } from 'next/navigation';
const Summary = ({ formData, prevStep, setStep, setFormData, business }) => {
    console.log('Business in Summary:', business);
    const router = useRouter();
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
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
    const handleFinish = async () => {
        if(!validationForm()){
            return;
        }
        //show loading using state
        setIsLoading(true);
        try {
            // First API call - booking
            const response = await fetch(`http://13.229.116.85:3001/api/bookings`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    location_id: formData.location?.id,
                    service_id: formData.service?.id,
                    resource_id: formData.resource?.id,
                    price: formData.service?.price,
                    starts_at: formData.booking?.starts_at,
                    ends_at: formData.booking?.ends_at,
                    user_id: business?.id,
                    payment_status: 0,
                    status: 1,
                    customer_name: customerInfo.customer_name,  
                    customer_phone: customerInfo.customer_phone,
                    customer_email: customerInfo.customer_email
                }),
            });

            if (!response.ok) {
                throw new Error('Booking creation failed');
            }
            const bookingData = await response.json();
            // Second API call - email
            const emailResponse = await fetch(`http://13.229.116.85:3001/api/notifications/send-mail`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  to: customerInfo.customer_email,
                  template: "booking",
                  data: {
                      customer_name: customerInfo.customer_name,  
                      service_name: formData.service?.name,
                      location_name: formData.location?.name,
                      time: `${formData.booking?.starts_at?.split('T')[0]} ${formData.booking?.time}`,
                      service_price: formData.service?.price
                  },
                  from: "ymarvintan@gmail.com"
                })
            });

            if (!emailResponse.ok) {
                const emailError = await emailResponse.json();
                throw new Error(emailError.message || 'Failed to send email notification');
            }
            
            //save the booking confirmation details
            const bookingConfirmation = {
              bookingId: bookingData.id,
              customerInfo: {
                name: customerInfo.customer_name,
                email: customerInfo.customer_email,
                phone: customerInfo.customer_phone
              },
              serviceInfo: {
                name: formData.service?.name,
                price: formData.service?.price,
                location: formData.location?.name,
                resource: formData.booking?.resource?.name,
                date: formData.booking?.starts_at?.split('T')[0] || '',
                time: formData.booking?.time
              },
              business: {
                name: business?.name,
                id: business?.id,
                slug: business?.slug
              }
            }

            // Clear storage and reset state
            localStorage.removeItem("currentStep");
            localStorage.removeItem("formData");
            //here we need to redirect to summary page
            localStorage.setItem("bookingConfirmation", JSON.stringify(bookingConfirmation));
            // Redirect to confirmation page
            router.push(`/${business.slug}/booking_confirmation`);
            setFormData({ service: null, location: null, resource: null, booking: null });

        } catch (error) {
            setError(error.message);
            console.error('Error:', error.message);
            return; // Prevent state reset on error
        } finally{
          //hide loading using state
          setIsLoading(false);
        }
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
            {/* Add loading overlay */}
            {isLoading && (
                <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-90 z-50">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <h2 className="text-xl font-semibold text-blue-500">Processing your booking...</h2>
                        <p className="text-gray-500 mt-2">Please wait a moment</p>
                    </div>
                </div>
            )}
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
                  className={`text-gray-800 py-2 px-6 rounded-lg transition-colors`}
              >
                  Go Back
              </button>
              <button 
                  onClick={handleFinish}
                  className={`text-black py-2 px-6 rounded-lg transition-colors`}
              >
                  Confirm Booking
              </button>
            </div>
        </div>
    );
};

export default Summary;