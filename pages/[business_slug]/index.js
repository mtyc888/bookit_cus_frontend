import MultiStepForm from "@/app/components/MultiStepForm";
import "@/app/globals.css";
import http from 'http';

export async function getServerSideProps(context) {
    const { business_slug } = context.params;
    console.log("Fetching data for business_slug:", business_slug);

    return new Promise((resolve) => {
        // Use http.get instead of fetch
        http.get(`http://13.229.116.85:3001/api/business/${business_slug}`, (res) => {
            let data = '';

            // A chunk of data has been received.
            res.on('data', (chunk) => {
                data += chunk;
            });

            // The whole response has been received.
            res.on('end', () => {
                if (res.statusCode !== 200) {
                    console.error(`Failed to fetch business data: ${res.statusCode}`);
                    resolve({ notFound: true });
                    return;
                }

                try {
                    const business = JSON.parse(data);
                    console.log("Successfully fetched business data:", business);
                    resolve({
                        props: {
                            business,
                            slug: business_slug
                        }
                    });
                } catch (error) {
                    console.error("Error parsing business data:", error);
                    resolve({ notFound: true });
                }
            });
        }).on('error', (error) => {
            console.error("Error fetching business data:", error);
            resolve({ notFound: true });
        });
    });
}

export default function BusinessPage({ business, slug }) {
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