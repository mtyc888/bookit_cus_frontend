import { useRouter } from 'next/router'; 
import dynamic from 'next/dynamic';

const BookingConfirmation = dynamic(
  () => import('@/app/components/BookingConfirmation'),
  { ssr: false }
);

export default function BookingConfirmationPage() {
  const router = useRouter();
  const { business_slug } = router.query;

  return <BookingConfirmation businessSlug={business_slug} />;
}