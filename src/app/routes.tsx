import React from 'react';
import { createBrowserRouter, Navigate, Outlet } from 'react-router';
import { PremiumLayout } from './components/PremiumLayout';
import { LoginPage } from './pages/Login';

// Import newly created MMA Views
import { HomeView } from './pages/HomeView';
import { DashboardView } from './pages/DashboardView';
import { MetadataView } from './pages/MetadataView';
import { CycleManageView } from './pages/CyclePublish';
import { ReportsView } from './pages/ReportsView';
import { CategoryTreeLayout } from './pages/CategoryTree';
import { UserManagementView, RoleManagementView, AuditLogView } from './pages/BackendManagement';
import { ProtectedRoute } from './components/ProtectedRoute';
import { HelpView } from './pages/HelpView';
import { SearchResultsView } from './pages/SearchResultsView';

import { ProfileSetupLayout } from './pages/profile-setup/ProfileSetupLayout';
import { ProfileManager } from './pages/profile-setup/ProfileManager';
import { RouteManager } from './pages/profile-setup/RouteManager';
import { ClassManager } from './pages/profile-setup/ClassManager';
import { CategoryManager } from './pages/profile-setup/CategoryManager';
import { Settings, Shield, HelpCircle, MonitorPlay, User } from 'lucide-react';

function PlaceholderView({ title }: { title: string }) {
  return (
    <div className="p-10 h-full flex flex-col items-center justify-center text-center bg-slate-50">
      <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-slate-100">
        <Settings className="w-10 h-10 text-slate-300" />
      </div>
      <h3 className="text-2xl font-bold text-slate-800 mb-3">{title}</h3>
      <p className="text-slate-500 max-w-md">
        This module is part of the Envee CMS architecture but is currently a placeholder in this frontend demo.
      </p>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/search",
    element: <SearchResultsView />,
  },
  {
    path: "/",
    Component: PremiumLayout,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      
      {
        path: "home",
        element: <HomeView />
      },
      
      {
        path: "dashboard",
        element: <DashboardView />
      },
      
      {
        path: "metadata",
        children: [
          { index: true, element: <Navigate to="video" replace /> },
          { path: "video", element: <MetadataView type="video" /> },
          { path: "audio", element: <MetadataView type="audio" /> },
          { path: "game-app", element: <MetadataView type="game" /> },
          { path: "audiobook", element: <MetadataView type="audiobook" /> },
          { path: "ebook", element: <MetadataView type="ebook" /> },
          { path: "bundle", element: <MetadataView type="bundle" /> },
          { path: "group-template", element: <PlaceholderView title="Group Template" /> },
          { path: "import", element: <PlaceholderView title="Import Module" /> },
          { path: "*", element: <PlaceholderView title="Metadata Module" /> }
        ]
      },
      
      {
        path: "cycle",
        children: [
          { index: true, element: <Navigate to="manage" replace /> },
          { path: "manage", element: <CycleManageView /> },
          { path: "sign-off", element: <PlaceholderView title="Sign-Off Module" /> },
          { path: "export", element: <PlaceholderView title="Export Module" /> },
          { path: "integrity-check", element: <PlaceholderView title="Integrity Check" /> },
          { path: "export-diff", element: <PlaceholderView title="Export Diff" /> },
          { path: "*", element: <PlaceholderView title="Cycle Management" /> }
        ]
      },

      {
        path: "reports",
        children: [
          { index: true, element: <Navigate to="media" replace /> },
          { path: ":type", element: <ReportsView /> },
        ]
      },

      {
        path: "help",
        element: <HelpView />
      },

      {
        path: "profile-setup",
        element: (
          <ProtectedRoute allowedRoles={['IFE_PROVIDER']}>
            <ProfileSetupLayout />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <Navigate to="profiles" replace /> },
          { path: "profiles", element: <ProfileManager /> },
          { path: "routes", element: <RouteManager /> },
          { path: "classes", element: <ClassManager /> },
          { path: "categories/:id", element: <CategoryManager /> },
          { path: "categories", element: <Navigate to="/profile-setup/profiles" replace /> },
        ]
      },

      {
        path: "configuration",
        children: [
          { index: true, element: <Navigate to="eis" replace /> },
          { path: ":type", element: <PlaceholderView title="Configuration Module" /> },
        ]
      },

      {
        path: "administration",
        children: [
          { index: true, element: <Navigate to="users" replace /> },
          { path: "users", element: <UserManagementView /> },
          { path: "roles", element: <RoleManagementView /> },
          { path: "audit", element: <AuditLogView /> },
          { path: "category-tree", element: <CategoryTreeLayout /> },
          { path: "*", element: <PlaceholderView title="Administration" /> }
        ]
      },


      {
        path: ":primary/:secondary",
        element: <PlaceholderView title="Unknown Module" />
      },
      {
        path: ":primary",
        element: <PlaceholderView title="Unknown Module" />
      }
    ],
  },
]);