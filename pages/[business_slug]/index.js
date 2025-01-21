import MultiStepForm from "@/app/components/MultiStepForm";
import "@/app/globals.css";
import https from 'https';

export async function getServerSideProps(context) {
    const { business_slug } = context.params;
    console.log("Fetching data for business_slug:", business_slug);

    try {
        // Create custom agent to handle SSL
        const agent = new https.Agent({
            rejectUnauthorized: false
        });

        const res = await fetch(
            `http://13.229.116.85:3001/api/business/${business_slug}`,
            {
                headers: {
                    'Accept': 'application/json',
                    'User-Agent': 'NextJS/ServerSide'
                },
                agent
            }
        );

        console.log("API Response Status:", res.status);

        if (!res.ok) {
            console.error(`Failed to fetch business data: ${res.status}`);
            // Log the error response body for debugging
            const errorBody = await res.text();
            console.error("Error response body:", errorBody);
            return { notFound: true };
        }

        const business = await res.json();
        console.log("Successfully fetched business data:", business);

        return {
            props: {
                business,
                slug: business_slug
            },
        };
    } catch (error) {
        console.error("Error fetching business data:", error.message);
        // Return more detailed error information in development
        return {
            props: {
                error: process.env.NODE_ENV === 'development' ? error.message : 'An error occurred',
                slug: business_slug
            }
        };
    }
}

export default function BusinessPage({ business, slug, error }) {
    // Handle error state
    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
                <div className="max-w-3xl w-full bg-white shadow-md rounded-lg p-6">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">
                        Error Loading Business Page
                    </h1>
                    {process.env.NODE_ENV === 'development' && (
                        <p className="text-gray-600 mb-6">{error}</p>
                    )}
                </div>
            </div>
        );
    }

    // Handle loading state
    if (!business) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
                <div className="max-w-3xl w-full bg-white shadow-md rounded-lg p-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">Loading...</h1>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
            <div className="max-w-3xl w-full bg-white shadow-md rounded-lg p-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">
                    Welcome to <span className="text-blue-600">{business.name}</span>'s Booking Page
                </h1>
                <p className="text-gray-600 mb-6">
                    This is <span className="font-semibold">{business.name}</span>'s dynamic booking page. Follow the steps below to complete your booking.
                </p>
                <div className="border-t border-gray-200 mt-4 pt-4">
                    <MultiStepForm business={business} />
                </div>
            </div>
        </div>
    );
}