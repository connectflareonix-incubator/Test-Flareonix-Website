import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, FileText, Users as TeamIcon, Briefcase, Handshake, Inbox,
  Star, UserCog, Megaphone, Settings, LogOut, Menu, X,
} from 'lucide-react';
import { adminClear } from './adminAuth';

const links = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/blog', label: 'Blog', icon: FileText },
  { to: '/admin/team', label: 'Team Gallery', icon: TeamIcon },
  { to: '/admin/projects', label: 'Projects', icon: Briefcase },
  { to: '/admin/collaborations', label: 'Collaborations', icon: Handshake },
  { to: '/admin/inbox', label: 'Inbox', icon: Inbox },
  { to: '/admin/feedback', label: 'Feedback & Reviews', icon: Star },
  { to: '/admin/users', label: 'Users', icon: UserCog },
  { to: '/admin/announcements', label: 'Announcements', icon: Megaphone },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

const AdminLayout = ({ children }) => {
  const loc = useLocation();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);

  const logout = () => {
    adminClear();
    nav('/admin');
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white flex">
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden fixed top-4 left-4 z-40 p-2 bg-[#0D0D0D] border border-[#FF6B00]/30 rounded-lg"
        aria-label="Toggle menu"
        data-testid="admin-mobile-toggle"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-[#0D0D0D] border-r border-white/10 transition-transform z-30 ${
          open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
        data-testid="admin-sidebar"
      >
        <div className="p-6 border-b border-white/10">
          <h1 className="font-heading text-xl font-bold">
            <span className="text-[#FF6B00]">Flare</span>onix Admin
          </h1>
        </div>
        <nav className="p-3 space-y-1 overflow-y-auto h-[calc(100vh-160px)]">
          {links.map((l) => {
            const Icon = l.icon;
            const active = loc.pathname === l.to || loc.pathname.startsWith(l.to + '/');
            return (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  active
                    ? 'bg-[#FF6B00]/15 text-[#FF6B00] font-semibold'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`}
                data-testid={`admin-nav-${l.label.toLowerCase().replace(/[^a-z]+/g, '-')}`}
              >
                <Icon className="h-4 w-4" /> {l.label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-white/10">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10"
            data-testid="admin-logout"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0 md:ml-0 p-4 md:p-8 pt-16 md:pt-8">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
