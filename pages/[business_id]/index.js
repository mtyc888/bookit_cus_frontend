// Next.js Dynamic Route: pages/[business_id]/index.js
import MultiStepForm from "@/app/components/MultiStepForm";
import "@/app/globals.css";

export async function getServerSideProps(context) {
    const { business_id } = context.params;

    try {
        // Fetch the business data from your Node.js API using user_id
        const res = await fetch(`http://localhost:3001/api/business/${business_id}`);
        if (!res.ok) {
            return { notFound: true };
        }

        const business = await res.json();

        // Pass the business data to the page
        return {
            props: { business }, // Pass business-specific data as props
        };
    } catch (error) {
        console.error("Error fetching business data:", error);
        return { notFound: true };
    }
}

export default function BusinessPage({ business }) {
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
                    <MultiStepForm />
                </div>
            </div>
        </div>
    );
}
