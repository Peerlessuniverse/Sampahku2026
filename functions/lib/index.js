"use strict";
/**
 * Firebase Cloud Functions Entry Point
 *
 * Export all Cloud Functions from this file
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLeaderboard = exports.linkTelegramWithCode = exports.createLinkCode = exports.getUserCreditsByTelegram = exports.awardCreditsFromTelegram = exports.getUserHistory = exports.getUserCredits = exports.redeemCredits = exports.awardCredits = exports.linkTelegramAccount = exports.verifyTelegramAuth = exports.captureEbookLead = exports.utasWebhook = void 0;
// Export UTAS Webhook Handler
var utasWebhook_1 = require("./utasWebhook");
Object.defineProperty(exports, "utasWebhook", { enumerable: true, get: function () { return utasWebhook_1.utasWebhook; } });
// Export Ebook Lead Capture
var captureEbookLead_1 = require("./captureEbookLead");
Object.defineProperty(exports, "captureEbookLead", { enumerable: true, get: function () { return captureEbookLead_1.captureEbookLead; } });
// Export Telegram Auth Functions
var telegramAuth_1 = require("./telegramAuth");
Object.defineProperty(exports, "verifyTelegramAuth", { enumerable: true, get: function () { return telegramAuth_1.verifyTelegramAuth; } });
Object.defineProperty(exports, "linkTelegramAccount", { enumerable: true, get: function () { return telegramAuth_1.linkTelegramAccount; } });
// Export Credits & Wallet Functions
var credits_1 = require("./credits");
Object.defineProperty(exports, "awardCredits", { enumerable: true, get: function () { return credits_1.awardCredits; } });
Object.defineProperty(exports, "redeemCredits", { enumerable: true, get: function () { return credits_1.redeemCredits; } });
Object.defineProperty(exports, "getUserCredits", { enumerable: true, get: function () { return credits_1.getUserCredits; } });
Object.defineProperty(exports, "getUserHistory", { enumerable: true, get: function () { return credits_1.getUserHistory; } });
Object.defineProperty(exports, "awardCreditsFromTelegram", { enumerable: true, get: function () { return credits_1.awardCreditsFromTelegram; } });
Object.defineProperty(exports, "getUserCreditsByTelegram", { enumerable: true, get: function () { return credits_1.getUserCreditsByTelegram; } });
Object.defineProperty(exports, "createLinkCode", { enumerable: true, get: function () { return credits_1.createLinkCode; } });
Object.defineProperty(exports, "linkTelegramWithCode", { enumerable: true, get: function () { return credits_1.linkTelegramWithCode; } });
Object.defineProperty(exports, "getLeaderboard", { enumerable: true, get: function () { return credits_1.getLeaderboard; } });
//# sourceMappingURL=index.js.map