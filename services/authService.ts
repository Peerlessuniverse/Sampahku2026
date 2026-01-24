import { auth, googleProvider } from "./firebase";
import { signInWithPopup, signOut, onAuthStateChanged, User } from "firebase/auth";
import { saveUserProfile } from "./dbService";

export interface UserProfile {
    uid: string;
    email: string;
    displayName: string;
    photoURL: string;
    role: 'user' | 'admin' | 'sponsor';
    createdAt: string;
}

const USER_KEY = 'sampahku_user_session';

export const loginWithGoogle = async (): Promise<UserProfile> => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        const userProfile: UserProfile = {
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || 'Cosmic Guardian',
            photoURL: user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`,
            role: 'user', // Default role
            createdAt: new Date().toISOString()
        };

        // Sync profile to Firestore
        await saveUserProfile({
            uid: userProfile.uid,
            displayName: userProfile.displayName,
            photoURL: userProfile.photoURL
        });

        localStorage.setItem(USER_KEY, JSON.stringify(userProfile));
        window.dispatchEvent(new CustomEvent('authChanged', { detail: { user: userProfile } }));
        return userProfile;
    } catch (error: any) {
        console.error("Firebase Auth Error Details:", {
            code: error.code,
            message: error.message,
            stack: error.stack
        });
        throw error;
    }
};

export const logout = async () => {
    await signOut(auth);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem('auth_role');
    localStorage.removeItem('auth_sponsor_id');
    window.dispatchEvent(new CustomEvent('authChanged', { detail: { user: null } }));
};

// Listen to Firebase Auth state changes
export const onAuthUIStateChanged = (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
};

onAuthStateChanged(auth, (user: User | null) => {
    if (user) {
        const userProfile: UserProfile = {
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || 'Cosmic Guardian',
            photoURL: user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`,
            role: 'user',
            createdAt: new Date().toISOString()
        };
        localStorage.setItem(USER_KEY, JSON.stringify(userProfile));
        window.dispatchEvent(new CustomEvent('authChanged', { detail: { user: userProfile } }));
    } else {
        localStorage.removeItem(USER_KEY);
        window.dispatchEvent(new CustomEvent('authChanged', { detail: { user: null } }));
    }
});

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
