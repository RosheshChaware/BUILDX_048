'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  UserX,
  Eye,
  Shield,
  MapPin,
  Search,
  Languages,
  PhoneCall,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  Radio,
  ArrowRight,
} from 'lucide-react';
import { useSuraksha } from '@/hooks/useSuraksha';

const CONTENT = {
  EN: {
    heroTitle: 'Deekshabhoomi Citizen Safety Portal',
    heroSub: 'How can we help you right now? Official emergency assistance & citizen services.',
    sosBadge: 'ONE-TOUCH EMERGENCY',
    sosTitle: 'EMERGENCY SOS',
    sosSub: 'Instant Police, Medical, or Fire rescue team dispatch to your location',
    actionMissing: 'Report Missing Person',
    actionMissingSub: 'Lost child, wandering elderly, or adult in crowd',
    actionSighting: 'Report Sighting',
    actionSightingSub: 'Did you spot a missing person or person of interest?',
    actionSecurity: 'Report Security Incident',
    actionSecuritySub: 'Chain snatching, theft, harassment, or lost item',
    actionHelpDesk: 'Find Nearest Help Desk',
    actionHelpDeskSub: '10 on-site assistance desks across all 4 gates',
    actionMap: 'Live Safety Map',
    actionMapSub: 'View exits, water stations, and medical triage points',
    trackTitle: 'Track My Incident Report',
    trackPlaceholder: 'Enter Incident ID (e.g. INC-2048)...',
    trackButton: 'Search Status',
    helplinesTitle: 'Emergency Helpline Numbers',
    policeHelpline: 'Nagpur Police Control: 112 / 100',
    deekshabhoomiControl: 'Deekshabhoomi Admin Desk: +91 712 256 0101',
    ambulanceHelpline: 'Medical Ambulance: 108',
    womenHelpline: 'Women Damini Helpline: 1091',
  },
  HI: {
    heroTitle: 'दीक्षाभूमि नागरिक सुरक्षा सहायता पोर्टल',
    heroSub: 'हम आपकी क्या सहायता कर सकते हैं? आधिकारिक आपातकालीन सहायता एवं नागरिक सेवाएँ।',
    sosBadge: 'आपातकालीन सहायता',
    sosTitle: 'आपातकालीन एसओएस (SOS)',
    sosSub: 'तुरंत पुलिस, एम्बुलेंस या बचाव दल सहायता प्राप्त करें',
    actionMissing: 'लापता व्यक्ति की रिपोर्ट करें',
    actionMissingSub: 'लापता बच्चा, बुजुर्ग या वयस्क की सूचना दें',
    actionSighting: 'लापता व्यक्ति देखने की सूचना दें',
    actionSightingSub: 'क्या आपने किसी लापता बच्चे या बुजुर्ग को देखा?',
    actionSecurity: 'सुरक्षा / चोरी की शिकायत करें',
    actionSecuritySub: 'चेन स्नैचिंग, चोरी, छेड़छाड़ या खोया सामान',
    actionHelpDesk: 'नजदीकी सहायता केंद्र खोजें',
    actionHelpDeskSub: 'सभी 4 द्वारों पर 10 सहायता केंद्र उपलब्ध हैं',
    actionMap: 'लाइव सुरक्षा मानचित्र',
    actionMapSub: 'निकास द्वार, पेयजल स्टॉल व प्राथमिक चिकित्सा केंद्र',
    trackTitle: 'शिकायत की स्थिति जांचें',
    trackPlaceholder: 'इंसिडेंट आईडी दर्ज करें (उदा. INC-2048)...',
    trackButton: 'स्थिति देखें',
    helplinesTitle: 'आपातकालीन हेल्पलाइन नंबर',
    policeHelpline: 'नागपुर पुलिस नियंत्रण कक्ष: 112 / 100',
    deekshabhoomiControl: 'दीक्षाभूमि सुरक्षा डेस्क: +91 712 256 0101',
    ambulanceHelpline: 'एम्बुलेंस सहायता: 108',
    womenHelpline: 'महिला दामिनी हेल्पलाइन: 1091',
  },
};

