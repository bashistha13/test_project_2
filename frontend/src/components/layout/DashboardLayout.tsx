import { useState, useRef, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, User, Search, Plus, Filter, Download, Upload, Loader2, Mail } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useDashboard } from '../../context/DashboardContext';
import { getCategories } from '../../features/products/api/getProducts';
import type { Category } from '../../features/products/types';
import axios from 'axios';

// ✅ FIXED: Updated to match your Swagger Port (5175)
const API_BASE_URL = "http://localhost:5175"; 

export const DashboardLayout = () => {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [categories, setCategories] = useState<Category[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setSearchTerm, setSelectedCategory, setTriggerAddModal } = useDashboard();

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error("Failed to load sidebar categories", err);
      }
    };
    fetchCats();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleAddClick = () => {
    setTriggerAddModal(true); 
  };

  const handleDownloadTemplate = () => {
    window.location.href = `${API_BASE_URL}/api/products/template`;
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post(`${API_BASE_URL}/api/products/import`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      alert("Products imported successfully!");
      window.location.reload(); 
    } catch (error) {
      console.error(error);
      alert("Failed to import. Ensure CSV format matches template.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const isAdmin = user?.role === 'Admin';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="h-16 bg-white border-b border-gray-200 px-4 flex items-center justify-between sticky top-0 z-40 w-full">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="text-xl font-bold text-blue-600 tracking-tight" onClick={() => navigate('/')} style={{cursor: 'pointer'}}>
            SmartBiz
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-blue-100 p-1.5 rounded-full text-blue-600">
              <User size={18} />
            </div>
            <span className="text-sm font-medium text-gray-700">
              {user?.username || 'user'}
            </span>
          </div>
          
          <button onClick={handleLogout} className="flex items-center gap-2 border border-gray-200 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:text-red-600 hover:border-red-200 transition-all">
            <LogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1 relative overflow-hidden">
        {/* Sidebar */}
        <aside 
          className={`
            fixed top-16 left-0 h-[calc(100vh-4rem)] w-80 bg-white border-r border-gray-200 
            z-30 transition-transform duration-300 ease-in-out overflow-y-auto
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          <div className="p-6 space-y-8">
            
            {isAdmin && (
              <div className="space-y-3">
                <button 
                  onClick={handleAddClick}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-xl hover:bg-blue-700 transition-all shadow-md font-medium"
                >
                  <Plus size={20} /> Add New Product
                </button>

                <button 
                  onClick={() => navigate('/email')}
                  className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all font-medium text-sm"
                >
                  <Mail size={18} /> Send Email / Alerts
                </button>

                <button 
                  onClick={handleDownloadTemplate}
                  className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl hover:bg-gray-50 hover:text-blue-600 transition-all font-medium text-sm"
                >
                  <Download size={18} /> Download Template
                </button>
                
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".csv" className="hidden" />
                
                <button 
                  onClick={handleImportClick}
                  disabled={isUploading}
                  className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl hover:bg-gray-50 hover:text-green-600 transition-all font-medium text-sm"
                >
                  {isUploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
                  {isUploading ? "Importing..." : "Bulk Import Data"}
                </button>
              </div>
            )}

            {/* Filters */}
            <div className="space-y-5">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Filters & Search</h3>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input type="text" placeholder="Product name..." className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Category</label>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  
                  <select 
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="All">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat.categoryId} value={cat.categoryName}>
                        {cat.categoryName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main 
          className={`
            flex-1 p-4 md:p-6 overflow-x-auto transition-all duration-300 ease-in-out
            ${isSidebarOpen ? 'ml-80' : 'ml-0'}
          `}
        >
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};