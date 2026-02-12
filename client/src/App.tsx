import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProductTable } from './features/products/components/ProductTable';
import { Login } from './features/auth/routes/Login';
import { Register } from './features/auth/routes/Register';
import { Navbar } from './components/Navbar';

// Wrapper for Protected Routes
const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="mx-auto max-w-5xl">
          <Outlet /> {/* Renders the child route (ProductTable) */}
        </div>
      </div>
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Private Routes (Protected) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={
              <>
                 <h1 className="mb-6 text-2xl font-bold text-gray-900">Product Management</h1>
                 <ProductTable />
              </>
            } />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;