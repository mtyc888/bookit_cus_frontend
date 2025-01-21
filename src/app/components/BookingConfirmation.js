"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function BookingConfirmation({ businessSlug }) {
    const router = useRouter();
    const [bookingDetails, setBookingDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            try {
                const confirmation = localStorage.getItem("bookingConfirmation");
                if (confirmation) {
                    const parsed = JSON.parse(confirmation);
                    // Verify the business slug matches
                    if (parsed.business?.slug === businessSlug) {
                        setBookingDetails(parsed);
                        localStorage.removeItem("bookingConfirmation");
                    } else {
                        // Redirect to the business home page if slugs don't match
                        router.push(`/${businessSlug}`);
                    }
                } else {
                    // No booking details found, redirect to business home
                    router.push(`/${businessSlug}`);
                }
            } catch (error) {
                console.error("Error parsing booking confirmation:", error);
                router.push(`/${businessSlug}`);
            }
            setIsLoading(false);
        }
    }, [businessSlug, router]);

    if (isLoading) {
        return <div className="flex justify-center items-center min-h-screen">
            <div className="text-center p-8">Loading...</div>
        </div>;
    }

    if (!bookingDetails) {
        return null; // Router will handle the redirect
    }

    // If no booking details found and not loading
    if (!bookingDetails && !isLoading) {
        return <div className="flex justify-center items-center min-h-screen">
            <div className="text-center p-8">
                <h1 className="text-2xl font-bold mb-4">No Booking Found</h1>
                <p className="mb-4">Sorry, we couldn't find your booking details.</p>
                <Link href="/" className="text-blue-500 hover:text-blue-600">
                    Return to Homepage
                </Link>
            </div>
        </div>;
    }
    return (
        <div className="max-w-2xl mx-auto p-6 bg-white text-slate-700">
            {/* Success Message */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
                <div className="flex items-center justify-center mb-4">
                    <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h1 className="text-2xl font-bold text-center text-green-800 mb-2">Booking Confirmed!</h1>
                <p className="text-center text-green-700">A confirmation email has been sent to {bookingDetails.customerInfo.email}</p>
            </div>

            {/* Booking Details */}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
                <div className="border-b px-6 py-4">
                    <h2 className="text-xl font-semibold">Booking Details</h2>
                    <p className="text-gray-500 text-sm">Booking ID: {bookingDetails.bookingId}</p>
                </div>

                <div className="p-6 space-y-6">
                    {/* Service Details */}
                    <div>
                        <h3 className="font-medium text-gray-900 mb-2">Service Information</h3>
                        <div className="bg-gray-50 rounded p-4">
                            <p className="text-lg font-semibold">{bookingDetails.serviceInfo.name}</p>
                            <p className="text-gray-600">${bookingDetails.serviceInfo.price}</p>
                            <p className="text-gray-600">Location: {bookingDetails.serviceInfo.location}</p>
                            <p className="text-gray-600">Resource: {bookingDetails.serviceInfo.resource}</p>
                        </div>
                    </div>

                    {/* Date & Time */}
                    <div>
                        <h3 className="font-medium text-gray-900 mb-2">Schedule</h3>
                        <div className="bg-gray-50 rounded p-4">
                            <p className="text-gray-600">Date: {new Date(bookingDetails.serviceInfo.date).toLocaleDateString()}</p>
                            <p className="text-gray-600">Time: {bookingDetails.serviceInfo.time}</p>
                        </div>
                    </div>

                    {/* Customer Details */}
                    <div>
                        <h3 className="font-medium text-gray-900 mb-2">Customer Information</h3>
                        <div className="bg-gray-50 rounded p-4">
                            <p className="text-gray-600">Name: {bookingDetails.customerInfo.name}</p>
                            <p className="text-gray-600">Email: {bookingDetails.customerInfo.email}</p>
                            <p className="text-gray-600">Phone: {bookingDetails.customerInfo.phone}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Next Steps */}
            <div className="bg-blue-50 rounded-lg p-6 mb-8">
                <h2 className="text-lg font-semibold text-blue-800 mb-4">What's Next?</h2>
                <ul className="space-y-2 text-blue-700">
                    <li className="flex items-center">
                        <span className="mr-2">•</span>
                        A confirmation email has been sent to your inbox
                    </li>
                    <li className="flex items-center">
                        <span className="mr-2">•</span>
                        Please arrive 5-10 minutes before your appointment
                    </li>
                    <li className="flex items-center">
                        <span className="mr-2">•</span>
                        If you need to reschedule, please contact us 24 hours in advance
                    </li>
                </ul>
            </div>

            {/* Return Home Button */}
            <div className="text-center">
                <Link 
                    href={`/${bookingDetails.business?.slug || ''}`}
                    className="inline-block bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-colors"
                >
                    Book another appointment.
                </Link>
            </div>
        </div>
    );
}