export default function CitizenPortalPage() {
  const [lang, setLang] = useState<'EN' | 'HI'>('EN');
  const [trackQuery, setTrackQuery] = useState('');
  const [searched, setSearched] = useState(false);
  const [trackResult, setTrackResult] = useState<any>(null);

  const { state } = useSuraksha();
  const t = CONTENT[lang];

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    const q = trackQuery.trim().toUpperCase();
    const found = state.incidents.find((i) => i.id.toUpperCase() === q);
    setTrackResult(found || null);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-16 w-full">
      {/* Citizen Sub-Header with Language Toggle */}
      <div className="w-full border-b border-slate-200 bg-white shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-600 flex items-center justify-center font-bold text-white shadow-xs">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-extrabold text-sm text-slate-900 flex items-center tracking-tight">
                SECURE<span className="text-cyan-600">MESH</span>
                <span className="ml-2 px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-cyan-50 text-cyan-700 border border-cyan-200">
                  CITIZEN DESK
                </span>
              </div>
              <div className="text-[11px] text-slate-500 font-medium">Deekshabhoomi Gathering 2026 • Public Assistance Portal</div>
            </div>
          </div>

          {/* English / Hindi Toggle Button */}
          <button
            onClick={() => setLang(lang === 'EN' ? 'HI' : 'EN')}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition shadow-2xs"
          >
            <Languages className="w-4 h-4 text-cyan-600" />
            <span>{lang === 'EN' ? 'मराठी / हिंदी' : 'English'}</span>
          </button>
        </div>
      </div>

      {/* Main Full-Screen Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Title Greeting Header */}
        <div className="text-center py-2 space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{t.heroTitle}</h1>
          <p className="text-sm text-slate-600 max-w-2xl mx-auto">{t.heroSub}</p>
        </div>

        {/* 1. Full-Width Emergency SOS Banner */}
        <Link
          href="/sos"
          className="block p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white shadow-lg shadow-red-500/20 transition transform active:scale-[0.99] group border border-red-500"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-white uppercase tracking-wider">
                  {t.sosBadge}
                </span>
                <span className="flex items-center gap-1 text-[11px] font-mono text-red-200">
                  <Radio className="w-3 h-3 animate-ping" />
                  <span>DIRECT DISPATCH ACTIVE</span>
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-black tracking-tight">{t.sosTitle}</div>
              <div className="text-xs sm:text-sm text-red-100 font-medium">{t.sosSub}</div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-center px-4 py-2 rounded-xl bg-white text-red-600 font-bold text-xs sm:text-sm group-hover:bg-red-50 transition shadow-xs shrink-0">
              <span>Trigger Alarm</span>
              <AlertTriangle className="w-4 h-4 text-red-600" />
            </div>
          </div>
        </Link>

        {/* 2. Responsive 4-Column Grid of Core Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Report Missing Person */}
          <Link
            href="/missing-person"
            className="p-5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-blue-400 shadow-xs hover:shadow-md transition flex flex-col justify-between group"
          >
            <div>
              <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 mb-3 group-hover:scale-105 transition">
                <UserX className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition">
                {t.actionMissing}
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-snug">
                {t.actionMissingSub}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600">
              <span>Report Now</span>
              <ChevronRight className="w-4 h-4 transition group-hover:translate-x-1" />
            </div>
          </Link>

          {/* Report Sighting */}
          <Link
            href="/sighting"
            className="p-5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-emerald-400 shadow-xs hover:shadow-md transition flex flex-col justify-between group"
          >
            <div>
              <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-3 group-hover:scale-105 transition">
                <Eye className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition">
                {t.actionSighting}
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-snug">
                {t.actionSightingSub}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-600">
              <span>Submit Sighting</span>
              <ChevronRight className="w-4 h-4 transition group-hover:translate-x-1" />
            </div>
          </Link>

          {/* Security / Crime Report */}
          <Link
            href="/security-report"
            className="p-5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-amber-400 shadow-xs hover:shadow-md transition flex flex-col justify-between group"
          >
            <div>
              <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-3 group-hover:scale-105 transition">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-600 transition">
                {t.actionSecurity}
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-snug">
                {t.actionSecuritySub}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-600">
              <span>Report Security</span>
              <ChevronRight className="w-4 h-4 transition group-hover:translate-x-1" />
            </div>
          </Link>

          {/* Find Help Desk */}
          <Link
            href="/help-desks"
            className="p-5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-purple-400 shadow-xs hover:shadow-md transition flex flex-col justify-between group"
          >
            <div>
              <div className="w-11 h-11 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 mb-3 group-hover:scale-105 transition">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-purple-600 transition">
                {t.actionHelpDesk}
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-snug">
                {t.actionHelpDeskSub}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-purple-600">
              <span>View 10 Desks</span>
              <ChevronRight className="w-4 h-4 transition group-hover:translate-x-1" />
            </div>
          </Link>
        </div>

        {/* 3. Lower Split: Track Report (7 Cols) & Safety Helplines (5 Cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Track My Incident Report */}
          <div className="lg:col-span-7 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900 pb-2 border-b border-slate-100">
              <Search className="w-4 h-4 text-blue-600" />
              <span>{t.trackTitle}</span>
            </div>

            <form onSubmit={handleTrack} className="flex gap-2">
              <input
                type="text"
                value={trackQuery}
                onChange={(e) => setTrackQuery(e.target.value)}
                placeholder={t.trackPlaceholder}
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-mono"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm transition shadow-xs active:scale-98 shrink-0 flex items-center gap-1.5"
              >
                <span>{t.trackButton}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Tracking Result View */}
            {searched && (
              <div className="pt-2">
                {trackResult ? (
                  <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-xs sm:text-sm text-blue-700">
                        {trackResult.id}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                        {trackResult.status}
                      </span>
                    </div>
                    <div className="font-bold text-sm text-slate-900">{trackResult.title}</div>
                    <div className="text-xs text-slate-600">
                      Location: <strong>{trackResult.location}</strong> • Logged at: {trackResult.timestamp}
                    </div>

                    {trackResult.assignedResponder && (
                      <div className="text-xs text-slate-700 bg-white p-3 rounded-lg border border-slate-200 flex items-center justify-between shadow-2xs">
                        <span>Assigned Responder: <strong>{trackResult.assignedResponder.name}</strong></span>
                        <span className="text-blue-600 font-mono font-bold">
                          {trackResult.assignedResponder.distanceMeters
                            ? `${trackResult.assignedResponder.distanceMeters}m away`
                            : 'En route'}
                        </span>
                      </div>
                    )}

                    <div className="text-right pt-1">
                      <Link
                        href={`/incidents/${trackResult.id}`}
                        className="text-xs font-bold text-blue-600 hover:underline inline-flex items-center gap-1"
                      >
                        <span>View Full Dossier &amp; Updates</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
                    No incident found with ID &quot;{trackQuery}&quot;. Please verify the reference ID or visit your nearest Help Desk.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Emergency Helpline Directory */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3.5">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-800 pb-2 border-b border-slate-100">
              <PhoneCall className="w-4 h-4 text-emerald-600" />
              <span>{t.helplinesTitle}</span>
            </div>

            <div className="space-y-2 text-xs sm:text-sm text-slate-700">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100 hover:bg-slate-100 transition">
                <span>{t.policeHelpline}</span>
                <a href="tel:112" className="px-3 py-1 rounded bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 shadow-2xs">
                  Call 112
                </a>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100 hover:bg-slate-100 transition">
                <span>{t.ambulanceHelpline}</span>
                <a href="tel:108" className="px-3 py-1 rounded bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 shadow-2xs">
                  Call 108
                </a>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100 hover:bg-slate-100 transition">
                <span>{t.womenHelpline}</span>
                <a href="tel:1091" className="px-3 py-1 rounded bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 shadow-2xs">
                  Call 1091
                </a>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100 hover:bg-slate-100 transition">
                <span>{t.deekshabhoomiControl}</span>
                <a href="tel:+917122560101" className="px-3 py-1 rounded bg-slate-800 text-white font-mono font-bold text-xs hover:bg-slate-900 shadow-2xs">
                  Call Desk
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Return to Command Center Link */}
        <div className="text-center pt-4">
          <Link
            href="/control-room"
            className="text-xs sm:text-sm text-slate-500 hover:text-cyan-700 font-medium inline-flex items-center gap-1.5 transition"
          >
            <span>← Switch to Police &amp; Control Room Operations Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
