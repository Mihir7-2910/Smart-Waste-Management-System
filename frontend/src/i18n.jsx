import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const translations = {
  en: {
    language: 'Language', home: 'Home', raiseComplaint: 'Raise Complaint', trackTicket: 'Track Ticket',
    trackComplaint: 'Track Complaint', staffLogin: 'Staff Login', logout: 'Log Out', smartWastePlatform: 'SMART WASTE PLATFORM',
    adminConsole: 'ADMIN CONSOLE', driverTerminal: 'DRIVER TERMINAL', smartWasteResponse: 'Smart waste response',
    cleanerStreets: 'Cleaner streets,', fasterAction: 'faster action.', reportIntro: 'Report garbage, overflow, or dumping. We send it to the nearest team.',
    sla: '4-hour SLA', whatsapp: 'WhatsApp updates', liveStatus: 'Live status', cityOnline: 'City operations online',
    openComplaints: 'Open complaints', priorityQueue: 'Priority queue', high: 'High', howItWorks: 'How it works',
    nextTip: 'Next tip', reportNow: 'Report now', viewLeaderboard: 'View leaderboard', actNow: 'Act now',
    spotLitter: 'Spot litter nearby?', reportWasteNow: 'Report waste now', communityImpact: 'Community impact',
    avgResponse: 'Avg. response', targetSla: 'Inside target SLA', priorityIssue: 'Overflowing bins near civic square',
    betterOperations: 'Better city operations', publicAwareness: 'Public awareness', awarenessTitle: 'Civic cleanliness awareness',
    everydayHabits: 'Everyday habits', habitsTitle: 'Clean city best practices', cityMetrics: 'City-wide waste response metrics',
    grievancesLogged: 'Grievances logged', wards: 'Across 12 city wards', cleaned: 'Cleaned', resolutionRate: 'resolution rate',
    turnaround: 'Turnaround', withinSla: 'Within SLA target', fleetActive: 'Fleet active', gpsVehicles: 'GPS tracked vehicles',
    quotes: [['A cleaner city begins with one responsible action.', 'Clean India Civic Initiative'], ['See waste. Report it. Keep your neighbourhood clean.', 'CleanCity AI Mission']],
    steps: [['Report', 'Take a photo and share the exact location.'], ['Dispatch', 'AI finds the nearest response team.'], ['Resolve', 'Track progress until the area is clean.']],
    features: [['Live waste hotspots', 'Spot overflowing bins before they spread.'], ['Auto-dispatch fleet', 'The nearest team responds faster.'], ['Citizen alerts', 'Get status, ETA and cleanup updates.']],
    posters: [['Source segregation', 'Use the right bin', 'Separate wet and dry waste.'], ['Civic responsibility', "Don't dump on roads", 'Dispose waste responsibly.'], ['Circular economy', 'Segregate your waste', 'Keep recyclables separate.'], ['Green community', 'Keep your neighbourhood clean', 'Small habits build healthier communities.'], ['Instant 4-hour SLA', 'See a waste problem?', 'Report it and alert the nearest team.']],
    tips: [['Segregate wet and dry waste', 'Make recycling easier.'], ['Avoid roadside dumping', 'Use designated collection points.'], ['Keep drains litter-free', 'Help prevent waterlogging.'], ['Report overflowing bins', 'Early reports stop waste from spreading.'], ['Dispose C&D debris properly', 'Use approved municipal collection.'], ['Package biohazard waste safely', 'Secure sharp and clinical waste.']]
  },
  hi: {
    language: 'भाषा', home: 'होम', raiseComplaint: 'शिकायत दर्ज करें', trackTicket: 'टिकट ट्रैक करें', trackComplaint: 'शिकायत ट्रैक करें',
    staffLogin: 'स्टाफ लॉगिन', logout: 'लॉग आउट', smartWastePlatform: 'स्मार्ट वेस्ट प्लेटफॉर्म', adminConsole: 'एडमिन कंसोल', driverTerminal: 'ड्राइवर टर्मिनल',
    smartWasteResponse: 'स्मार्ट कचरा सेवा', cleanerStreets: 'साफ सड़कें,', fasterAction: 'तेज़ कार्रवाई।', reportIntro: 'कचरा, ओवरफ्लो या डंपिंग की सूचना दें। हम टीम भेजेंगे।',
    sla: '4 घंटे की SLA', whatsapp: 'WhatsApp अपडेट', liveStatus: 'लाइव स्थिति', cityOnline: 'शहर सेवा ऑनलाइन', openComplaints: 'खुली शिकायतें', priorityQueue: 'प्राथमिकता सूची', high: 'अधिक',
    howItWorks: 'यह कैसे काम करता है', nextTip: 'अगला सुझाव', reportNow: 'अभी रिपोर्ट करें', viewLeaderboard: 'लीडरबोर्ड देखें', actNow: 'अभी कार्रवाई करें', spotLitter: 'पास में कचरा दिखा?', reportWasteNow: 'कचरे की रिपोर्ट करें', communityImpact: 'सामुदायिक प्रभाव',
    avgResponse: 'औसत प्रतिक्रिया', targetSla: 'SLA लक्ष्य के अंदर', priorityIssue: 'सिविक स्क्वायर के पास ओवरफ्लो बिन', betterOperations: 'बेहतर शहर संचालन', publicAwareness: 'जन जागरूकता', awarenessTitle: 'स्वच्छता जागरूकता', everydayHabits: 'रोज़मर्रा की आदतें', habitsTitle: 'स्वच्छ शहर की अच्छी आदतें', cityMetrics: 'शहर की कचरा सेवा के आंकड़े', grievancesLogged: 'दर्ज शिकायतें', wards: '12 वार्डों में', cleaned: 'साफ की गईं', resolutionRate: 'समाधान दर', turnaround: 'समाधान समय', withinSla: 'SLA लक्ष्य के अंदर', fleetActive: 'सक्रिय वाहन', gpsVehicles: 'GPS ट्रैक किए गए वाहन',
    quotes: [['स्वच्छ शहर की शुरुआत एक जिम्मेदार कदम से होती है।', 'स्वच्छ भारत पहल'], ['कचरा देखें, रिपोर्ट करें, शहर साफ रखें।', 'क्लीनसिटी AI मिशन']],
    steps: [['रिपोर्ट', 'फोटो और सही स्थान साझा करें।'], ['भेजें', 'AI सबसे नज़दीकी टीम खोजता है।'], ['समाधान', 'क्षेत्र साफ होने तक प्रगति देखें।']],
    features: [['कचरा हॉटस्पॉट', 'ओवरफ्लो बिन की जल्दी पहचान करें।'], ['ऑटो-डिस्पैच बेड़ा', 'नज़दीकी टीम जल्दी पहुंचेगी।'], ['नागरिक अलर्ट', 'स्थिति, ETA और सफाई अपडेट पाएं।']],
    posters: [['कचरा अलग करें', 'सही बिन का उपयोग करें', 'गीला और सूखा कचरा अलग रखें।'], ['नागरिक जिम्मेदारी', 'सड़क पर कचरा न डालें', 'कचरे का जिम्मेदारी से निपटारा करें।'], ['सर्कुलर अर्थव्यवस्था', 'कचरा अलग करें', 'रीसायकल सामग्री अलग रखें।'], ['हरित समुदाय', 'अपना मोहल्ला साफ रखें', 'छोटी आदतें स्वस्थ समुदाय बनाती हैं।'], ['4 घंटे की SLA', 'कचरा दिखा?', 'रिपोर्ट करें और नज़दीकी टीम बुलाएं।']],
    tips: [['गीला और सूखा कचरा अलग करें', 'रीसाइक्लिंग आसान बनाएं।'], ['सड़क किनारे कचरा न डालें', 'निर्धारित संग्रह केंद्र का उपयोग करें।'], ['नालियां कचरा-मुक्त रखें', 'जलभराव रोकने में मदद करें।'], ['ओवरफ्लो बिन की रिपोर्ट करें', 'जल्दी रिपोर्ट से कचरा फैलता नहीं।'], ['निर्माण कचरा सही जगह दें', 'नगरपालिका की सेवा का उपयोग करें।'], ['जैविक कचरा सुरक्षित पैक करें', 'नुकीली और मेडिकल चीजें सुरक्षित रखें।']]
  },
  gu: {
    language: 'ભાષા', home: 'હોમ', raiseComplaint: 'ફરિયાદ નોંધાવો', trackTicket: 'ટિકિટ ટ્રેક કરો', trackComplaint: 'ફરિયાદ ટ્રેક કરો',
    staffLogin: 'સ્ટાફ લૉગિન', logout: 'લૉગ આઉટ', smartWastePlatform: 'સ્માર્ટ વેસ્ટ પ્લેટફોર્મ', adminConsole: 'એડમિન કન્સોલ', driverTerminal: 'ડ્રાઇવર ટર્મિનલ',
    smartWasteResponse: 'સ્માર્ટ કચરા સેવા', cleanerStreets: 'સ્વચ્છ રસ્તા,', fasterAction: 'ઝડપી કાર્યવાહી.', reportIntro: 'કચરો, ઓવરફ્લો અથવા ડમ્પિંગની જાણ કરો. અમે ટીમ મોકલીશું.',
    sla: '4 કલાકની SLA', whatsapp: 'WhatsApp અપડેટ', liveStatus: 'લાઇવ સ્થિતિ', cityOnline: 'શહેર સેવા ઓનલાઇન', openComplaints: 'ચાલુ ફરિયાદો', priorityQueue: 'પ્રાથમિકતા કતાર', high: 'ઉચ્ચ',
    howItWorks: 'આ કેવી રીતે કામ કરે છે', nextTip: 'આગળની ટીપ', reportNow: 'હમણાં રિપોર્ટ કરો', viewLeaderboard: 'લીડરબોર્ડ જુઓ', actNow: 'હમણાં કાર્યવાહી કરો', spotLitter: 'નજીક કચરો દેખાયો?', reportWasteNow: 'કચરાની જાણ કરો', communityImpact: 'સમુદાય પર અસર',
    avgResponse: 'સરેરાશ પ્રતિસાદ', targetSla: 'SLA લક્ષ્યમાં', priorityIssue: 'સિવિક સ્ક્વેર પાસે ઓવરફ્લો બિન', betterOperations: 'વધુ સારી શહેર સેવા', publicAwareness: 'જાહેર જાગૃતિ', awarenessTitle: 'સ્વચ્છતા જાગૃતિ', everydayHabits: 'રોજિંદી આદતો', habitsTitle: 'સ્વચ્છ શહેરની સારી આદતો', cityMetrics: 'શહેરની કચરા સેવા આંકડા', grievancesLogged: 'નોંધાયેલી ફરિયાદો', wards: '12 શહેર વોર્ડમાં', cleaned: 'સાફ કરેલ', resolutionRate: 'ઉકેલ દર', turnaround: 'ઉકેલ સમય', withinSla: 'SLA લક્ષ્યમાં', fleetActive: 'સક્રિય વાહનો', gpsVehicles: 'GPS ટ્રેક વાહનો',
    quotes: [['સ્વચ્છ શહેરની શરૂઆત એક જવાબદાર પગલાથી થાય છે.', 'સ્વચ્છ ભારત પહેલ'], ['કચરો જુઓ, જાણ કરો, શહેર સ્વચ્છ રાખો.', 'ક્લીનસિટી AI મિશન']],
    steps: [['રિપોર્ટ', 'ફોટો અને સાચું સ્થાન શેર કરો.'], ['મોકલો', 'AI સૌથી નજીકની ટીમ શોધે છે.'], ['ઉકેલ', 'વિસ્તાર સાફ થાય ત્યાં સુધી પ્રગતિ જુઓ.']],
    features: [['કચરા હોટસ્પોટ', 'ઓવરફ્લો બિનની વહેલી જાણ કરો.'], ['ઓટો-ડિસ્પેચ કાફલો', 'સૌથી નજીકની ટીમ ઝડપથી પહોંચશે.'], ['નાગરિક એલર્ટ', 'સ્થિતિ, ETA અને સફાઈ અપડેટ મેળવો.']],
    posters: [['કચરો અલગ કરો', 'સાચા બિનનો ઉપયોગ કરો', 'ભીનો અને સૂકો કચરો અલગ રાખો.'], ['નાગરિક જવાબદારી', 'રસ્તા પર કચરો ન નાખો', 'કચરાનો જવાબદારીપૂર્વક નિકાલ કરો.'], ['સર્ક્યુલર અર્થતંત્ર', 'કચરો અલગ કરો', 'રીસાયકલ સામગ્રી અલગ રાખો.'], ['હરિત સમુદાય', 'તમારો વિસ્તાર સ્વચ્છ રાખો', 'નાની આદતો સ્વસ્થ સમુદાય બનાવે છે.'], ['4 કલાકની SLA', 'કચરો દેખાયો?', 'જાણ કરો અને નજીકની ટીમ બોલાવો.']],
    tips: [['ભીનો અને સૂકો કચરો અલગ કરો', 'રીસાયક્લિંગ સરળ બનાવો.'], ['રસ્તા પર કચરો ન નાખો', 'નક્કી કરેલા સંગ્રહ કેન્દ્રનો ઉપયોગ કરો.'], ['ગટરો કચરા મુક્ત રાખો', 'પાણી ભરાવા અટકાવવામાં મદદ કરો.'], ['ઓવરફ્લો બિનની જાણ કરો', 'વહેલી જાણથી કચરો ફેલાતો નથી.'], ['બાંધકામ કચરાનો યોગ્ય નિકાલ કરો', 'મ્યુનિસિપલ સેવા વાપરો.'], ['બાયો-હેઝાર્ડ કચરો સુરક્ષિત પેક કરો', 'તીક્ષ્ણ અને મેડિકલ વસ્તુઓ સુરક્ષિત રાખો.']]
  }
};

