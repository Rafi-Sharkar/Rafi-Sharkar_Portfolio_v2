import Navbar from '@/components/Navbar';
import ContactForm from '@/components/ContactForm';

export default function Page() {
  return (
    <>
      <Navbar />
      <ContactForm showFooter={true} />
    </>
  );
}