import React, { useState } from 'react';
import ManageService from '../components/ManageService';
import BookingMonitoring from '../components/BookingMonitoring';
import ManageDoctorForm from '../components/ManageDoctorForm';
import ManageBlockedTime from '../components/ManageBlockedTime';
import ManageDoctorSchedule from '../components/ManageDoctorSchedule';
import MedicineManager from '../components/MedicineManager';
import ManageCategory from '../components/ManageCategory';
import ManageOrder from '../components/ManageOrder';
import ManageArticle from '../components/ManageArticle';

export default function DashboardAdminPages() {
  const [activePage, setActivePage] = useState('ManageService');

  const menu = [
    { key: 'ManageService', label: 'Manage Service' },
    { key: 'BookingMonitoring', label: 'Booking Monitoring' },
    { key: 'ManageDoctorForm', label: 'Manage Doctor' },
    { key: 'ManageBlockedTime', label: 'Manage Blocked Time' },
    { key: 'ManageDoctorSchedule', label: 'Manage Doctor Schedule' },
    { key: 'ManageMedicine', label: 'Manage Medicine' },
    { key: 'ManageCategory', label: 'Manage Category' },
    { key: 'ManageOrder', label: 'Manage Order' },
    { key: 'ManageArticle', label: 'Manage Article' },








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
          return <ManageBlockedTime/>
          case 'ManageDoctorSchedule':
          return <ManageDoctorSchedule/>
           case 'ManageMedicine':
          return <MedicineManager/>
           case 'ManageCategory':
          return <ManageCategory/>
           case 'ManageOrder':
          return <ManageOrder/>
          case 'ManageArticle':
          return <ManageArticle/>
      default:
        return <ManageService />;
    }
  };

  return (
    <div className="flex min-h-screen bg-blue-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md border-r border-blue-100 p-6 flex flex-col">
        <h2 className="text-2xl font-bold text-blue-700 mb-6">Admin Dashboard</h2>
        <ul className="flex flex-col gap-3">
          {menu.map(item => (
            <li key={item.key}>
              <button
                onClick={() => setActivePage(item.key)}
                className={`w-full text-left px-4 py-2 rounded-lg font-medium hover:bg-blue-100 transition \${activePage===item.key ? 'bg-blue-200 text-blue-900' : 'text-blue-700'}`}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
}