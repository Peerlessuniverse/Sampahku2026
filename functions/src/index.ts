/**
 * Firebase Cloud Functions Entry Point
 * 
 * Export all Cloud Functions from this file
 */

// Export UTAS Webhook Handler
export { utasWebhook } from './utasWebhook';

// Export Ebook Lead Capture
export { captureEbookLead } from './captureEbookLead';

// Export Telegram Auth Functions
export { verifyTelegramAuth, linkTelegramAccount } from './telegramAuth';

// Export Credits & Wallet Functions
export {
  awardCredits,
  redeemCredits,
  getUserCredits,
  getUserHistory,
  awardCreditsFromTelegram,
  getUserCreditsByTelegram,
  createLinkCode,
  linkTelegramWithCode,
  getLeaderboard,
} from './credits';
