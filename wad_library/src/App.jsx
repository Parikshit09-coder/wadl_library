import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Resources from './pages/Resources';
import Search from './pages/Search';
import Login from './pages/Login';
import Dashboard from './pages/admin/Dashboard';
import ResourceManager from './pages/admin/ResourceManager';
import AdminManager from './pages/admin/AdminManager';

function AppLayout({ children, hideNav = false }) {
  return (
    <>
      {!hideNav && <Navbar />}
      <div className="page-wrapper">
        {children}
      </div>
      {!hideNav && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<AppLayout><Home /></AppLayout>} />
          <Route path="/resources" element={<AppLayout><Resources /></AppLayout>} />
          <Route path="/search" element={<AppLayout><Search /></AppLayout>} />
          <Route path="/login" element={<AppLayout hideNav><Login /></AppLayout>} />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <AppLayout>
              <ProtectedRoute adminOnly>
                <Dashboard />
              </ProtectedRoute>
            </AppLayout>
          } />
          <Route path="/admin/resources" element={
            <AppLayout>
              <ProtectedRoute adminOnly>
                <ResourceManager />
              </ProtectedRoute>
            </AppLayout>
          } />
          <Route path="/admin/admins" element={
            <AppLayout>
              <ProtectedRoute adminOnly>
                <AdminManager />
              </ProtectedRoute>
            </AppLayout>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
