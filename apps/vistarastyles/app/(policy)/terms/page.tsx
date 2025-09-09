import Link from "next/link";

export default function TermsOfService() {
    return (
        <div className="max-w-5xl mx-auto px-6 py-12">
            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold">
                    Terms of Service
                </h1>
                <p className="text-sm text-gray-500 mt-2">
                    Last updated: {new Date().toLocaleDateString("en-IN")}
                </p>
            </div>

            {/* Content */}
            <div>
                <section className="pb-8">
                    <p className="text-gray-700 leading-relaxed">
                        Welcome to <strong>Vistara Styles</strong>. By accessing or using our
                        website (
                        <Link
                            href="https://vistarastyles.com"
                            className="text-indigo-600 hover:underline"
                        >
                            vistarastyles.com
                        </Link>
                        ) and services, you agree to the following Terms of Service. Please
                        read them carefully before making a purchase or creating an account.
                    </p>
                </section>

                <div className="border-t border-gray-100 pt-6 pb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Eligibility</h2>
                    <p className="text-gray-700">
                        You must be at least 18 years old to use our services. By creating an
                        account with Clerk, you confirm that you are legally capable of
                        entering into binding contracts under Indian law.
                    </p>
                </div>

                <div className="border-t border-gray-100 pt-6 pb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Account Responsibilities</h2>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                        <li>You are responsible for maintaining the confidentiality of your account.</li>
                        <li>Ensure your account details are accurate and up to date.</li>
                        <li>Do not share your login credentials with others.</li>
                    </ul>
                </div>

                <div className="border-t border-gray-100 pt-6 pb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Orders & Payments</h2>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                        <li>All prices are listed in Indian Rupees (₹) and include GST.</li>
                        <li>Payments are securely processed through Razorpay and stored in Convex.</li>
                        <li>We reserve the right to refuse or cancel any order due to errors or suspicious activity.</li>
                    </ul>
                </div>

                <div className="border-t border-gray-100 pt-6 pb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Shipping & Delivery</h2>
                    <p className="text-gray-700">
                        We provide free shipping across India. Estimated delivery times are
                        displayed at checkout, but delays may occur due to logistics or unforeseen events.
                    </p>
                </div>

                <div className="border-t border-gray-100 pt-6 pb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Returns & Refunds</h2>
                    <p className="text-gray-700">
                        We offer a <strong>7-day return policy</strong> on eligible products.
                        Items must be unused, unworn, and in original packaging. Refunds will
                        be processed to your original payment method after inspection.
                    </p>
                </div>

                <div className="border-t border-gray-100 pt-6 pb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Prohibited Activities</h2>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                        <li>Using our site for unlawful purposes.</li>
                        <li>Attempting to hack, disrupt, or exploit the platform.</li>
                        <li>Sharing false, offensive, or misleading content.</li>
                    </ul>
                </div>

                <div className="border-t border-gray-100 pt-6 pb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Intellectual Property</h2>
                    <p className="text-gray-700">
                        All content, logos, images, and designs on Vistara Styles are owned by
                        us and protected under Indian copyright laws. Unauthorized use is prohibited.
                    </p>
                </div>

                <div className="border-t border-gray-100 pt-6 pb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Limitation of Liability</h2>
                    <p className="text-gray-700">
                        Vistara Styles is not liable for indirect damages, delays, or losses
                        beyond our reasonable control. Our maximum liability is limited to the
                        amount you paid for the product.
                    </p>
                </div>

                <div className="border-t border-gray-100 pt-6 pb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Analytics & Tracking</h2>
                    <p className="text-gray-700">
                        We use PostHog to analyze website performance. This data is anonymized
                        and used only to improve customer experience. Please see our{" "}
                        <Link href="/privacy" className="text-indigo-600 hover:underline">
                            Privacy Policy
                        </Link>{" "}
                        for details.
                    </p>
                </div>

                <div className="border-t border-gray-100 pt-6 pb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">10. Governing Law</h2>
                    <p className="text-gray-700">
                        These Terms are governed by the laws of India. Any disputes will be
                        subject to the jurisdiction of courts in Rajkot, Gujarat.
                    </p>
                </div>

                <div className="border-t border-gray-100 pt-6 pb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">11. Changes to Terms</h2>
                    <p className="text-gray-700">
                        We may update these Terms from time to time. Continued use of our
                        services after changes implies acceptance of the revised Terms.
                    </p>
                </div>

                <div className="border-t border-gray-100 pt-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">12. Contact Us</h2>
                    <p className="text-gray-700">
                        For questions about these Terms, please contact us at:
                    </p>
                    <p className="mt-2 text-gray-800 font-medium">
                        <b>Vistara Styles</b> <br />
                        Dr. Shyama Prashad Mukherjee Nagar <br />
                        Building-G, Flat No. 504, Rajkot, Gujarat <br />
                        <span className="font-semibold">Email:</span> <Link href={'mailto:contactus@vistarastyles.com'}>contactus@vistarastyles.com</Link>
                        <br/>
                        <span className="font-semibold">Phone:</span> <Link href={'tel:7623969483'}>7623969483</Link>

                    </p>
                </div>
            </div>
        </div>
    );
}
