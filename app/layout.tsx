import "./globals.css";
import Providers from "@/components/Providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Particles from "@/components/Particles";

export const metadata = { title: "xBlue Studio | مجتمع برمجة عربي", description: "مجتمع ديسكورد عربي للمبرمجين: مشاريع مجانية، بوتات مخصصة، ودعم." };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body style={{ fontFamily: "'Segoe UI', Tahoma, Arial, sans-serif" }}>
        <Providers>
          <Particles />
          <Header />
          <main className="max-w-7xl mx-auto px-4 py-10 min-h-">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
