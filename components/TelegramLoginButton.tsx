/**
 * Telegram Login Button Component
 * 
 * Integrates Telegram Login Widget for authentication
 * Uses Firebase Cloud Function for secure server-side verification
 */

import React, { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';

// Telegram Auth Data interface (from Telegram Login Widget)
export interface TelegramAuthData {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    photo_url?: string;
    auth_date: number;
    hash: string;
}

interface TelegramLoginButtonProps {
    botName: string;
    onAuth: (user: TelegramAuthData) => void;
    onError?: (error: string) => void;
    buttonSize?: 'large' | 'medium' | 'small';
    cornerRadius?: number;
    requestAccess?: 'write' | '';
    showUserPhoto?: boolean;
    lang?: string;
    disabled?: boolean;
}

// Extend window to include Telegram callback
declare global {
    interface Window {
        TelegramLoginCallback?: (user: TelegramAuthData) => void;
    }
}

const TelegramLoginButton: React.FC<TelegramLoginButtonProps> = ({
    botName,
    onAuth,
    onError,
    buttonSize = 'large',
    cornerRadius = 20,
    requestAccess = 'write',
    showUserPhoto = true,
    lang = 'id',
    disabled = false,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [widgetError, setWidgetError] = useState<string | null>(null);

    useEffect(() => {
        if (disabled) return;

        // Create global callback function
        const callbackName = 'TelegramLoginCallback';
        window[callbackName] = (user: TelegramAuthData) => {
            console.log('Telegram auth callback received:', user);
            onAuth(user);
        };

        // Create and inject script
        const script = document.createElement('script');
        script.src = 'https://telegram.org/js/telegram-widget.js?22';
        script.setAttribute('data-telegram-login', botName);
        script.setAttribute('data-size', buttonSize);
        script.setAttribute('data-radius', cornerRadius.toString());
        script.setAttribute('data-onauth', `${callbackName}(user)`);
        script.setAttribute('data-lang', lang);
        
        if (requestAccess) {
            script.setAttribute('data-request-access', requestAccess);
        }
        
        if (!showUserPhoto) {
            script.setAttribute('data-userpic', 'false');
        }

        script.async = true;

        script.onload = () => {
            setIsLoading(false);
        };

        script.onerror = () => {
            setIsLoading(false);
            setWidgetError('Failed to load Telegram widget');
            onError?.('Failed to load Telegram login widget');
        };

        // Clear container and append script
        if (containerRef.current) {
            containerRef.current.innerHTML = '';
            containerRef.current.appendChild(script);
        }

        // Cleanup
        return () => {
            delete window[callbackName];
            if (containerRef.current) {
                containerRef.current.innerHTML = '';
            }
        };
    }, [botName, buttonSize, cornerRadius, requestAccess, showUserPhoto, lang, onAuth, onError, disabled]);

    if (disabled) {
        return (
            <button
                disabled
                className="w-full flex items-center justify-center gap-4 py-6 bg-[#54a9eb]/30 text-white/50 rounded-[2rem] font-black text-lg uppercase italic tracking-widest cursor-not-allowed"
            >
                <TelegramIcon className="w-6 h-6" />
                Telegram Login Disabled
            </button>
        );
    }

    if (widgetError) {
        return (
            <button
                onClick={() => window.location.reload()}
                className="w-full flex items-center justify-center gap-4 py-6 bg-red-500/20 text-red-400 rounded-[2rem] font-bold text-sm uppercase tracking-wider border border-red-500/30"
            >
                Widget Error - Click to Retry
            </button>
        );
    }

    return (
        <div className="relative">
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#54a9eb]/10 rounded-[2rem] border border-[#54a9eb]/20">
                    <Loader2 className="w-6 h-6 animate-spin text-[#54a9eb]" />
                </div>
            )}
            <div 
                ref={containerRef} 
                className={`telegram-login-container flex justify-center ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
                style={{ minHeight: buttonSize === 'large' ? '48px' : buttonSize === 'medium' ? '40px' : '32px' }}
            />
        </div>
    );
};

// Telegram SVG Icon
const TelegramIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
    </svg>
);

export default TelegramLoginButton;
export { TelegramIcon };
