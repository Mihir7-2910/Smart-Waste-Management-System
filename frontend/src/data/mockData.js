// CleanCity AI — Master Mock & Operational Dataset for SIH 2026

export const CLEANLINESS_QUOTES = [
  {
    quote: "A cleaner city begins with one responsible action.",
    author: "Clean India Civic Initiative"
  },
  {
    quote: "See waste. Report it. Keep your neighbourhood clean.",
    author: "CleanCity AI Mission"
  },
  {
    quote: "Clean surroundings begin with responsible citizens.",
    author: "Smart City Urban Mission"
  },
  {
    quote: "Don't wait for someone else to clean it. Be the reason it stays clean.",
    author: "Swachh Bharat Abhiyan"
  }
];

export const AWARENESS_POSTERS = [
  {
    id: "post-1",
    icon: "🗑️",
    title: "USE THE RIGHT BIN",
    desc: "Separate wet and dry waste properly to double municipal recycling efficiency.",
    tag: "Source Segregation",
    bgGradient: "from-emerald-900/40 via-slate-900 to-emerald-950/60",
    borderColor: "border-emerald-500/30",
    textColor: "text-emerald-400"
  },
  {
    id: "post-2",
    icon: "🚯",
    title: "DON'T DUMP ON ROADS",
    desc: "A clean street starts with responsible disposal. Roadside dumping attracts strays and diseases.",
    tag: "Civic Responsibility",
    bgGradient: "from-rose-900/40 via-slate-900 to-rose-950/60",
    borderColor: "border-rose-500/30",
    textColor: "text-rose-400"
  },
  {
    id: "post-3",
    icon: "♻️",
    title: "SEGREGATE YOUR WASTE",
    desc: "Keep organic kitchen waste separate from recyclable plastics, paper, and glass.",
    tag: "Circular Economy",
    bgGradient: "from-blue-900/40 via-slate-900 to-blue-950/60",
    borderColor: "border-blue-500/30",
    textColor: "text-blue-400"
  },
  {
    id: "post-4",
    icon: "🌱",
    title: "KEEP YOUR NEIGHBOURHOOD CLEAN",
    desc: "Small daily habits by societies create clean, healthy, and flood-resilient communities.",
    tag: "Green Community",
    bgGradient: "from-teal-900/40 via-slate-900 to-teal-950/60",
    borderColor: "border-teal-500/30",
    textColor: "text-teal-400"
  },
  {
    id: "post-5",
    icon: "📸",
    title: "SEE A WASTE PROBLEM?",
    desc: "Report it in 30 seconds via CleanCity AI. Our automated dispatch system alerts the nearest truck.",
    tag: "Instant 4-Hr SLA",
    bgGradient: "from-amber-900/40 via-slate-900 to-amber-950/60",
    borderColor: "border-amber-500/30",
    textColor: "text-amber-400"
  }
];

export const CLEAN_CITY_TIPS = [
  {
    icon: "🥗",
    title: "Segregate Wet & Dry Waste",
    desc: "Keep biodegradable food waste separate from plastics for easier composting."
  },
  {
    icon: "🚫",
    title: "Avoid Roadside Open Dumping",
    desc: "Always use municipal designated collection bins or wait for morning tippers."
  },
  {
    icon: "🚰",
    title: "Keep Storm Drains Litter-Free",
    desc: "Prevent urban waterlogging during monsoons by keeping plastics away from gutters."
  },
  {
    icon: "⏰",
    title: "Report Overflowing Bins Early",
    desc: "Early citizen reporting prevents waste scatter and foul odor accumulation."
  },
  {
    icon: "🧱",
    title: "Proper C&D Debris Disposal",
    desc: "Book designated municipal debris compactors for construction and brick rubble."
  },
  {
    icon: "🏥",
    title: "Safe Biohazard Packaging",
    desc: "Wrap clinical items or broken glass securely before presenting for disposal."
  }
];

export const COMMUNITY_IMPACT = {
  issuesReported: 1248,
  issuesResolved: 1184,
  resolutionRate: "94.8%",
  hotspotsAddressed: 86,
  avgResponseHours: "2.3 Hrs",
  activeSanitationFleet: 18
};

