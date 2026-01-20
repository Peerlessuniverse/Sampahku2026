import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

const ScrollToTop: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    // Show button when page is scrolled down
    const toggleVisibility = () => {
        if (window.pageYOffset > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    // Set the top coordinate to 0
    // make scrolling smooth
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    return (
        <div className="fixed bottom-10 right-10 z-[100]">
            <button
                type="button"
                onClick={scrollToTop}
                className={`
          flex items-center justify-center w-14 h-14 rounded-2xl
          bg-white/10 backdrop-blur-2xl border border-white/20
          text-white shadow-[0_20px_50px_rgba(0,0,0,0.5)]
          transition-all duration-500 transform
          hover:scale-110 hover:bg-emerald-500 hover:border-emerald-400 hover:-translate-y-2
          active:scale-95
          ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-50 pointer-events-none'}
        `}
                aria-label="Scroll to top"
            >
                <ArrowUp className="w-6 h-6 animate-bounce" />

                {/* Glow effect on hover */}
                <div className="absolute inset-0 rounded-2xl bg-emerald-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
        </div>
    );
};

export default ScrollToTop;
