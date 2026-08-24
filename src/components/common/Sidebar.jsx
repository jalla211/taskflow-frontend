import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
  Settings,
  FileText,
  Bell,
Calendar,
  LogOut,
  UserCircle,
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout, isAdmin, isProjectManager } = useAuth();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  // Define all navigation items - NO DUPLICATES
  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/projects', icon: FolderKanban, label: 'Projects' },
    { path: '/tasks', icon: CheckSquare, label: 'Tasks' },
    { path: '/calendar', icon: Calendar, label: 'Calendar' },
    { path: '/notification-preferences', icon: Bell, label: 'Preferences' },
  ];

  // Add role-specific items only once
  if (isAdmin()) {
    navItems.push({ path: '/users', icon: Users, label: 'Users' });
    navItems.push({ path: '/admin', icon: Settings, label: 'Admin' });
  }

  if (isAdmin() || isProjectManager()) {
    navItems.push({ path: '/reports', icon: FileText, label: 'Reports' });
  }

  // Remove any potential duplicates by filtering unique paths
  const uniqueNavItems = navItems.filter((item, index, self) =>
    index === self.findIndex((t) => t.path === item.path)
  );

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-[#1E3A5F] text-white flex flex-col shadow-xl z-50">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-white/10">
        <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
          <span className="text-2xl font-bold text-white">T</span>
        </div>
        <span className="text-xl font-bold tracking-tight">TaskFlow</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {uniqueNavItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                active
                  ? 'bg-white/20 text-white shadow-lg'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-white/60 group-hover:text-white'}`} />
              <span className="font-medium text-sm">{item.label}</span>
              {active && (
                <div className="ml-auto w-1.5 h-8 bg-white rounded-full"></div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="px-4 py-4 border-t border-white/10">
        <Link
          to="/profile"
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-all duration-200 group"
        >
          <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center overflow-hidden">
            {user?.profile_picture ? (
              <img
                src={`/storage/${user.profile_picture}`}
                alt={user?.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              <UserCircle className="w-6 h-6 text-white/70" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">{user?.name}</div>
            <div className="text-xs text-white/50 truncate">{user?.role?.name}</div>
          </div>
        </Link>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200 group mt-1"
        >
          <LogOut className="w-5 h-5 text-white/60 group-hover:text-white" />
          <span className="font-medium text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;