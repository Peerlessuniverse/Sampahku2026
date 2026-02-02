import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import SponsorScreen from './SponsorScreen';

const AD_FREQUENCY = 3; // Show ad every 3 valid navigations

const AdManager: React.FC = () => {
    const location = useLocation();
    const [showAd, setShowAd] = useState(false);
    const navigationCount = useRef(0);
    const previousPath = useRef(location.pathname);

    // Firestore auto-syncs in real-time - no manual sync needed!

    useEffect(() => {
        // Skip if path hasn't actually changed (handling potential double-fires)
        if (location.pathname === previousPath.current) return;

        // Skip specific paths where ads shouldn't appear
        const skipPaths = [
            '/login',
            '/central-command',
            '/admin',
            '/scanner', // Scanner needs uninterrupted flow usually
            '/sponsor'
        ];

        const isSkipPath = skipPaths.some(path => location.pathname.startsWith(path));

        previousPath.current = location.pathname;

        if (isSkipPath) return;

        // Increment count
        navigationCount.current += 1;

        // Check frequency
        if (navigationCount.current >= AD_FREQUENCY) {
            setShowAd(true);
            navigationCount.current = 0; // Reset counter
        }

    }, [location.pathname]);

    const handleAdComplete = () => {
        setShowAd(false);
    };

    if (!showAd) return null;

    return <SponsorScreen onComplete={handleAdComplete} />;
};

export default AdManager;
