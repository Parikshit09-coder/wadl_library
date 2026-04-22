import { useMemo, useState } from 'react';
import { MdLanguage } from 'react-icons/md';

function getHostFromUrl(url) {
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

export default function ProviderLogo({ provider, className = '', size = 32 }) {
  const [hasError, setHasError] = useState(false);

  const logoUrl = useMemo(() => {
    const host = getHostFromUrl(provider?.baseUrl || '');
    return host ? `https://logo.clearbit.com/${host}` : '';
  }, [provider?.baseUrl]);

  if (!logoUrl || hasError) {
    return <MdLanguage className={`text-academic-400 ${className}`} size={size} aria-hidden="true" />;
  }

  return (
    <img
      src={logoUrl}
      alt={`${provider?.name || 'Provider'} logo`}
      className={`${className} object-contain rounded`}
      style={{ width: size, height: size }}
      loading="lazy"
      onError={() => setHasError(true)}
      referrerPolicy="no-referrer"
    />
  );
}