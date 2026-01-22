import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Scanner from './pages/Scanner';
import Contact from './pages/Contact';
import Pricing from './pages/Pricing';
import TransformationLanding from './pages/TransformationLanding';
import TransformationDetail from './pages/TransformationDetail';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import AdminSponsors from './pages/AdminSponsors';
import SponsorLanding from './pages/SponsorLanding';
import Login from './pages/Login';
import WTE from './pages/WTE';
import WTELab from './pages/WTELab';
import EcoCredits from './pages/EcoCredits';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

const AppContent: React.FC = () => {
    const location = useLocation();
    // We might want to hide navbar/footer on some pages if needed
    const hideNavFooter = false;

    return (
        <div className="flex flex-col min-h-screen">
            {!hideNavFooter && <Navbar />}
            <ScrollToTop />
            <main className={`flex-grow ${(!hideNavFooter && location.pathname !== '/') ? 'pt-20' : ''}`}>
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
                </Routes>

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