const LanguageContext = createContext(null);

const globalText = {
  hi: {
    'CITIZEN CIVIC PORTAL': 'नागरिक पोर्टल', 'Automated 4-Hr Dispatch': '4 घंटे ऑटो-डिस्पैच', 'Log Waste Grievance': 'कचरा शिकायत दर्ज करें',
    'Back to CleanCity Home': 'क्लीनसिटी होम पर वापस जाएं', 'Waste Grievance Category:': 'कचरा शिकायत श्रेणी:', 'Photo Evidence:': 'फोटो प्रमाण:',
    'Geo Location & Pin:': 'जियो लोकेशन और पिन:', 'Prominent Landmark:': 'मुख्य स्थान:', 'Citizen WhatsApp Number (For Digital Receipt):': 'WhatsApp नंबर (डिजिटल रसीद):',
    'Problem Description:': 'समस्या का विवरण:', 'Camera / Upload Photo': 'कैमरा / फोटो अपलोड करें', 'Edit Pin': 'पिन बदलें',
    'My Active Grievances': 'मेरी सक्रिय शिकायतें', 'WhatsApp Receipt': 'WhatsApp रसीद', 'Timeline': 'टाइमलाइन', 'Submit & Trigger Automated Dispatch': 'सबमिट करें और टीम बुलाएं',
    'Verifying & Submitting...': 'जांच और सबमिट हो रहा है...', 'Track Your Complaint': 'अपनी शिकायत ट्रैक करें', 'Search': 'खोजें', 'Recent Tickets:': 'हाल के टिकट:',
    'Before Cleanup': 'सफाई से पहले', 'Cleaned & AI Verified': 'साफ और AI सत्यापित', 'Cleanup In Progress': 'सफाई जारी है', 'After-photo pending': 'बाद की फोटो बाकी है',
    'Close': 'बंद करें', 'Cancel': 'रद्द करें', 'Confirm Location': 'स्थान की पुष्टि करें', 'Select Complaint Location': 'शिकायत का स्थान चुनें',
    'Live Camera': 'लाइव कैमरा', 'Upload File': 'फाइल अपलोड करें', 'Snap Photo': 'फोटो लें', 'Retake': 'फिर से लें', 'Use This Photo': 'यह फोटो उपयोग करें',
    'Municipal Staff Login': 'नगरपालिका स्टाफ लॉगिन', 'Admin Control Tower': 'एडमिन कंट्रोल टावर', 'Driver Terminal': 'ड्राइवर टर्मिनल', 'Sign In to Admin Control Tower': 'एडमिन कंट्रोल टावर में लॉगिन करें',
    'Launch Driver Field Terminal': 'ड्राइवर टर्मिनल शुरू करें', 'Control Tower': 'कंट्रोल टावर', 'AI Hotspots': 'AI हॉटस्पॉट', 'Society Intel': 'सोसाइटी जानकारी', 'Analytics BI': 'एनालिटिक्स',
    'Pending': 'लंबित', 'Assigned': 'सौंपा गया', 'In Progress': 'प्रगति में', 'Resolved': 'हल किया गया', 'Rejected': 'अस्वीकृत', 'Critical': 'गंभीर', 'High Priority': 'उच्च प्राथमिकता',
    'Citizen App': 'नागरिक ऐप', 'WhatsApp Bot': 'WhatsApp बॉट', 'SMS Gateway': 'SMS गेटवे', 'Pause': 'रोकें', 'Resume': 'जारी रखें', 'Reset Filters': 'फिल्टर रीसेट करें', 'Mode:': 'मोड:', 'Smart India Hackathon (SIH 2026) — CleanCity AI Smart Waste Management System': 'स्मार्ट इंडिया हैकाथॉन (SIH 2026) — क्लीनसिटी AI स्मार्ट वेस्ट मैनेजमेंट सिस्टम'
  },
  gu: {
    'CITIZEN CIVIC PORTAL': 'નાગરિક પોર્ટલ', 'Automated 4-Hr Dispatch': '4 કલાક ઓટો-ડિસ્પેચ', 'Log Waste Grievance': 'કચરાની ફરિયાદ નોંધાવો',
    'Back to CleanCity Home': 'ક્લીનસિટી હોમ પર પાછા જાઓ', 'Waste Grievance Category:': 'કચરા ફરિયાદ શ્રેણી:', 'Photo Evidence:': 'ફોટો પુરાવો:',
    'Geo Location & Pin:': 'જિયો લોકેશન અને પિન:', 'Prominent Landmark:': 'મુખ્ય સ્થળ:', 'Citizen WhatsApp Number (For Digital Receipt):': 'WhatsApp નંબર (ડિજિટલ રસીદ):',
    'Problem Description:': 'સમસ્યાનું વર્ણન:', 'Camera / Upload Photo': 'કેમેરા / ફોટો અપલોડ કરો', 'Edit Pin': 'પિન બદલો',
    'My Active Grievances': 'મારી સક્રિય ફરિયાદો', 'WhatsApp Receipt': 'WhatsApp રસીદ', 'Timeline': 'ટાઇમલાઇન', 'Submit & Trigger Automated Dispatch': 'સબમિટ કરો અને ટીમ બોલાવો',
    'Verifying & Submitting...': 'ચકાસણી અને સબમિટ થઈ રહ્યું છે...', 'Track Your Complaint': 'તમારી ફરિયાદ ટ્રેક કરો', 'Search': 'શોધો', 'Recent Tickets:': 'તાજેતરની ટિકિટ:',
    'Before Cleanup': 'સફાઈ પહેલાં', 'Cleaned & AI Verified': 'સાફ અને AI ચકાસાયેલ', 'Cleanup In Progress': 'સફાઈ ચાલુ છે', 'After-photo pending': 'પછીનો ફોટો બાકી છે',
    'Close': 'બંધ કરો', 'Cancel': 'રદ કરો', 'Confirm Location': 'સ્થાનની પુષ્ટિ કરો', 'Select Complaint Location': 'ફરિયાદનું સ્થાન પસંદ કરો',
    'Live Camera': 'લાઇવ કેમેરા', 'Upload File': 'ફાઇલ અપલોડ કરો', 'Snap Photo': 'ફોટો લો', 'Retake': 'ફરી લો', 'Use This Photo': 'આ ફોટો વાપરો',
    'Municipal Staff Login': 'મ્યુનિસિપલ સ્ટાફ લૉગિન', 'Admin Control Tower': 'એડમિન કંટ્રોલ ટાવર', 'Driver Terminal': 'ડ્રાઇવર ટર્મિનલ', 'Sign In to Admin Control Tower': 'એડમિન કંટ્રોલ ટાવરમાં લૉગિન કરો',
    'Launch Driver Field Terminal': 'ડ્રાઇવર ટર્મિનલ શરૂ કરો', 'Control Tower': 'કંટ્રોલ ટાવર', 'AI Hotspots': 'AI હોટસ્પોટ', 'Society Intel': 'સોસાયટી માહિતી', 'Analytics BI': 'એનાલિટિક્સ',
    'Pending': 'બાકી', 'Assigned': 'સોંપાયેલ', 'In Progress': 'પ્રગતિમાં', 'Resolved': 'ઉકેલાયેલ', 'Rejected': 'નકારાયેલ', 'Critical': 'ગંભીર', 'High Priority': 'ઉચ્ચ પ્રાથમિકતા',
    'Citizen App': 'નાગરિક એપ', 'WhatsApp Bot': 'WhatsApp બોટ', 'SMS Gateway': 'SMS ગેટવે', 'Pause': 'થોભો', 'Resume': 'ચાલુ કરો', 'Reset Filters': 'ફિલ્ટર રીસેટ કરો', 'Mode:': 'મોડ:', 'Smart India Hackathon (SIH 2026) — CleanCity AI Smart Waste Management System': 'સ્માર્ટ ઇન્ડિયા હેકાથોન (SIH 2026) — ક્લીનસિટી AI સ્માર્ટ વેસ્ટ મેનેજમેન્ટ સિસ્ટમ'
  }
};

