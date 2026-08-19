import React, { useState, useEffect } from 'react';
import { Navbar } from './components/common/Navbar';
import { CitizenLandingPage } from './components/citizen/CitizenLandingPage';
import { CitizenComplaintForm } from './components/citizen/CitizenComplaintForm';
import { TrackComplaintModal } from './components/citizen/TrackComplaintModal';
import { WhatsAppTicketModal } from './components/citizen/WhatsAppTicketModal';
import { DriverPortal } from './components/driver/DriverPortal';
import { AdminControlTower } from './components/admin/AdminControlTower';
import { HotspotHeatmapMap } from './components/gis/HotspotHeatmapMap';
import { SocietyIntelView } from './components/admin/SocietyIntelView';
import { AnalyticsDashboard } from './components/analytics/AnalyticsDashboard';
import { KarmaRewardsModal } from './components/citizen/KarmaRewardsModal';
import { ComplaintTimelineModal } from './components/citizen/ComplaintTimelineModal';
import { LoginModal } from './components/auth/LoginModal';
import { api } from './services/api';

export function App() {
  // Authentication Role State: 'CITIZEN' (Public Default), 'ADMIN', 'DRIVER'
  const [currentUser, setCurrentUser] = useState({ role: 'CITIZEN' });
  const [activeTab, setActiveTab] = useState('citizen-home');
  const [complaints, setComplaints] = useState([]);
  const [drivers, setDrivers] = useState([]);

  // Modals state
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isKarmaOpen, setIsKarmaOpen] = useState(false);
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [activeWhatsAppComplaint, setActiveWhatsAppComplaint] = useState(null);
  const [activeTimelineComplaint, setActiveTimelineComplaint] = useState(null);

  // Load live state on startup
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const cList = await api.getComplaints();
    const dList = await api.getDrivers();
    setComplaints(cList);
    setDrivers(dList);
  };

  // Auth Handlers
  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
    if (userData.role === 'ADMIN') {
      setActiveTab('admin');
    } else if (userData.role === 'DRIVER') {
      setActiveTab('driver');
    }
  };

  const handleLogout = () => {
    setCurrentUser({ role: 'CITIZEN' });
    setActiveTab('citizen-home');
  };

  // 1. Citizen Creates Complaint
  const handleCreateComplaint = async (data) => {
    const created = await api.createComplaint(data);
    await loadData();
    return created;
  };

  // 2. Driver Accepts Job
  const handleAcceptJob = async (driverId, ticketId) => {
    const res = await api.driverAcceptJob(driverId, ticketId);
    await loadData();
    return res;
  };

  // 3. Driver Declines Job
  const handleDeclineJob = async (driverId, ticketId) => {
    const res = await api.driverDeclineJob(driverId, ticketId);
    await loadData();
    return res;
  };

  // 4. Driver Starts Navigation
  const handleStartNavigation = async (driverId, ticketId) => {
    const res = await api.driverStartNavigation(driverId, ticketId);
    await loadData();
    return res;
  };

  // 5. Driver Starts Cleanup
  const handleStartCleanup = async (driverId, ticketId) => {
    const res = await api.driverStartCleanup(driverId, ticketId);
    await loadData();
    return res;
  };

  // 6. Driver Completes Cleanup & Uploads Proof
  const handleCompleteJob = async (driverId, ticketId, afterPhotoUrl) => {
    const res = await api.driverCompleteJob(driverId, ticketId, afterPhotoUrl);
    await loadData();
    return res;
  };

  // 7. Admin Force Manual Dispatch
  const handleAdminManualDispatch = async (complaintId, driverId) => {
    const res = await api.adminManualDispatch(complaintId, driverId);
    await loadData();
    return res;
  };

  const pendingCount = complaints.filter((c) => c.status === 'REPORTED').length;
  const searchingCount = complaints.filter((c) => c.status === 'SEARCHING_DRIVER').length;

  const isCitizen = currentUser.role === 'CITIZEN';
  const isAdmin = currentUser.role === 'ADMIN';
  const isDriver = currentUser.role === 'DRIVER';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-slate-950 font-sans">
      {/* Role-Aware Top Navigation */}
      <Navbar
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
        onOpenKarma={() => setIsKarmaOpen(true)}
        onOpenTrackModal={() => setIsTrackModalOpen(true)}
        pendingCount={pendingCount}
        searchingCount={searchingCount}
      />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* ========================================================= */}
        {/* 1. CITIZEN VIEWS (Public by Default)                      */}
        {/* ========================================================= */}
        {isCitizen && (
          <>
            {activeTab === 'citizen-home' && (
              <CitizenLandingPage
                onRaiseComplaint={() => setActiveTab('citizen-report')}
                onTrackComplaint={() => setIsTrackModalOpen(true)}
                onOpenKarma={() => setIsKarmaOpen(true)}
                activeComplaintsCount={complaints.length}
              />
            )}

            {activeTab === 'citizen-report' && (
              <CitizenComplaintForm
                complaints={complaints}
                onCreateComplaint={handleCreateComplaint}
                onResolveDemo={handleCompleteJob}
                onBackToLanding={() => setActiveTab('citizen-home')}
              />
            )}
          </>
        )}

        {/* ========================================================= */}
        {/* 2. SANITATION DRIVER TERMINAL (Protected: Driver Login)  */}
        {/* ========================================================= */}
        {isDriver && (
          <DriverPortal
            drivers={drivers}
            complaints={complaints}
            onAcceptJob={handleAcceptJob}
            onDeclineJob={handleDeclineJob}
            onStartNavigation={handleStartNavigation}
            onStartCleanup={handleStartCleanup}
            onCompleteJob={handleCompleteJob}
            onOpenWhatsAppModal={(c) => setActiveWhatsAppComplaint(c)}
          />
        )}

        {/* ========================================================= */}
        {/* 3. MUNICIPAL ADMIN CONTROL TOWER (Protected: Admin Login) */}
        {/* ========================================================= */}
        {isAdmin && (
          <>
            {activeTab === 'admin' && (
              <AdminControlTower
                complaints={complaints}
                drivers={drivers}
                onManualDispatch={handleAdminManualDispatch}
                onOpenWhatsAppModal={(c) => setActiveWhatsAppComplaint(c)}
                onInspectTimeline={(c) => setActiveTimelineComplaint(c)}
                onOpenHotspots={() => setActiveTab('hotspots')}
                onOpenSociety={() => setActiveTab('society')}
                onOpenAnalytics={() => setActiveTab('analytics')}
              />
            )}

            {activeTab === 'hotspots' && <HotspotHeatmapMap />}

            {activeTab === 'society' && <SocietyIntelView />}

            {activeTab === 'analytics' && <AnalyticsDashboard complaints={complaints} />}
          </>
        )}
      </main>

      {/* Municipal Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>Smart India Hackathon (SIH 2026) — CleanCity AI Smart Waste Management System</span>
          <span className="text-slate-400 font-mono">
            Mode: <strong className={isAdmin ? 'text-amber-400' : isDriver ? 'text-blue-400' : 'text-emerald-400'}>{currentUser.role}</strong>
          </span>
        </div>
      </footer>

      {/* Auth Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Global Modals */}
      <TrackComplaintModal
        isOpen={isTrackModalOpen}
        onClose={() => setIsTrackModalOpen(false)}
        complaints={complaints}
        onOpenWhatsAppModal={(c) => {
          setIsTrackModalOpen(false);
          setActiveWhatsAppComplaint(c);
        }}
      />

      <WhatsAppTicketModal
        complaint={activeWhatsAppComplaint}
        isOpen={!!activeWhatsAppComplaint}
        onClose={() => setActiveWhatsAppComplaint(null)}
      />

      <KarmaRewardsModal
        isOpen={isKarmaOpen}
        onClose={() => setIsKarmaOpen(false)}
      />

      <ComplaintTimelineModal
        complaint={activeTimelineComplaint}
        isOpen={!!activeTimelineComplaint}
        onClose={() => setActiveTimelineComplaint(null)}
        onResolveDemo={(id) => handleCompleteJob('DRV-01', id, null)}
      />
    </div>
  );
}

export default App;
