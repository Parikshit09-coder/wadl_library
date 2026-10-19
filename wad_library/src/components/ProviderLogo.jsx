import {
  SiIeee,
  SiGooglescholar,
  SiArxiv,
  SiAcm,
  SiScopus,
  SiPubmed,
  SiResearchgate,
  SiSemanticscholar,
  SiElsevier,
} from 'react-icons/si';

// Official brand marks bundled with the app (no external requests).
const BRAND_ICONS = {
  'IEEE Xplore': { Icon: SiIeee, color: '#00629B' },
  'Google Scholar': { Icon: SiGooglescholar, color: '#4285F4' },
  arXiv: { Icon: SiArxiv, color: '#B31B1B' },
  'ACM Digital Library': { Icon: SiAcm, color: '#0085CA' },
  Scopus: { Icon: SiScopus, color: '#E9711C' },
  PubMed: { Icon: SiPubmed, color: '#20558A' },
  ResearchGate: { Icon: SiResearchgate, color: '#00CCBB' },
  'Semantic Scholar': { Icon: SiSemanticscholar, color: '#1857B6' },
  ScienceDirect: { Icon: SiElsevier, color: '#FF6C00' },
};

// Official site logos saved in public/logos for providers without a brand glyph.
const LOGO_FILES = {
  SpringerLink: '/logos/springerlink.png',
  JSTOR: '/logos/jstor.png',
  DOAJ: '/logos/doaj.png',
  CORE: '/logos/core.png',
};

export default function ProviderLogo({ provider, className = '', size = 32 }) {
  const name = provider?.name || '';

  const brand = BRAND_ICONS[name];
  if (brand) {
    const { Icon, color } = brand;
    return <Icon className={className} size={size} color={color} aria-label={`${name} logo`} />;
  }

  const file = LOGO_FILES[name];
  if (file) {
    return (
      <img
        src={file}
        alt={`${name} logo`}
        className={className}
        width={size}
        height={size}
        loading="lazy"
      />
    );
  }

  // No logo available: monogram badge in the provider's colour.
  return (
    <span
      className={className}
      aria-label={`${name} logo`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        borderRadius: Math.max(6, size / 5),
        background: provider?.color || '#1B2A4A',
        color: '#fff',
        fontWeight: 700,
        fontSize: Math.max(8, size * 0.3),
        letterSpacing: '0.02em',
        boxSizing: 'border-box',
        padding: 0,
      }}
    >
      {(provider?.shortName || name).slice(0, 4).toUpperCase()}
    </span>
  );
}
