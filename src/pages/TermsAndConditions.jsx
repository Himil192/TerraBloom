import React from "react";
import { Link } from "react-router-dom";
import { ScrollText, Mail, ArrowRight, Leaf } from "lucide-react";

const sections = [
    { title: "Acceptance of Terms", body: "By accessing and using our website, you accept and agree to comply with these terms and conditions." },
    { title: "Use of Services", body: "You may use the services provided by TerraBloom in accordance with these terms. Any misuse or illegal activities will lead to suspension of services." },
    { title: "Privacy", body: "Please refer to our Privacy Policy for information on how we collect and use your personal data." },
    { title: "Changes to Terms", body: "We reserve the right to modify these terms at any time. Any changes will be updated on this page." },
    { title: "Limitation of Liability", body: "TerraBloom will not be liable for any indirect, incidental, or consequential damages arising from the use of our website or services." },
    { title: "Governing Law", body: "These terms and conditions are governed by the laws of [Insert Country], and any disputes will be handled in the appropriate courts." },
];

const TermsAndConditions = () => {
    return (
        <div className="min-h-screen bg-color-background text-color-text">
            {/* Hero */}
            <section className="relative pt-28 pb-12 overflow-hidden">
                <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-[#88B73B]/15 blur-3xl pointer-events-none"></div>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest btn-secondary px-4 py-1.5 mb-4">
                        <ScrollText className="w-3.5 h-3.5" /> Legal
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">
                        Terms &amp; <span className="text-highlight">Conditions</span>
                    </h1>
                    <p className="opacity-80 max-w-2xl mb-4">
                        Welcome to TerraBloom. By using our services, you agree to the following
                        terms and conditions. Please read them carefully.
                    </p>
                    <span className="inline-block text-xs font-medium border border-color-border rounded-full px-3 py-1 opacity-70">
                        Last updated: September 2026
                    </span>
                </div>
            </section>

            {/* Sections */}
            <section className="pb-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="card-surface rounded-3xl border border-color-border shadow-sm p-6 sm:p-10 space-y-8">
                        {sections.map((section, index) => (
                            <section key={section.title}>
                                <h2 className="text-lg sm:text-xl font-bold mb-2">
                                    <span className="text-highlight mr-2">{index + 1}.</span>
                                    {section.title}
                                </h2>
                                <p className="opacity-80 leading-relaxed">{section.body}</p>
                            </section>
                        ))}

                        <section className="bg-[#4A9B4B]/10 rounded-2xl p-6">
                            <h2 className="text-lg sm:text-xl font-bold mb-2">
                                <span className="text-highlight mr-2">7.</span>
                                Contact Information
                            </h2>
                            <p className="opacity-80 mb-4">
                                If you have any questions regarding these terms, our team is happy
                                to help.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <a
                                    href="mailto:hello@terrabloom.com"
                                    className="btn-secondary px-5 py-2.5 text-sm font-semibold"
                                >
                                    <Mail className="w-4 h-4 mr-2" /> hello@terrabloom.com
                                </a>
                                <Link
                                    to="/contact-us"
                                    className="btn-primary text-white px-5 py-2.5 rounded-full text-sm font-semibold inline-flex items-center gap-2"
                                >
                                    Contact Page <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </section>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default TermsAndConditions;
