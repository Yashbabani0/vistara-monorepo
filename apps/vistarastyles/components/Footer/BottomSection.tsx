import Link from "next/link";

export default function BottomSection() {
  return (
    <div className="mt-10 pt-8 border-t border-gray-200">
      <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <p className="text-sm text-gray-600">
          © {new Date().getFullYear()} Vistara Styles. All rights reserved.
        </p>
        <div className="flex space-x-6">
          <Link
            href="/privacy"
            className="text-sm text-gray-600 hover:text-yellow-500 transition-all duration-300 ease-in-out"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            className="text-sm text-gray-600 hover:text-yellow-500 transition-all duration-300 ease-in-out"
          >
            Terms of Service
          </Link>
          <Link
            href="/cookies"
            className="text-sm text-gray-600 hover:text-yellow-500 transition-all duration-300 ease-in-out"
          >
            Cookie Policy
          </Link>
        </div>
      </div>
    </div>
  );
}
