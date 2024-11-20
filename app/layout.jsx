import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "@/app/globals.css";
import AuthProvider from "@/components/AuthProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "photoswipe/dist/photoswipe.css";
import { GlobalProvider } from "@/context/GlobalContext";

export const metadata = {
  title: "PropertyPulse | Find The Perfect Rental",
  description: "Find your dream rental property",
  keywords: "rental, find rentals, find properties",
};

const MainLayout = ({ children }) => {
  return (
    <GlobalProvider>
      <AuthProvider>
        <html lang="en">
          <body>
            <Navbar />
            <main className="min-h-screen">{children}</main>
            <Footer />
            <ToastContainer />
          </body>
        </html>
      </AuthProvider>
    </GlobalProvider>
  );
};
export default MainLayout;
