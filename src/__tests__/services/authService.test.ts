import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
    loginWithGoogle,
    logout,
    isAuthenticated,
    getCurrentUser
} from '@/services/authService';

describe('authService', () => {
    beforeEach(() => {
        window.localStorage.clear();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('loginWithGoogle should return a user and set authentication', async () => {
        const user = await loginWithGoogle();

        expect(user).toBeDefined();
        expect(user.role).toBe('user');
        expect(isAuthenticated()).toBe(true);
        expect(getCurrentUser()).toEqual(user);
    });

    it('logout should clear session', async () => {
        await loginWithGoogle();
        expect(isAuthenticated()).toBe(true);

        await logout();
        expect(isAuthenticated()).toBe(false);
        expect(getCurrentUser()).toBeNull();
    });
});
