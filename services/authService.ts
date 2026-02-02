// REAL FIREBASE AUTH SERVICE
import { auth } from "./firebaseConfig";
import {
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged,
    signInWithCustomToken,
    User
} from "firebase/auth";
import { getFunctions, httpsCallable } from "firebase/functions";
import { saveUserProfile } from "./dbService";
import { migrateLocalCreditsToCloud } from "./creditService";

export interface UserProfile {
    uid: string;
    email: string;
    displayName: string;
    photoURL: string;
    role: 'user' | 'admin' | 'sponsor';
    createdAt: string;
    // Telegram specific fields
    telegramId?: string;
    telegramUsername?: string;
    providers?: string[];
}

// Telegram Auth Data interface
export interface TelegramAuthData {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    photo_url?: string;
    auth_date: number;
    hash: string;
}

const USER_KEY = 'sampahku_user_session';

/**
 * Sign in with Google using Firebase Auth Popup
 * This ALWAYS shows the Google account selection popup!
 */
export const loginWithGoogle = async (): Promise<UserProfile> => {
    try {
        console.log("🔐 Starting Google Sign-In with popup...");

        // Create Google Provider
        const provider = new GoogleAuthProvider();

        // ⭐ FORCE ACCOUNT SELECTION EVERY TIME!
        provider.setCustomParameters({
            prompt: 'select_account' // Always show account picker!
        });

        // Sign in with popup (THIS SHOWS GOOGLE POPUP!)
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        console.log("✅ Google Sign-In successful!", user.email);

        // Create user profile
        const userProfile: UserProfile = {
            uid: user.uid,
            email: user.email || 'unknown@sampahku.com',
            displayName: user.displayName || 'Guardian',
            photoURL: user.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${user.displayName || 'G'}`,
            role: 'user',
            createdAt: new Date().toISOString()
        };

        // Save to Firestore
        await saveUserProfile({
            uid: userProfile.uid,
            displayName: userProfile.displayName,
            photoURL: userProfile.photoURL,
        });

        // Save to localStorage for quick access
        localStorage.setItem(USER_KEY, JSON.stringify(userProfile));

        // Migrate local credits to cloud
        try {
            await migrateLocalCreditsToCloud(userProfile.uid);
            console.log("💰 Credits migrated to cloud!");
        } catch (e) {
            console.warn("⚠️ Credit migration skipped:", e);
        }

        // Dispatch auth changed event
        window.dispatchEvent(new CustomEvent('authChanged', { detail: { user: userProfile } }));

        return userProfile;
    } catch (error: any) {
        console.error("❌ Google Sign-In failed:", error);

        // Handle specific error cases
        if (error.code === 'auth/popup-closed-by-user') {
            throw new Error('Sign-in dibatalkan. Silakan coba lagi.');
        } else if (error.code === 'auth/popup-blocked') {
            throw new Error('Popup diblokir browser. Izinkan popup untuk sign-in.');
        } else if (error.code === 'auth/cancelled-popup-request') {
            throw new Error('Popup request dibatalkan.');
        }

        throw new Error('Gagal masuk dengan Google. Silakan coba lagi.');
    }
};

export const logout = async () => {
    console.log("🔓 Logging out...");

    try {
        // Sign out from Firebase
        await signOut(auth);

        // Clear local storage
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem('auth_role');
        localStorage.removeItem('auth_sponsor_id');

        // Dispatch event
        window.dispatchEvent(new CustomEvent('authChanged', { detail: { user: null } }));

        console.log("✅ Logged out successfully!");
    } catch (error) {
        console.error("❌ Logout failed:", error);
        throw error;
    }
};

// Real Firebase auth state listener
export const onAuthUIStateChanged = (callback: (user: UserProfile | null) => void) => {
    // Listen to Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
        if (firebaseUser) {
            // User is logged in
            const userProfile: UserProfile = {
                uid: firebaseUser.uid,
                email: firebaseUser.email || 'unknown@sampahku.com',
                displayName: firebaseUser.displayName || 'Guardian',
                photoURL: firebaseUser.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${firebaseUser.displayName || 'G'}`,
                role: 'user',
                createdAt: new Date().toISOString()
            };

            // Save to localStorage
            localStorage.setItem(USER_KEY, JSON.stringify(userProfile));
            callback(userProfile);
        } else {
            // User is logged out
            callback(null);
        }
    });

    // Return unsubscribe function
    return unsubscribe;
};

export const getCurrentUser = (): UserProfile | null => {
    const stored = localStorage.getItem(USER_KEY);
    if (!stored) return null;
    try {
        return JSON.parse(stored);
    } catch (e) {
        return null;
    }
};

export const isAuthenticated = (): boolean => {
    return getCurrentUser() !== null;
};

export const updateUser = async (updates: Partial<UserProfile>) => {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const updatedUser = { ...currentUser, ...updates };
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));

    // Also update db record for persistence if needed in dbService context
    await saveUserProfile({
        uid: updatedUser.uid,
        displayName: updatedUser.displayName,
        photoURL: updatedUser.photoURL
    });

    window.dispatchEvent(new CustomEvent('authChanged', { detail: { user: updatedUser } }));
    return updatedUser;
};

