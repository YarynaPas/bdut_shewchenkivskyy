import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

import HeaderComponent from "@/components/HeaderComponent/HeaderComponent";
import Footer from "@/components/Footer/Footer";

const montserrat = Montserrat({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "БДЮТ Шевченківського району",
  description: "Будинок дитячої та юнацької творчості Шевченківського району м. Львова",
};

type LayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: LayoutProps) {
  return (
      <html lang="uk">
      <body className={montserrat.className}>
      <HeaderComponent />

      <main>
        {children}
      </main>
      <Footer />
      </body>
      </html>
  );
}