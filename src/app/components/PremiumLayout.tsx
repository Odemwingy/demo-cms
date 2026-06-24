import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate, Link } from 'react-router';
import { 
  Home, 
  Database, 
  RefreshCcw, 
  BarChart3, 
  HelpCircle,
  Settings,
  Shield,
  MonitorPlay,
  User,
  Search,
  Bell,
  ChevronRight,
  Menu,
  ChevronDown,
  LogOut,
  Activity
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAuth } from '../AuthContext';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const PRIMARY_NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: Activity },
  { id: 'home', label: 'Sheet', icon: Home },
  { id: 'metadata', label: 'Metadata', icon: Database },
  { id: 'cycle', label: 'Cycle', icon: RefreshCcw },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
  { id: 'profile-setup', label: 'Profile Setup', icon: User },
  { id: 'configuration', label: 'Configuration', icon: Settings },
  { id: 'administration', label: 'Administration', icon: Shield },
];

export const SECONDARY_NAV: Record<string, { id: string; label: string }[]> = {
  home: [], // Home usually has no secondary dropdowns in the top bar, just the layout
  metadata: [
    { id: 'audio', label: 'Audio' },
    { id: 'video', label: 'Video' },
    { id: 'game-app', label: 'Game/App' },
    { id: 'audiobook', label: 'Audiobook' },
    { id: 'ebook', label: 'Ebook' },
    { id: 'bundle', label: 'Bundle' },
    { id: 'group-template', label: 'Group Template' },
    { id: 'import', label: 'Import' },
  ],
  cycle: [
    { id: 'manage', label: 'Manage Cycles' },
    { id: 'sign-off', label: 'Sign-Off' },
    { id: 'export', label: 'Export' },
    { id: 'integrity-check', label: 'Integrity Check' },
    { id: 'export-diff', label: 'Export Diff' },
  ],
  reports: [
    { id: 'media', label: 'Media Report' },
    { id: 'change-request', label: 'Change Request Report' },
    { id: 'lcs-vls', label: 'LCS/VLS Report' },
    { id: 'qc', label: 'QC Report' },
    { id: 'action', label: 'Action Report' },
  ],
  administration: [
    { id: 'users', label: 'User Management' },
    { id: 'roles', label: 'Role Management' },
    { id: 'audit', label: 'Audit Logs' },
    { id: 'category-tree', label: 'Category Tree' },
  ],
  configuration: [
    { id: 'eis', label: 'EIS Configuration' },
    { id: 'extensions', label: 'Extensions' },
    { id: 'language', label: 'Language' },
    { id: 'preferences', label: 'Preferences' },
    { id: 'images', label: 'Images' },
  ],
  'profile-setup': [
    { id: 'profiles', label: 'Add/Select Profile' },
    { id: 'media-config', label: 'Media Config' },
    { id: 'routes', label: 'Routes' },
    { id: 'sub-profile', label: 'Sub-Profile' },
    { id: 'categories', label: 'Category' },
  ]
};

