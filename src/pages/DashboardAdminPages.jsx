import React, { useState, useEffect } from 'react';
import ManageService from '../components/ManageService';
import BookingMonitoring from '../components/BookingMonitoring';
import ManageDoctorForm from '../components/ManageDoctorForm';
import ManageBlockedTime from '../components/ManageBlockedTime';
import ManageDoctorSchedule from '../components/ManageDoctorSchedule';
import MedicineManager from '../components/MedicineManager';
import ManageCategory from '../components/ManageCategory';
import ManageOrder from '../components/ManageOrder';
import ManageArticle from '../components/ManageArticle';
import { useNavigate } from 'react-router-dom';

export default function DashboardAdminPages() {
  const [activePage, setActivePage] = useState('ManageService');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigation = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigation("/", { replace: true });
    }
  }, [token, navigation]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigation('/');
  };

  const menu = [
    { key: 'ManageService', label: 'Manage Service', icon: '🏥' },
    { key: 'BookingMonitoring', label: 'Booking Monitoring', icon: '📊' },
    { key: 'ManageDoctorForm', label: 'Manage Doctor', icon: '👨‍⚕️' },
    { key: 'ManageMedicine', label: 'Manage Medicine', icon: '💊' },
    { key: 'ManageCategory', label: 'Manage Category', icon: '📂' },
    { key: 'ManageOrder', label: 'Manage Order', icon: '🛒' },
    { key: 'ManageArticle', label: 'Manage Article', icon: '📝' },
  ];

  const renderContent = () => {
    switch(activePage){
      case 'ManageService':
        return <ManageService />;
      case 'BookingMonitoring':
        return <BookingMonitoring />;
      case 'ManageDoctorForm':
        return <ManageDoctorForm />;
      case 'ManageBlockedTime':
        return <ManageBlockedTime/>;
      case 'ManageDoctorSchedule':
        return <ManageDoctorSchedule/>;
      case 'ManageMedicine':
        return <MedicineManager/>;
      case 'ManageCategory':
        return <ManageCategory/>;
      case 'ManageOrder':
        return <ManageOrder/>;
      case 'ManageArticle':
        return <ManageArticle/>;
      default:
        return <ManageService />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Add custom CSS for scrollbar */}
      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-custom::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-custom::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-custom::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }
        .scrollbar-custom::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white shadow-md z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center mr-3">
            <span className="text-2xl">🏥</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900">KlinikCare Admin</h1>
        </div>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center"
        >
          <span className="text-2xl">{isSidebarOpen ? '✕' : '☰'}</span>
        </button>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Desktop: Icon Only (80px), Mobile: Full Slide */}
      <div className={`
        fixed lg:sticky top-0 h-screen bg-white shadow-lg z-50
        transition-all duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
        w-72 lg:w-20
        ${isSidebarOpen ? 'left-0' : ''}
      `}>
        <div className="h-full flex flex-col p-4">
          {/* Logo - Desktop (Icon Only) */}
          <div className="hidden lg:flex items-center justify-center mb-8 mt-4">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center">
              <span className="text-3xl">🏥</span>
            </div>
          </div>

          {/* Logo - Mobile (Full) */}
          <div className="lg:hidden flex items-center mb-8">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center mr-3">
              <span className="text-3xl">🏥</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">KlinikCare</h2>
              <p className="text-sm text-gray-500">Admin Dashboard</p>
            </div>
          </div>

          {/* Menu */}
          <nav className="flex-1 overflow-y-auto scrollbar-custom">
            <ul className="flex flex-col gap-2">
              {menu.map(item => (
                <li key={item.key}>
                  <button
                    onClick={() => {
                      setActivePage(item.key);
                      setIsSidebarOpen(false);
                    }}
                    className={`
                      group relative w-full flex items-center justify-center lg:justify-center px-4 py-3 rounded-xl
                      font-medium transition-all duration-200
                      ${activePage === item.key 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                        : 'text-gray-700 hover:bg-blue-50'
                      }
                    `}
                  >
                    {/* Icon - Always visible */}
                    <span className="text-2xl flex-shrink-0">{item.icon}</span>
                    
                    {/* Text - Mobile only */}
                    <span className="lg:hidden ml-3 whitespace-nowrap">
                      {item.label}
                    </span>

                    {/* Tooltip - Desktop on hover (Floating Card Style) */}
                    <div className="
                      hidden lg:flex
                      absolute left-full ml-3 px-4 py-2.5 
                      bg-white text-gray-900 text-sm font-semibold rounded-xl shadow-xl border border-gray-200
                      opacity-0 invisible group-hover:opacity-100 group-hover:visible 
                      pointer-events-none
                      transition-all duration-200 whitespace-nowrap z-[60]
                      items-center gap-2
                    ">
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                      {/* Arrow */}
                      <div className="absolute right-full top-1/2 -translate-y-1/2 -mr-2 border-8 border-transparent border-r-white" />
                      <div className="absolute right-full top-1/2 -translate-y-1/2 -mr-2.5 border-8 border-transparent border-r-gray-200" />
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer - Desktop: Icon Only, Mobile: Full Info */}
          <div className="mt-auto pt-4 border-t border-gray-200">
            <div className="flex items-center justify-center lg:justify-center px-4 py-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xl">👤</span>
              </div>
              
              {/* User Info - Mobile Only */}
              <div className="lg:hidden ml-3">
                <p className="font-semibold text-gray-900 text-sm">Admin User</p>
                <p className="text-xs text-gray-500">admin@klinik.com</p>
                <button 
                  className="text-xs text-red-500 hover:text-red-700 font-medium mt-1" 
                  onClick={handleLogout}
                >
                  Keluar
                </button>
              </div>
            </div>

            {/* Logout Button - Desktop (Icon Only with Tooltip) */}
            <button 
              onClick={handleLogout}
              className="hidden lg:flex w-full items-center justify-center p-3 rounded-xl text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all group relative mt-2"
            >
              <span className="text-2xl">🚪</span>
              
              {/* Tooltip for Logout (Floating Card Style) */}
              <div className="
                absolute left-full ml-3 px-4 py-2.5 
                bg-white text-gray-900 text-sm font-semibold rounded-xl shadow-xl border border-gray-200
                opacity-0 invisible group-hover:opacity-100 group-hover:visible
                pointer-events-none
                transition-all duration-200 whitespace-nowrap z-[60]
                flex items-center gap-2
              ">
                <span>🚪</span>
                <span>Keluar</span>
                {/* Arrow */}
                <div className="absolute right-full top-1/2 -translate-y-1/2 -mr-2 border-8 border-transparent border-r-white" />
                <div className="absolute right-full top-1/2 -translate-y-1/2 -mr-2.5 border-8 border-transparent border-r-gray-200" />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Spacer for mobile header */}
        <div className="lg:hidden h-20" />
        
        {/* Content Area - Now has MORE space! */}
        <div className="flex-1 p-4 lg:p-6 overflow-y-auto">
          <div className="max-w-full mx-auto">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}