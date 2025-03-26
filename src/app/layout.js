import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import AuthProvider from "@/features/AuthProvider";
import { getServerSession } from "next-auth"; // ✅ Import only `getServerSession`
import { Inter } from "next/font/google";
import "./globals.css"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "OkhlaDastarkhan Shop",
  description: "Okhladastarkhan Shop register your shop and receive orders online",
};

export default async function RootLayout({ children }) {
  // Fetch session from the server
  const session = await getServerSession(); // ✅ Remove `authOptions`

  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider session={session}>
          <Navbar />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