// These strings are shared by the citizen flow, staff portals and every modal.
// Keeping them in the provider means a language selection made anywhere applies
// to the whole application instead of only to the landing-page components.
const universalText = {
  hi: {
    'SIH 2026 Prototype': 'SIH 2026 प्रोटोटाइप', 'CleanCity AI — Civic Waste Reporting Platform': 'क्लीनसिटी AI — नागरिक कचरा रिपोर्टिंग प्लेटफॉर्म',
    'Municipal Operations Control Tower': 'नगरपालिका संचालन कंट्रोल टावर', 'Sanitation Driver Mobile Terminal': 'स्वच्छता चालक मोबाइल टर्मिनल',
    'Admin Control Mode': 'एडमिन कंट्रोल मोड', 'Driver On Duty': 'चालक ड्यूटी पर', 'Civic Portal Active': 'नागरिक पोर्टल सक्रिय',
    'Quick': 'त्वरित', 'Karma': 'कर्म अंक', 'Switch to light mode': 'लाइट मोड चुनें', 'Switch to dark mode': 'डार्क मोड चुनें',
    'Grievance Registered & Auto-Dispatched!': 'शिकायत दर्ज हुई और टीम को भेज दी गई!',
    'View Digital WhatsApp Ticket Receipt': 'डिजिटल WhatsApp टिकट रसीद देखें', 'Track Live Status': 'लाइव स्थिति ट्रैक करें',
    'Waste Grievance': 'कचरा शिकायत', 'Overflowing Smart Bin': 'ओवरफ्लो स्मार्ट बिन', 'Illegal Roadside Dumping': 'सड़क किनारे अवैध डंपिंग',
    'Construction Debris (C&D)': 'निर्माण मलबा (C&D)', 'Hazardous / Medical Waste': 'खतरनाक / मेडिकल कचरा',
    'Dead Animal Removal': 'मृत पशु हटाना', 'Other Waste Issue': 'अन्य कचरा समस्या',
    'Municipal bin is full and spilling': 'नगरपालिका बिन भर गया है और कचरा फैल रहा है', 'Garbage dumped on open plot/street': 'खुले प्लॉट/सड़क पर कचरा फेंका गया है',
    'Cement, broken brick, rubble': 'सीमेंट, टूटी ईंट, मलबा', 'Syringes, chemicals, biohazard': 'सिरिंज, रसायन, जैव-खतरा',
    'Requires immediate sanitation team': 'तुरंत स्वच्छता टीम की आवश्यकता', 'Public litter, clogged open drain': 'सार्वजनिक कचरा, बंद खुली नाली',
    'Photo Attached & AI Verified': 'फोटो संलग्न और AI से सत्यापित', 'Please enter a brief description of the waste problem.': 'कृपया कचरे की समस्या का संक्षिप्त विवरण दें।',
    'Search any area (e.g. Saraspur), drag pin, or use Live GPS': 'कोई भी क्षेत्र खोजें, पिन खींचें या लाइव GPS का उपयोग करें',
    'Search area (e.g. Saraspur, Maninagar, Navrangpura)...': 'क्षेत्र खोजें (जैसे सरसपुर, मणिनगर, नवरंगपुरा)...',
    'Quick:': 'त्वरित:', 'Nearest Smart Bin:': 'निकटतम स्मार्ट बिन:', 'away': 'दूर', 'Use Live GPS': 'लाइव GPS उपयोग करें',
    'Smart Camera & AI Vision': 'स्मार्ट कैमरा और AI विज़न', 'Capture a clear photo for AI waste verification': 'AI कचरा सत्यापन के लिए साफ फोटो लें',
    'Upload from device': 'डिवाइस से अपलोड करें', 'Camera permission is required to capture a photo.': 'फोटो लेने के लिए कैमरा अनुमति आवश्यक है।',
    'Track Your Complaint': 'अपनी शिकायत ट्रैक करें', 'Enter your Ticket ID to check live municipal redressal': 'लाइव नगरपालिका समाधान देखने के लिए टिकट ID डालें',
    'Enter Ticket ID (e.g. SWM-2026-8951)...': 'टिकट ID डालें (जैसे SWM-2026-8951)...', 'Enter a Ticket ID to View Live Status': 'लाइव स्थिति देखने के लिए टिकट ID डालें',
    'View Complete WhatsApp Digital Ticket & Updates': 'पूरा WhatsApp डिजिटल टिकट और अपडेट देखें', 'Reported Photo': 'रिपोर्ट की गई फोटो',
    'Cleaned Photo': 'सफाई की फोटो', 'AI Verified': 'AI सत्यापित', 'AI Cleaned & Verified': 'AI द्वारा साफ और सत्यापित',
    'SLA Target': 'SLA लक्ष्य', '4-Hour Max': 'अधिकतम 4 घंटे', 'Copy WhatsApp Text': 'WhatsApp टेक्स्ट कॉपी करें',
    'Municipal Grievance Redressal': 'नगरपालिका शिकायत निवारण', 'Submitted Evidence': 'जमा किया गया प्रमाण', 'Photo Geotagged': 'फोटो जियोटैग किया गया',
    'Ticket:': 'टिकट:', 'Restricted access for City Admin & Sanitation Drivers': 'सिटी एडमिन और स्वच्छता चालकों के लिए सीमित पहुंच',
    'Demo Credentials:': 'डेमो क्रेडेंशियल:', 'Demo Quick PIN:': 'डेमो क्विक PIN:', 'Switch Driver:': 'चालक बदलें:',
    'Ticket ID & Category:': 'टिकट ID और श्रेणी:', 'Location & Landmark:': 'स्थान और लैंडमार्क:', 'Priority & SLA:': 'प्राथमिकता और SLA:',
    'ACCEPT JOB DISPATCH': 'जॉब डिस्पैच स्वीकार करें', 'Decline': 'अस्वीकार करें', 'Citizen WhatsApp Updates': 'नागरिक WhatsApp अपडेट',
    'No Active Job Assigned': 'कोई सक्रिय जॉब असाइन नहीं है', "Today's Optimized Route": 'आज का अनुकूलित मार्ग',
    'Sequenced to minimize distance & fuel usage': 'दूरी और ईंधन उपयोग कम करने के लिए क्रमबद्ध', 'Upload Cleanup Resolution Proof': 'सफाई समाधान प्रमाण अपलोड करें',
    'After Cleanup': 'सफाई के बाद', 'AI Vision: 97% Cleanliness Verification Score': 'AI विज़न: 97% स्वच्छता सत्यापन स्कोर',
    'Admin Command Center': 'एडमिन कमांड सेंटर', 'Total Reports': 'कुल रिपोर्ट', 'All Municipal Grievances': 'सभी नगरपालिका शिकायतें',
    'Click to View Unassigned': 'अनअसाइन शिकायतें देखने के लिए क्लिक करें', 'Driver Dispatched': 'चालक भेज दिया गया', 'On-Site Cleanup': 'स्थल पर सफाई',
    'AI Verified Cleaned': 'AI द्वारा सत्यापित सफाई', 'Critical SLA': 'गंभीर SLA', 'Urgent Hazard Alert': 'तत्काल खतरा अलर्ट',
    'Search by ID, Address, Citizen, Category...': 'ID, पता, नागरिक, श्रेणी से खोजें...', 'All Wards': 'सभी वार्ड', 'All Channels (App/WA/SMS)': 'सभी चैनल (ऐप/WA/SMS)',
    'Citizen Web App': 'नागरिक वेब ऐप', 'No Grievances Found in this Filter': 'इस फ़िल्टर में कोई शिकायत नहीं मिली',
    'All complaints in this category have been processed': 'इस श्रेणी की सभी शिकायतों पर कार्रवाई हो चुकी है', 'Auto-Assign Nearest Driver': 'निकटतम चालक स्वतः असाइन करें',
    'Haversine Nearest-Driver Dispatch': 'हैवरसाइन निकटतम चालक डिस्पैच', 'Calculates optimal municipal vehicle by geographical distance': 'भौगोलिक दूरी के आधार पर सर्वोत्तम नगरपालिका वाहन चुनता है',
    'Best Matched Driver (Haversine Optimized)': 'सर्वश्रेष्ठ चालक मिलान (हैवरसाइन अनुकूलित)', 'Estimated ETA:': 'अनुमानित ETA:', 'Truck Fill:': 'ट्रक भराव:',
    'Confirm & Dispatch Driver (Start 4-Hr SLA)': 'पुष्टि करें और चालक भेजें (4 घंटे SLA शुरू करें)', 'No active drivers in range.': 'सीमा में कोई सक्रिय चालक नहीं है।',
    'AI Waste Hotspot & Event Predictor': 'AI कचरा हॉटस्पॉट और घटना पूर्वानुमानक', 'Severe Overflow Hotspot (>85% Risk)': 'गंभीर ओवरफ्लो हॉटस्पॉट (>85% जोखिम)',
    'Moderate Hotspot (50-80% Risk)': 'मध्यम हॉटस्पॉट (50-80% जोखिम)', 'Healthy Smart Bin (<50% Fill)': 'स्वस्थ स्मार्ट बिन (<50% भराव)',
    'AI Surge Forecasts': 'AI वृद्धि पूर्वानुमान', 'Proactive event-based municipal recommendations': 'सक्रिय घटना-आधारित नगरपालिका सुझाव',
    'Timeframe:': 'समय-सीमा:', 'Estimated Tonnage:': 'अनुमानित टन भार:', 'Recommended Municipal Action:': 'अनुशंसित नगरपालिका कार्रवाई:',
    'Society & Apartment Waste Intelligence': 'सोसाइटी और अपार्टमेंट कचरा जानकारी', 'Predicted Weekly Waste:': 'अनुमानित साप्ताहिक कचरा:',
    'Peak Disposal Time:': 'अधिकतम निपटान समय:', 'Active Audit Status:': 'सक्रिय ऑडिट स्थिति:',
    'Actionable Municipal BI & Analytics': 'कार्रवाई योग्य नगरपालिका BI और एनालिटिक्स', 'Daily Solid Waste Cleared': 'रोज़ साफ किया गया ठोस कचरा',
    'Average SLA Resolution Time': 'औसत SLA समाधान समय', 'AI Verification Accuracy': 'AI सत्यापन सटीकता', 'Fleet Fuel Saved (Haversine)': 'बेड़े का बचाया ईंधन (हैवरसाइन)',
    'Tonnage / Day': 'टन भार / दिन', 'Grievance Category Breakdown': 'शिकायत श्रेणी विभाजन', 'Comparing actual hours vs 4.0 hour municipal deadline': 'वास्तविक समय और 4 घंटे की नगरपालिका समय-सीमा की तुलना'
  },
  gu: {
    'SIH 2026 Prototype': 'SIH 2026 પ્રોટોટાઇપ', 'CleanCity AI — Civic Waste Reporting Platform': 'ક્લીનસિટી AI — નાગરિક કચરો રિપોર્ટિંગ પ્લેટફોર્મ',
    'Municipal Operations Control Tower': 'મ્યુનિસિપલ ઓપરેશન્સ કંટ્રોલ ટાવર', 'Sanitation Driver Mobile Terminal': 'સ્વચ્છતા ડ્રાઇવર મોબાઇલ ટર્મિનલ',
    'Admin Control Mode': 'એડમિન કંટ્રોલ મોડ', 'Driver On Duty': 'ડ્રાઇવર ડ્યુટી પર', 'Civic Portal Active': 'નાગરિક પોર્ટલ સક્રિય',
    'Quick': 'ઝડપી', 'Karma': 'કર્મ પોઇન્ટ', 'Switch to light mode': 'લાઇટ મોડ ચાલુ કરો', 'Switch to dark mode': 'ડાર્ક મોડ ચાલુ કરો',
    'Grievance Registered & Auto-Dispatched!': 'ફરિયાદ નોંધાઈ અને ટીમને મોકલવામાં આવી!', 'View Digital WhatsApp Ticket Receipt': 'ડિજિટલ WhatsApp ટિકિટ રસીદ જુઓ',
    'Track Live Status': 'લાઇવ સ્થિતિ ટ્રેક કરો', 'Waste Grievance': 'કચરા ફરિયાદ', 'Overflowing Smart Bin': 'ઓવરફ્લો સ્માર્ટ બિન',
    'Illegal Roadside Dumping': 'રસ્તા કિનારે ગેરકાયદે ડમ્પિંગ', 'Construction Debris (C&D)': 'બાંધકામનો કાટમાળ (C&D)',
    'Hazardous / Medical Waste': 'જોખમી / મેડિકલ કચરો', 'Dead Animal Removal': 'મૃત પશુ દૂર કરવું', 'Other Waste Issue': 'અન્ય કચરા સમસ્યા',
    'Municipal bin is full and spilling': 'મ્યુનિસિપલ બિન ભરાઈ ગયો છે અને કચરો ફેલાઈ રહ્યો છે', 'Garbage dumped on open plot/street': 'ખુલ્લા પ્લોટ/રસ્તા પર કચરો નાખવામાં આવ્યો છે',
    'Cement, broken brick, rubble': 'સિમેન્ટ, તૂટેલી ઈંટ, કાટમાળ', 'Syringes, chemicals, biohazard': 'સીરિન્જ, રસાયણો, બાયો-હેઝાર્ડ',
    'Requires immediate sanitation team': 'તાત્કાલિક સ્વચ્છતા ટીમ જરૂરી છે', 'Public litter, clogged open drain': 'જાહેર કચરો, ભરાયેલી ખુલ્લી ગટર',
    'Photo Attached & AI Verified': 'ફોટો જોડાયેલ અને AI ચકાસાયેલ', 'Please enter a brief description of the waste problem.': 'કૃપા કરીને કચરા સમસ્યાનું ટૂંકું વર્ણન આપો।',
    'Search any area (e.g. Saraspur), drag pin, or use Live GPS': 'કોઈ વિસ્તાર શોધો, પિન ખેંચો અથવા લાઇવ GPS વાપરો',
    'Search area (e.g. Saraspur, Maninagar, Navrangpura)...': 'વિસ્તાર શોધો (જેમ કે સરસપુર, મણિનગર, નવરંગપુરા)...',
    'Quick:': 'ઝડપી:', 'Nearest Smart Bin:': 'નજીકનો સ્માર્ટ બિન:', 'away': 'દૂર', 'Use Live GPS': 'લાઇવ GPS વાપરો',
    'Smart Camera & AI Vision': 'સ્માર્ટ કેમેરા અને AI વિઝન', 'Capture a clear photo for AI waste verification': 'AI કચરા ચકાસણી માટે સ્પષ્ટ ફોટો લો',
    'Upload from device': 'ડિવાઇસમાંથી અપલોડ કરો', 'Camera permission is required to capture a photo.': 'ફોટો લેવા માટે કેમેરા પરવાનગી જરૂરી છે।',
    'Track Your Complaint': 'તમારી ફરિયાદ ટ્રેક કરો', 'Enter your Ticket ID to check live municipal redressal': 'લાઇવ મ્યુનિસિપલ ઉકેલ જોવા ટિકિટ ID નાખો',
    'Enter Ticket ID (e.g. SWM-2026-8951)...': 'ટિકિટ ID નાખો (જેમ કે SWM-2026-8951)...', 'Enter a Ticket ID to View Live Status': 'લાઇવ સ્થિતિ જોવા ટિકિટ ID નાખો',
    'View Complete WhatsApp Digital Ticket & Updates': 'સંપૂર્ણ WhatsApp ડિજિટલ ટિકિટ અને અપડેટ જુઓ', 'Reported Photo': 'રિપોર્ટ કરેલો ફોટો',
    'Cleaned Photo': 'સફાઈનો ફોટો', 'AI Verified': 'AI ચકાસાયેલ', 'AI Cleaned & Verified': 'AI દ્વારા સાફ અને ચકાસાયેલ',
    'SLA Target': 'SLA લક્ષ્ય', '4-Hour Max': 'મહત્તમ 4 કલાક', 'Copy WhatsApp Text': 'WhatsApp ટેક્સ્ટ કૉપી કરો',
    'Municipal Grievance Redressal': 'મ્યુનિસિપલ ફરિયાદ નિવારણ', 'Submitted Evidence': 'જમા કરેલો પુરાવો', 'Photo Geotagged': 'ફોટો જિયોટેગ કરેલો', 'Ticket:': 'ટિકિટ:',
    'Restricted access for City Admin & Sanitation Drivers': 'સિટી એડમિન અને સ્વચ્છતા ડ્રાઇવરો માટે મર્યાદિત ઍક્સેસ',
    'Demo Credentials:': 'ડેમો ઓળખપત્રો:', 'Demo Quick PIN:': 'ડેમો ક્વિક PIN:', 'Switch Driver:': 'ડ્રાઇવર બદલો:',
    'Ticket ID & Category:': 'ટિકિટ ID અને શ્રેણી:', 'Location & Landmark:': 'સ્થાન અને લૅન્ડમાર્ક:', 'Priority & SLA:': 'પ્રાથમિકતા અને SLA:',
    'ACCEPT JOB DISPATCH': 'જોબ ડિસ્પેચ સ્વીકારો', 'Decline': 'નકારો', 'Citizen WhatsApp Updates': 'નાગરિક WhatsApp અપડેટ',
    'No Active Job Assigned': 'કોઈ સક્રિય જોબ સોંપાયેલ નથી', "Today's Optimized Route": 'આજનો અનુકૂળ માર્ગ',
    'Sequenced to minimize distance & fuel usage': 'અંતર અને ઇંધણનો ઉપયોગ ઘટાડવા ક્રમબદ્ધ', 'Upload Cleanup Resolution Proof': 'સફાઈ ઉકેલનો પુરાવો અપલોડ કરો',
    'After Cleanup': 'સફાઈ પછી', 'AI Vision: 97% Cleanliness Verification Score': 'AI વિઝન: 97% સ્વચ્છતા ચકાસણી સ્કોર',
    'Admin Command Center': 'એડમિન કમાન્ડ સેન્ટર', 'Total Reports': 'કુલ રિપોર્ટ', 'All Municipal Grievances': 'તમામ મ્યુનિસિપલ ફરિયાદો',
    'Click to View Unassigned': 'અસાઇન ન થયેલી ફરિયાદો જોવા ક્લિક કરો', 'Driver Dispatched': 'ડ્રાઇવર મોકલ્યો', 'On-Site Cleanup': 'સ્થળ પર સફાઈ',
    'AI Verified Cleaned': 'AI દ્વારા ચકાસાયેલ સફાઈ', 'Critical SLA': 'ગંભીર SLA', 'Urgent Hazard Alert': 'તાત્કાલિક જોખમ ચેતવણી',
    'Search by ID, Address, Citizen, Category...': 'ID, સરનામું, નાગરિક, શ્રેણીથી શોધો...', 'All Wards': 'તમામ વોર્ડ', 'All Channels (App/WA/SMS)': 'તમામ ચેનલ (એપ/WA/SMS)',
    'Citizen Web App': 'નાગરિક વેબ એપ', 'No Grievances Found in this Filter': 'આ ફિલ્ટરમાં કોઈ ફરિયાદ મળી નથી',
    'All complaints in this category have been processed': 'આ શ્રેણીની તમામ ફરિયાદો પર કાર્યવાહી થઈ ગઈ છે', 'Auto-Assign Nearest Driver': 'નજીકના ડ્રાઇવરને આપમેળે સોંપો',
    'Haversine Nearest-Driver Dispatch': 'હેવરસાઇન નજીકના ડ્રાઇવર ડિસ્પેચ', 'Calculates optimal municipal vehicle by geographical distance': 'ભૌગોલિક અંતરના આધારે શ્રેષ્ઠ મ્યુનિસિપલ વાહન પસંદ કરે છે',
    'Best Matched Driver (Haversine Optimized)': 'શ્રેષ્ઠ ડ્રાઇવર મેળ (હેવરસાઇન અનુકૂળિત)', 'Estimated ETA:': 'અંદાજિત ETA:', 'Truck Fill:': 'ટ્રક ભરાવ:',
    'Confirm & Dispatch Driver (Start 4-Hr SLA)': 'પુષ્ટિ કરો અને ડ્રાઇવર મોકલો (4 કલાક SLA શરૂ કરો)', 'No active drivers in range.': 'રેન્જમાં કોઈ સક્રિય ડ્રાઇવર નથી।',
    'AI Waste Hotspot & Event Predictor': 'AI કચરા હોટસ્પોટ અને ઇવેન્ટ પ્રેડિક્ટર', 'Severe Overflow Hotspot (>85% Risk)': 'ગંભીર ઓવરફ્લો હોટસ્પોટ (>85% જોખમ)',
    'Moderate Hotspot (50-80% Risk)': 'મધ્યમ હોટસ્પોટ (50-80% જોખમ)', 'Healthy Smart Bin (<50% Fill)': 'સ્વસ્થ સ્માર્ટ બિન (<50% ભરાવ)',
    'AI Surge Forecasts': 'AI વૃદ્ધિ પૂર્વાનુમાન', 'Proactive event-based municipal recommendations': 'સક્રિય ઇવેન્ટ આધારિત મ્યુનિસિપલ ભલામણો',
    'Timeframe:': 'સમયમર્યાદા:', 'Estimated Tonnage:': 'અંદાજિત ટન ભાર:', 'Recommended Municipal Action:': 'ભલામણ કરેલ મ્યુનિસિપલ કાર્યવાહી:',
    'Society & Apartment Waste Intelligence': 'સોસાયટી અને એપાર્ટમેન્ટ કચરા માહિતી', 'Predicted Weekly Waste:': 'અંદાજિત સાપ્તાહિક કચરો:',
    'Peak Disposal Time:': 'મહત્તમ નિકાલ સમય:', 'Active Audit Status:': 'સક્રિય ઓડિટ સ્થિતિ:',
    'Actionable Municipal BI & Analytics': 'કાર્યક્ષમ મ્યુનિસિપલ BI અને એનાલિટિક્સ', 'Daily Solid Waste Cleared': 'દરરોજ સાફ કરેલો ઘન કચરો',
    'Average SLA Resolution Time': 'સરેરાશ SLA ઉકેલ સમય', 'AI Verification Accuracy': 'AI ચકાસણી ચોકસાઈ', 'Fleet Fuel Saved (Haversine)': 'બચાવેલું ફ્લીટ ઇંધણ (હેવરસાઇન)',
    'Tonnage / Day': 'ટન ભાર / દિવસ', 'Grievance Category Breakdown': 'ફરિયાદ શ્રેણી વિભાજન', 'Comparing actual hours vs 4.0 hour municipal deadline': 'વાસ્તવિક કલાકો અને 4 કલાકની મ્યુનિસિપલ સમયમર્યાદાની સરખામણી'
  }
};

