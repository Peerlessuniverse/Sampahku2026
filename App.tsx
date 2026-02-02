import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { initializeLocalStorageMigration } from './services/localStorageMigration';

// Pages - Lazy loaded for performance
const Home = lazy(() => import('./pages/Home'));
const Scanner = lazy(() => import('./pages/Scanner'));
const Contact = lazy(() => import('./pages/Contact'));
const Pricing = lazy(() => import('./pages/Pricing'));
const TransformationLanding = lazy(() => import('./pages/TransformationLanding'));
const TransformationDetail = lazy(() => import('./pages/TransformationDetail'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const Terms = lazy(() => import('./pages/Terms'));
const AdminSponsors = lazy(() => import('./pages/AdminSponsors'));
const SponsorLanding = lazy(() => import('./pages/SponsorLanding'));
const Login = lazy(() => import('./pages/Login'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const WTE = lazy(() => import('./pages/WTE'));
const WTELab = lazy(() => import('./pages/WTELab'));
const EcoCredits = lazy(() => import('./pages/EcoCredits'));
const Documentation = lazy(() => import('./pages/Documentation'));
const HallOfFame = lazy(() => import('./pages/HallOfFame'));
const Profile = lazy(() => import('./pages/Profile'));
const Marketplace = lazy(() => import('./pages/Marketplace'));
const SponsorContract = lazy(() => import('./pages/SponsorContract'));
const SponsorPayment = lazy(() => import('./pages/SponsorPayment'));
const MiniApp = lazy(() => import('./pages/MiniApp'));
const SponsorDashboard = lazy(() => import('./pages/SponsorDashboard'));

// Ads Management Pages (Partner = formerly Advertiser)
const PartnerDashboard = lazy(() => import('./pages/PartnerDashboard'));
const PartnerCampaigns = lazy(() => import('./pages/PartnerCampaigns'));
const PartnerReports = lazy(() => import('./pages/PartnerReports'));
const PartnerBilling = lazy(() => import('./pages/PartnerBilling'));

// Backward compatibility - keep old imports as aliases
const AdvertiserDashboard = PartnerDashboard;
const AdvertiserCampaigns = PartnerCampaigns;
const AdvertiserReports = PartnerReports;
const AdvertiserBilling = PartnerBilling;

const AdminReviewQueue = lazy(() => import('./pages/AdminReviewQueue'));
const AdminPartners = lazy(() => import('./pages/AdminPartners'));
const AdminAdvertisers = AdminPartners; // Backward compatibility alias
const AdminPlacements = lazy(() => import('./pages/AdminPlacements'));

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import ScrollReset from './components/ScrollReset';
import { Loader2 } from 'lucide-react';

const PageLoader = () => (
    <div className="min-h-screen bg-[#02020a] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-violet-500 animate-spin" />
        <p className="mt-4 text-violet-400 font-black tracking-[0.3em] uppercase text-xs animate-pulse">
            Inisialisasi Dimensi...
        </p>
    </div>
);

import AdManager from './components/AdManager';

const AppContent: React.FC = () => {
    const location = useLocation();

    // Run localStorage migration on app initialization
    useEffect(() => {
        initializeLocalStorageMigration();
    }, []);

    // We might want to hide navbar/footer on some pages if needed
    const hideNavFooter =
        location.pathname.startsWith('/central-command') ||
        location.pathname.startsWith('/admin') ||
        location.pathname.startsWith('/advertiser') ||
        location.pathname.startsWith('/partner') ||
        location.pathname.startsWith('/mini');

    return (
        <div className="flex flex-col min-h-screen">
            <AdManager />
            <ScrollReset />
            {!hideNavFooter && <Navbar />}
            <ScrollToTop />
            <main className={`flex-grow ${(!hideNavFooter && location.pathname !== '/') && !location.pathname.startsWith('/mini') ? 'pt-20' : ''}`}>
                <Suspense fallback={<PageLoader />}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/mini" element={<MiniApp />} />
                        <Route path="/scanner" element={<Scanner />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/pricing" element={<Pricing />} />
                        <Route path="/wte" element={<WTE />} />
                        <Route path="/wte/lab" element={<WTELab />} />
                        <Route path="/transformasi" element={<TransformationLanding />} />
                        <Route path="/transformasi/:id" element={<TransformationDetail />} />
                        <Route path="/privacy" element={<PrivacyPolicy />} />
                        <Route path="/terms" element={<Terms />} />
                        <Route path="/central-command" element={<Login />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/portals" element={<Login />} />
                        <Route path="/central-command/dashboard" element={<AdminDashboard />} />
                        <Route path="/central-command/sponsors" element={<AdminSponsors />} />
                        <Route path="/app/partner/dashboard" element={<SponsorDashboard />} />

                        {/* Partner Ads System Routes (formerly Advertiser) */}
                        <Route path="/partner/dashboard" element={<PartnerDashboard />} />
                        <Route path="/partner/campaigns" element={<PartnerCampaigns />} />
                        <Route path="/partner/reports" element={<PartnerReports />} />
                        <Route path="/partner/billing" element={<PartnerBilling />} />

                        {/* Backward compatibility redirects for old advertiser routes */}
                        <Route path="/advertiser/dashboard" element={<AdvertiserDashboard />} />
                        <Route path="/advertiser/campaigns" element={<AdvertiserCampaigns />} />
                        <Route path="/advertiser/reports" element={<AdvertiserReports />} />
                        <Route path="/advertiser/billing" element={<AdvertiserBilling />} />

                        <Route path="/admin/review-queue" element={<AdminReviewQueue />} />
                        <Route path="/admin/partners" element={<AdminPartners />} />
                        <Route path="/admin/advertisers" element={<AdminAdvertisers />} />
                        <Route path="/admin/placements" element={<AdminPlacements />} />

                        {/* Legacy routes for backwards compatibility */}
                        <Route path="/admin/portal" element={<AdminSponsors />} />
                        <Route path="/sponsor/info" element={<SponsorLanding />} />
                        <Route path="/credits" element={<EcoCredits />} />
                        <Route path="/docs" element={<Documentation />} />
                        <Route path="/leaderboard" element={<HallOfFame />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/marketplace" element={<Marketplace />} />
                        <Route path="/sponsor/contract" element={<SponsorContract />} />
                        <Route path="/sponsor/payment" element={<SponsorPayment />} />
                    </Routes>
                </Suspense>
            </main>
            {!hideNavFooter && <Footer />}
        </div>
    );
};

const App: React.FC = () => {
    return (
        <Router>
            <AppContent />
        </Router>
    );
};

export default App;