// =====================================================
// TELEGRAM AUTHENTICATION
// =====================================================

/**
 * Sign in with Telegram using Firebase Cloud Function for verification
 * @param telegramData - Data from Telegram Login Widget callback
 */
export const loginWithTelegram = async (telegramData: TelegramAuthData): Promise<UserProfile> => {
    try {
        console.log("🔐 Starting Telegram Sign-In...", telegramData.id);

        // Call Cloud Function to verify Telegram auth and get custom token
        const functions = getFunctions();
        const verifyTelegramAuth = httpsCallable(functions, 'verifyTelegramAuth');

        const result = await verifyTelegramAuth(telegramData);
        const data = result.data as {
            success: boolean;
            customToken: string;
            isNewUser: boolean;
            user: {
                uid: string;
                displayName: string;
                photoURL: string;
                telegramId: string;
                telegramUsername: string | null;
            };
        };

        if (!data.success || !data.customToken) {
            throw new Error('Verifikasi Telegram gagal');
        }

        console.log("✅ Telegram verified! Signing in with custom token...");

        // Sign in to Firebase with custom token
        await signInWithCustomToken(auth, data.customToken);

        // Create user profile
        const userProfile: UserProfile = {
            uid: data.user.uid,
            email: '', // Telegram doesn't provide email
            displayName: data.user.displayName,
            photoURL: data.user.photoURL,
            role: 'user',
            createdAt: new Date().toISOString(),
            telegramId: data.user.telegramId,
            telegramUsername: data.user.telegramUsername || undefined,
            providers: ['telegram']
        };

        // Save to Firestore (update profile)
        await saveUserProfile({
            uid: userProfile.uid,
            displayName: userProfile.displayName,
            photoURL: userProfile.photoURL,
        });

        // Save to localStorage
        localStorage.setItem(USER_KEY, JSON.stringify(userProfile));

        // Migrate local credits to cloud
        try {
            await migrateLocalCreditsToCloud(userProfile.uid);
            console.log("💰 Credits migrated to cloud!");
        } catch (e) {
            console.warn("⚠️ Credit migration skipped:", e);
        }

        // Dispatch auth changed event
        window.dispatchEvent(new CustomEvent('authChanged', { detail: { user: userProfile } }));

        console.log("✅ Telegram Sign-In successful!", userProfile.telegramUsername || userProfile.uid);

        return userProfile;
    } catch (error: any) {
        console.error("❌ Telegram Sign-In failed:", error);

        // Handle specific error cases
        if (error.code === 'functions/permission-denied') {
            throw new Error('Verifikasi Telegram tidak valid. Coba lagi.');
        } else if (error.code === 'functions/invalid-argument') {
            throw new Error('Data Telegram tidak lengkap atau kadaluarsa.');
        } else if (error.message) {
            throw new Error(error.message);
        }

        throw new Error('Gagal masuk dengan Telegram. Silakan coba lagi.');
    }
};

/**
 * Link Telegram account to current user (for users logged in with Google)
 * @param telegramData - Data from Telegram Login Widget callback
 */
export const linkTelegramToAccount = async (telegramData: TelegramAuthData): Promise<{ success: boolean; mergedCredits: number }> => {
    try {
        const currentUser = getCurrentUser();
        if (!currentUser) {
            throw new Error('Anda harus login terlebih dahulu');
        }

        console.log("🔗 Linking Telegram account...", telegramData.id);

        // Call Cloud Function
        const functions = getFunctions();
        const linkTelegram = httpsCallable(functions, 'linkTelegramAccount');

        const result = await linkTelegram(telegramData);
        const data = result.data as {
            success: boolean;
            mergedCredits: number;
            telegramUsername: string | null;
        };

        if (data.success) {
            // Update local user profile
            const updatedUser: UserProfile = {
                ...currentUser,
                telegramId: telegramData.id.toString(),
                telegramUsername: data.telegramUsername || undefined,
                providers: [...(currentUser.providers || []), 'telegram']
            };
            localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));

            // Dispatch event
            window.dispatchEvent(new CustomEvent('authChanged', { detail: { user: updatedUser } }));

            console.log(`✅ Telegram linked! Merged ${data.mergedCredits} credits`);
        }

        return {
            success: data.success,
            mergedCredits: data.mergedCredits
        };
    } catch (error: any) {
        console.error("❌ Telegram linking failed:", error);

        if (error.code === 'functions/already-exists') {
            throw new Error('Akun Telegram ini sudah terhubung ke user lain.');
        }

        throw new Error(error.message || 'Gagal menghubungkan akun Telegram.');
    }
};

/**
 * Check if current user has Telegram linked
 */
export const hasTelegramLinked = (): boolean => {
    const user = getCurrentUser();
    return !!user?.telegramId;
};

/**
 * Get Telegram Bot name for login widget
 */
export const getTelegramBotName = (): string => {
    // This should match your Telegram bot username (without @)
    return 'SampahKosmikBot';
};
