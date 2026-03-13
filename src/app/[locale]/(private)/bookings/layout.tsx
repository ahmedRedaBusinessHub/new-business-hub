import Footer from "@/components/layout/public/Footer";
import Navbar from "@/components/layout/public/Navbar";

export default function BookingsLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Navbar />
            <main>{children}</main>
            <Footer />
        </>
    );
}
