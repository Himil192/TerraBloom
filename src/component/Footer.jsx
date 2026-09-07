import { useEffect } from 'react';
import { useTheme } from '../theme/ThemeContext';
import { Link } from 'react-router-dom';
import { Github, Mail, Heart, Leaf } from 'lucide-react';
import SvgComponent from './SvgComponent';

const Footer = () => {
    const { isDark } = useTheme();

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDark]);

    const year = new Date().getFullYear();

    const exploreLinks = [
        { name: 'Products', href: '/products' },
        { name: 'Blog', href: '/blogs' },
        { name: 'Contact Us', href: '/contact-us' },
    ];
    const accountLinks = [
        { name: 'Login', href: '/login' },
        { name: 'Sign Up', href: '/signup' },
        { name: 'My Dashboard', href: '/user-dashboard' },
    ];
    const legalLinks = [
        { name: 'Privacy Policy', href: '/privacy-policy' },
        { name: 'Terms & Conditions', href: '/terms-and-conditions' },
    ];
    const socials = [
        { icon: Github, href: 'https://github.com/Himil192/TerraBloom', label: 'GitHub account', external: true },
        { icon: Mail, href: 'mailto:hello@terrabloom.com', label: 'Email us', external: false },
    ];

    const renderColumn = (title, links) => (
        <div>
            <h2 className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-white/60">{title}</h2>
            <ul className="space-y-3 font-medium">
                {links.map((link) => (
                    <li key={link.name}>
                        <Link
                            to={link.href}
                            className="text-sm text-white/80 transition-all duration-200 hover:translate-x-0.5 hover:text-white"
                        >
                            {link.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );

    return (
        <footer className="footer mt-16 rounded-t-[2rem]">
            <Leaf className="pointer-events-none absolute -right-4 top-8 h-32 w-32 rotate-12 text-white/5" />
            <Leaf className="pointer-events-none absolute -left-6 bottom-10 h-24 w-24 -rotate-12 text-white/5" />

            <div className="relative mx-auto w-full max-w-screen-xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
                <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
                    <div className="lg:col-span-5">
                        <Link to="/" className="inline-flex rounded-xl bg-white px-3 py-2 shadow-md">
                            <SvgComponent />
                        </Link>
                        <p className="mt-5 max-w-sm text-sm font-semibold text-white">
                            TerraBloom isn&rsquo;t just a store &mdash; it&rsquo;s a lifestyle choice.
                        </p>
                        <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/70">
                            Join thousands of changemakers making the planet better, one product at a time.
                        </p>
                        <div className="mt-6 flex items-center gap-3">
                            {socials.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    aria-label={social.label}
                                    {...(social.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#4A9B4B] hover:bg-[#4A9B4B] hover:text-white"
                                >
                                    <social.icon className="h-4 w-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-7">
                        {renderColumn('Explore', exploreLinks)}
                        {renderColumn('Account', accountLinks)}
                        {renderColumn('Legal', legalLinks)}
                    </div>
                </div>

                <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
                    <p className="text-sm text-white/70">
                        &copy; {year} <Link to="/" className="font-semibold text-white hover:underline">TerraBloom</Link>. All rights reserved.
                    </p>
                    <p className="flex items-center gap-1.5 text-sm text-white/70">
                        Made with <Heart className="h-3.5 w-3.5 fill-current text-[#FF8A8A]" /> for the planet
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
