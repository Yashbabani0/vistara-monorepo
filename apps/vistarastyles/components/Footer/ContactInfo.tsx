import { Mail, MapPin, Phone } from "lucide-react";

export default function ContactInfo() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Contact Us</h3>
      <ul className="space-y-2">
        <li className="flex items-center text-sm text-gray-600">
          <MapPin className="h-4 w-4 mr-2" />
          123 T-Shirt Street, Fashion City
        </li>
        <li className="flex items-center text-sm text-gray-600">
          <Phone className="h-4 w-4 mr-2" />
          +1 234 567 8900
        </li>
        <li className="flex items-center text-sm text-gray-600">
          <Mail className="h-4 w-4 mr-2" />
          support@tshirtstore.com
        </li>
      </ul>
    </div>
  );
}
