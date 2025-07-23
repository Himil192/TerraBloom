import { useState } from 'react';


import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';

const NewsLetter = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) return;

        try {
            await addDoc(collection(db, "newsletter"), {
                email,
                timestamp: Timestamp.now(),
            });
            setSubmitted(true);
            setEmail('');
        } catch (err) {
            console.error("Error adding email: ", err);
        }
    };

    return (
        <section className="bg-color-background text-color-text pt-24 pb-16">
            <div className="max-w-6xl mx-auto px-6 text-center">
                <h2 className="font-bold text-4xl" data-aos="zoom-in-up">Join the Eco Revolution</h2>
                <h3 className="text-3xl font-bold text-highlight mt-2 mb-4" data-aos="zoom-in-up">Subscribe to Our Newsletter</h3>
                <p className="mb-12 text-color-text max-w-2xl mx-auto" data-aos="zoom-in-up">
                    Get exclusive offers, eco-tips, and the latest news on sustainable living.
                </p>

                <form onSubmit={handleSubmit} className="flex justify-center flex-col sm:flex-row">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border border-color-border rounded-l-lg p-3 w-full sm:w-1/3 mb-4 sm:mb-0"
                        data-aos="zoom-in-right"
                    />
                    <button type="submit" className="btn-primary px-6 py-3 sm:ml-4" data-aos="zoom-in-left">
                        {submitted ? 'Thanks!' : 'Subscribe'}
                    </button>
                </form>
            </div>
        </section>
    );
};

export default NewsLetter;