Object.assign(globalText.hi, universalText.hi);
Object.assign(globalText.gu, universalText.gu);

// Numbered labels are rendered as one text node in the complaint form.
Object.assign(globalText.hi, {
  'Duplicate report found': 'डुप्लिकेट रिपोर्ट मिली', 'This image was already submitted. Both reports were merged into one ticket.': 'यह फोटो पहले जमा हो चुकी है। दोनों रिपोर्ट एक टिकट में जोड़ दी गई हैं।',
  'submissions merged': 'सबमिशन जोड़ी गईं', 'Track Existing Report': 'मौजूदा रिपोर्ट ट्रैक करें', 'Close duplicate report': 'डुप्लिकेट रिपोर्ट बंद करें',
  '1. Waste Grievance Category:': '1. कचरा शिकायत श्रेणी:', '2. Photo Evidence:': '2. फोटो प्रमाण:',
  '3. Geo Location & Pin:': '3. जियो लोकेशन और पिन:', '4. Prominent Landmark:': '4. मुख्य स्थान:',
  '5. Citizen WhatsApp Number (For Digital Receipt):': '5. नागरिक WhatsApp नंबर (डिजिटल रसीद के लिए):',
  '6. Problem Description:': '6. समस्या का विवरण:', 'Automated 4-Hr Dispatch': '4 घंटे ऑटो-डिस्पैच',
  'Describe the waste problem (e.g. Bin has been overflowing since 2 days, foul odor spilling over footpath)...': 'कचरे की समस्या बताएं (जैसे बिन 2 दिन से भर रहा है और फुटपाथ पर बदबू फैल रही है)...',
  'e.g. Opposite Gate #2, Near Tea Stall': 'जैसे गेट #2 के सामने, चाय की दुकान के पास'
});
Object.assign(globalText.gu, {
  'Duplicate report found': 'ડુપ્લિકેટ રિપોર્ટ મળી', 'This image was already submitted. Both reports were merged into one ticket.': 'આ ફોટો અગાઉ સબમિટ થયો છે. બંને રિપોર્ટ એક ટિકિટમાં જોડવામાં આવી છે.',
  'submissions merged': 'સબમિશન જોડાઈ', 'Track Existing Report': 'હાલની રિપોર્ટ ટ્રેક કરો', 'Close duplicate report': 'ડુપ્લિકેટ રિપોર્ટ બંધ કરો',
  '1. Waste Grievance Category:': '1. કચરા ફરિયાદ શ્રેણી:', '2. Photo Evidence:': '2. ફોટો પુરાવો:',
  '3. Geo Location & Pin:': '3. જિયો લોકેશન અને પિન:', '4. Prominent Landmark:': '4. મુખ્ય સ્થળ:',
  '5. Citizen WhatsApp Number (For Digital Receipt):': '5. નાગરિક WhatsApp નંબર (ડિજિટલ રસીદ માટે):',
  '6. Problem Description:': '6. સમસ્યાનું વર્ણન:', 'Automated 4-Hr Dispatch': '4 કલાક ઓટો-ડિસ્પેચ',
  'Describe the waste problem (e.g. Bin has been overflowing since 2 days, foul odor spilling over footpath)...': 'કચરાની સમસ્યા વર્ણવો (જેમ કે બિન 2 દિવસથી ભરાઈ રહ્યો છે અને ફૂટપાથ પર દુર્ગંધ ફેલાય છે)...',
  'e.g. Opposite Gate #2, Near Tea Stall': 'જેમ કે ગેટ #2 સામે, ચાની દુકાન પાસે'
});

