// import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/features/Footer";
import Navbar from "@/components/features/Navbar";
// import Footer from "@/components/shared/Footer";

export default function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
