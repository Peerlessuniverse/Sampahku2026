"use strict";
/**
 * Telegram Login Verification Cloud Function
 *
 * Verifies Telegram Login Widget data and creates Firebase Custom Token
 * for seamless authentication.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.linkTelegramAccount = exports.verifyTelegramAuth = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const crypto = __importStar(require("crypto"));
// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
    admin.initializeApp();
}
const db = admin.firestore();
/**
 * Verify Telegram Login Widget hash
 * Uses HMAC-SHA256 as per Telegram documentation
 */
function verifyTelegramHash(data, botToken) {
    const { hash } = data, authData = __rest(data, ["hash"]);
    // Create data_check_string (sorted key=value pairs)
    const dataCheckString = Object.keys(authData)
        .sort()
        .map((key) => `${key}=${authData[key]}`)
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
function verifyAuthDate(authDate) {
    const now = Math.floor(Date.now() / 1000);
    const maxAge = 24 * 60 * 60; // 24 hours in seconds
    return now - authDate < maxAge;
}
/**
 * Cloud Function: verifyTelegramAuth
 *
 * Verifies Telegram Login data and returns Firebase Custom Token
 */
exports.verifyTelegramAuth = functions.https.onCall(async (data, context) => {
    var _a;
    try {
        // Get bot token from Firebase Functions config
        const botToken = (_a = functions.config().telegram) === null || _a === void 0 ? void 0 : _a.bot_token;
        if (!botToken) {
            console.error("Telegram bot token not configured");
            throw new functions.https.HttpsError("failed-precondition", "Telegram authentication not configured");
        }
        // Validate required fields
        if (!data.id || !data.first_name || !data.auth_date || !data.hash) {
            throw new functions.https.HttpsError("invalid-argument", "Missing required Telegram auth fields");
        }
        // Verify auth_date is not too old
        if (!verifyAuthDate(data.auth_date)) {
            throw new functions.https.HttpsError("invalid-argument", "Telegram auth data expired. Please try again.");
        }
        // Verify hash
        if (!verifyTelegramHash(data, botToken)) {
            throw new functions.https.HttpsError("permission-denied", "Invalid Telegram auth hash");
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
        let uid;
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
        }
        else {
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
                initialCredits = (pendingData === null || pendingData === void 0 ? void 0 : pendingData.credits) || 0;
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
    }
    catch (error) {
        console.error("Telegram auth error:", error);
        if (error instanceof functions.https.HttpsError) {
            throw error;
        }
        throw new functions.https.HttpsError("internal", "Failed to verify Telegram authentication");
    }
});
/**
 * Cloud Function: linkTelegramAccount
 *
 * Links Telegram account to existing Firebase user (e.g., Google user)
 */
exports.linkTelegramAccount = functions.https.onCall(async (data, context) => {
    var _a;
    // Ensure user is authenticated
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "Must be logged in to link accounts");
    }
    try {
        const botToken = (_a = functions.config().telegram) === null || _a === void 0 ? void 0 : _a.bot_token;
        if (!botToken) {
            throw new functions.https.HttpsError("failed-precondition", "Telegram authentication not configured");
        }
        // Validate and verify
        if (!data.id || !data.hash || !verifyAuthDate(data.auth_date)) {
            throw new functions.https.HttpsError("invalid-argument", "Invalid Telegram auth data");
        }
        if (!verifyTelegramHash(data, botToken)) {
            throw new functions.https.HttpsError("permission-denied", "Invalid Telegram auth hash");
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
            throw new functions.https.HttpsError("already-exists", "This Telegram account is already linked to another user");
        }
        // Check for pending credits
        const pendingCreditsDoc = await db
            .collection("telegram_pending")
            .doc(telegramId)
            .get();
        let mergedCredits = 0;
        if (pendingCreditsDoc.exists) {
            const pendingData = pendingCreditsDoc.data();
            mergedCredits = (pendingData === null || pendingData === void 0 ? void 0 : pendingData.credits) || 0;
            await db.collection("telegram_pending").doc(telegramId).delete();
        }
        // Update user document
        const updateData = {
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
    }
    catch (error) {
        console.error("Link Telegram error:", error);
        if (error instanceof functions.https.HttpsError) {
            throw error;
        }
        throw new functions.https.HttpsError("internal", "Failed to link Telegram account");
    }
});
//# sourceMappingURL=telegramAuth.js.map