// Portal-specific labels, filters and status copy.  These are intentionally
// exact UI strings so the same selection works in citizen, admin and driver
// views, including screens that mount after a language has already been chosen.
Object.assign(globalText.hi, {
  'All City Wards': 'सभी शहर वार्ड', 'All Intake Channels': 'सभी इनटेक चैनल', 'AI Auto-Dispatching...': 'AI स्वतः डिस्पैच कर रहा है...',
  'WhatsApp Thread': 'WhatsApp वार्तालाप', 'Override Dispatch': 'डिस्पैच बदलें', 'Sanitation Compactor Vehicles': 'स्वच्छता कॉम्पैक्टर वाहन',
  'Active Citizen Grievances': 'सक्रिय नागरिक शिकायतें', 'IoT Smart Bins': 'IoT स्मार्ट बिन', 'Reported': 'रिपोर्ट की गई',
  'Auto-Searching': 'स्वतः खोज जारी', 'Matching Driver': 'चालक खोजा जा रहा है', 'Assigned / En Route': 'असाइन / रास्ते में',
  'Fresh Ingestion': 'नई प्राप्ति', 'All Municipal Reports': 'सभी नगरपालिका रिपोर्ट', 'Search Ticket ID, citizen, landmark...': 'टिकट ID, नागरिक, लैंडमार्क खोजें...',
  'All Channels': 'सभी चैनल', 'Operations': 'संचालन', 'Live Map': 'लाइव मैप', 'Map View': 'मैप दृश्य',
  'Switch Driver:': 'चालक बदलें:', '4-Hour SLA Kickoff': '4 घंटे SLA शुरू', 'Start Navigation': 'नेविगेशन शुरू करें',
  'Start Cleanup': 'सफाई शुरू करें', 'Complete Cleanup': 'सफाई पूरी करें', 'Upload Proof': 'प्रमाण अपलोड करें',
  'Live Fleet Tracking': 'लाइव बेड़ा ट्रैकिंग', 'Driver Location': 'चालक का स्थान', 'Current Job': 'वर्तमान जॉब',
  'Rapido/Uber-Style Fleet Radar': 'रैपिडो/उबर-शैली बेड़ा रडार', 'Active Route:': 'सक्रिय मार्ग:', 'Speed:': 'गति:',
  'Truck Fill Level:': 'ट्रक भराव स्तर:', 'Estimated Arrival': 'अनुमानित आगमन', 'Active Municipal Fleet': 'सक्रिय नगरपालिका बेड़ा',
  'Route Stops Sequence': 'रूट स्टॉप क्रम', 'Pause Simulation': 'सिमुलेशन रोकें', 'Resume Simulation': 'सिमुलेशन शुरू करें',
  'Waste Hotspot Zone': 'कचरा हॉटस्पॉट ज़ोन', 'Density:': 'घनत्व:', 'Predicted Spillage Radius:': 'अनुमानित फैलाव त्रिज्या:',
  'Code:': 'कोड:', 'Fill Level:': 'भराव स्तर:', 'Battery:': 'बैटरी:', 'Vehicle:': 'वाहन:', 'Capacity:': 'क्षमता:', 'Status:': 'स्थिति:',
  'Address:': 'पता:', 'Active': 'सक्रिय', 'Available': 'उपलब्ध', 'Busy': 'व्यस्त', 'On Route': 'मार्ग पर',
  'High (Market Spike)': 'उच्च (बाज़ार वृद्धि)', 'Severe (Weekend Crowd)': 'गंभीर (सप्ताहांत भीड़)', 'Medium (Food Street)': 'मध्यम (फूड स्ट्रीट)', 'Moderate (Commercial)': 'मध्यम (व्यावसायिक)',
  'Total': 'कुल', 'Mins': 'मिनट', 'Hours': 'घंटे', 'Tons': 'टन', 'Litres': 'लीटर',
  'Daily Solid Waste Cleared': 'दैनिक साफ ठोस कचरा', 'Average SLA Resolution Time': 'औसत SLA समाधान समय',
  'AI Verification Accuracy': 'AI सत्यापन सटीकता', 'Fleet Fuel Saved (Haversine)': 'बेड़े का बचा ईंधन (हैवरसाइन)',
  'Actionable Municipal BI & Analytics': 'नगरपालिका BI और एनालिटिक्स', 'Grievance Category Breakdown': 'शिकायत श्रेणी विवरण',
  'Waste Collected': 'एकत्र कचरा', 'Resolution Time': 'समाधान समय', 'Verification': 'सत्यापन',
  'Light': 'लाइट', 'Dark': 'डार्क', 'Search': 'खोजें', 'Filter': 'फ़िल्टर', 'Clear': 'साफ करें'
});
Object.assign(globalText.gu, {
  'All City Wards': 'તમામ શહેર વોર્ડ', 'All Intake Channels': 'તમામ ઇનટેક ચેનલ', 'AI Auto-Dispatching...': 'AI આપમેળે ડિસ્પેચ કરી રહ્યું છે...',
  'WhatsApp Thread': 'WhatsApp વાતચીત', 'Override Dispatch': 'ડિસ્પેચ બદલો', 'Sanitation Compactor Vehicles': 'સ્વચ્છતા કોમ્પેક્ટર વાહનો',
  'Active Citizen Grievances': 'સક્રિય નાગરિક ફરિયાદો', 'IoT Smart Bins': 'IoT સ્માર્ટ બિન', 'Reported': 'રિપોર્ટ કરેલ',
  'Auto-Searching': 'આપમેળે શોધ ચાલુ', 'Matching Driver': 'ડ્રાઇવર શોધી રહ્યો છે', 'Assigned / En Route': 'સોંપેલ / માર્ગમાં',
  'Fresh Ingestion': 'નવી પ્રાપ્તી', 'All Municipal Reports': 'તમામ મ્યુનિસિપલ રિપોર્ટ', 'Search Ticket ID, citizen, landmark...': 'ટિકિટ ID, નાગરિક, લૅન્ડમાર્ક શોધો...',
  'All Channels': 'તમામ ચેનલ', 'Operations': 'સંચાલન', 'Live Map': 'લાઇવ મેપ', 'Map View': 'મેપ વ્યૂ',
  'Switch Driver:': 'ડ્રાઇવર બદલો:', '4-Hour SLA Kickoff': '4 કલાક SLA શરૂ', 'Start Navigation': 'નેવિગેશન શરૂ કરો',
  'Start Cleanup': 'સફાઈ શરૂ કરો', 'Complete Cleanup': 'સફાઈ પૂર્ણ કરો', 'Upload Proof': 'પુરાવો અપલોડ કરો',
  'Live Fleet Tracking': 'લાઇવ ફ્લીટ ટ્રેકિંગ', 'Driver Location': 'ડ્રાઇવરનું સ્થાન', 'Current Job': 'વર્તમાન જોબ',
  'Rapido/Uber-Style Fleet Radar': 'રૅપિડો/ઉબર-સ્ટાઇલ ફ્લીટ રડાર', 'Active Route:': 'સક્રિય માર્ગ:', 'Speed:': 'ઝડપ:',
  'Truck Fill Level:': 'ટ્રક ભરાવ સ્તર:', 'Estimated Arrival': 'અંદાજિત આગમન', 'Active Municipal Fleet': 'સક્રિય મ્યુનિસિપલ ફ્લીટ',
  'Route Stops Sequence': 'રૂટ સ્ટોપ ક્રમ', 'Pause Simulation': 'સિમ્યુલેશન થોભાવો', 'Resume Simulation': 'સિમ્યુલેશન ચાલુ કરો',
  'Waste Hotspot Zone': 'કચરા હોટસ્પોટ ઝોન', 'Density:': 'ઘનતા:', 'Predicted Spillage Radius:': 'અંદાજિત ફેલાવાની ત્રિજ્યા:',
  'Code:': 'કોડ:', 'Fill Level:': 'ભરાવ સ્તર:', 'Battery:': 'બેટરી:', 'Vehicle:': 'વાહન:', 'Capacity:': 'ક્ષમતા:', 'Status:': 'સ્થિતિ:',
  'Address:': 'સરનામું:', 'Active': 'સક્રિય', 'Available': 'ઉપલબ્ધ', 'Busy': 'વ્યસ્ત', 'On Route': 'માર્ગ પર',
  'High (Market Spike)': 'ઉચ્ચ (બજાર વધારો)', 'Severe (Weekend Crowd)': 'ગંભીર (સપ્તાહાંત ભીડ)', 'Medium (Food Street)': 'મધ્યમ (ફૂડ સ્ટ્રીટ)', 'Moderate (Commercial)': 'મધ્યમ (વ્યાવસાયિક)',
  'Total': 'કુલ', 'Mins': 'મિનિટ', 'Hours': 'કલાક', 'Tons': 'ટન', 'Litres': 'લિટર',
  'Daily Solid Waste Cleared': 'દરરોજ સાફ કરેલો ઘન કચરો', 'Average SLA Resolution Time': 'સરેરાશ SLA ઉકેલ સમય',
  'AI Verification Accuracy': 'AI ચકાસણી ચોકસાઈ', 'Fleet Fuel Saved (Haversine)': 'બચાવેલું ફ્લીટ ઇંધણ (હેવરસાઇન)',
  'Actionable Municipal BI & Analytics': 'મ્યુનિસિપલ BI અને એનાલિટિક્સ', 'Grievance Category Breakdown': 'ફરિયાદ શ્રેણી વિગતો',
  'Waste Collected': 'એકત્ર કચરો', 'Resolution Time': 'ઉકેલ સમય', 'Verification': 'ચકાસણી',
  'Light': 'લાઇટ', 'Dark': 'ડાર્ક', 'Search': 'શોધો', 'Filter': 'ફિલ્ટર', 'Clear': 'સાફ કરો'
});

