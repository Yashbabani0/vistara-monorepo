import Link from "next/link";

export default function AboutUs() {
    return (
        <div className="max-w-5xl mx-auto px-6 py-12">
            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold">About Us</h1>
                <p className="text-sm text-gray-500 mt-2">
                    Last updated: 06-09-2025
                </p>
            </div>

            {/* Content */}
            <div>
                <section className="mb-10">
                    <p className="text-gray-700 leading-relaxed">
                        Welcome to <strong>Vistara Styles</strong>, your trusted destination
                        for high-quality, stylish, and affordable t-shirts in India.
                        Based in Rajkot, Gujarat, we are passionate about creating fashion
                        that blends comfort with modern trends.
                    </p>
                </section>

                <section className="border-t border-gray-100 pt-6 mb-10">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        1. Our Mission
                    </h2>
                    <p className="text-gray-700">
                        Our mission is to provide trendy and comfortable t-shirts that
                        elevate everyday fashion without compromising on quality or price.
                        We aim to bring you apparel that fits your lifestyle, whether it’s
                        casual wear, work-from-home comfort, or statement streetwear.
                    </p>
                </section>

                <section className="border-t border-gray-100 pt-6 mb-10">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        2. Why Choose Us?
                    </h2>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                        <li>High-quality fabrics sourced responsibly.</li>
                        <li>Trendy designs tailored for Indian customers.</li>
                        <li>Affordable prices with transparent billing (GST included).</li>
                        <li>Free shipping across India.</li>
                        <li>Secure payments with Razorpay integration.</li>
                        <li>7-day hassle-free returns.</li>
                    </ul>
                </section>

                <section className="border-t border-gray-100 pt-6 mb-10">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        3. Technology We Use
                    </h2>
                    <p className="text-gray-700">
                        At Vistara Styles, we use modern technology to enhance your shopping
                        experience. Authentication is powered by <strong>Clerk</strong>,
                        our database is managed with <strong>Convex</strong>, payments are
                        processed securely via <strong>Razorpay</strong>, and analytics are
                        tracked with <strong>PostHog</strong> to continuously improve our
                        platform.
                    </p>
                </section>

                <section className="border-t border-gray-100 pt-6 mb-10">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        4. Our Commitment
                    </h2>
                    <p className="text-gray-700">
                        We are committed to building long-lasting relationships with our
                        customers by offering top-quality products, excellent customer service,
                        and continuous innovation in fashion. Every order you place with us
                        is carefully processed, packed, and delivered with care.
                    </p>
                </section>

                <section className="border-t border-gray-100 pt-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        5. Contact Us
                    </h2>
                    <p className="text-gray-700">
                        Have questions, feedback, or collaboration ideas? We’d love to hear
                        from you. Get in touch with us:
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
