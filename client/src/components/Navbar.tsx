import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div className="flex items-center">
            <span className="text-xl font-bold text-blue-600">SmartBiz</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Hello, <b>{user?.username}</b> ({user?.role})
            </span>
            <button
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-700 hover:bg-gray-200"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};