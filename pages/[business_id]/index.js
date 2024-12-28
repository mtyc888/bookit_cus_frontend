// Next.js Dynamic Route: pages/[business_id]/index.js
import MultiStepForm from "@/app/components/MultiStepForm";

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
        console.error('Error fetching business data:', error);
        return { notFound: true };
    }
}

export default function BusinessPage({ business }) {
    return (
        <div>
            <h1>Welcome to {business.name}'s Booking Page</h1>
            <p>This is {business.name}'s dynamic booking page.</p>
            <MultiStepForm/>
        </div>
    );
}
