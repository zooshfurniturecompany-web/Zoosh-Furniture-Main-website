import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import FloatingContact from "@/components/layout/floating-contact";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow pt-[84px]">{children}</div>
      <FloatingContact />
      <Footer />
    </div>
  );
}
