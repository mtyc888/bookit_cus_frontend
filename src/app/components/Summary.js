import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
const Summary = ({ formData, prevStep, setStep, setFormData, business }) => {
    console.log('Business in Summary:', business);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
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
    const notifySuccess = () => {
      toast.success("Booking Successful, Please Check Your Email For Summary.");
    };
    const notifyError = () => {
      toast.error("Booking UnSuccessful.");
    };
    const handleFinish = async () => {
      //prevent multiple submissions
        if(isSubmitting){
          return;
        }
        if(!validationForm()){
            notifyError();
            return;
        }
        setIsSubmitting(true);
        try {
            // First API call - booking
            const response = await fetch(`http://localhost:3001/api/bookings`, {
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

            // Second API call - email
            const emailResponse = await fetch(`http://localhost:3001/api/notifications/send-mail`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    to: customerInfo.customer_email,
                    template: "booking",
                    data: {
                        customerName: customerInfo.customer_name,
                        date: formData.booking?.starts_at?.split('T')[0] || '',
                        time: formData.booking?.time,
                        service: formData.service?.name,
                        location: formData.location?.name
                    },
                    from: "ymarvintan@gmail.com"  // Removed process.env as it's client-side
                })
            });

            if (!emailResponse.ok) {
                const emailError = await emailResponse.json();
                throw new Error(emailError.message || 'Failed to send email notification');
            }

            // If both calls succeed, show success notification and reset
            notifySuccess();
            
            // Clear storage and reset state
            localStorage.removeItem("currentStep");
            localStorage.removeItem("formData");
            setStep(1);
            setFormData({ service: null, location: null, resource: null, booking: null });

        } catch (error) {
            notifyError();
            setError(error.message);
            console.error('Error:', error.message);
            return; // Prevent state reset on error
        } finally{
          setIsSubmitting(false); //re-enable
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
            <ToastContainer 
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
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
                  disabled={isSubmitting}
                  className={`${
                      isSubmitting 
                      ? 'bg-gray-300 cursor-not-allowed' 
                      : 'bg-gray-200 hover:bg-gray-300'
                  } text-gray-800 py-2 px-6 rounded-lg transition-colors`}
              >
                  Go Back
              </button>
              <button 
                  onClick={handleFinish}
                  disabled={isSubmitting}
                  className={`${
                      isSubmitting 
                      ? 'bg-blue-300 cursor-not-allowed' 
                      : 'bg-blue-500 hover:bg-blue-600'
                  } text-white py-2 px-6 rounded-lg transition-colors`}
              >
                  {isSubmitting ? 'Confirming...' : 'Confirm Booking'}
              </button>
            </div>
        </div>
    );
};

export default Summary;