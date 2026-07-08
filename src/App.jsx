import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import TransactionHistory from './pages/TransactionHistory'; // Import Halaman Baru
import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        
        <Route 
          path="/dashboard" 
          element={
            <Layout>
              <Dashboard />
            </Layout>
          } 
        />

        <Route 
          path="/users" 
          element={
            <Layout>
              <UserManagement />
            </Layout>
          } 
        />

        {/* Route Baru untuk Transaksi */}
        <Route 
          path="/transactions" 
          element={
            <Layout>
              <TransactionHistory />
            </Layout>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;