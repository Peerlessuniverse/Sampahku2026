/**
 * Telegram Login Verification Cloud Function
 * 
 * Verifies Telegram Login Widget data and creates Firebase Custom Token
 * for seamless authentication.
 */

import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as crypto from "crypto";

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
    admin.initializeApp();
}

const db = admin.firestore();

// Telegram Auth Data Interface
interface TelegramAuthData {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    photo_url?: string;
    auth_date: number;
    hash: string;
}

/**
 * Verify Telegram Login Widget hash
 * Uses HMAC-SHA256 as per Telegram documentation
 */
function verifyTelegramHash(data: TelegramAuthData, botToken: string): boolean {
    const { hash, ...authData } = data;

    // Create data_check_string (sorted key=value pairs)
    const dataCheckString = Object.keys(authData)
        .sort()
        .map((key) => `${key}=${authData[key as keyof typeof authData]}`)
        .join("\n");

    // Create secret key from bot token
    const secretKey = crypto.createHash("sha256").update(botToken).digest();

    // Calculate HMAC-SHA256
    const calculatedHash = crypto
        .createHmac("sha256", secretKey)
        .update(dataCheckString)
        .digest("hex");

    return calculatedHash === hash;
}

/**
 * Verify auth_date is not too old (prevent replay attacks)
 * Max age: 24 hours
 */
function verifyAuthDate(authDate: number): boolean {
    const now = Math.floor(Date.now() / 1000);
    const maxAge = 24 * 60 * 60; // 24 hours in seconds
    return now - authDate < maxAge;
}

/**
 * Cloud Function: verifyTelegramAuth
 * 
 * Verifies Telegram Login data and returns Firebase Custom Token
 */
export const verifyTelegramAuth = functions.https.onCall(
    async (data: TelegramAuthData, context) => {
        try {
            // Get bot token from Firebase Functions config
            const botToken = functions.config().telegram?.bot_token;

            if (!botToken) {
                console.error("Telegram bot token not configured");
                throw new functions.https.HttpsError(
                    "failed-precondition",
                    "Telegram authentication not configured"
                );
            }

            // Validate required fields
            if (!data.id || !data.first_name || !data.auth_date || !data.hash) {
                throw new functions.https.HttpsError(
                    "invalid-argument",
                    "Missing required Telegram auth fields"
                );
            }

            // Verify auth_date is not too old
            if (!verifyAuthDate(data.auth_date)) {
                throw new functions.https.HttpsError(
                    "invalid-argument",
                    "Telegram auth data expired. Please try again."
                );
            }

            // Verify hash
            if (!verifyTelegramHash(data, botToken)) {
                throw new functions.https.HttpsError(
                    "permission-denied",
                    "Invalid Telegram auth hash"
                );
            }

            // Auth verified! Now create or update user
            const telegramId = data.id.toString();
            const displayName = data.last_name
                ? `${data.first_name} ${data.last_name}`
                : data.first_name;

            // Check if user with this telegramId already exists
            const usersRef = db.collection("users");
            const existingUserQuery = await usersRef
                .where("telegramId", "==", telegramId)
                .limit(1)
                .get();

            let uid: string;
            let isNewUser = false;

            if (!existingUserQuery.empty) {
                // Existing user - get their UID
                uid = existingUserQuery.docs[0].id;

                // Update last login
                await usersRef.doc(uid).update({
                    lastLoginAt: admin.firestore.FieldValue.serverTimestamp(),
                    telegramPhotoUrl: data.photo_url || null,
                });

                console.log(`Existing Telegram user logged in: ${uid}`);
            } else {
                // New user - create Firebase Auth user and Firestore document
                uid = `telegram_${telegramId}`;
                isNewUser = true;

                // Check for any pending credits from bot
                const pendingCreditsDoc = await db
                    .collection("telegram_pending")
                    .doc(telegramId)
                    .get();

                let initialCredits = 0;
                if (pendingCreditsDoc.exists) {
                    const pendingData = pendingCreditsDoc.data();
                    initialCredits = pendingData?.credits || 0;

                    // Delete pending record after merge
                    await db.collection("telegram_pending").doc(telegramId).delete();
                    console.log(`Merged ${initialCredits} pending credits for ${telegramId}`);
                }

                // Create user document
                await usersRef.doc(uid).set({
                    uid,
                    email: null,
                    displayName,
                    photoURL: data.photo_url || `https://api.dicebear.com/7.x/initials/svg?seed=${displayName}`,
                    telegramId,
                    telegramUsername: data.username || null,
                    telegramPhotoUrl: data.photo_url || null,
                    providers: ["telegram"],
                    credits: initialCredits,
                    impact: 0,
                    role: "user",
                    createdAt: admin.firestore.FieldValue.serverTimestamp(),
                    lastLoginAt: admin.firestore.FieldValue.serverTimestamp(),
                });

                console.log(`New Telegram user created: ${uid}`);
            }

            // Create Firebase Custom Token
            const customToken = await admin.auth().createCustomToken(uid, {
                telegramId,
                provider: "telegram",
            });

            return {
                success: true,
                customToken,
                isNewUser,
                user: {
                    uid,
                    displayName,
                    photoURL: data.photo_url || `https://api.dicebear.com/7.x/initials/svg?seed=${displayName}`,
                    telegramId,
                    telegramUsername: data.username || null,
                },
            };
        } catch (error: any) {
            console.error("Telegram auth error:", error);

            if (error instanceof functions.https.HttpsError) {
                throw error;
            }

            throw new functions.https.HttpsError(
                "internal",
                "Failed to verify Telegram authentication"
            );
        }
    }
);

