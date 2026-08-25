import {
  INITIAL_COMPLAINTS,
  INITIAL_DRIVERS,
  SMART_BINS,
  AI_PREDICTIONS,
  SOCIETY_INTELLIGENCE,
  COMMUNITY_IMPACT,
  CLEANLINESS_QUOTES,
  AWARENESS_POSTERS,
  CLEAN_CITY_TIPS
} from '../data/mockData';
import { findNearestVehicle, calculateDistanceKm, formatDistance } from '../utils/distance';

const STORAGE_KEYS = {
  COMPLAINTS: 'cleancity_complaints_v2',
  DRIVERS: 'cleancity_drivers_v2',
  BINS: 'cleancity_bins_v2',
};

export function getStoredComplaints() {
  const data = localStorage.getItem(STORAGE_KEYS.COMPLAINTS);
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      // ignore
    }
  }
  localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(INITIAL_COMPLAINTS));
  return INITIAL_COMPLAINTS;
}

export function saveStoredComplaints(complaints) {
  localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(complaints));
}

export function getStoredDrivers() {
  const data = localStorage.getItem(STORAGE_KEYS.DRIVERS);
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      // ignore
    }
  }
  localStorage.setItem(STORAGE_KEYS.DRIVERS, JSON.stringify(INITIAL_DRIVERS));
  return INITIAL_DRIVERS;
}

export function saveStoredDrivers(drivers) {
  localStorage.setItem(STORAGE_KEYS.DRIVERS, JSON.stringify(drivers));
}

function getImageFingerprint(imageUrl) {
  if (!imageUrl) return null;
  return imageUrl.split('?')[0];
}

// Generate Structured WhatsApp Message for Initial Registration
export function generateInitialWhatsAppTicket(complaint) {
  const dateStr = new Date(complaint.createdAt || Date.now()).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  const timeStr = new Date(complaint.createdAt || Date.now()).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return `━━━━━━━━━━━━━━━━━━━━
🏛️ CLEANCITY AI
🧹 WASTE COMPLAINT REGISTERED

Complaint ID:
${complaint.id}

Status: 🟡 Reported

Category:
${complaint.categoryLabel}

Reported On:
${dateStr}, ${timeStr}

Location:
${complaint.address}

Landmark:
${complaint.landmark || 'Nearby landmark'}

Description:
${complaint.description}

Evidence:
📸 Photo Submitted & AI Verified (${Math.round((complaint.aiConfidence || 0.95) * 100)}% Match)

Location:
📍 GPS Captured (${complaint.latitude?.toFixed(4)}° N, ${complaint.longitude?.toFixed(4)}° E)

Priority:
🟠 ${complaint.priority}

Expected Response:
Within 4-Hour Municipal SLA Guarantee

━━━━━━━━━━━━━━━━━━━━
📋 COMPLAINT JOURNEY
🟢 Complaint Submitted
🟡 Finding Nearby Sanitation Team
⚪ Driver Assigned
⚪ Cleaning In Progress
⚪ Resolution Verification
⚪ Resolved

━━━━━━━━━━━━━━━━━━━━
🎫 TRACK YOUR COMPLAINT
Your complaint has been registered in the municipal automated dispatch system.

Ticket ID: ${complaint.id}
CleanCity AI • Smart Waste Management System
━━━━━━━━━━━━━━━━━━━━`;
}

