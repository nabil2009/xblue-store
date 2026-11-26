import "./globals.css";
import { Cairo } from "next/font/google";
import Providers from "@/components/Providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Particles from "@/components/Particles";
const cairo = Cairo({ subsets: ["arabic", "latin"], weight: ["400", "700", "900"] });
export const metadata = { title: "xBlue Studio | مجتمع برمجة عربي", description: "مجتمع ديسكورد عربي للمبرمجين: مشاريع مجانية، بوتات مخصصة، ودعم." };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl"><body className={cairo.className}>
      <Providers><Particles /><Header /><main className="max-w-7xl mx-auto px-4 py-10 min-h-[70vh]">{children}</main><Footer /></Providers>
    </body></html>
  );
}
