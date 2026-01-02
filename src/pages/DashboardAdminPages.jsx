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
import ManagePrescription from '../components/ManagePrescription';
import ManageGeneral from '../components/ManageGeneral';
import { Menu, X, ChevronDown, ChevronRight, LogOut, Package, FileText, Pill, ClipboardList, Calendar, Settings, Folder, ShoppingCart, FileEdit } from 'lucide-react';

export default function DashboardAdminPages() {
  const [activePage, setActivePage] = useState('ManageService');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({});
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

  const toggleSubmenu = (key) => {
    setExpandedMenus(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

 

  const menu = [
    { 
      key: 'ManageService', 
      label: 'Layanan', 
      icon: Package,
      single: true
    },
    { 
      key: 'Pesanan',
      label: 'Pesanan',
      icon: ShoppingCart,
      submenu: [
        { key: 'BookingMonitoring', label: 'Booking', icon: Calendar },
        { key: 'ManageOrder', label: 'Order', icon: ClipboardList }
      ]
    },
    { 
      key: 'ManageDoctorForm', 
      label: 'Dokter', 
      icon: FileText,
      single: true
    },
    { 
      key: 'Obat',
      label: 'Obat',
      icon: Pill,
      submenu: [
        { key: 'ManageMedicine', label: 'Medicine', icon: Pill },
        { key: 'ManagePrescription', label: 'Resep', icon: ClipboardList }
      ]
    },
    { 
      key: 'ManageCategory', 
      label: 'Kategori', 
      icon: Folder,
      single: true
    },
    { 
      key: 'ManageArticle', 
      label: 'Artikel', 
      icon: FileEdit,
      single: true
    },
    { 
      key: 'ManageGeneral', 
      label: 'Umum', 
      icon: Settings,
      single: true
    }
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
      case 'ManagePrescription':
        return <ManagePrescription/>;
      case 'ManageGeneral':
        return <ManageGeneral/>;
      default:
        return <ManageService />;
    }
  };

  const handleMenuClick = (item) => {
    if (item.single) {
      setActivePage(item.key);
      setIsMobileSidebarOpen(false);
    } else {
      toggleSubmenu(item.key);
    }
  };

  const handleSubmenuClick = (key) => {
    setActivePage(key);
    setIsMobileSidebarOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
            <Package className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">KlinikCare</h1>
            <p className="text-xs text-gray-500">Admin Dashboard</p>
          </div>
        </div>
        <button
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors"
        >
          {isMobileSidebarOpen ? <X className="w-5 h-5 text-gray-700" /> : <Menu className="w-5 h-5 text-gray-700" />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {isMobileSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/30 z-40 backdrop-blur-sm"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 h-screen bg-white border-r border-gray-200 z-50
        transition-all duration-300 ease-in-out
        ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
        ${isSidebarOpen ? 'lg:w-64' : 'lg:w-20'}
        w-64
      `}>
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Package className="w-6 h-6 text-white" />
              </div>
              {(isSidebarOpen || isMobileSidebarOpen) && (
                <div className="lg:block hidden">
                  <h2 className="text-lg font-bold text-gray-900">KlinikCare</h2>
                  <p className="text-xs text-gray-500">Admin Dashboard</p>
                </div>
              )}
              {/* Desktop Toggle */}
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="ml-auto hidden lg:flex w-8 h-8 items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Menu */}
          <nav className="flex-1 overflow-y-auto p-3">
            <ul className="space-y-1">
              {menu.map(item => {
                const Icon = item.icon;
                const isExpanded = expandedMenus[item.key];
                const isActive = item.single ? activePage === item.key : item.submenu?.some(sub => sub.key === activePage);

                return (
                  <li key={item.key}>
                    <button
                      onClick={() => handleMenuClick(item)}
                      className={`
                        w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                        font-medium transition-all duration-200
                        ${isActive
                          ? 'bg-blue-600 text-white shadow-sm' 
                          : 'text-gray-700 hover:bg-gray-100'
                        }
                        ${!isSidebarOpen && !isMobileSidebarOpen ? 'justify-center' : ''}
                      `}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      {(isSidebarOpen || isMobileSidebarOpen) && (
                        <>
                          <span className="flex-1 text-left text-sm">{item.label}</span>
                          {!item.single && (
                            isExpanded ? 
                            <ChevronDown className="w-4 h-4 flex-shrink-0" /> : 
                            <ChevronRight className="w-4 h-4 flex-shrink-0" />
                          )}
                        </>
                      )}
                    </button>

                    {/* Submenu */}
                    {!item.single && isExpanded && (isSidebarOpen || isMobileSidebarOpen) && (
                      <ul className="mt-1 ml-4 space-y-1">
                        {item.submenu.map(subItem => {
                          const SubIcon = subItem.icon;
                          return (
                            <li key={subItem.key}>
                              <button
                                onClick={() => handleSubmenuClick(subItem.key)}
                                className={`
                                  w-full flex items-center gap-3 px-3 py-2 rounded-lg
                                  text-sm transition-all duration-200
                                  ${activePage === subItem.key
                                    ? 'bg-blue-50 text-blue-600 font-medium'
                                    : 'text-gray-600 hover:bg-gray-50'
                                  }
                                `}
                              >
                                <SubIcon className="w-4 h-4 flex-shrink-0" />
                                <span>{subItem.label}</span>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-blue-600">AD</span>
              </div>
              {(isSidebarOpen || isMobileSidebarOpen) && (
                <div className="lg:block hidden">
                  <p className="text-sm font-semibold text-gray-900">Admin User</p>
                  <p className="text-xs text-gray-500">admin@klinik.com</p>
                </div>
              )}
            </div>
            <button
              onClick={handleLogout}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                text-gray-700 hover:bg-red-50 hover:text-red-600
                font-medium transition-all duration-200
                ${!isSidebarOpen && !isMobileSidebarOpen ? 'justify-center' : ''}
              `}
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {(isSidebarOpen || isMobileSidebarOpen) && (
                <span className="text-sm">Keluar</span>
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen">
        <div className="lg:hidden h-16" />
        <div className="flex-1 p-4 lg:p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
}