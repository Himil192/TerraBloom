// src/pages/PrivacyPolicy.jsx

import React from "react";

const PrivacyPolicy = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12 text-gray-800">
            <h1 className="text-4xl font-bold mb-6 text-green-700">Privacy Policy</h1>

            <p className="mb-4 text-sm text-gray-500">Effective Date: April 23, 2025</p>

            <p className="mb-6">
                Welcome to TerraBloom. Your privacy is important to us. This Privacy Policy
                outlines how we collect, use, and protect your information when you visit our website.
            </p>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-2">1. Information We Collect</h2>
                <ul className="list-disc list-inside space-y-2">
                    <li><strong>Personal Information</strong>: e.g., name, email, contact info (if submitted).</li>
                    <li><strong>Non-Personal Info</strong>: browser, OS, referral links, usage patterns.</li>
                    <li><strong>Cookies & Analytics</strong>: for improving performance and user experience.</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-2">2. How We Use Your Information</h2>
                <ul className="list-disc list-inside space-y-2">
                    <li>To operate and maintain our website.</li>
                    <li>To improve and personalize your experience.</li>
                    <li>To communicate with you (if you contact us).</li>
                    <li>To analyze trends and site traffic.</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-2">3. Sharing Your Information</h2>
                <p>
                    We do not sell or share your data. Data may be shared only with trusted providers or when legally required.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-2">4. Your Rights</h2>
                <ul className="list-disc list-inside space-y-2">
                    <li>Access or correct your data.</li>
                    <li>Request deletion of your data.</li>
                    <li>Withdraw your consent at any time.</li>
                </ul>
                <p>Contact us at <a href="mailto:your@email.com" className="text-green-600 underline">your@email.com</a></p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-2">5. Security</h2>
                <p>We implement security measures to protect your data from unauthorized access or misuse.</p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-2">6. External Links</h2>
                <p>
                    We are not responsible for the privacy practices of other websites linked from ours.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-2">7. Updates</h2>
                <p>
                    This policy may change. Updates will be posted here with a new effective date.
                </p>
            </section>

            <section>
                <h2 className="text-2xl font-semibold mb-2">8. Contact</h2>
                <p>
                    Questions? Email us at:{" "}
                    <a href="mailto:himilprajapati.com" className="text-green-600 underline">
                        himilprajapati.com
                    </a>
                </p>
            </section>
        </div>
    );
};

export default PrivacyPolicy;