export const INITIAL_DRIVERS = [
  {
    id: "DRV-01",
    name: "Ramesh Patel",
    phone: "+91 98250 12345",
    vehicleId: "TRK-01",
    vehicleReg: "GJ-01-WM-9021",
    vehicleType: "Heavy Compactor (10 Ton)",
    capacityL: 10000,
    currentFillL: 6800,
    fillPercentage: 68,
    fuelPercentage: 74,
    speedKmH: 28,
    currentLat: 23.0338,
    currentLng: 72.5850,
    status: "ON_DUTY", // ON_DUTY, BUSY, IDLE
    currentJobTicket: "SWM-2026-8940",
    incomingJobRequest: null,
    rating: 4.9,
    jobsCompletedToday: 7,
    routeWaypoints: [
      { id: "WP-1", name: "Municipal Zone 4 Yard", lat: 23.0280, lng: 72.5720, status: "COMPLETED", time: "10:30 AM" },
      { id: "WP-2", name: "Crossroad 6 CG Road (Debris)", lat: 23.0315, lng: 72.5590, status: "CURRENT", time: "11:15 AM", ticketId: "SWM-2026-8940" },
      { id: "WP-3", name: "Navrangpura Market", lat: 23.0375, lng: 72.5625, status: "PENDING", time: "11:45 AM" },
      { id: "WP-4", name: "Pirana Waste Processing Plant", lat: 22.9850, lng: 72.5680, status: "PENDING", time: "12:45 PM" }
    ]
  },
  {
    id: "DRV-02",
    name: "Suresh Prajapati",
    phone: "+91 98980 67890",
    vehicleId: "TRK-02",
    vehicleReg: "GJ-01-ET-4412",
    vehicleType: "Electric Tipper (2.5 Ton)",
    capacityL: 2500,
    currentFillL: 2100,
    fillPercentage: 84,
    fuelPercentage: 88,
    speedKmH: 22,
    currentLat: 23.0540,
    currentLng: 72.5310,
    status: "ON_DUTY",
    currentJobTicket: "SWM-2026-8935",
    incomingJobRequest: null,
    rating: 4.8,
    jobsCompletedToday: 5,
    routeWaypoints: [
      { id: "WP-21", name: "Bodakdev Community Bin", lat: 23.0450, lng: 72.5180, status: "COMPLETED", time: "10:40 AM" },
      { id: "WP-22", name: "Doctor House Lane (Hazmat)", lat: 23.0210, lng: 72.5710, status: "CURRENT", time: "11:25 AM", ticketId: "SWM-2026-8935" },
      { id: "WP-23", name: "Vastrapur Lake North Gate", lat: 23.0392, lng: 72.5310, status: "PENDING", time: "12:00 PM" }
    ]
  },
  {
    id: "DRV-03",
    name: "Vikram Sinh",
    phone: "+91 97240 55432",
    vehicleId: "TRK-03",
    vehicleReg: "GJ-01-HD-8830",
    vehicleType: "Hydraulic Dumper (15 Ton)",
    capacityL: 15000,
    currentFillL: 4200,
    fillPercentage: 28,
    fuelPercentage: 92,
    speedKmH: 0,
    currentLat: 23.0120,
    currentLng: 72.5780,
    status: "IDLE", // Standby ready for auto-dispatch!
    currentJobTicket: null,
    incomingJobRequest: null,
    rating: 4.9,
    jobsCompletedToday: 4,
    routeWaypoints: [
      { id: "WP-31", name: "Paldi Central Depot (Standby)", lat: 23.0120, lng: 72.5780, status: "CURRENT", time: "Standby" }
    ]
  }
];

