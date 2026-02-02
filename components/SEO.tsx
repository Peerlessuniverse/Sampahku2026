import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title: string;
    description?: string;
    image?: string;
    type?: string;
}

const SEO: React.FC<SEOProps> = ({
    title,
    description = "SampahKu 2026 - Sistem Pengelolaan Sampah Masuk Akal. Ubah limbah menjadi energi dan harmoni.",
    image = "/images/og-default.png",
    type = "website"
}) => {
    const siteTitle = "SampahKu 2026";
    const fullTitle = title === siteTitle ? title : `${title} | ${siteTitle}`;

    // Ensure image is absolute URL if possible, but relative is okay strictly speaking for some parsers (better absolute)
    // Assuming relative for now or handled by base tag

    return (
        <Helmet>
            {/* Standard Metadata */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />
        </Helmet>
    );
};

export default SEO;
