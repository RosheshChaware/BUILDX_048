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
} from 'lucide-react';
import { useSuraksha } from '@/hooks/useSuraksha';

const CONTENT = {
  EN: {
    heroTitle: 'Deekshabhoomi Citizen Safety Portal',
    heroSub: 'How can we help you right now?',
    sosBadge: 'ONE-TOUCH EMERGENCY',
    sosTitle: 'EMERGENCY SOS',
    sosSub: 'Instant Police, Medical, or Fire rescue team dispatch',
    actionMissing: 'Report Missing Person',
    actionMissingSub: 'Lost child, wandering elderly, or adult',
    actionSighting: 'Report Sighting',
    actionSightingSub: 'Did you spot a missing person or suspect?',
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
    heroSub: 'हम आपकी क्या सहायता कर सकते हैं?',
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
    <div className="min-h-screen bg-[#F1F5F9] text-slate-900 pb-16">
      {/* Citizen Header with Language Toggle */}
      <div className="max-w-md mx-auto px-4 pt-4 pb-3 flex items-center justify-between border-b border-slate-200 bg-white">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-600 flex items-center justify-center font-bold text-white shadow-2xs">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="font-extrabold text-sm text-slate-900 flex items-center">
              SECURE<span className="text-cyan-600">MESH</span>
            </div>
            <div className="text-[10px] text-slate-500 font-medium">Deekshabhoomi Gathering 2026</div>
          </div>
        </div>

        {/* English / Hindi Toggle Button */}
        <button
          onClick={() => setLang(lang === 'EN' ? 'HI' : 'EN')}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition shadow-2xs"
        >
          <Languages className="w-3.5 h-3.5 text-blue-600" />
          <span>{lang === 'EN' ? 'मराठी / हिंदी' : 'English'}</span>
        </button>
      </div>

      <div className="max-w-md mx-auto px-4 pt-5 space-y-4">
        {/* Title greeting */}
        <div className="text-center py-2">
          <h1 className="text-xl font-black text-slate-900 tracking-tight">{t.heroTitle}</h1>
          <p className="text-xs text-slate-500 mt-1">{t.heroSub}</p>
        </div>

        {/* 1. BIG RED SOS BUTTON */}
        <Link
          href="/sos"
          className="block p-5 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white shadow-lg shadow-red-500/20 transition transform active:scale-98 group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-white uppercase tracking-wider">
              {t.sosBadge}
            </span>
            <AlertTriangle className="w-6 h-6 text-white animate-bounce" />
          </div>
          <div className="text-2xl font-black tracking-tight">{t.sosTitle}</div>
          <div className="text-xs text-red-100 mt-1 font-medium">{t.sosSub}</div>
        </Link>

        {/* 2. Grid of Core Actions */}
        <div className="grid grid-cols-2 gap-3">
          {/* Report Missing Person */}
          <Link
            href="/missing-person"
            className="p-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-blue-400 shadow-sm transition flex flex-col justify-between group"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 mb-2 group-hover:scale-105 transition">
                <UserX className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition">
                {t.actionMissing}
              </h3>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                {t.actionMissingSub}
              </p>
            </div>
            <div className="mt-3 flex items-center text-[10px] font-bold text-blue-600">
              <span>Report Now</span>
              <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </div>
          </Link>

          {/* Report Sighting */}
          <Link
            href="/sighting"
            className="p-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-emerald-400 shadow-sm transition flex flex-col justify-between group"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-2 group-hover:scale-105 transition">
                <Eye className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-bold text-slate-900 group-hover:text-emerald-600 transition">
                {t.actionSighting}
              </h3>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                {t.actionSightingSub}
              </p>
            </div>
            <div className="mt-3 flex items-center text-[10px] font-bold text-emerald-600">
              <span>Submit Sight</span>
              <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </div>
          </Link>

          {/* Security / Crime Report */}
          <Link
            href="/security-report"
            className="p-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-amber-400 shadow-sm transition flex flex-col justify-between group"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-2 group-hover:scale-105 transition">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-bold text-slate-900 group-hover:text-amber-600 transition">
                {t.actionSecurity}
              </h3>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                {t.actionSecuritySub}
              </p>
            </div>
            <div className="mt-3 flex items-center text-[10px] font-bold text-amber-600">
              <span>Report Theft</span>
              <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </div>
          </Link>

          {/* Find Help Desk */}
          <Link
            href="/help-desks"
            className="p-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-purple-400 shadow-sm transition flex flex-col justify-between group"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 mb-2 group-hover:scale-105 transition">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-bold text-slate-900 group-hover:text-purple-600 transition">
                {t.actionHelpDesk}
              </h3>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                {t.actionHelpDeskSub}
              </p>
            </div>
            <div className="mt-3 flex items-center text-[10px] font-bold text-purple-600">
              <span>View 10 Desks</span>
              <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </div>
          </Link>
        </div>

        {/* 3. Track My Report Section */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
            <Search className="w-4 h-4 text-blue-600" />
            <span>{t.trackTitle}</span>
          </div>

          <form onSubmit={handleTrack} className="flex gap-2">
            <input
              type="text"
              value={trackQuery}
              onChange={(e) => setTrackQuery(e.target.value)}
              placeholder={t.trackPlaceholder}
              className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-mono"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-2xs active:scale-98"
            >
              {t.trackButton}
            </button>
          </form>

          {/* Tracking Result View */}
          {searched && (
            <div className="mt-3 pt-3 border-t border-slate-100">
              {trackResult ? (
                <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-blue-700">
                      {trackResult.id}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                      {trackResult.status}
                    </span>
                  </div>
                  <div className="font-bold text-xs text-slate-900">{trackResult.title}</div>
                  <div className="text-[11px] text-slate-600">
                    Location: {trackResult.location} ({trackResult.timestamp})
                  </div>

                  {trackResult.assignedResponder && (
                    <div className="text-[10px] text-slate-700 bg-white p-2 rounded-lg border border-slate-200 flex items-center justify-between shadow-2xs">
                      <span>Assigned: <strong>{trackResult.assignedResponder.name}</strong></span>
                      <span className="text-blue-600 font-mono font-bold">
                        {trackResult.assignedResponder.distanceMeters
                          ? `${trackResult.assignedResponder.distanceMeters}m away`
                          : 'En route'}
                      </span>
                    </div>
                  )}

                  <div className="text-right">
                    <Link
                      href={`/incidents/${trackResult.id}`}
                      className="text-xs font-bold text-blue-600 hover:underline"
                    >
                      View Full Dossier &amp; Updates →
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
                  No incident found with ID &quot;{trackQuery}&quot;. Please verify the reference ID or visit your nearest Help Desk.
                </div>
              )}
            </div>
          )}
        </div>

        {/* 4. Safety Helplines Phone Directory */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm text-xs space-y-2.5">
          <div className="flex items-center gap-2 font-bold text-slate-800">
            <PhoneCall className="w-4 h-4 text-emerald-600" />
            <span>{t.helplinesTitle}</span>
          </div>
          <div className="space-y-1.5 text-[11px] text-slate-600">
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span>{t.policeHelpline}</span>
              <a href="tel:112" className="text-blue-600 font-bold hover:underline">
                Call 112
              </a>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span>{t.ambulanceHelpline}</span>
              <a href="tel:108" className="text-emerald-600 font-bold hover:underline">
                Call 108
              </a>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
              <span>{t.womenHelpline}</span>
              <a href="tel:1091" className="text-rose-600 font-bold hover:underline">
                Call 1091
              </a>
            </div>
            <div className="flex items-center justify-between py-1.5">
              <span>{t.deekshabhoomiControl}</span>
              <a href="tel:+917122560101" className="text-slate-800 font-mono font-semibold hover:underline">
                Direct Desk
              </a>
            </div>
          </div>
        </div>

        {/* Return to Command Center link */}
        <div className="text-center pt-2">
          <Link
            href="/control-room"
            className="text-xs text-slate-500 hover:text-blue-600 font-medium inline-flex items-center gap-1"
          >
            ← Switch to Police &amp; Control Room Operations
          </Link>
        </div>
      </div>
    </div>
  );
}