function TopBar() {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { 
    users, currentUser, setCurrentUser, 
    selectedAirline, setSelectedAirline, 
    selectedCycle, setSelectedCycle 
  } = useAuth();
  
  const [availableAirlines, setAvailableAirlines] = useState<any[]>([]);

  useEffect(() => {
    if (currentUser) {
      fetch(`http://localhost:3001/api/airlines?user_id=${currentUser.id}`)
        .then(res => res.json())
        .then(data => {
          setAvailableAirlines(data);
          if (data.length > 0 && !selectedAirline) {
            setSelectedAirline(data[0].id);
            if (data[0].cycles && data[0].cycles.length > 0) {
              setSelectedCycle(data[0].cycles[0]);
            }
          } else if (data.length === 0) {
            setSelectedAirline('');
            setSelectedCycle('');
          }
        });
    }
  }, [currentUser]);

  const handleAirlineChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const aid = e.target.value;
    setSelectedAirline(aid);
    const airline = availableAirlines.find(a => a.id === aid);
    if (airline && airline.cycles && airline.cycles.length > 0) {
      setSelectedCycle(airline.cycles[0]);
    } else {
      setSelectedCycle('');
    }
  };

  const selectedAirlineData = availableAirlines.find(a => a.id === selectedAirline);
  const cycles = selectedAirlineData?.cycles || [];

  return (
    <header className="h-16 bg-slate-900 flex items-center justify-between px-6 shrink-0 text-white shadow-md z-30 relative">
      <div className="flex items-center gap-6 shrink-0">
        <div className="flex items-center gap-3 text-indigo-400 font-bold text-xl tracking-wide cursor-pointer">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
            <Database className="h-5 w-5" />
          </div>
          <span>IFE CMS</span>
        </div>
      </div>

      <div className="flex items-center gap-5">
        <a href="/help" target="_blank" rel="noopener noreferrer" className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors flex items-center justify-center" title="Envee Help">
          <HelpCircle className="h-5 w-5" />
        </a>
        <button className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-indigo-500 rounded-full border border-slate-900"></span>
        </button>
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-3 cursor-pointer p-1.5 pr-3 hover:bg-slate-800 rounded-full transition-colors border border-slate-700/50"
          >
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-inner">
              <span className="text-sm font-medium text-white">{currentUser?.username.substring(0,2).toUpperCase() || 'U'}</span>
            </div>
            <div className="flex flex-col items-start hidden sm:flex">
              <span className="text-sm font-medium text-slate-200 leading-tight">{currentUser?.username || 'Guest'}</span>
              <span className="text-[10px] text-indigo-300 font-bold tracking-wider">{currentUser?.role || 'NO ROLE'}</span>
            </div>
            <ChevronDown className="h-4 w-4 text-slate-400 hidden sm:block" />
          </button>

          {userMenuOpen && (
            <>
              <div className="fixed inset-0 z-20" onClick={() => setUserMenuOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-64 bg-slate-800 rounded-xl shadow-xl border border-slate-700 py-2 z-30 overflow-hidden backdrop-blur-xl">
                <div className="px-5 py-4 border-b border-slate-700/50 bg-slate-800/50">
                  <p className="text-sm font-medium text-white">{currentUser?.username}</p>
                  <p className="text-xs text-slate-400 mt-1">Role: {currentUser?.role}</p>
                </div>
                <div className="py-2">
                  <div className="px-4 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider">Switch Account (Test)</div>
                  {users.map(u => (
                    <button 
                      key={u.id}
                      onClick={() => { setCurrentUser(u); setUserMenuOpen(false); }}
                      className={cn(
                        "w-full flex flex-col items-start px-5 py-2 text-sm transition-colors",
                        currentUser?.id === u.id ? "bg-indigo-500/10 text-indigo-400" : "text-slate-300 hover:bg-slate-700 hover:text-white"
                      )}
                    >
                      <span>{u.username}</span>
                      <span className="text-xs opacity-60">{u.role} {u.company_id ? `(${u.company_id})` : ''}</span>
                    </button>
                  ))}
                </div>
                <div className="border-t border-slate-700/50 py-2">
                  <button
                    onClick={() => navigate('/login')}
                    className="w-full flex items-center gap-3 px-5 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function FilterBar() {
  const { currentUser, selectedAirline, setSelectedAirline, selectedCycle, setSelectedCycle } = useAuth();
  const [availableAirlines, setAvailableAirlines] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('MMA');
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      fetch(`http://localhost:3001/api/airlines?user_id=${currentUser.id}`)
        .then(res => res.json())
        .then(data => {
          setAvailableAirlines(data);
          if (data.length > 0 && !selectedAirline) {
            setSelectedAirline(data[0].id);
            if (data[0].cycles && data[0].cycles.length > 0) {
              setSelectedCycle(data[0].cycles[0]);
            }
          } else if (data.length === 0) {
            setSelectedAirline('');
            setSelectedCycle('');
          }
        });
    }
  }, [currentUser]);

  const handleAirlineChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const aid = e.target.value;
    setSelectedAirline(aid);
    const airline = availableAirlines.find(a => a.id === aid);
    if (airline && airline.cycles && airline.cycles.length > 0) {
      setSelectedCycle(airline.cycles[0]);
    } else {
      setSelectedCycle('');
    }
  };

  const selectedAirlineData = availableAirlines.find(a => a.id === selectedAirline);
  const cycles = selectedAirlineData?.cycles || [];

  return (
    <div className="h-14 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-10 shadow-sm relative">
      <div className="flex items-center gap-3">
        <select 
          className="bg-slate-100/50 hover:bg-slate-100 text-sm font-medium text-slate-700 px-3 py-1.5 outline-none cursor-pointer border border-slate-200 rounded-lg transition-colors focus:ring-2 focus:ring-indigo-500/20"
          value={selectedAirline}
          onChange={handleAirlineChange}
        >
          {availableAirlines.map(a => (
            <option key={a.id} value={a.id}>{a.code} - {a.name}</option>
          ))}
          {availableAirlines.length === 0 && <option value="">No airlines available</option>}
        </select>
        
        <select 
          className="bg-slate-100/50 hover:bg-slate-100 text-sm font-medium text-slate-700 px-3 py-1.5 outline-none cursor-pointer border border-slate-200 rounded-lg transition-colors focus:ring-2 focus:ring-indigo-500/20"
          value={selectedCycle}
          onChange={(e) => setSelectedCycle(e.target.value)}
        >
          {cycles.map((c: string) => (
            <option key={c} value={c}>{c}</option>
          ))}
          {cycles.length === 0 && <option value="">No cycles</option>}
        </select>
      </div>

      <div className="flex items-center relative">
        <form 
          className="relative flex items-center group shadow-sm rounded-lg"
          onSubmit={(e) => {
            e.preventDefault();
            if (searchQuery.trim()) {
              const url = `/#/search?type=${encodeURIComponent(searchType)}&q=${encodeURIComponent(searchQuery.trim())}`;
              window.open(url, '_blank', 'width=1000,height=600,menubar=no,toolbar=no,location=no,status=no,resizable=yes');
            }
          }}
        >
          <div className="absolute left-3 text-indigo-500 transition-colors pointer-events-none z-10">
            <Search className="w-4 h-4" />
          </div>
          <input 
            type="text" 
            placeholder="Search MMA..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-2 py-1.5 text-sm bg-white border border-slate-300 rounded-l-lg outline-none w-56 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all font-medium text-slate-700"
          />
          <select 
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="py-1.5 px-2 text-sm bg-white border-y border-slate-300 outline-none text-slate-600 focus:border-indigo-400 transition-all font-medium cursor-pointer border-l"
          >
            <option value="MMA">MMA</option>
            <option value="MID">MID</option>
            <option value="Filename">Filename</option>
          </select>
          <button 
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 border border-orange-500 px-4 py-1.5 text-sm font-bold text-white rounded-r-lg transition-colors"
          >
            Search
          </button>
        </form>
      </div>
    </div>
  );
}

