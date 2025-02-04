import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FiSettings } from 'react-icons/fi';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';

import { Navbar, Footer, Sidebar, ThemeSettings } from './Components';
import { Ecommerce } from './Templates';
import './App.css';

import { useStateContext } from './Contexts/ContextProvider';
import Dashboard from './Pages/Dashboard/Dashboard';
import Orders from './Pages/Orders/Orders';
import Reviews from './Pages/Reviews/Reviews';
import CreateEvent from './Pages/Events/CreateEvent/CreateEvent';
import EditEvent from './Pages/Events/EditEvent/EditEvent';
import EventsDashboard from './Pages/Events/EventsDashboard/EventsDashboard';
import AllUsers from './Pages/Users/AllUsers/AllUsers';
import Customers from './Pages/Users/Customers/Customers';
import Workers from './Pages/Users/Workers/Workers';
import EventsTable from './Pages/Events/EventsTable/EventsTable';


const App = () => {
  const { setCurrentColor, setCurrentMode, currentMode, activeMenu, currentColor, themeSettings, setThemeSettings } = useStateContext();
  const [routes] = useState([
    { path: '/dashboard', element: <Dashboard /> },
    { path: '/orders', element: <Orders /> },
    { path: '/reviews', element: <Reviews /> },
    { path: '/create-events', element: <CreateEvent /> },
    { path: '/edit-events', element: <EditEvent /> },
    { path: '/events-dashboard', element: <EventsDashboard /> },
    { path: '/all-users', element: <AllUsers /> },
    { path: '/customers', element: <Customers /> },
    { path: '/workers', element: <Workers /> },
    { path: '/events-table', element: <EventsTable/>},
  ]);

  useEffect(() => {
    const currentThemeColor = localStorage.getItem('colorMode');
    const currentThemeMode = localStorage.getItem('themeMode');
    if (currentThemeColor && currentThemeMode) {
      setCurrentColor(currentThemeColor);
      setCurrentMode(currentThemeMode);
    }
  }, []);

  return (
    <div className={currentMode === 'Dark' ? 'dark' : ''}>
      <BrowserRouter>
        <div className="flex relative dark:bg-main-dark-bg">
          <div className="fixed right-4 bottom-4" style={{ zIndex: '1000' }}>
            <TooltipComponent content="Settings" position="Top">
              <button
                type="button"
                onClick={() => setThemeSettings(true)}
                style={{ background: currentColor, borderRadius: '50%' }}
                className="text-3xl text-white p-3 hover:drop-shadow-xl hover:bg-light-gray"
              >
                <FiSettings />
              </button>
            </TooltipComponent>
          </div>
          {activeMenu ? (
            <div className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white">
              <Sidebar />
            </div>
          ) : (
            <div className="w-0 dark:bg-secondary-dark-bg">
              <Sidebar />
            </div>
          )}
          <div
            className={
              activeMenu
                ? 'dark:bg-main-dark-bg bg-main-bg min-h-screen md:ml-72 w-full'
                : 'bg-main-bg dark:bg-main-dark-bg w-full min-h-screen flex-2'
            }
          >
            <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full">
              <Navbar />
            </div>
            <div>
              {themeSettings && <ThemeSettings />}

              <Routes>
                {routes.map((route, index) => (
                  <Route key={index} path={route.path} element={route.element} />
                ))}
              </Routes>
            </div>
            <Footer />
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;
