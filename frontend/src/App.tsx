import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './features/auth/routes/Login';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { ProductTable } from './features/products/components/ProductTable';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DashboardProvider } from './context/DashboardContext'; // Import this

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuth();
  return token ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <DashboardProvider> {/* WRAP HERE */}
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
              <Route index element={<ProductTable />} />
            </Route>
          </Routes>
        </DashboardProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;