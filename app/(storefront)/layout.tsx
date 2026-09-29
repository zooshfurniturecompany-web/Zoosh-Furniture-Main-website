import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import FloatingContact from "@/components/layout/floating-contact";
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
        <Navbar />
        <main className="flex-grow pt-[94px] md:pt-[102px]">{children}</main>
        <FloatingContact />
        <Footer />
        <CartDrawer />
      </div>
    </CartProvider>
  );
}
