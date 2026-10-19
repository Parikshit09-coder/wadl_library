import { MdLocalLibrary, MdWifi, MdPublic } from 'react-icons/md';
import './OpacLinks.css';

const OPAC_IN_CAMPUS = 'http://10.10.9.231:8018/autolibwebopac/Login.aspx';
const OPAC_OFF_CAMPUS = 'http://103.97.166.170:8018/autolibwebopac/Login.aspx';

export default function OpacLinks({ compact = false }) {
  if (compact) {
    return (
      <div className="opac-compact">
        <div className="opac-compact-title">
          <MdLocalLibrary /> Library Web-OPAC
        </div>
        <p className="opac-compact-desc">
          Online library catalogue: search, renew and reserve books, and see new arrivals.
        </p>
        <div className="opac-compact-actions">
          <div className="opac-option">
            <a href={OPAC_IN_CAMPUS} target="_blank" rel="noopener noreferrer" className="opac-btn primary small">
              <MdWifi /> In Campus
            </a>
            <span className="opac-hint">Connected to the college network</span>
          </div>
          <div className="opac-option">
            <a href={OPAC_OFF_CAMPUS} target="_blank" rel="noopener noreferrer" className="opac-btn secondary small">
              <MdPublic /> Out of Campus
            </a>
            <span className="opac-hint">From home or any other network</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="opac-banner">
      <div className="opac-info">
        <MdLocalLibrary className="opac-icon" />
        <div>
          <h3>Library Web-OPAC</h3>
          <p>Online Public Access Catalogue: search the library catalogue, renew and reserve books, recommend titles and see new arrivals. Login with your ERP Enrollment No.</p>
        </div>
      </div>
      <div className="opac-actions">
        <div className="opac-option">
          <a href={OPAC_IN_CAMPUS} target="_blank" rel="noopener noreferrer" className="opac-btn primary">
            <MdWifi /> In Campus
          </a>
          <span className="opac-hint">Use when connected to the college network</span>
        </div>
        <div className="opac-option">
          <a href={OPAC_OFF_CAMPUS} target="_blank" rel="noopener noreferrer" className="opac-btn secondary">
            <MdPublic /> Out of Campus
          </a>
          <span className="opac-hint">Use from home or any other network</span>
        </div>
      </div>
    </div>
  );
}
