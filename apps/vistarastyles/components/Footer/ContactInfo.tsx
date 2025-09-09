import { Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";

export default function ContactInfo() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Contact Us</h3>
      <ul className="space-y-2">
        <li className="flex items-center text-sm text-gray-600">
          <MapPin className="h-4 w-4 mr-2" />
          Dr.shyama Prashad Mukherjee Nagar, <br /> Building-G, Flat no.504,
          <br />
          Rajkot, Gujarat 360005
        </li>
        <Link
          href={"tel:+917623969483"}
          className="flex items-center text-sm text-gray-600 hover:text-yellow-500 transition-all duration-300 ease-in-out"
        >
          <Phone className="h-4 w-4 mr-2" />
          +917623969483
        </Link>
        <Link
          href={"mailto:contactus@vistarastyles.com"}
          className="flex items-center text-sm text-gray-600 hover:text-yellow-500 transition-all duration-300 ease-in-out"
        >
          <Mail className="h-4 w-4 mr-2" />
          contactus@vistarastyles.com
        </Link>
      </ul>
    </div>
  );
}
