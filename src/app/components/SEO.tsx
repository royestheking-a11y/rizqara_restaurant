import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  image = '/images/about-facade.png',
  url = 'https://rizqara.tech',
  type = 'website',
}) => {
  const siteTitle = 'Rizqara Restaurant';
  const fullTitle = title ? `${title} | ${siteTitle}` : `${siteTitle} | Premium Dining in Dhaka`;
  const defaultDesc = 'Experience the finest Asian and Fusion cuisine at Rizqara Restaurant in Dhaka. Exquisite dining, professional catering, and real-time table ordering.';

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDesc} />
      <meta name="keywords" content={keywords || 'Restaurant Dhaka, Fine Dining, Asian Fusion, Rizqara Restaurant, Best Food Dhaka, Catering Dhaka'} />

      {/* Open Graph / Facebook tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDesc} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />

      {/* Twitter tags */}
      <meta name="twitter:creator" content="@rizqaratech" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || defaultDesc} />
      <meta name="twitter:image" content={image} />

      {/* Canonical link */}
      <link rel="canonical" href={url} />
    </Helmet>
  );
};