export const INITIAL_COMPLAINTS = [
  {
    id: "SWM-2026-8951",
    channel: "APP",
    citizenName: "Priya Sharma",
    citizenPhone: "+91 98765 43210",
    category: "OVERFLOWING_BIN",
    categoryLabel: "Overflowing Municipal Bin",
    priority: "HIGH",
    status: "REPORTED", // REPORTED, SEARCHING_DRIVER, ASSIGNED, ON_THE_WAY, IN_PROGRESS, RESOLVED, REJECTED
    description: "Municipal waste bin near Navrangpura vegetable market has been overflowing and waste is spilling onto the walkway.",
    address: "Near Navrangpura Vegetable Market, Ward 4, Ahmedabad",
    landmark: "Main Market Entrance Gate #2",
    ward: "Ward 4 (Navrangpura)",
    latitude: 23.0375,
    longitude: 72.5625,
    binCode: "BIN-AHD-0042",
    beforeImageUrl: "https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?w=800&auto=format&fit=crop&q=60",
    afterImageUrl: null,
    aiVerified: true,
    aiConfidence: 0.96,
    aiTags: ["Severe Overflow", "Organic Waste 70%", "Obstruction on Pavement"],
    slaDeadline: new Date(Date.now() + 3.8 * 3600 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    assignedDriver: null,
    whatsappMessages: [
      {
        id: "msg-1",
        type: "INITIAL_TICKET",
        time: "12 mins ago",
        text: `━━━━━━━━━━━━━━━━━━━━\n🏛️ CLEANCITY AI\n🧹 WASTE COMPLAINT REGISTERED\n\nComplaint ID: SWM-2026-8951\nStatus: 🟡 Reported\nCategory: Overflowing Municipal Bin\nReported On: 19 August 2026, 11:32 AM\nLocation: Navrangpura Vegetable Market\nAddress: Near Navrangpura Vegetable Market, Ward 4, Ahmedabad\nLandmark: Main Market Entrance Gate #2\nDescription: Municipal waste bin has been overflowing and waste is spilling onto the walkway.\nEvidence: 📸 Photo Submitted\nLocation: 📍 GPS Location Captured (23.0375° N, 72.5625° E)\nPriority: 🟠 High\nExpected Response: Within 4-Hour Municipal SLA\n\n━━━━━━━━━━━━━━━━━━━━\n📋 COMPLAINT JOURNEY\n🟢 Complaint Submitted\n🟡 Finding Nearby Sanitation Team\n⚪ Driver Assigned\n⚪ Cleaning In Progress\n⚪ Resolution Verification\n⚪ Resolved\n\n━━━━━━━━━━━━━━━━━━━━\n🎫 TRACK YOUR COMPLAINT\nTicket ID: SWM-2026-8951\nCleanCity AI • Smart Waste Management System\n━━━━━━━━━━━━━━━━━━━━`
      }
    ],
    timeline: [
      { status: "REPORTED", title: "Complaint Registered", description: "Submitted via Citizen Web App with GPS location & photo evidence.", time: "12 mins ago" },
      { status: "AI_VERIFIED", title: "AI Vision Verified", description: "Confidence 96% — Overflowing organic waste detected. Auto-dispatch search triggered.", time: "11 mins ago" }
    ]
  },
  {
    id: "SWM-2026-8942",
    channel: "WHATSAPP",
    citizenName: "Amit Verma (WhatsApp Bot)",
    citizenPhone: "+91 98111 22334",
    category: "ILLEGAL_DUMPING",
    categoryLabel: "Illegal Roadside Dumping",
    priority: "HIGH",
    status: "SEARCHING_DRIVER",
    description: "Huge pile of mixed plastic bottles, food boxes and thermocol dumped beside Sector 15 park gate overnight.",
    address: "Opposite Gate #3, Vastrapur Lake Garden, Ward 7",
    landmark: "Beside Lake Parking Lot",
    ward: "Ward 7 (Vastrapur)",
    latitude: 23.0392,
    longitude: 72.5310,
    binCode: null,
    beforeImageUrl: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&auto=format&fit=crop&q=60",
    afterImageUrl: null,
    aiVerified: true,
    aiConfidence: 0.91,
    aiTags: ["Single-Use Plastic 60%", "Road Encroachment"],
    slaDeadline: new Date(Date.now() + 3.5 * 3600 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    assignedDriver: null,
    whatsappMessages: [
      {
        id: "msg-42-1",
        type: "INITIAL_TICKET",
        time: "35 mins ago",
        text: `🏛️ CLEANCITY AI — TICKET REGISTERED\nTicket: SWM-2026-8942\nStatus: 🟡 Reported\nLocation: Opposite Gate #3, Vastrapur Lake Garden\nCategory: Illegal Roadside Dumping\nPriority: 🟠 High (4-Hr SLA)`
      },
      {
        id: "msg-42-2",
        type: "DISPATCH_SEARCH",
        time: "30 mins ago",
        text: `🔎 DRIVER SEARCHING: We are finding the nearest available sanitation team to dispatch to your location.`
      }
    ],
    timeline: [
      { status: "REPORTED", title: "WhatsApp Ingestion", description: "Parsed from WhatsApp Grievance Bot (+91-9811122334).", time: "35 mins ago" },
      { status: "SEARCHING_DRIVER", title: "Auto-Dispatch in Progress", description: "Searching nearest available tippers within 3.5 km radius.", time: "30 mins ago" }
    ]
  },
  {
    id: "SWM-2026-8940",
    channel: "SMS",
    citizenName: "SMS Citizen (+91 97250 98765)",
    citizenPhone: "+91 97250 98765",
    category: "CONSTRUCTION_DEBRIS",
    categoryLabel: "Construction & Demolition Debris",
    priority: "HIGH",
    status: "ON_THE_WAY",
    description: "Cement bags and broken concrete dumped on main road corner blocking stormwater drain.",
    address: "Crossroad 6, CG Road Near Municipal School, Ward 4",
    landmark: "Near Municipal School Corner",
    ward: "Ward 4 (Navrangpura)",
    latitude: 23.0315,
    longitude: 72.5590,
    binCode: null,
    beforeImageUrl: "https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?w=800&auto=format&fit=crop&q=60",
    afterImageUrl: null,
    aiVerified: true,
    aiConfidence: 0.94,
    aiTags: ["Debris", "Drain Blockage Risk"],
    slaDeadline: new Date(Date.now() + 2.5 * 3600 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 65 * 60 * 1000).toISOString(),
    assignedDriver: {
      id: "DRV-01",
      name: "Ramesh Patel",
      phone: "+91 98250 12345",
      vehicleId: "TRK-01",
      vehicleReg: "GJ-01-WM-9021",
      assignedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      etaMinutes: 4
    },
    whatsappMessages: [
      {
        id: "msg-40-1",
        type: "INITIAL_TICKET",
        time: "65 mins ago",
        text: `🏛️ CLEANCITY AI TICKET: SWM-2026-8940\nStatus: 🟡 Reported\nLocation: CG Road Crossroad 6\nCategory: Construction Debris`
      },
      {
        id: "msg-40-2",
        type: "DRIVER_ASSIGNED",
        time: "30 mins ago",
        text: `🚛 DRIVER ASSIGNED: Sanitation Driver Ramesh Patel (TRK-01 • GJ-01-WM-9021) has accepted your job.`
      },
      {
        id: "msg-40-3",
        type: "ON_THE_WAY",
        time: "5 mins ago",
        text: `📍 DRIVER ON THE WAY: Sanitation team is travelling to your reported location. ETA: ~4 mins.`
      }
    ],
    timeline: [
      { status: "REPORTED", title: "SMS Ingested", description: "Parsed from citizen SMS.", time: "65 mins ago" },
      { status: "ASSIGNED", title: "Driver Accepted Job", description: "Driver Ramesh Patel accepted via Driver Mobile Terminal.", time: "30 mins ago" },
      { status: "ON_THE_WAY", title: "Navigation Started", description: "Driver en-route with Heavy Compactor TRK-01 (ETA: 4 min).", time: "5 mins ago" }
    ]
  },
  {
    id: "SWM-2026-8935",
    channel: "APP",
    citizenName: "Dr. Karan Joshi",
    citizenPhone: "+91 98989 12121",
    category: "HAZARDOUS_WASTE",
    categoryLabel: "Bio-Hazardous Waste Spillage",
    priority: "CRITICAL",
    status: "IN_PROGRESS",
    description: "Unsealed clinical waste bags and syringes spilled outside clinic alleyway.",
    address: "Doctor House Lane, Ellisbridge, Ward 3",
    landmark: "Behind Lifecare Pathology Lab",
    ward: "Ward 3 (Ellisbridge)",
    latitude: 23.0210,
    longitude: 72.5710,
    binCode: "BIN-AHD-0019",
    beforeImageUrl: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&auto=format&fit=crop&q=60",
    afterImageUrl: null,
    aiVerified: true,
    aiConfidence: 0.98,
    aiTags: ["Biohazard Protocol", "Hazmat PPE Required"],
    slaDeadline: new Date(Date.now() + 1.1 * 3600 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 100 * 60 * 1000).toISOString(),
    assignedDriver: {
      id: "DRV-02",
      name: "Suresh Prajapati",
      phone: "+91 98980 67890",
      vehicleId: "TRK-02",
      vehicleReg: "GJ-01-ET-4412",
      assignedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      etaMinutes: 0
    },
    whatsappMessages: [
      {
        id: "msg-35-1",
        type: "INITIAL_TICKET",
        time: "100 mins ago",
        text: `🏛️ CLEANCITY AI — EMERGENCY HAZMAT TICKET: SWM-2026-8935\nPriority: 🔴 CRITICAL\nLocation: Doctor House Lane, Ellisbridge`
      },
      {
        id: "msg-35-2",
        type: "DRIVER_ASSIGNED",
        time: "45 mins ago",
        text: `🚛 DISPATCHED: Suresh Prajapati (TRK-02) assigned with Specialized Medical Waste Container.`
      },
      {
        id: "msg-35-3",
        type: "IN_PROGRESS",
        time: "10 mins ago",
        text: `🧹 CLEANING IN PROGRESS: Driver has arrived at Doctor House Lane. Sanitation & sterilization underway.`
      }
    ],
    timeline: [
      { status: "REPORTED", title: "Emergency Grievance", description: "Classified as CRITICAL biohazard by AI Vision.", time: "100 mins ago" },
      { status: "ASSIGNED", title: "Specialized Team Dispatched", description: "Dispatched to Suresh Prajapati (TRK-02).", time: "45 mins ago" },
      { status: "IN_PROGRESS", title: "On-Site Cleanup Started", description: "Driver arrived at location; sanitization in progress.", time: "10 mins ago" }
    ]
  },
  {
    id: "SWM-2026-8928",
    channel: "APP",
    citizenName: "Meera Desai",
    citizenPhone: "+91 97123 45678",
    category: "OVERFLOWING_BIN",
    categoryLabel: "Community Bin Cleared",
    priority: "MEDIUM",
    status: "RESOLVED",
    description: "Bin near Law Garden night market full after Sunday evening crowd.",
    address: "Law Garden Khau Galli, Ellisbridge, Ward 3",
    landmark: "Near Handicraft Stall #14",
    ward: "Ward 3 (Ellisbridge)",
    latitude: 23.0238,
    longitude: 72.5568,
    binCode: "BIN-AHD-0008",
    beforeImageUrl: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&auto=format&fit=crop&q=60",
    afterImageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=60",
    aiVerified: true,
    aiConfidence: 0.97,
    aiTags: ["100% Cleared", "Area Sanitized"],
    slaDeadline: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    assignedDriver: {
      id: "DRV-01",
      name: "Ramesh Patel",
      phone: "+91 98250 12345",
      vehicleId: "TRK-01",
      vehicleReg: "GJ-01-WM-9021",
      assignedAt: new Date(Date.now() - 4.5 * 3600 * 1000).toISOString(),
      etaMinutes: 0
    },
    whatsappMessages: [
      {
        id: "msg-28-1",
        type: "INITIAL_TICKET",
        time: "5 hrs ago",
        text: `🏛️ CLEANCITY AI TICKET: SWM-2026-8928\nStatus: 🟡 Reported\nLocation: Law Garden Khau Galli`
      },
      {
        id: "msg-28-2",
        type: "RESOLVED",
        time: "1 hr ago",
        text: `✅ RESOLVED: Your reported issue at Law Garden Khau Galli has been resolved successfully. AI Resolution Verification score: 97% Clean. Thank you for keeping our city clean!`
      }
    ],
    timeline: [
      { status: "REPORTED", title: "Complaint Lodged", description: "Reported by citizen.", time: "5 hrs ago" },
      { status: "ASSIGNED", title: "Driver Dispatched", description: "Assigned to Ramesh Patel.", time: "4.5 hrs ago" },
      { status: "RESOLVED", title: "Cleanup Completed & AI Verified", description: "After-photo verified with 97% Cleanliness score.", time: "1 hr ago" }
    ]
  }
];

export const SMART_BINS = [
  { id: "BIN-AHD-0042", name: "Navrangpura Market Bin", lat: 23.0375, lng: 72.5625, capacityL: 1100, currentFill: 95, status: "OVERFLOW", battery: 89, lastCleaned: "Yesterday 4:00 PM" },
  { id: "BIN-AHD-0012", name: "Commerce Six Roads Corner", lat: 23.0410, lng: 72.5540, capacityL: 1100, currentFill: 76, status: "FILLING", battery: 94, lastCleaned: "Today 6:00 AM" },
  { id: "BIN-AHD-0008", name: "Law Garden Street Bin", lat: 23.0238, lng: 72.5568, capacityL: 1500, currentFill: 25, status: "EMPTY", battery: 98, lastCleaned: "Today 9:00 AM" },
  { id: "BIN-AHD-0019", name: "Ellisbridge Doctor House", lat: 23.0210, lng: 72.5710, capacityL: 800, currentFill: 88, status: "OVERFLOW", battery: 72, lastCleaned: "Yesterday 8:00 PM" },
  { id: "BIN-AHD-0088", name: "Vastrapur Lake North Gate", lat: 23.0392, lng: 72.5310, capacityL: 2000, currentFill: 92, status: "OVERFLOW", battery: 85, lastCleaned: "Yesterday 6:00 PM" },
  { id: "BIN-AHD-0055", name: "IIM Road Commercial Strip", lat: 23.0320, lng: 72.5320, capacityL: 1100, currentFill: 48, status: "FILLING", battery: 91, lastCleaned: "Today 7:30 AM" }
];

export const AI_PREDICTIONS = [
  {
    id: "PRED-01",
    eventTitle: "Navratri Garba Mahotsav (GMDC Ground)",
    ward: "Ward 4 (Navrangpura)",
    predictedSpike: "+38% Waste Spike",
    timeframe: "Next 48 Hours",
    wasteType: "Plastic Bottles, Food Boxes & Polyethylene",
    estimatedTonnage: "18.4 Tons / Day",
    overflowRisk: "HIGH (92% Bin Overflow Probability)",
    recommendedAction: "Pre-allocate 2 Dedicated Compactors (TRK-01, TRK-04) + 6 Temporary 1500L Bins",
    confidence: "94% (Historical Multi-Year Pattern)"
  },
  {
    id: "PRED-02",
    eventTitle: "Sunday Weekend Organic Market Surge",
    ward: "Ward 7 (Vastrapur)",
    predictedSpike: "+24% Organic Waste Spike",
    timeframe: "Sunday 06:00 AM - 02:00 PM",
    wasteType: "Wet Organic & Vegetable Remains",
    estimatedTonnage: "11.2 Tons",
    overflowRisk: "MEDIUM (68% Probability)",
    recommendedAction: "Schedule extra morning sweep trip for E-Tipper TRK-02 at 11:30 AM",
    confidence: "89%"
  },
  {
    id: "PRED-03",
    eventTitle: "Post-Diwali Packaging & Commercial Surplus",
    ward: "Ward 3 (Ellisbridge)",
    predictedSpike: "+45% Cardboard & Dry Waste",
    timeframe: "Upcoming Festival Week",
    wasteType: "Dry Paper, Cardboard & Gift Wraps",
    estimatedTonnage: "24.5 Tons / Day",
    overflowRisk: "CRITICAL (96% Probability)",
    recommendedAction: "Activate 24x7 Night Shift Route + Route Optimization Engine",
    confidence: "96%"
  }
];

export const SOCIETY_INTELLIGENCE = [
  {
    id: "SOC-01",
    name: "Gokul Greens Residency",
    units: 340,
    ward: "Ward 7 (Vastrapur)",
    predictedWasteWeekKg: 520,
    trendPercent: "+14%",
    segregationScore: 88,
    peakDay: "Sunday Morning (08:00 - 11:00 AM)",
    currentIssue: "Bin 2 Overflowing — Block C",
    lastComplaintStatus: "Resolved 2 days ago",
    recommendedAction: "Increase Sunday collection frequency to 2x daily",
    binCount: 4,
    organicRatio: "64%",
    recyclableRatio: "32%"
  },
  {
    id: "SOC-02",
    name: "Palm Grove Heights",
    units: 480,
    ward: "Ward 4 (Navrangpura)",
    predictedWasteWeekKg: 780,
    trendPercent: "-4%",
    segregationScore: 94,
    peakDay: "Saturday Evening",
    currentIssue: "All Bins Healthy (45% capacity)",
    lastComplaintStatus: "No open issues",
    recommendedAction: "Eligible for 5% Municipal Green Property Tax Rebate",
    binCount: 6,
    organicRatio: "70%",
    recyclableRatio: "26%"
  },
  {
    id: "SOC-03",
    name: "Silver Oak Towers",
    units: 210,
    ward: "Ward 3 (Ellisbridge)",
    predictedWasteWeekKg: 390,
    trendPercent: "+22%",
    segregationScore: 62,
    currentIssue: "Mixed Plastic in Organic Bins",
    lastComplaintStatus: "Open Grievance SWM-2026-8951",
    recommendedAction: "Conduct Ward Awareness Session on Waste Segregation",
    binCount: 3,
    organicRatio: "45%",
    recyclableRatio: "40%"
  }
];

export const CITIZEN_LEADERBOARD = [
  { rank: 1, name: "Priya Sharma", points: 840, badges: ["Eco Champion 🌟", "Verified Reporter 🛡️"], resolvedCount: 18 },
  { rank: 2, name: "Rahul Dave", points: 720, badges: ["Clean City Warrior 🏆"], resolvedCount: 14 },
  { rank: 3, name: "Karan Joshi", points: 610, badges: ["Neighborhood Hero 📍"], resolvedCount: 11 },
  { rank: 4, name: "Meera Desai", points: 550, badges: ["Green Volunteer 🌱"], resolvedCount: 9 }
];