export const api = {
  // --- Complaints ---
  async getComplaints(filter = {}) {
    let list = getStoredComplaints();

    if (filter.status && filter.status !== 'ALL') {
      list = list.filter((c) => c.status === filter.status);
    }
    if (filter.priority && filter.priority !== 'ALL') {
      list = list.filter((c) => c.priority === filter.priority);
    }
    if (filter.channel && filter.channel !== 'ALL') {
      list = list.filter((c) => c.channel === filter.channel);
    }
    if (filter.ward && filter.ward !== 'ALL') {
      list = list.filter((c) => c.ward.includes(filter.ward));
    }
    if (filter.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(
        (c) =>
          c.id.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.address.toLowerCase().includes(q) ||
          c.citizenName.toLowerCase().includes(q)
      );
    }

    return list;
  },

  async getComplaintById(id) {
    const list = getStoredComplaints();
    return list.find((c) => c.id.toUpperCase() === id.toUpperCase()) || null;
  },

  // 1. Citizen Creates Complaint
  async createComplaint(data) {
    const complaints = getStoredComplaints();
    const imageFingerprint = getImageFingerprint(data.imageFingerprint);
    const duplicate = imageFingerprint && complaints.find((complaint) => {
      const createdAt = new Date(complaint.createdAt || 0).getTime();
      const isRecent = Date.now() - createdAt <= 10 * 60 * 1000;
      return isRecent && complaint.imageFingerprint === imageFingerprint;
    });

    if (duplicate) {
      duplicate.duplicateCount = (duplicate.duplicateCount || 1) + 1;
      duplicate.duplicateImages = [...new Set([...(duplicate.duplicateImages || [duplicate.beforeImageUrl]), data.beforeImageUrl])];
      duplicate.duplicateReports = [
        ...(duplicate.duplicateReports || []),
        { citizenPhone: data.citizenPhone, submittedAt: new Date().toISOString() }
      ];
      saveStoredComplaints(complaints);
      return { ...duplicate, isDuplicate: true, mergedInto: duplicate.id };
    }

    const newId = `SWM-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newComplaint = {
      id: newId,
      channel: data.channel || 'APP',
      citizenName: data.citizenName || 'Responsible Citizen',
      citizenPhone: data.citizenPhone || '+91 98765 43210',
      category: data.category || 'OVERFLOWING_BIN',
      categoryLabel: data.categoryLabel || 'Overflowing Municipal Bin',
      priority: data.priority || 'HIGH',
      status: 'REPORTED',
      description: data.description,
      address: data.address || 'Selected Location, Ahmedabad',
      landmark: data.landmark || 'Near Main Road Corner',
      ward: data.ward || 'Ward 4 (Navrangpura)',
      latitude: data.latitude || 23.0375,
      longitude: data.longitude || 72.5625,
      binCode: data.binCode || null,
      beforeImageUrl:
        data.beforeImageUrl ||
        'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?w=800&auto=format&fit=crop&q=60',
      imageFingerprint,
      duplicateCount: 1,
      duplicateImages: [data.beforeImageUrl].filter(Boolean),
      duplicateReports: [],
      afterImageUrl: null,
      aiVerified: true,
      aiConfidence: data.aiConfidence || 0.96,
      aiTags: data.aiTags || ['Verified Garbage', 'Auto AI Geotagged'],
      slaDeadline: new Date(Date.now() + 4 * 3600 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      assignedDriver: null,
      declinedDriverIds: [],
      whatsappMessages: [],
      timeline: [
        {
          status: 'REPORTED',
          title: 'Complaint Registered',
          description: `Complaint ${newId} logged via Citizen Web App with GPS coordinates.`,
          time: 'Just now'
        },
        {
          status: 'AI_VERIFIED',
          title: 'AI Computer Vision Verification Passed',
          description: 'Confidence 96% — Real waste detected. Auto-dispatch pipeline triggered.',
          time: 'Just now'
        }
      ]
    };

    // Attach initial WhatsApp digital ticket
    newComplaint.whatsappMessages.push({
      id: `msg-${Date.now()}`,
      type: 'INITIAL_TICKET',
      time: 'Just now',
      text: generateInitialWhatsAppTicket(newComplaint)
    });

    complaints.unshift(newComplaint);
    saveStoredComplaints(complaints);

    // Auto-trigger automated driver discovery!
    await this.autoDispatchComplaint(newId);

    return newComplaint;
  },

  // 2. Automated Nearest-Driver Dispatch Discovery
  async autoDispatchComplaint(complaintId) {
    const complaints = getStoredComplaints();
    const drivers = getStoredDrivers();
    const complaint = complaints.find((c) => c.id === complaintId);
    if (!complaint) return null;

    complaint.status = 'SEARCHING_DRIVER';
    complaint.timeline.push({
      status: 'SEARCHING_DRIVER',
      title: 'Searching Nearest Sanitation Team',
      description: 'AI Dispatch Engine scanning GPS coordinates of available compactors and tippers.',
      time: 'Just now'
    });

    complaint.whatsappMessages.push({
      id: `msg-${Date.now()}`,
      type: 'DISPATCH_SEARCH',
      time: 'Just now',
      text: `🔎 DRIVER SEARCHING: CleanCity AI is finding the nearest available sanitation driver to dispatch to your location.`
    });

    // Find best suitable driver
    let bestDriver = null;
    let minDistance = Infinity;

    drivers.forEach((driver) => {
      // Prefer IDLE or ON_DUTY drivers with capacity
      if (driver.fillPercentage < 90 && ['IDLE', 'ON_DUTY'].includes(driver.status) && !complaint.declinedDriverIds?.includes(driver.id)) {
        const dist = calculateDistanceKm(
          complaint.latitude,
          complaint.longitude,
          driver.currentLat,
          driver.currentLng
        );
        if (dist < minDistance) {
          minDistance = dist;
          bestDriver = driver;
        }
      }
    });

    if (bestDriver) {
      // Send job pop-up card to driver's mobile console
      const estMinutes = Math.max(4, Math.round(minDistance * 3.2));
      bestDriver.incomingJobRequest = {
        ticketId: complaint.id,
        categoryLabel: complaint.categoryLabel,
        address: complaint.address,
        landmark: complaint.landmark,
        priority: complaint.priority,
        latitude: complaint.latitude,
        longitude: complaint.longitude,
        distanceKm: minDistance,
        distanceText: formatDistance(minDistance),
        estimatedMinutes: estMinutes,
        beforeImageUrl: complaint.beforeImageUrl,
        dispatchedAt: new Date().toISOString()
      };
      saveStoredDrivers(drivers);
    } else {
      complaint.adminAlert = 'NO_DRIVER_AVAILABLE';
    }

    saveStoredComplaints(complaints);
    return complaint;
  },

  // 3. Driver Accepts Job
  async driverAcceptJob(driverId, ticketId) {
    const complaints = getStoredComplaints();
    const drivers = getStoredDrivers();
    const complaint = complaints.find((c) => c.id === ticketId);
    const driver = drivers.find((d) => d.id === driverId);

    if (!complaint || !driver) throw new Error('Complaint or Driver not found');

    complaint.status = 'ASSIGNED';
    complaint.assignedDriver = {
      id: driver.id,
      name: driver.name,
      phone: driver.phone,
      vehicleId: driver.vehicleId,
      vehicleReg: driver.vehicleReg,
      vehicleType: driver.vehicleType,
      assignedAt: new Date().toISOString(),
      etaMinutes: driver.incomingJobRequest?.estimatedMinutes || 7
    };

    complaint.timeline.push({
      status: 'ASSIGNED',
      title: `Job Accepted by ${driver.name}`,
      description: `Driver accepted job with vehicle ${driver.vehicleReg} (${driver.vehicleType}).`,
      time: 'Just now'
    });

    complaint.whatsappMessages.push({
      id: `msg-${Date.now()}`,
      type: 'DRIVER_ASSIGNED',
      time: 'Just now',
      text: `🚛 DRIVER ASSIGNED: Sanitation Driver ${driver.name} (${driver.vehicleId} • ${driver.vehicleReg}) has accepted your complaint. Vehicle Type: ${driver.vehicleType}.`
    });

    driver.currentJobTicket = ticketId;
    driver.incomingJobRequest = null;
    driver.status = 'BUSY';

    // Add waypoint to driver's route sequence
    driver.routeWaypoints.push({
      id: `WP-${Date.now()}`,
      name: complaint.address,
      lat: complaint.latitude,
      lng: complaint.longitude,
      status: 'CURRENT',
      time: `~${complaint.assignedDriver.etaMinutes} mins`,
      ticketId: complaint.id
    });

    saveStoredComplaints(complaints);
    saveStoredDrivers(drivers);
    return { complaint, driver };
  },

  // 4. Driver Declines Job (Auto-Re-dispatch to Next Driver)
  async driverDeclineJob(driverId, ticketId) {
    const complaints = getStoredComplaints();
    const drivers = getStoredDrivers();
    const complaint = complaints.find((c) => c.id === ticketId);
    const driver = drivers.find((d) => d.id === driverId);

    if (driver) {
      driver.incomingJobRequest = null;
      saveStoredDrivers(drivers);
    }

    if (complaint && !complaint.declinedDriverIds?.includes(driverId)) {
      complaint.declinedDriverIds = [...(complaint.declinedDriverIds || []), driverId];
    }

    // Try finding another driver
    const otherDrivers = drivers.filter(
      (d) => d.fillPercentage < 90
        && ['IDLE', 'ON_DUTY'].includes(d.status)
        && !complaint?.declinedDriverIds?.includes(d.id)
    );
    let nextDriver = null;
    let minDistance = Infinity;

    if (complaint) {
      otherDrivers.forEach((d) => {
        const dist = calculateDistanceKm(complaint.latitude, complaint.longitude, d.currentLat, d.currentLng);
        if (dist < minDistance) {
          minDistance = dist;
          nextDriver = d;
        }
      });

      if (nextDriver) {
        const estMinutes = Math.max(4, Math.round(minDistance * 3.2));
        nextDriver.incomingJobRequest = {
          ticketId: complaint.id,
          categoryLabel: complaint.categoryLabel,
          address: complaint.address,
          landmark: complaint.landmark,
          priority: complaint.priority,
          latitude: complaint.latitude,
          longitude: complaint.longitude,
          distanceKm: minDistance,
          distanceText: formatDistance(minDistance),
          estimatedMinutes: estMinutes,
          beforeImageUrl: complaint.beforeImageUrl,
          dispatchedAt: new Date().toISOString()
        };
        saveStoredDrivers(drivers);
      } else {
        complaint.adminAlert = 'NO_DRIVER_ACCEPTED';
        saveStoredComplaints(complaints);
      }
      saveStoredComplaints(complaints);
    }

    return { success: true };
  },

  // 5. Driver Starts Navigation (On The Way)
  async driverStartNavigation(driverId, ticketId) {
    const complaints = getStoredComplaints();
    const complaint = complaints.find((c) => c.id === ticketId);
    if (!complaint) return null;

    complaint.status = 'ON_THE_WAY';
    complaint.timeline.push({
      status: 'ON_THE_WAY',
      title: 'Driver En Route',
      description: 'Driver started GPS turn-by-turn navigation towards the reported landmark.',
      time: 'Just now'
    });

    complaint.whatsappMessages.push({
      id: `msg-${Date.now()}`,
      type: 'ON_THE_WAY',
      time: 'Just now',
      text: `📍 DRIVER ON THE WAY: The sanitation team is travelling to your reported location (${complaint.address}). Live ETA: ~${complaint.assignedDriver?.etaMinutes || 5} mins.`
    });

    saveStoredComplaints(complaints);
    return complaint;
  },

  // 6. Driver Arrives & Starts Cleanup
  async driverStartCleanup(driverId, ticketId) {
    const complaints = getStoredComplaints();
    const complaint = complaints.find((c) => c.id === ticketId);
    if (!complaint) return null;

    complaint.status = 'IN_PROGRESS';
    complaint.timeline.push({
      status: 'IN_PROGRESS',
      title: 'Cleanup Underway',
      description: 'Driver arrived on-site. Compactor loading and area sanitization started.',
      time: 'Just now'
    });

    complaint.whatsappMessages.push({
      id: `msg-${Date.now()}`,
      type: 'IN_PROGRESS',
      time: 'Just now',
      text: `🧹 CLEANING IN PROGRESS: The sanitation team has arrived on site. Waste removal & area sweeping is underway.`
    });

    saveStoredComplaints(complaints);
    return complaint;
  },

  // 7. Driver Uploads Resolution Proof & Marks Completed
  async driverCompleteJob(driverId, ticketId, afterImageUrl) {
    const complaints = getStoredComplaints();
    const drivers = getStoredDrivers();
    const complaint = complaints.find((c) => c.id === ticketId);
    const driver = drivers.find((d) => d.id === driverId);

    if (!complaint) throw new Error('Complaint not found');

    complaint.status = 'RESOLVED';
    complaint.afterImageUrl =
      afterImageUrl ||
      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=60';
    complaint.resolvedAt = new Date().toISOString();

    complaint.timeline.push({
      status: 'RESOLVED',
      title: 'Cleanup Completed & Verified',
      description: 'Resolution photo uploaded. AI Vision confirmed 97% Cleanliness score.',
      time: 'Just now'
    });

    complaint.whatsappMessages.push({
      id: `msg-${Date.now()}`,
      type: 'RESOLVED',
      time: 'Just now',
      text: `✅ COMPLAINT RESOLVED: Your reported issue at ${complaint.address} has been resolved successfully. AI Resolution Verification Score: 97% Clean. Thank you for helping keep our city clean!\n\nTicket ID: ${complaint.id}\nCleanCity AI • Smart City Municipal Redressal`
    });

    if (driver) {
      driver.currentJobTicket = null;
      driver.status = 'ON_DUTY';
      driver.jobsCompletedToday = (driver.jobsCompletedToday || 0) + 1;
      // Mark waypoint completed
      const wp = driver.routeWaypoints.find((w) => w.ticketId === ticketId);
      if (wp) wp.status = 'COMPLETED';
      saveStoredDrivers(drivers);
    }

    saveStoredComplaints(complaints);
    return complaint;
  },

  // 8. Admin Manual Override Dispatch
  async adminManualDispatch(complaintId, driverId) {
    return this.driverAcceptJob(driverId, complaintId);
  },

  // --- Get Drivers ---
  async getDrivers() {
    return getStoredDrivers();
  },

  // --- Static/Metadata ---
  async getQuotes() {
    return CLEANLINESS_QUOTES;
  },
  async getAwarenessPosters() {
    return AWARENESS_POSTERS;
  },
  async getCleanCityTips() {
    return CLEAN_CITY_TIPS;
  },
  async getCommunityImpact() {
    return COMMUNITY_IMPACT;
  },
  async getBins() {
    return SMART_BINS;
  },
  async getPredictions() {
    return AI_PREDICTIONS;
  },
  async getSocietyIntelligence() {
    return SOCIETY_INTELLIGENCE;
  }
};
