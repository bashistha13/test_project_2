import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './features/auth/routes/Login';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { ProductTable } from './features/products/components/ProductTable';
import { TestEmail } from './features/admin/components/TestEmail'; // Import this
import { AuthProvider, useAuth } from './context/AuthContext';
import { DashboardProvider } from './context/DashboardContext';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuth();
  return token ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <DashboardProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            {/* Dashboard Layout Routes */}
            <Route path="/" element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
              {/* Default Page: Inventory Table */}
              <Route index element={<ProductTable />} />
              
              {/* Email Page Route */}
              <Route path="email" element={<TestEmail />} />
            </Route>

          </Routes>
        </DashboardProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;