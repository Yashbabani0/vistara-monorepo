import Link from "next/link";

export default function CookiePolicy() {
    return (
        <div className="max-w-5xl mx-auto px-6 py-12">
            {/* Header Section */}
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold">Cookie Policy</h1>
                <p className="text-sm text-gray-500 mt-2">
                    Last updated: 06-09-2025
                </p>
            </div>

            {/* Content */}
            <div>
                <section className="mb-10">
                    <p className="text-gray-700 leading-relaxed">
                        This Cookie Policy explains how <strong>Vistara Styles</strong> uses
                        cookies and similar technologies on our website{" "}
                        <Link href="https://vistarastyles.com" className="text-blue-600 hover:underline">
                            vistarastyles.com
                        </Link>. By using our site, you agree to the use of cookies as
                        described in this policy.
                    </p>
                </section>

                <section className="border-t border-gray-100 pt-6 mb-10">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        1. What Are Cookies?
                    </h2>
                    <p className="text-gray-700">
                        Cookies are small text files stored on your device when you visit a
                        website. They help us improve your shopping experience, analyze
                        website performance, and deliver personalized services.
                    </p>
                </section>

                <section className="border-t border-gray-100 pt-6 mb-10">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        2. Types of Cookies We Use
                    </h2>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                        <li>
                            <strong>Essential Cookies:</strong> Required for site functionality
                            such as login (via Clerk), cart management, and secure checkout
                            with Razorpay.
                        </li>
                        <li>
                            <strong>Performance Cookies:</strong> Used by PostHog to track
                            anonymized analytics like page views, clicks, and navigation.
                        </li>
                        <li>
                            <strong>Preference Cookies:</strong> Store your choices such as
                            selected products, sizes, and colors.
                        </li>
                        <li>
                            <strong>Advertising Cookies:</strong> May be used in the future to
                            display relevant promotions.
                        </li>
                    </ul>
                </section>

                <section className="border-t border-gray-100 pt-6 mb-10">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        3. How We Use Cookies
                    </h2>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                        <li>To keep your shopping cart saved while browsing.</li>
                        <li>To remember login sessions securely.</li>
                        <li>To analyze website traffic and improve performance.</li>
                        <li>To personalize your shopping experience.</li>
                    </ul>
                </section>

                <section className="border-t border-gray-100 pt-6 mb-10">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        4. Managing Cookies
                    </h2>
                    <p className="text-gray-700">
                        You can control or delete cookies through your browser settings.
                        However, disabling essential cookies may affect your ability to log in,
                        add items to cart, or complete checkout.
                    </p>
                </section>

                <section className="border-t border-gray-100 pt-6 mb-10">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        5. Third-Party Cookies
                    </h2>
                    <p className="text-gray-700">
                        Some cookies may be set by trusted third-party providers we work with,
                        such as Clerk (authentication), Razorpay (payments), and PostHog
                        (analytics).
                    </p>
                </section>

                <section className="border-t border-gray-100 pt-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        6. Contact Us
                    </h2>
                    <p className="text-gray-700">
                        If you have any questions about this Cookie Policy, please contact us:
                    </p>
                    <p className="mt-2 text-gray-800 font-medium">
                        <span className="font-semibold">Vistara Styles</span> <br />
                        Dr. Shyama Prashad Mukherjee Nagar <br />
                        Building-G, Flat No. 504, Rajkot, Gujarat <br />
                        <Link
                            href="mailto:contactus@vistarstyles.com"
                            className="font-semibold my-2"
                        >
                            Email: contactus@vistarstyles.com
                        </Link>
                        <br />
                        <Link
                            href="tel:7623969483"
                            className="font-semibold my-2"
                        >
                            Phone: 7623969483
                        </Link>
                    </p>
                </section>
            </div>
        </div>
    );
}
