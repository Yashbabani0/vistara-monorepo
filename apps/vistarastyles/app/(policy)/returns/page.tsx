export default function ReturnsPage() {
    return (
        <div className="max-w-3xl mx-auto px-6 py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
                Returns & Refund Policy
            </h1>

            <div className="space-y-8 text-gray-700 leading-relaxed">
                <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">
                        Exchange Policy
                    </h2>
                    <p>
                        At <span className="font-medium">Vistara Styles</span>, we currently{" "}
                        <span className="font-medium">do not accept product exchanges</span>.
                        Exchange options will be introduced in the future (estimated 6–12
                        months from now). For now, please review size and color carefully
                        before placing an order.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">
                        Courier Returns (Undelivered / RTO)
                    </h2>
                    <p>
                        If the courier company is unable to deliver your order and it is
                        marked as <span className="font-medium">undelivered</span> or{" "}
                        <span className="font-medium">RTO (Return to Origin)</span>, the
                        package will be returned to our facility at:
                    </p>
                    <p className="mt-2 font-medium">
                        QikInk.com, 42A, Ambrose Nagar, Somanur Road, Karumathampatti,
                        Coimbatore, Tamil Nadu – 641659
                    </p>
                    <p className="mt-3">Some common reasons for RTO include:</p>
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

                <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">
                        Customer Returns
                    </h2>
                    <p>
                        Despite multiple quality checks, there may be rare cases where a
                        product is misprinted, damaged, or defective due to courier
                        mishandling. In such cases:
                    </p>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                        <li>
                            You must submit a claim within{" "}
                            <span className="font-medium">7 days of delivery</span>.
                        </li>
                        <li>
                            Claims must include{" "}
                            <span className="font-medium">unboxing videos and pictures</span>{" "}
                            of the defective product and original packaging.
                        </li>
                        <li>
                            Without proper proof,{" "}
                            <span className="font-medium">
                Vistara Styles will not be liable
              </span>{" "}
                            for refunds or replacements.
                        </li>
                        <li>
                            If a wrong size was ordered or you wish to return without defects,
                            it will be handled at your expense by placing a new order.
                        </li>
                        <li>
                            If items are lost in transit,{" "}
                            <span className="font-medium">we will issue a refund</span> once
                            the courier confirms the lost status.
                        </li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">
                        Important Notes
                    </h2>
                    <ol className="list-decimal pl-6 mt-2 space-y-2">
                        <li>
                            For size discrepancy claims, images of the product with proper
                            measurements must be shared with our production team.
                        </li>
                        <li>
                            Please unbox packages carefully. If damage is caused by scissors
                            or sharp objects during unboxing, refunds/replacements will not be
                            possible unless you provide an{" "}
                            <span className="font-medium">unpacking video</span>.
                        </li>
                        <li>
                            If the package shows damage upon delivery, kindly{" "}
                            <span className="font-medium">mention it in the courier remarks</span>{" "}
                            while signing. This helps us file claims with the courier.
                        </li>
                    </ol>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">
                        Color Matching in DTG Printing
                    </h2>
                    <p>
                        We use <span className="font-medium">CMYK inks</span> for printing.
                        Due to the nature of digital printing, colors may slightly differ
                        from what you see on your screen. Spot color matching is not
                        supported. If color accuracy is critical, we recommend ordering test
                        swatches before placing a bulk order.
                    </p>
                </section>
            </div>
        </div>
    );
}
