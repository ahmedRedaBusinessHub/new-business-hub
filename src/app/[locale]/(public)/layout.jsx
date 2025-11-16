import Footer from "@/components/layout/public/Footer";
import Navbar from "@/components/layout/public/Navbar";

export default function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
