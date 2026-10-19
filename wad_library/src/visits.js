import { apiFetch } from './api';

let visitPromise;

// Counts one visit per browser session and resolves to the total visit count.
export function trackVisit() {
  if (!visitPromise) {
    let counted = false;
    try {
      counted = sessionStorage.getItem('visit_counted') === '1';
    } catch {
      // sessionStorage unavailable; count as a new visit
    }

    visitPromise = (counted ? apiFetch('/stats') : apiFetch('/stats/visit', { method: 'POST' }))
      .then((data) => {
        try {
          sessionStorage.setItem('visit_counted', '1');
        } catch {
          // ignore
        }
        return data.visits;
      })
      .catch(() => null);
  }
  return visitPromise;
}
