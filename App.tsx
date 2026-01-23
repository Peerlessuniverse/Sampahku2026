import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

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
const WTE = lazy(() => import('./pages/WTE'));
const WTELab = lazy(() => import('./pages/WTELab'));
const EcoCredits = lazy(() => import('./pages/EcoCredits'));
const Documentation = lazy(() => import('./pages/Documentation'));

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

const AppContent: React.FC = () => {
    const location = useLocation();
    // We might want to hide navbar/footer on some pages if needed
    const hideNavFooter = false;

    return (
        <div className="flex flex-col min-h-screen">
            <ScrollReset />
            {!hideNavFooter && <Navbar />}
            <ScrollToTop />
            <main className={`flex-grow ${(!hideNavFooter && location.pathname !== '/') ? 'pt-20' : ''}`}>
                <Suspense fallback={<PageLoader />}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/scanner" element={<Scanner />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/pricing" element={<Pricing />} />
                        <Route path="/wte" element={<WTE />} />
                        <Route path="/wte/lab" element={<WTELab />} />
                        <Route path="/transformasi" element={<TransformationLanding />} />
                        <Route path="/transformasi/:id" element={<TransformationDetail />} />
                        <Route path="/privacy" element={<PrivacyPolicy />} />
                        <Route path="/terms" element={<Terms />} />
                        <Route path="/admin" element={<Login />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/portals" element={<Login />} />
                        <Route path="/admin/portal" element={<AdminSponsors />} />
                        <Route path="/sponsor/info" element={<SponsorLanding />} />
                        <Route path="/credits" element={<EcoCredits />} />
                        <Route path="/docs" element={<Documentation />} />
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