Object.assign(globalText.hi, {
  'Capture or upload photo for instant verification': 'तुरंत सत्यापन के लिए फोटो लें या अपलोड करें',
  'No Photo Selected': 'कोई फोटो नहीं चुनी गई', 'Start live camera, upload an image, or click any preset below': 'लाइव कैमरा शुरू करें, फोटो अपलोड करें या नीचे कोई नमूना चुनें',
  'OR CHOOSE HACKATHON DEMO SAMPLE PHOTO:': 'या हैकाथॉन डेमो नमूना फोटो चुनें:', 'Overflowing Bin (Market)': 'ओवरफ्लो बिन (बाज़ार)',
  'Overflowing Bin': 'ओवरफ्लो बिन', 'Illegal Plastic Dump': 'अवैध प्लास्टिक डंप', 'Single-Use Plastics': 'सिंगल-यूज़ प्लास्टिक',
  'Construction Debris': 'निर्माण मलबा', 'C&D Debris': 'C&D मलबा', 'Medical / Hazardous Waste': 'मेडिकल / खतरनाक कचरा', 'Hazardous / Clinical': 'खतरनाक / क्लिनिकल'
});
Object.assign(globalText.gu, {
  'Capture or upload photo for instant verification': 'તાત્કાલિક ચકાસણી માટે ફોટો લો અથવા અપલોડ કરો',
  'No Photo Selected': 'કોઈ ફોટો પસંદ કર્યો નથી', 'Start live camera, upload an image, or click any preset below': 'લાઇવ કેમેરા શરૂ કરો, ફોટો અપલોડ કરો અથવા નીચે નમૂનો પસંદ કરો',
  'OR CHOOSE HACKATHON DEMO SAMPLE PHOTO:': 'અથવા હેકાથોન ડેમો નમૂનાનો ફોટો પસંદ કરો:', 'Overflowing Bin (Market)': 'ઓવરફ્લો બિન (બજાર)',
  'Overflowing Bin': 'ઓવરફ્લો બિન', 'Illegal Plastic Dump': 'ગેરકાયદે પ્લાસ્ટિક ડમ્પ', 'Single-Use Plastics': 'સિંગલ-યૂઝ પ્લાસ્ટિક',
  'Construction Debris': 'બાંધકામનો કાટમાળ', 'C&D Debris': 'C&D કાટમાળ', 'Medical / Hazardous Waste': 'મેડિકલ / જોખમી કચરો', 'Hazardous / Clinical': 'જોખમી / ક્લિનિકલ'
});

