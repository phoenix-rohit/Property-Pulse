import Image from "next/image";
import logo from "@/assets/images/logo.png";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-4 mt-24 bg-gray-200">
      <div className="container flex flex-col items-center justify-between px-4 mx-auto md:flex-row">
        <div className="mb-4 md:mb-0">
          <Image src={logo} alt="Logo" className="w-auto h-8" />
        </div>

        <div>
          <p className="mt-2 text-sm text-gray-500 md:mt-0">
            &copy; {currentYear} PropertyPulse. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
export default Footer;
