"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLeaderboard = exports.getUserCreditsByTelegram = exports.awardCreditsFromTelegram = exports.linkTelegramWithCode = exports.createLinkCode = exports.redeemCredits = exports.awardCredits = exports.getUserHistory = exports.getUserCredits = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const crypto = __importStar(require("crypto"));
if (!admin.apps.length) {
    admin.initializeApp();
}
const db = admin.firestore();
const AD_LIMITS = {
    MAX_ADS_PER_DAY: 100,
    MAX_POINTS_FROM_ADS_PER_DAY: 145,
    ADS_PER_SESSION: 10,
    SESSION_COOLDOWN_MINUTES: 5,
};
// TelegramAwardInput declared when needed for dedicated endpoint
const getTodayWIB = () => {
    const fmt = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Jakarta",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
    return fmt.format(new Date()); // YYYY-MM-DD
};
const hashId = (input) => crypto.createHash("sha256").update(input).digest("hex");
const computeAdReward = (adNumber) => {
    if (adNumber <= 10)
        return 11 - adNumber; // 10..1
    return 1;
};
const ensureWallet = (data) => ({
    credits: (data === null || data === void 0 ? void 0 : data.credits) || 0,
    impact: (data === null || data === void 0 ? void 0 : data.impact) || 0,
    completedActivities: (data === null || data === void 0 ? void 0 : data.completedActivities) || [],
    badges: (data === null || data === void 0 ? void 0 : data.badges) || [],
    totalAnalyses: (data === null || data === void 0 ? void 0 : data.totalAnalyses) || 0,
    createdAt: data === null || data === void 0 ? void 0 : data.createdAt,
    updatedAt: data === null || data === void 0 ? void 0 : data.updatedAt,
});
const getWalletRef = (uid) => db.collection("wallets").doc(uid);
const getLedgerEntryRef = (uid, entryId) => db.collection("ledgers").doc(uid).collection("entries").doc(entryId);
const getAdStatsRef = (uid, day) => db.collection("adStats").doc(uid).collection("days").doc(day);
const getBadgeCatalogRef = () => db.collection("badge_catalog");
exports.getUserCredits = functions.https.onCall(async (data) => {
    const { uid } = data || {};
    if (!uid || typeof uid !== "string") {
        throw new functions.https.HttpsError("invalid-argument", "uid required");
    }
    const walletSnap = await getWalletRef(uid).get();
    const wallet = ensureWallet(walletSnap.data());
    return {
        credits: wallet.credits || 0,
        impact: wallet.impact || 0,
        completedActivities: wallet.completedActivities || [],
    };
});
exports.getUserHistory = functions.https.onCall(async (data) => {
    const { uid } = data || {};
    if (!uid || typeof uid !== "string") {
        throw new functions.https.HttpsError("invalid-argument", "uid required");
    }
    const entriesSnap = await db
        .collection("ledgers")
        .doc(uid)
        .collection("entries")
        .orderBy("createdAt", "desc")
        .limit(50)
        .get();
    return entriesSnap.docs.map((doc) => {
        var _a, _b;
        const d = doc.data();
        return {
            id: doc.id,
            amount: d.amount,
            description: d.description,
            timestamp: (((_b = (_a = d.createdAt) === null || _a === void 0 ? void 0 : _a.toDate) === null || _b === void 0 ? void 0 : _b.call(_a)) || new Date()).toISOString(),
            type: d.type || (d.amount >= 0 ? "earn" : "redeem"),
        };
    });
});
exports.awardCredits = functions.https.onCall(async (rawData) => {
    const data = rawData;
    if (!data || typeof data !== "object") {
        throw new functions.https.HttpsError("invalid-argument", "payload missing");
    }
    const { uid, amount, description, activityId, impactChange = 0, source, idempotencyKey, metadata = {}, actionType, } = data;
    if (!uid || typeof uid !== "string")
        throw new functions.https.HttpsError("invalid-argument", "uid required");
    if (!description || typeof description !== "string")
        throw new functions.https.HttpsError("invalid-argument", "description required");
    if (!source || !["web", "telegram", "admin", "system"].includes(source)) {
        throw new functions.https.HttpsError("invalid-argument", "invalid source");
    }
    if (!idempotencyKey || typeof idempotencyKey !== "string") {
        throw new functions.https.HttpsError("invalid-argument", "idempotencyKey required");
    }
    const entryId = hashId(idempotencyKey);
    const ledgerRef = getLedgerEntryRef(uid, entryId);
    // Idempotency check upfront
    const existingLedger = await ledgerRef.get();
    if (existingLedger.exists) {
        const walletSnap = await getWalletRef(uid).get();
        const wallet = ensureWallet(walletSnap.data());
        return {
            ok: true,
            duplicate: true,
            wallet: {
                credits: wallet.credits,
                impact: wallet.impact,
                completedActivitiesCount: wallet.completedActivities.length,
            },
        };
    }
    const now = admin.firestore.Timestamp.now();
    let computedAmount = amount;
    let computedImpact = impactChange || 0;
    const walletRef = getWalletRef(uid);
    const today = getTodayWIB();
    const adStatsRef = getAdStatsRef(uid, today);
    const result = await db.runTransaction(async (tx) => {
        let walletSnap = await tx.get(walletRef);
        if (!walletSnap.exists) {
            tx.set(walletRef, {
                credits: 0,
                impact: 0,
                completedActivities: [],
                createdAt: now,
                updatedAt: now,
            });
            walletSnap = await tx.get(walletRef);
        }
        const walletData = ensureWallet(walletSnap.data());
        const completedActivities = walletData.completedActivities || [];
        // Activity dedup
        if (activityId) {
            if (completedActivities.includes(activityId)) {
                return {
                    ok: true,
                    duplicate: true,
                    reason: "activity_completed",
                    wallet: {
                        credits: walletData.credits,
                        impact: walletData.impact,
                        completedActivitiesCount: completedActivities.length,
                    },
                };
            }
        }
        // Ad watch server validation
        if (actionType === "ad_watch") {
            let adSnap = await tx.get(adStatsRef);
            let adData = adSnap.exists
                ? adSnap.data()
                : {
                    date: today,
                    totalAdsWatched: 0,
                    currentSessionAds: 0,
                    sessionsCompleted: 0,
                    lastSessionEndTime: null,
                    pointsEarned: 0,
                    updatedAt: now,
                };
            // Daily reset if date mismatch
            if (adData.date !== today) {
                adData = {
                    date: today,
                    totalAdsWatched: 0,
                    currentSessionAds: 0,
                    sessionsCompleted: 0,
                    lastSessionEndTime: null,
                    pointsEarned: 0,
                    updatedAt: now,
                };
            }
            if (adData.totalAdsWatched >= AD_LIMITS.MAX_ADS_PER_DAY) {
                throw new functions.https.HttpsError("failed-precondition", "max_ads_reached");
            }
            if (adData.pointsEarned >= AD_LIMITS.MAX_POINTS_FROM_ADS_PER_DAY) {
                throw new functions.https.HttpsError("failed-precondition", "max_ad_points_reached");
            }
            const nowMs = Date.now();
            if (adData.currentSessionAds >= AD_LIMITS.ADS_PER_SESSION && adData.lastSessionEndTime) {
                const diff = nowMs - adData.lastSessionEndTime;
                if (diff < AD_LIMITS.SESSION_COOLDOWN_MINUTES * 60 * 1000) {
                    throw new functions.https.HttpsError("failed-precondition", "session_cooldown");
                }
                // Start new session
                adData.currentSessionAds = 0;
                adData.lastSessionEndTime = null;
            }
            const nextAdNumber = adData.totalAdsWatched + 1;
            let reward = computeAdReward(nextAdNumber);
            if (adData.pointsEarned + reward > AD_LIMITS.MAX_POINTS_FROM_ADS_PER_DAY) {
                reward = AD_LIMITS.MAX_POINTS_FROM_ADS_PER_DAY - adData.pointsEarned;
                if (reward <= 0) {
                    throw new functions.https.HttpsError("failed-precondition", "max_ad_points_reached");
                }
            }
            adData.totalAdsWatched += 1;
            adData.currentSessionAds += 1;
            adData.pointsEarned += reward;
            adData.updatedAt = now;
            if (adData.currentSessionAds >= AD_LIMITS.ADS_PER_SESSION) {
                adData.sessionsCompleted += 1;
                adData.lastSessionEndTime = nowMs;
            }
            tx.set(adStatsRef, adData, { merge: true });
            computedAmount = reward;
        }
        if (!computedAmount || computedAmount === 0) {
            throw new functions.https.HttpsError("invalid-argument", "amount must be non-zero");
        }
        const newCredits = walletData.credits + computedAmount;
        const newImpact = walletData.impact + (computedImpact || 0);
        const updates = {
            credits: newCredits,
            impact: newImpact,
            updatedAt: now,
        };
        if (activityId) {
            updates.completedActivities = admin.firestore.FieldValue.arrayUnion(activityId);
        }
        tx.set(walletRef, updates, { merge: true });
        const entry = {
            amount: computedAmount,
            type: computedAmount >= 0 ? "earn" : "redeem",
            description,
            activityId: activityId || null,
            impactChange: computedImpact || 0,
            source,
            idempotencyKey,
            metadata,
            createdAt: now,
        };
        tx.set(ledgerRef, entry, { merge: false });
        return {
            ok: true,
            duplicate: false,
            wallet: {
                credits: newCredits,
                impact: newImpact,
                completedActivitiesCount: activityId
                    ? completedActivities.length + 1
                    : completedActivities.length,
            },
            transaction: {
                id: entryId,
                amount: computedAmount,
                description,
                type: entry.type,
                createdAt: now.toDate().toISOString(),
            },
        };
    });
    return result;
});
exports.redeemCredits = functions.https.onCall(async (data) => {
    const payload = data;
    if (!payload || typeof payload !== "object") {
        throw new functions.https.HttpsError("invalid-argument", "payload missing");
    }
    const { uid, amount, description, idempotencyKey } = payload;
    if (!uid || typeof uid !== "string")
        throw new functions.https.HttpsError("invalid-argument", "uid required");
    if (!description || typeof description !== "string")
        throw new functions.https.HttpsError("invalid-argument", "description required");
    if (!idempotencyKey || typeof idempotencyKey !== "string")
        throw new functions.https.HttpsError("invalid-argument", "idempotencyKey required");
    if (!amount || amount >= 0)
        throw new functions.https.HttpsError("invalid-argument", "amount must be negative for redeem");
    const walletRef = getWalletRef(uid);
    const now = admin.firestore.Timestamp.now();
    const entryId = hashId(idempotencyKey);
    const ledgerRef = getLedgerEntryRef(uid, entryId);
    const existing = await ledgerRef.get();
    if (existing.exists) {
        const walletSnap = await walletRef.get();
        const wallet = ensureWallet(walletSnap.data());
        return {
            ok: true,
            duplicate: true,
            wallet: {
                credits: wallet.credits,
                impact: wallet.impact,
                completedActivitiesCount: wallet.completedActivities.length,
            },
        };
    }
    const res = await db.runTransaction(async (tx) => {
        const walletSnap = await tx.get(walletRef);
        const walletData = ensureWallet(walletSnap.data());
        const currentCredits = walletData.credits;
        if (currentCredits + amount < 0) {
            throw new functions.https.HttpsError("failed-precondition", "insufficient_credits");
        }
        const newCredits = currentCredits + amount;
        tx.set(walletRef, { credits: newCredits, updatedAt: now }, { merge: true });
        tx.set(ledgerRef, {
            amount,
            type: "redeem",
            description,
            impactChange: 0,
            source: payload.source || "web",
            idempotencyKey,
            metadata: payload.metadata || {},
            createdAt: now,
        });
        return {
            ok: true,
            duplicate: false,
            wallet: {
                credits: newCredits,
                impact: walletData.impact,
                completedActivitiesCount: walletData.completedActivities.length,
            },
            transaction: {
                id: entryId,
                amount,
                description,
                type: "redeem",
                createdAt: now.toDate().toISOString(),
            },
        };
    });
    return res;
});
// ===== Telegram linking (code-based) =====
const LINK_CODE_TTL_MS = 5 * 60 * 1000;
const generateCode = () => {
    // 6-digit numeric code with leading zeros
    const num = crypto.randomInt(0, 1000000);
    return num.toString().padStart(6, "0");
};
exports.createLinkCode = functions.https.onCall(async (data, context) => {
    var _a, _b;
    const { telegramUserId, displayName } = data || {};
    if (!telegramUserId || typeof telegramUserId !== "string") {
        throw new functions.https.HttpsError("invalid-argument", "telegramUserId required");
    }
    const botSecret = (_a = functions.config().telegram) === null || _a === void 0 ? void 0 : _a.bot_secret;
    const headerSecret = (_b = context.rawRequest) === null || _b === void 0 ? void 0 : _b.headers["x-bot-secret"];
    if (!botSecret || !headerSecret || headerSecret !== botSecret) {
        throw new functions.https.HttpsError("permission-denied", "invalid bot secret");
    }
    const code = generateCode();
    const nowMs = Date.now();
    const expiresAt = admin.firestore.Timestamp.fromMillis(nowMs + LINK_CODE_TTL_MS);
    const codeRef = db.collection("linkCodes").doc(code);
    await codeRef.set({
        code,
        telegramUserId,
        displayName: displayName || null,
        expiresAt,
        used: false,
        usedByUid: null,
        createdAt: admin.firestore.Timestamp.fromMillis(nowMs),
    });
    return { code, expiresAt: expiresAt.toDate().toISOString() };
});
exports.linkTelegramWithCode = functions.https.onCall(async (data, context) => {
    var _a;
    if (!((_a = context.auth) === null || _a === void 0 ? void 0 : _a.uid)) {
        throw new functions.https.HttpsError("unauthenticated", "login required");
    }
    const { code } = data || {};
    if (!code || typeof code !== "string") {
        throw new functions.https.HttpsError("invalid-argument", "code required");
    }
    const codeRef = db.collection("linkCodes").doc(code);
    const now = admin.firestore.Timestamp.now();
    const res = await db.runTransaction(async (tx) => {
        var _a;
        const codeSnap = await tx.get(codeRef);
        if (!codeSnap.exists) {
            throw new functions.https.HttpsError("not-found", "code_not_found");
        }
        const codeData = codeSnap.data();
        if (codeData.used) {
            throw new functions.https.HttpsError("failed-precondition", "code_used");
        }
        if (((_a = codeData.expiresAt) === null || _a === void 0 ? void 0 : _a.toMillis) && codeData.expiresAt.toMillis() < Date.now()) {
            throw new functions.https.HttpsError("deadline-exceeded", "code_expired");
        }
        const telegramUserId = codeData.telegramUserId;
        const linkRef = db.collection("telegram_links").doc(String(telegramUserId));
        tx.set(linkRef, {
            uid: context.auth.uid,
            telegramUserId,
            linkedAt: now,
            displayName: codeData.displayName || null,
        }, { merge: true });
        tx.update(codeRef, { used: true, usedByUid: context.auth.uid });
        return { telegramUserId };
    });
    return { ok: true, telegramUserId: res.telegramUserId };
});
const DEFAULT_BADGES = [
    { id: "FIRST_ANALYSIS", name: "🌠 Stardust Scout", desc: "Analisis sampah pertama", rewardCredits: 50, icon: "🌠", criteria: { type: "first_analysis", threshold: 1 }, order: 1 },
    { id: "STREAK_3", name: "🏗️ Cosmic Architect", desc: "Streak 3 hari", rewardCredits: 100, icon: "🏗️", criteria: { type: "streak_gte", threshold: 3 }, order: 2 },
    { id: "STREAK_7", name: "🌀 Nebula Guardian", desc: "Streak 7 hari", rewardCredits: 300, icon: "🌀", criteria: { type: "streak_gte", threshold: 7 }, order: 3 },
    { id: "ANALYSIS_10", name: "💧 Aqua Mystic", desc: "10 analisis sampah", rewardCredits: 150, icon: "💧", criteria: { type: "analyses_gte", threshold: 10 }, order: 4 },
    { id: "POINTS_500", name: "☀️ Solar Vanguard", desc: "500 poin", rewardCredits: 120, icon: "☀️", criteria: { type: "points_gte", threshold: 500 }, order: 5 },
    { id: "POINTS_1000", name: "🌍 Terra Shaper", desc: "1000 poin", rewardCredits: 200, icon: "🌍", criteria: { type: "points_gte", threshold: 1000 }, order: 6 },
];
const seedBadgeCatalog = async () => {
    const batch = db.batch();
    DEFAULT_BADGES.forEach((badge) => {
        const ref = getBadgeCatalogRef().doc(badge.id);
        batch.set(ref, badge, { merge: true });
    });
    await batch.commit();
    return DEFAULT_BADGES;
};
const loadBadgeCatalog = async () => {
    const snap = await getBadgeCatalogRef().orderBy("order").get();
    let items = snap.docs.map((d) => (Object.assign({ id: d.id }, d.data())));
    if (items.length === 0) {
        items = await seedBadgeCatalog();
    }
    return items;
};
const evaluateBadgeCriteria = (badge, user) => {
    const c = badge.criteria;
    if (!c)
        return false;
    switch (c.type) {
        case "first_analysis":
            return (user.totalAnalyses || 0) >= 1;
        case "streak_gte":
            return false; // Streak dihitung terpisah di Postgres untuk bot
        case "analyses_gte":
            return (user.totalAnalyses || 0) >= (c.threshold || 0);
        case "points_gte":
            return (user.credits || 0) >= (c.threshold || 0);
        default:
            return false;
    }
};
exports.awardCreditsFromTelegram = functions.https.onCall(async (rawData) => {
    var _a;
    const data = rawData;
    if (!data || typeof data !== "object") {
        throw new functions.https.HttpsError("invalid-argument", "payload missing");
    }
    const { telegramUserId, idempotencyKey, actionType, metadata = {} } = data;
    if (!telegramUserId || typeof telegramUserId !== "string") {
        throw new functions.https.HttpsError("invalid-argument", "telegramUserId required");
    }
    if (!idempotencyKey || typeof idempotencyKey !== "string") {
        throw new functions.https.HttpsError("invalid-argument", "idempotencyKey required");
    }
    // Resolve UID via telegram_links
    const linkRef = db.collection("telegram_links").doc(telegramUserId);
    const linkSnap = await linkRef.get();
    if (!linkSnap.exists) {
        return { ok: false, reason: "telegram_not_linked", creditedAmount: 0 };
    }
    const linkData = linkSnap.data();
    const uid = linkData.uid;
    // Idempotency check
    const entryId = hashId(idempotencyKey);
    const ledgerRef = getLedgerEntryRef(uid, entryId);
    const existingLedger = await ledgerRef.get();
    if (existingLedger.exists) {
        const walletSnap = await getWalletRef(uid).get();
        const wallet = ensureWallet(walletSnap.data());
        return {
            ok: true,
            duplicate: true,
            creditedAmount: 0,
            wallet: {
                credits: wallet.credits,
                impact: wallet.impact,
                completedActivitiesCount: wallet.completedActivities.length,
            },
        };
    }
    const now = admin.firestore.Timestamp.now();
    let computedAmount = data.amount || 0;
    let computedImpact = 0;
    let newBadges = [];
    // Tentukan reward berdasarkan metadata (scan/mission)
    if (metadata) {
        const kategori = ((_a = metadata.kategori) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || "";
        if (kategori === "dasar") {
            computedAmount = 20;
        }
        else if (kategori === "organik") {
            computedAmount = 25;
        }
        else if (kategori === "anorganik") {
            computedAmount = 15;
        }
        else if (kategori === "b3" || kategori === "b3 sampah") {
            computedAmount = 40;
        }
        else if (kategori === "residu") {
            computedAmount = 15;
        }
        else {
            computedAmount = 10; // default
        }
    }
    const result = await db.runTransaction(async (tx) => {
        let walletSnap = await tx.get(getWalletRef(uid));
        if (!walletSnap.exists) {
            tx.set(getWalletRef(uid), {
                credits: 0,
                impact: 0,
                completedActivities: [],
                badges: [],
                totalAnalyses: 0,
                createdAt: now,
                updatedAt: now,
            });
            walletSnap = await tx.get(getWalletRef(uid));
        }
        const walletData = ensureWallet(walletSnap.data());
        let currentAnalyses = walletData.totalAnalyses || 0;
        // Increment totalAnalyses untuk scan
        if (actionType === "telegram_scan") {
            currentAnalyses += 1;
        }
        // Evaluasi badges berdasarkan katalog Firestore
        const catalog = await loadBadgeCatalog();
        const ownedBadges = new Set(walletData.badges || []);
        const earned = [];
        let totalRewardSum = 0;
        for (const badge of catalog) {
            if (ownedBadges.has(badge.id))
                continue;
            // Khusus untuk bot: evaluasi hanya badge yang relevan
            const isRelevant = badge.id === "FIRST_ANALYSIS" || badge.id.startsWith("ANALYSIS_") || badge.id.startsWith("POINTS_");
            if (!isRelevant)
                continue;
            if (evaluateBadgeCriteria(badge, Object.assign(Object.assign({}, walletData), { totalAnalyses: currentAnalyses }))) {
                earned.push(badge.id);
                totalRewardSum += badge.rewardCredits || 0;
            }
        }
        if (earned.length > 0) {
            newBadges = earned;
        }
        const newCredits = walletData.credits + computedAmount + totalRewardSum;
        const newImpact = walletData.impact + computedImpact;
        const updates = {
            credits: newCredits,
            impact: newImpact,
            totalAnalyses: currentAnalyses,
            updatedAt: now,
        };
        if (newBadges.length > 0) {
            updates.badges = admin.firestore.FieldValue.arrayUnion(...newBadges);
        }
        tx.set(getWalletRef(uid), updates, { merge: true });
        const entry = {
            amount: computedAmount + totalRewardSum,
            type: "earn",
            description: data.description || "Telegram scan/mission",
            activityId: data.idempotencyKey, // Gunakan idempotencyKey sebagai activityId untuk identifikasi
            impactChange: computedImpact,
            source: "telegram",
            idempotencyKey,
            metadata: Object.assign(Object.assign({}, data.metadata), { newBadges }),
            createdAt: now,
        };
        tx.set(ledgerRef, entry, { merge: false });
        return {
            ok: true,
            duplicate: false,
            creditedAmount: computedAmount + totalRewardSum,
            wallet: {
                credits: newCredits,
                impact: newImpact,
                completedActivitiesCount: (walletData.completedActivities || []).length,
            },
            newBadges,
        };
    });
    return result;
});
exports.getUserCreditsByTelegram = functions.https.onCall(async (data) => {
    const { telegramUserId } = data || {};
    if (!telegramUserId || typeof telegramUserId !== "string") {
        throw new functions.https.HttpsError("invalid-argument", "telegramUserId required");
    }
    const linkRef = db.collection("telegram_links").doc(telegramUserId);
    const linkSnap = await linkRef.get();
    if (!linkSnap.exists) {
        return { credits: 0, impact: 0, badges: [], totalAnalyses: 0, linked: false };
    }
    const linkData = linkSnap.data();
    const uid = linkData.uid;
    const walletSnap = await getWalletRef(uid).get();
    const wallet = ensureWallet(walletSnap.data());
    return {
        credits: wallet.credits || 0,
        impact: wallet.impact || 0,
        badges: wallet.badges || [],
        totalAnalyses: wallet.totalAnalyses || 0,
        linked: true,
    };
});
exports.getLeaderboard = functions.https.onCall(async () => {
    const walletsSnap = await db.collection("wallets")
        .orderBy("credits", "desc")
        .limit(50)
        .get();
    const results = await Promise.all(walletsSnap.docs.map(async (doc) => {
        const wallet = doc.data();
        const uid = doc.id;
        // Fetch user info for name/avatar
        const userSnap = await db.collection("users").doc(uid).get();
        const userData = userSnap.data() || {};
        return {
            uid,
            credits: wallet.credits || 0,
            impact: wallet.impact || 0,
            displayName: userData.displayName || "Anonymous Guardian",
            photoURL: userData.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${uid}`,
        };
    }));
    return results;
});
//# sourceMappingURL=credits.js.map