Object.assign(globalText.hi, {
  'Total': 'कुल', 'REPORTED': 'रिपोर्ट की गई', 'SEARCHING_DRIVER': 'चालक खोज जारी', 'ON_THE_WAY': 'रास्ते में',
  'Overflowing Municipal Bin': 'ओवरफ्लो नगरपालिका बिन', 'Construction & Demolition Debris': 'निर्माण मलबा',
  'Bio-Hazardous Waste Spillage': 'जैव-खतरनाक कचरा फैलाव', 'Community Bin Cleared': 'सामुदायिक बिन साफ',
  'Citizen Web App': 'नागरिक वेब ऐप', 'AI Vision Verified': 'AI विज़न सत्यापित', 'Open complaints': 'खुली शिकायतें',
  'Avg. response': 'औसत प्रतिक्रिया', 'Inside target SLA': 'SLA लक्ष्य के अंदर', 'Priority queue': 'प्राथमिकता सूची'
});
Object.assign(globalText.gu, {
  'Total': 'કુલ', 'REPORTED': 'રિપોર્ટ કરેલ', 'SEARCHING_DRIVER': 'ડ્રાઇવર શોધ ચાલુ', 'ON_THE_WAY': 'માર્ગમાં',
  'Overflowing Municipal Bin': 'ઓવરફ્લો મ્યુનિસિપલ બિન', 'Construction & Demolition Debris': 'બાંધકામનો કાટમાળ',
  'Bio-Hazardous Waste Spillage': 'બાયો-હેઝાર્ડ કચરો ફેલાવો', 'Community Bin Cleared': 'સામુદાયિક બિન સાફ',
  'Citizen Web App': 'નાગરિક વેબ એપ', 'AI Vision Verified': 'AI વિઝન ચકાસાયેલ', 'Open complaints': 'ચાલુ ફરિયાદો',
  'Avg. response': 'સરેરાશ પ્રતિસાદ', 'Inside target SLA': 'SLA લક્ષ્યમાં', 'Priority queue': 'પ્રાથમિકતા કતાર'
});

