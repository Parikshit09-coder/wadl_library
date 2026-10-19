import { MdLocalLibrary, MdWifi, MdPublic } from 'react-icons/md';
import './OpacLinks.css';

const OPAC_IN_CAMPUS = 'http://10.10.9.231:8018/autolibwebopac/Login.aspx';
const OPAC_OFF_CAMPUS = 'http://103.97.166.170:8018/autolibwebopac/Login.aspx';

export default function OpacLinks() {
  return (
    <div className="opac-banner">
      <div className="opac-info">
        <MdLocalLibrary className="opac-icon" />
        <div>
          <h3>Library Web-OPAC</h3>
          <p>Book search, renew, reservation, recommendations and new arrivals. Login with your ERP Enrollment No.</p>
        </div>
      </div>
      <div className="opac-actions">
        <a href={OPAC_IN_CAMPUS} target="_blank" rel="noopener noreferrer" className="opac-btn primary">
          <MdWifi /> In Campus
        </a>
        <a href={OPAC_OFF_CAMPUS} target="_blank" rel="noopener noreferrer" className="opac-btn secondary">
          <MdPublic /> Out of Campus
        </a>
      </div>
    </div>
  );
}
