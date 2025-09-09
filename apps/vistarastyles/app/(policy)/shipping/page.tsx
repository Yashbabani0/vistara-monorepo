import Link from "next/link";

export default function ShippingInformation() {
    return (
        <div className="max-w-3xl mx-auto px-6 py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
                Shipping Information
            </h1>

            <div className="space-y-8 text-gray-700 leading-relaxed">
                <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">
                        Dispatch Timelines
                    </h2>
                    <p>
                        At <span className="font-semibold">Vistara Styles</span>, we usually
                        dispatch orders within <span className="font-medium">2 days</span>.
                        However, due to unforeseen circumstances, a few orders may take
                        longer. We are proud to say that{" "}
                        <span className="font-medium">90% of orders</span> are dispatched
                        within a <span className="font-medium">2–3 day</span> timeline.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">
                        Courier Partners
                    </h2>
                    <p>
                        We work with multiple courier partners to ensure your order reaches
                        you quickly and safely. Based on your location and pin code, your
                        order may be shipped via:
                    </p>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                        <li>Bluedart Express</li>
                        <li>Delhivery Air</li>
                        <li>Ekart</li>
                        <li>XPressBees</li>
                        <li>Delhivery Essentials</li>
                    </ul>
                    <p className="mt-3">
                        If none of the above are available for your location, we also ship
                        with <span className="font-medium">India Post</span>.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">
                        Address & Courier Handling
                    </h2>
                    <p>
                        Shipping is confirmed by the courier company as per the{" "}
                        <span className="font-medium">zip code / pin code</span> entered
                        during checkout. In some cases, an order may be shipped with an
                        incorrect address due to courier processing.
                    </p>
                    <p className="mt-3">
                        If your order is already shipped, we can raise a request with the
                        courier company for an address change. However, this request depends
                        on the courier’s policies. If they cannot update the address, the
                        order will be returned to origin (RTO) after delivery attempts.
                    </p>
                    <p className="mt-3">
                        If your order has not yet been shipped and is only in{" "}
                        <span className="font-medium">Pending or Processing</span> status, you can email
                        us at{" "}
                        <Link
                            href="mailto:contactus@vistarastyles.com"
                            className="text-blue-600 underline"
                        >
                            contactus@vistarastyles.com
                        </Link>{" "}
                        with your order ID and the updated address.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">
                        Reasons for Undelivered / RTO Orders
                    </h2>
                    <p>
                        Orders may be marked as undelivered or returned to origin (RTO) for
                        the following reasons:
                    </p>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                        <li>Pincode not serviceable</li>
                        <li>COD amount not ready</li>
                        <li>Customer not contactable</li>
                        <li>Incomplete address</li>
                        <li>Customer refused delivery</li>
                        <li>Poor weather conditions</li>
                        <li>Self-pickup requested by customer</li>
                        <li>Future delivery requested by customer</li>
                        <li>Door/premises/office closed</li>
                    </ul>
                </section>
            </div>
        </div>
    );
}