function PrimaryNav() {
  const location = useLocation();
  const activePrimary = location.pathname.split('/')[1] || 'home';
  const { currentUser } = useAuth();

  const visibleNav = PRIMARY_NAV.filter(nav => {
    if (nav.id === 'profile-setup' && currentUser?.role !== 'IFE_PROVIDER') return false;
    return true;
  });

  return (
    <nav className="h-14 bg-slate-950 flex items-center px-4 overflow-x-auto no-scrollbar shrink-0 shadow-inner border-b border-slate-800">
      <div className="flex gap-2 min-w-max px-2">
        {visibleNav.map((nav) => {
          const isActive = activePrimary === nav.id;
          const Icon = nav.icon;
          return (
            <Link
              key={nav.id}
              to={`/${nav.id}`}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20" 
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              )}
            >
              <Icon className={cn("h-4 w-4", isActive ? "text-indigo-200" : "text-slate-500")} />
              {nav.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function SecondaryNav() {
  const location = useLocation();
  const activePrimary = location.pathname.split('/')[1] || 'home';
  const activeSecondary = location.pathname.split('/')[2];
  
  const navItems = SECONDARY_NAV[activePrimary] || [];

  if (navItems.length === 0) return null;

  return (
    <div className="h-10 bg-white flex items-center px-6 overflow-x-auto no-scrollbar shrink-0 border-b border-slate-200">
      <div className="flex gap-6 min-w-max">
        {navItems.map((nav) => {
          const isActive = activeSecondary === nav.id;
          return (
            <Link
              key={nav.id}
              to={`/${activePrimary}/${nav.id}`}
              className={cn(
                "relative flex items-center justify-center h-10 text-sm font-semibold transition-colors",
                isActive 
                  ? "text-indigo-600" 
                  : "text-slate-500 hover:text-slate-800"
              )}
            >
              {nav.label}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-t-full" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function Breadcrumbs() {
  const location = useLocation();
  const activePrimary = location.pathname.split('/')[1] || 'home';
  const activeSecondary = location.pathname.split('/')[2];
  
  const pLabel = PRIMARY_NAV.find(n => n.id === activePrimary)?.label;
  const sLabel = SECONDARY_NAV[activePrimary]?.find(n => n.id === activeSecondary)?.label;

  if (activePrimary === 'home') return null;

  return (
    <div className="h-12 flex items-center px-8 text-sm text-slate-500 border-b border-slate-200 bg-white shrink-0">
      {pLabel && (
        <Link to={`/${activePrimary}`} className="hover:text-indigo-600 transition-colors font-medium">{pLabel}</Link>
      )}
      {sLabel && (
        <>
          <ChevronRight className="h-4 w-4 mx-2 flex-shrink-0 text-slate-300" />
          <span className="text-slate-900 font-semibold">{sLabel}</span>
        </>
      )}
    </div>
  );
}

import { GlobalTreeSidebar } from './GlobalTreeSidebar';

export function PremiumLayout() {
  const location = useLocation();
  const activePrimary = location.pathname.split('/')[1] || 'home';
  
  // Filter bar (Airline/Cycle selection & Search) should only show on content/data driven modules
  const showFilterBar = ['home', 'metadata', 'cycle', 'reports', 'dashboard'].includes(activePrimary);
  
  // Category tree should only show on core media management modules
  const showTree = ['home', 'metadata'].includes(activePrimary);

  return (
    <div className="flex flex-col h-screen w-full bg-slate-50 text-slate-900 font-sans overflow-hidden selection:bg-indigo-100 selection:text-indigo-900">
      <TopBar />
      <PrimaryNav />
      <SecondaryNav />
      {showFilterBar && <FilterBar />}
      <div className="flex flex-1 overflow-hidden relative">
        {showTree && <GlobalTreeSidebar />}
        <main className="flex-1 flex flex-col min-w-0 bg-slate-50 relative z-0">
          <Breadcrumbs />
          <div className="flex-1 overflow-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
