"use client";

export default function PrivacyPolicy() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-12 prose prose-gray">
            <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
            <p className="text-sm text-gray-500 mb-10">Last updated: 06-09-2025</p>

            <p>
                At <strong>Vistara Styles</strong>, we respect your privacy and are committed to
                protecting your personal data. This Privacy Policy explains how we
                collect, use, and safeguard your information when you use our website
                and services.
            </p>

            <h2>1. Information We Collect</h2>
            <ul>
                <li>
                    <strong>Account Data:</strong> When you sign up or log in using Clerk,
                    we collect your email, name, and profile details.
                </li>
                <li>
                    <strong>Order Data:</strong> We store your product selections, cart
                    items, and purchase history in Convex.
                </li>
                <li>
                    <strong>Analytics Data:</strong> We use PostHog to collect
                    non-identifiable information such as page views, clicks, and device
                    details to improve our site.
                </li>
                <li>
                    <strong>Newsletter/Contact Data:</strong> If you subscribe or contact
                    us, we store your email and messages.
                </li>
            </ul>

            <h2>2. How We Use Your Data</h2>
            <ul>
                <li>To process orders and deliver products you purchase.</li>
                <li>To personalize your shopping experience.</li>
                <li>To improve our website and track performance (via PostHog).</li>
                <li>To send you updates, offers, and newsletters (only if you opt in).</li>
                <li>To comply with Indian laws and resolve disputes if required.</li>
            </ul>

            <h2>3. Sharing of Data</h2>
            <p>
                We do <strong>not sell</strong> your personal data. We may share data
                only with:
            </p>
            <ul>
                <li>
                    <strong>Service providers</strong> like Clerk (authentication),
                    Convex (database), payment processors (e.g., Razorpay), and PostHog
                    (analytics).
                </li>
                <li>
                    <strong>Legal authorities</strong> when required under applicable
                    Indian law.
                </li>
            </ul>

            <h2>4. Data Retention & Security</h2>
            <p>
                We retain your data as long as necessary to provide services or comply
                with legal obligations. Your information is stored securely in our
                database, and we implement safeguards to protect it against unauthorized
                access.
            </p>

            <h2>5. Your Rights</h2>
            <p>As a user in India, you have the right to:</p>
            <ul>
                <li>Access and review your personal data.</li>
                <li>Request correction or deletion of your data.</li>
                <li>Withdraw consent for marketing communications.</li>
            </ul>

            <h2>6. Cookies & Tracking</h2>
            <p>
                We use cookies and analytics tools (via PostHog) to improve site
                performance. You can disable cookies in your browser settings, but some
                features may not work properly.
            </p>

            <h2>7. Children’s Privacy</h2>
            <p>
                Our services are not directed to children under 13. We do not knowingly
                collect data from minors. If you believe a child has provided us data,
                please contact us for removal.
            </p>

            <h2>8. Changes to This Policy</h2>
            <p>
                We may update this Privacy Policy from time to time. The latest version
                will always be available on this page with an updated date.
            </p>

            <h2>9. Contact Us</h2>
            <p>
                If you have any questions or concerns about this Privacy Policy, please
                contact us at:
            </p>
            <p>
                <strong>Vistara Styles</strong>
                <br />
                Dr. Shyama Prashad Mukherjee Nagar
                <br />
                Building-G, Flat No. 504, Rajkot, Gujarat
                <br />
                Email: support@vistarastyles.com
            </p>
        </div>
    );
}
