import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import FloatingContact from "@/components/layout/floating-contact";
import AnnouncementBar from "@/components/layout/announcement-bar";
import { CartProvider } from "@/components/cart/cart-context";
import CartDrawer from "@/components/cart/cart-drawer";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <div className="flex flex-col min-h-screen">
        <AnnouncementBar />
        <Navbar />
        <div className="flex-grow pt-[80px]">{children}</div>
        <FloatingContact />
        <Footer />
        <CartDrawer />
      </div>
    </CartProvider>
  );
}