/**
 * Cloud Function: linkTelegramAccount
 * 
 * Links Telegram account to existing Firebase user (e.g., Google user)
 */
export const linkTelegramAccount = functions.https.onCall(
    async (data: TelegramAuthData, context) => {
        // Ensure user is authenticated
        if (!context.auth) {
            throw new functions.https.HttpsError(
                "unauthenticated",
                "Must be logged in to link accounts"
            );
        }

        try {
            const botToken = functions.config().telegram?.bot_token;

            if (!botToken) {
                throw new functions.https.HttpsError(
                    "failed-precondition",
                    "Telegram authentication not configured"
                );
            }

            // Validate and verify
            if (!data.id || !data.hash || !verifyAuthDate(data.auth_date)) {
                throw new functions.https.HttpsError(
                    "invalid-argument",
                    "Invalid Telegram auth data"
                );
            }

            if (!verifyTelegramHash(data, botToken)) {
                throw new functions.https.HttpsError(
                    "permission-denied",
                    "Invalid Telegram auth hash"
                );
            }

            const telegramId = data.id.toString();
            const currentUid = context.auth.uid;

            // Check if this Telegram ID is already linked to another account
            const existingQuery = await db
                .collection("users")
                .where("telegramId", "==", telegramId)
                .limit(1)
                .get();

            if (!existingQuery.empty && existingQuery.docs[0].id !== currentUid) {
                throw new functions.https.HttpsError(
                    "already-exists",
                    "This Telegram account is already linked to another user"
                );
            }

            // Check for pending credits
            const pendingCreditsDoc = await db
                .collection("telegram_pending")
                .doc(telegramId)
                .get();

            let mergedCredits = 0;
            if (pendingCreditsDoc.exists) {
                const pendingData = pendingCreditsDoc.data();
                mergedCredits = pendingData?.credits || 0;
                await db.collection("telegram_pending").doc(telegramId).delete();
            }

            // Update user document
            const updateData: any = {
                telegramId,
                telegramUsername: data.username || null,
                telegramPhotoUrl: data.photo_url || null,
                providers: admin.firestore.FieldValue.arrayUnion("telegram"),
            };

            if (mergedCredits > 0) {
                updateData.credits = admin.firestore.FieldValue.increment(mergedCredits);
            }

            await db.collection("users").doc(currentUid).update(updateData);

            return {
                success: true,
                mergedCredits,
                telegramUsername: data.username,
            };
        } catch (error: any) {
            console.error("Link Telegram error:", error);

            if (error instanceof functions.https.HttpsError) {
                throw error;
            }

            throw new functions.https.HttpsError(
                "internal",
                "Failed to link Telegram account"
            );
        }
    }
);
