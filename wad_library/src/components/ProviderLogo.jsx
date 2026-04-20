import { useMemo, useState } from 'react';
import { FiGlobe } from 'react-icons/fi';

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
    return <FiGlobe className={className} size={size} aria-hidden="true" />;
  }

  return (
    <img
      src={logoUrl}
      alt={`${provider?.name || 'Provider'} logo`}
      className={className}
      width={size}
      height={size}
      loading="lazy"
      onError={() => setHasError(true)}
      referrerPolicy="no-referrer"
    />
  );
}