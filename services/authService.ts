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
    // Simulated Google Auth Process
    return new Promise((resolve) => {
        setTimeout(() => {
            const fakeUser: UserProfile = {
                uid: 'google_' + Math.random().toString(36).substr(2, 9),
                email: 'cosmic.user@gmail.com',
                displayName: 'Cosmic Guardian',
                photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=cosmic',
                role: 'user',
                createdAt: new Date().toISOString()
            };
            localStorage.setItem(USER_KEY, JSON.stringify(fakeUser));
            // Trigger event for UI reactivity
            window.dispatchEvent(new CustomEvent('authChanged', { detail: { user: fakeUser } }));
            resolve(fakeUser);
        }, 1500);
    });
};

export const logout = () => {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem('auth_role'); // Clean up old system
    localStorage.removeItem('auth_sponsor_id');
    window.dispatchEvent(new CustomEvent('authChanged', { detail: { user: null } }));
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
