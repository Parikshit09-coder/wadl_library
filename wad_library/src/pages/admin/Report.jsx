import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiDownload, FiUsers, FiTrendingUp, FiCalendar, FiClock } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { apiFetch, authHeaders } from '../../api';
import './Admin.css';
import './Report.css';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const SHORT = MONTHS.map((m) => m.slice(0, 3));

const pad = (n) => String(n).padStart(2, '0');
const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

function monthRange(year, month) {
  return { from: iso(new Date(year, month, 1)), to: iso(new Date(year, month + 1, 0)) };
}

function formatLabel(label, groupBy) {
  if (groupBy === 'year') return label;
  if (groupBy === 'month') {
    const [y, m] = label.split('-');
    return `${SHORT[Number(m) - 1]} ${y}`;
  }
  const [y, m, d] = label.split('-');
  return `${Number(d)} ${SHORT[Number(m) - 1]} ${y}`;
}

function BarChart({ data, labelFn, color = 'var(--orange)' }) {
  const W = 800;
  const H = 260;
  const m = { top: 16, right: 12, bottom: 40, left: 40 };
  const max = Math.max(1, ...data.map((d) => d.count));
  const niceMax = Math.ceil(max / 4) * 4 || 4;
  const innerW = W - m.left - m.right;
  const innerH = H - m.top - m.bottom;
  const step = innerW / Math.max(1, data.length);
  const barW = Math.min(40, step * 0.7);
  const every = Math.ceil(data.length / 12);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="report-chart" role="img">
      {[0, 1, 2, 3, 4].map((i) => {
        const y = m.top + innerH - (innerH * i) / 4;
        return (
          <g key={i}>
            <line x1={m.left} x2={W - m.right} y1={y} y2={y} stroke="#e6e1d9" />
            <text x={m.left - 6} y={y + 4} textAnchor="end" className="report-axis">{Math.round((niceMax * i) / 4)}</text>
          </g>
        );
      })}
      {data.map((d, i) => {
        const h = (d.count / niceMax) * innerH;
        const x = m.left + step * i + (step - barW) / 2;
        return (
          <g key={d.key ?? i}>
            <rect x={x} y={m.top + innerH - h} width={barW} height={h} rx="3" fill={color}>
              <title>{`${labelFn(d)}: ${d.count}`}</title>
            </rect>
            {i % every === 0 && (
              <text x={x + barW / 2} y={H - m.bottom + 16} textAnchor="middle" className="report-axis">{labelFn(d, true)}</text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

export default function Report() {
  const { token } = useAuth();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [mode, setMode] = useState('month'); // month | year | custom
  const [custom, setCustom] = useState(monthRange(now.getFullYear(), now.getMonth()));
  const [groupBy, setGroupBy] = useState('day');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const range = useMemo(() => {
    if (mode === 'month') return monthRange(year, month);
    if (mode === 'year') return { from: `${year}-01-01`, to: `${year}-12-31` };
    return custom;
  }, [mode, year, month, custom]);

  const effectiveGroup = mode === 'year' && groupBy === 'day' ? 'month' : groupBy;

  const load = useCallback(() => {
    setLoading(true);
    setError('');
    const qs = new URLSearchParams({ ...range, groupBy: effectiveGroup });
    apiFetch(`/stats/report?${qs}`, { headers: authHeaders(token) })
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [range, effectiveGroup, token]);

  useEffect(() => {
    if (range.from && range.to && range.from <= range.to) load();
  }, [load, range]);

  const years = Array.from({ length: 6 }, (_, i) => now.getFullYear() - i);
  const series = data?.series ?? [];
  const peak = series.reduce((best, s) => (s.count > (best?.count ?? 0) ? s : best), null);
  const avg = series.length ? (data.total / series.length).toFixed(1) : '0';
  const peakHour = data?.hours?.reduce((best, h) => (h.count > best.count ? h : best), { hour: 0, count: 0 });
  const periodText = `${new Date(range.from).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} – ${new Date(range.to).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`;
  const unit = { day: 'Daily', month: 'Monthly', year: 'Yearly' }[effectiveGroup];

  return (
    <div className="admin-page report-page">
      <div className="admin-header no-print">
        <div>
          <Link to="/admin" className="back-link">← Dashboard</Link>
          <h1>Visit Report</h1>
          <p>How many people visited the library website</p>
        </div>
        <button className="admin-btn primary" onClick={() => window.print()} disabled={!data}>
          <FiDownload /> Export PDF
        </button>
      </div>

      <div className="admin-section report-filters no-print">
        <div className="filter-group">
          <label>Period</label>
          <div className="segmented">
            {[['month', 'Month'], ['year', 'Year'], ['custom', 'Custom range']].map(([v, l]) => (
              <button key={v} className={mode === v ? 'active' : ''} onClick={() => setMode(v)}>{l}</button>
            ))}
          </div>
        </div>
        {mode !== 'custom' && (
          <div className="filter-group">
            <label>{mode === 'month' ? 'Month & year' : 'Year'}</label>
            <div className="filter-row">
              {mode === 'month' && (
                <select value={month} onChange={(e) => setMonth(Number(e.target.value))}>
                  {MONTHS.map((m, i) => <option key={m} value={i}>{m}</option>)}
                </select>
              )}
              <select value={year} onChange={(e) => setYear(Number(e.target.value))}>
                {years.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>
        )}
        {mode === 'custom' && (
          <div className="filter-group">
            <label>From – To</label>
            <div className="filter-row">
              <input type="date" value={custom.from} max={custom.to} onChange={(e) => setCustom({ ...custom, from: e.target.value })} />
              <input type="date" value={custom.to} min={custom.from} onChange={(e) => setCustom({ ...custom, to: e.target.value })} />
            </div>
          </div>
        )}
        <div className="filter-group">
          <label>Group by</label>
          <div className="segmented">
            {[['day', 'Day'], ['month', 'Month'], ['year', 'Year']].map(([v, l]) => (
              <button key={v} className={effectiveGroup === v ? 'active' : ''} onClick={() => setGroupBy(v)}>{l}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="report-sheet">
        <div className="report-letterhead">
          <img src="/pict-emblem.png" alt="PICT logo" />
          <div>
            <h2>PICT Digital Library</h2>
            <p>Website Visit Report</p>
          </div>
          <div className="report-meta">
            <strong>{periodText}</strong>
            <span>Generated {new Date().toLocaleString('en-IN')}</span>
          </div>
        </div>

        {error ? (
          <div className="empty-state"><p>{error}</p></div>
        ) : loading && !data ? (
          <p>Loading report...</p>
        ) : data && (
          <>
            <div className="report-kpis">
              <div className="report-kpi"><FiUsers /><div><b>{data.total.toLocaleString('en-IN')}</b><span>Visits in period</span></div></div>
              <div className="report-kpi"><FiTrendingUp /><div><b>{avg}</b><span>Avg per {effectiveGroup}</span></div></div>
              <div className="report-kpi"><FiCalendar /><div><b>{peak ? peak.count : 0}</b><span>Peak {peak ? `(${formatLabel(peak.label, effectiveGroup)})` : ''}</span></div></div>
              <div className="report-kpi"><FiClock /><div><b>{peakHour?.count ? `${pad(peakHour.hour)}:00` : '–'}</b><span>Busiest hour (IST)</span></div></div>
            </div>

            <h3>{unit} visits</h3>
            {series.length ? (
              <BarChart data={series.map((s) => ({ ...s, key: s.label }))} labelFn={(d, short) => (short && effectiveGroup === 'day' ? d.label.slice(8) : formatLabel(d.label, effectiveGroup))} />
            ) : (
              <div className="empty-state"><p>No visits recorded in this period.</p></div>
            )}

            <h3>Visits by hour of day</h3>
            <BarChart data={data.hours.map((h) => ({ ...h, key: h.hour }))} labelFn={(d) => `${pad(d.hour)}:00`} color="var(--navy)" />

            {series.length > 0 && (
              <>
                <h3>Breakdown</h3>
                <table className="admin-table report-table">
                  <thead><tr><th>Period</th><th>Visits</th><th>Share</th></tr></thead>
                  <tbody>
                    {series.map((s) => (
                      <tr key={s.label}>
                        <td>{formatLabel(s.label, effectiveGroup)}</td>
                        <td>{s.count.toLocaleString('en-IN')}</td>
                        <td>{((s.count / data.total) * 100).toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}

            <p className="report-note">
              Lifetime total shown on the home page: {data.lifetimeTotal.toLocaleString('en-IN')}.
              Date-wise tracking {data.trackingSince ? `started on ${new Date(data.trackingSince).toLocaleDateString('en-IN')}` : 'has not recorded any visits yet'}; earlier visits are only in the lifetime total.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
