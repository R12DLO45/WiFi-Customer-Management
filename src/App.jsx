import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import Layout from './components/Layout'; // Import Layout

function App() {
  return (
    <Router>
      <Routes>
        {/* Route Login (Tanpa Layout/Sidebar) */}
        <Route path="/" element={<Login />} />
        
        {/* Route Dashboard (Pakai Layout) */}
        <Route 
          path="/dashboard" 
          element={
            <Layout>
              <Dashboard />
            </Layout>
          } 
        />

        {/* Route User Management (Pakai Layout) */}
        <Route 
          path="/users" 
          element={
            <Layout>
              <UserManagement />
            </Layout>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;