import React, { useEffect, useState } from "react";
import { useTheme } from "../theme/ThemeContext";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Send, Clock, ArrowRight } from "lucide-react";
import { showSuccess, showError } from "../utils/toastUtils";

const CONTACT_CARDS = [
    { icon: Mail, label: "Email Us", value: "hello@terrabloom.com", href: "mailto:hello@terrabloom.com" },
    { icon: Phone, label: "Call Us", value: "+1 (555) 123-4567", href: "tel:+15551234567" },
    { icon: Clock, label: "Opening Hours", value: "Mon - Sat, 9:00 AM - 6:00 PM" },
];

const Contact = () => {
    const { isDark } = useTheme();
    const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [isDark]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const { name, email, message } = formData;
        if (!name || !email || !message) {
            showError("Please fill in all required fields.");
            return;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            showError("Please enter a valid email address.");
            return;
        }
        setIsSubmitting(true);
        // Simulated submit - replace with a real email service / backend later
        setTimeout(() => {
            showSuccess("Thanks! Your message has been sent.");
            setFormData({ name: "", email: "", subject: "", message: "" });
            setIsSubmitting(false);
        }, 800);
    };

    return (
        <div className="min-h-screen bg-color-background text-color-text">
            {/* Hero */}
            <section className="relative pt-28 pb-12 overflow-hidden">
                <div
                    className="absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl pointer-events-none"
                    style={{ background: "radial-gradient(circle, rgba(74,155,75,0.18), transparent 70%)" }}
                />
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
                    <span className="text-highlight text-sm font-bold uppercase tracking-widest" data-aos="fade-up">
                        We&apos;re Here to Help
                    </span>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mt-3 mb-4" data-aos="fade-up" data-aos-delay="100">
                        Get In <span className="text-highlight">Touch</span>
                    </h1>
                    <p className="text-lg text-color-text opacity-80 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="200">
                        Have a question, suggestion, or partnership idea? We&apos;d love to hear from you.
                    </p>
                    <div className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs font-semibold" data-aos="fade-up" data-aos-delay="300">
                        <span className="px-4 py-1.5 rounded-full border border-color-border">Avg. response under 24 hours</span>
                        <span className="px-4 py-1.5 rounded-full border border-color-border">Friendly human support</span>
                        <span className="px-4 py-1.5 rounded-full border border-color-border">Mon - Sat</span>
                    </div>
                </div>
            </section>

            {/* Contact cards */}
            <section className="pb-10">
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        {CONTACT_CARDS.map((card, index) => (
                            <div
                                key={card.label}
                                className="card-surface rounded-2xl shadow-md border border-color-border p-6 text-center hover:-translate-y-1 transition-transform duration-300"
                                data-aos="fade-up"
                                data-aos-delay={index * 100}
                                data-aos-once="true"
                            >
                                <span
                                    className="w-11 h-11 rounded-full flex items-center justify-center text-white mx-auto mb-3"
                                    style={{ backgroundColor: "var(--primary-color)" }}
                                >
                                    <card.icon className="h-5 w-5" />
                                </span>
                                <h3 className="font-bold mb-1">{card.label}</h3>
                                {card.href ? (
                                    <a href={card.href} className="text-sm text-color-text opacity-80 hover:text-highlight transition-colors">
                                        {card.value}
                                    </a>
                                ) : (
                                    <p className="text-sm text-color-text opacity-80">{card.value}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Map + form */}
            <section className="pb-16 lg:pb-24">
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                        {/* Map card */}
                        <div className="card-surface rounded-2xl shadow-md border border-color-border overflow-hidden" data-aos="fade-up">
                            <div className="aspect-video w-full">
                                <iframe
                                    title="TerraBloom location"
                                    className="w-full h-full border-0"
                                    loading="lazy"
                                    allowFullScreen
                                    src="https://maps.google.com/maps?q=32.7157,-117.1611&z=12&output=embed"
                                />
                            </div>
                            <div className="p-5 flex items-start gap-3">
                                <span
                                    className="w-9 h-9 rounded-full flex items-center justify-center text-white shrink-0"
                                    style={{ backgroundColor: "var(--primary-color)" }}
                                >
                                    <MapPin className="h-4 w-4" />
                                </span>
                                <div>
                                    <h3 className="font-bold mb-1">Visit Our Studio</h3>
                                    <p className="text-sm text-color-text opacity-70">123 Green Way, Eco City, CA 90210, United States</p>
                                </div>
                            </div>
                        </div>

                        {/* Form card */}
                        <form
                            onSubmit={handleSubmit}
                            className="card-surface rounded-2xl shadow-lg border border-color-border p-6 sm:p-8 flex flex-col gap-5"
                            data-aos="fade-up"
                        >
                            <div>
                                <h2 className="text-xl sm:text-2xl font-extrabold">Send us a message</h2>
                                <p className="text-sm text-color-text opacity-70 mt-1">
                                    Fill out the form and our team will get back to you within one business day.
                                </p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label htmlFor="contact-name" className="block text-sm font-semibold mb-1.5">
                                        Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="contact-name"
                                        name="name"
                                        placeholder="Your name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-3 border border-color-border rounded-xl bg-color-background text-color-text placeholder:text-color-text placeholder:opacity-40 focus:outline-none focus:ring-2 focus:ring-highlight transition"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="contact-email" className="block text-sm font-semibold mb-1.5">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        id="contact-email"
                                        name="email"
                                        placeholder="you@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-3 border border-color-border rounded-xl bg-color-background text-color-text placeholder:text-color-text placeholder:opacity-40 focus:outline-none focus:ring-2 focus:ring-highlight transition"
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="contact-subject" className="block text-sm font-semibold mb-1.5">
                                    Subject
                                </label>
                                <input
                                    type="text"
                                    id="contact-subject"
                                    name="subject"
                                    placeholder="How can we help?"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-color-border rounded-xl bg-color-background text-color-text placeholder:text-color-text placeholder:opacity-40 focus:outline-none focus:ring-2 focus:ring-highlight transition"
                                />
                            </div>
                            <div>
                                <label htmlFor="contact-message" className="block text-sm font-semibold mb-1.5">
                                    Message *
                                </label>
                                <textarea
                                    id="contact-message"
                                    name="message"
                                    placeholder="Write your message here..."
                                    rows={5}
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-3 border border-color-border rounded-xl bg-color-background text-color-text placeholder:text-color-text placeholder:opacity-40 focus:outline-none focus:ring-2 focus:ring-highlight transition resize-y"
                                />
                            </div>
                            <p className="text-xs text-color-text opacity-60 inline-flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5" /> We usually reply within 24 hours.
                            </p>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="inline-flex items-center justify-center gap-2 btn-primary py-3 px-8 rounded-full text-sm font-semibold transition disabled:opacity-50 self-start"
                            >
                                {isSubmitting ? "Sending..." : (
                                    <>
                                        <Send className="w-4 h-4" />
                                        Send Message
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            {/* Gradient CTA band */}
            <section className="pb-16 lg:pb-24">
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div
                        className="rounded-3xl px-6 py-12 sm:px-12 sm:py-16 text-center text-white shadow-xl overflow-hidden relative"
                        style={{ background: "linear-gradient(120deg, var(--primary-color), var(--secondary-color))" }}
                        data-aos="fade-up"
                    >
                        <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">Ready to grow with us?</h2>
                        <p className="max-w-xl mx-auto opacity-90 mb-8">
                            Explore our sustainable collection or read the latest from the journal.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link to="/products" className="btn-glass-solid">
                                Shop Products <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link to="/blogs" className="btn-glass">
                                Read the Blog
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;