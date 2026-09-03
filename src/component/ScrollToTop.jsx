import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

/**
 * Scrolls the window to the top whenever the user navigates to a new page
 * (PUSH/REPLACE). Back/forward browser navigation (POP) is skipped so the
 * browser's native scroll restoration can return users to where they were.
 */
export default function ScrollToTop() {
    const { pathname } = useLocation();
    const navigationType = useNavigationType();

    useEffect(() => {
        if (navigationType === 'POP') return;
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, [pathname, navigationType]);

    return null;
}
