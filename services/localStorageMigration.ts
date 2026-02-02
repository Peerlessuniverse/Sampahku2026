/**
 * localStorage Migration Helper
 *
 * Automatically migrates old localStorage keys and values from "advertiser" to "partner"
 * This runs on app initialization to ensure backward compatibility
 */

export const migrateLocalStorage = (): boolean => {
    try {
        console.log('🔄 Checking for localStorage migration needs...');

        let migrated = false;

        // 1. Migrate auth_advertiser_id → auth_partner_id
        const oldAdvertiserId = localStorage.getItem('auth_advertiser_id');
        if (oldAdvertiserId && !localStorage.getItem('auth_partner_id')) {
            localStorage.setItem('auth_partner_id', oldAdvertiserId);
            localStorage.removeItem('auth_advertiser_id');
            console.log('✅ Migrated: auth_advertiser_id → auth_partner_id');
            migrated = true;
        }

        // 2. Migrate auth_role: 'advertiser' → 'partner'
        const authRole = localStorage.getItem('auth_role');
        if (authRole === 'advertiser') {
            localStorage.setItem('auth_role', 'partner');
            console.log('✅ Migrated: auth_role from "advertiser" to "partner"');
            migrated = true;
        }

        // 3. Migrate auth_token if it contains 'advertiser'
        const authToken = localStorage.getItem('auth_token');
        if (authToken && authToken.includes('advertiser_session_')) {
            const newToken = authToken.replace('advertiser_session_', 'partner_session_');
            localStorage.setItem('auth_token', newToken);
            console.log('✅ Migrated: auth_token updated to use "partner" terminology');
            migrated = true;
        }

        // 4. Migrate auth_user_id if it contains 'advertiser'
        const authUserId = localStorage.getItem('auth_user_id');
        if (authUserId && authUserId.includes('advertiser-')) {
            const newUserId = authUserId.replace('advertiser-', 'partner-');
            localStorage.setItem('auth_user_id', newUserId);
            console.log('✅ Migrated: auth_user_id updated to use "partner" terminology');
            migrated = true;
        }

        if (migrated) {
            console.log('✨ localStorage migration completed successfully!');
        } else {
            console.log('ℹ️  No migration needed - localStorage is up to date');
        }

        return migrated;
    } catch (error) {
        console.error('❌ localStorage migration failed:', error);
        return false;
    }
};

/**
 * Check if user needs to be redirected after migration
 * This is useful if URL paths have changed
 */
export const checkRedirectAfterMigration = (): string | null => {
    const currentPath = window.location.pathname;

    // Redirect old advertiser routes to new partner routes
    if (currentPath.startsWith('/advertiser/')) {
        const newPath = currentPath.replace('/advertiser/', '/partner/');
        console.log(`🔀 Redirecting from ${currentPath} to ${newPath}`);
        return newPath;
    }

    // Redirect old admin advertiser routes to new admin partner routes
    if (currentPath === '/admin/advertisers') {
        console.log(`🔀 Redirecting from /admin/advertisers to /admin/partners`);
        return '/admin/partners';
    }

    return null;
};

/**
 * Initialize migration on app load
 * Call this function in your main App component or index.tsx
 */
export const initializeLocalStorageMigration = (): void => {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        const migrated = migrateLocalStorage();

        if (migrated) {
            // Check if redirect is needed
            const redirectPath = checkRedirectAfterMigration();
            if (redirectPath) {
                window.location.pathname = redirectPath;
            }
        }
    }
};