const originalNodes = new WeakMap();
const originalAttributes = new WeakMap();

function localizeDocument(language) {
  const replacements = globalText[language] || {};
  const localizeText = (node) => {
    if (!node.textContent?.trim()) return;
    const savedOriginal = originalNodes.get(node);
    const original = savedOriginal || node.textContent;
    const trimmed = original.trim();
    const translated = replacements[trimmed] || Object.keys(replacements)
      .filter((key) => key && trimmed.includes(key))
      .sort((first, second) => second.length - first.length)
      .reduce((value, key) => value.replaceAll(key, replacements[key]), trimmed);

    // Cache only strings that actually have a translation. This prevents a
    // changing value such as a clock, count, map value or ticket id from being
    // restored to an old value when React updates it.
    if ((!translated || translated === trimmed) && !savedOriginal) return;
    const nextText = original.replace(trimmed, translated || trimmed);
    if (translated) originalNodes.set(node, original);
    if (node.textContent !== nextText) node.textContent = nextText;
  };

  const localizeElement = (element) => {
    ['placeholder', 'title', 'aria-label'].forEach((attribute) => {
      if (!element.hasAttribute(attribute)) return;
      const saved = originalAttributes.get(element)?.[attribute];
      const original = saved || element.getAttribute(attribute);
      const translated = replacements[original];
      if (!translated && !saved) return;
      originalAttributes.set(element, { ...(originalAttributes.get(element) || {}), [attribute]: original });
      if (element.getAttribute(attribute) !== (translated || original)) element.setAttribute(attribute, translated || original);
    });
    element.childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) localizeText(node);
    });
  };

  const localizeTree = (root) => {
    if (root.nodeType === Node.TEXT_NODE) {
      localizeText(root);
      return;
    }
    if (root.nodeType !== Node.ELEMENT_NODE) return;
    localizeElement(root);
    root.querySelectorAll('*').forEach(localizeElement);
  };

  // A full pass only happens when the user explicitly changes language.
  localizeTree(document.body);
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'characterData') localizeText(mutation.target);
      if (mutation.type === 'attributes') localizeElement(mutation.target);
      if (mutation.type === 'childList') mutation.addedNodes.forEach(localizeTree);
    });
  });
  observer.observe(document.body, { childList: true, characterData: true, subtree: true, attributes: true, attributeFilter: ['placeholder', 'title', 'aria-label'] });
  return () => observer.disconnect();
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => localStorage.getItem('cleancity-language') || 'en');
  const setLanguage = (nextLanguage) => {
    setLanguageState(nextLanguage);
    localStorage.setItem('cleancity-language', nextLanguage);
  };
  const value = useMemo(() => ({
    language,
    setLanguage,
    t: translations[language],
    // Use this for labels assembled from data or state (for example complaint
    // categories), where React would otherwise overwrite a translated text node.
    translate: (text) => globalText[language]?.[text] || text
  }), [language]);
  useEffect(() => {
    document.documentElement.lang = language;
    return localizeDocument(language);
  }, [language]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}
