'use client';

import React, { useState } from 'react';
import {
  User,
  Phone,
  Video,
  Navigation,
  AlertCircle,
  Plus,
  ChevronRight,
  ShieldCheck,
  Radio,
} from 'lucide-react';
import { useSuraksha } from '@/hooks/useSuraksha';

export function FamilySafetyCard() {
  const { addNotification, triggerSos } = useSuraksha();
  const [sosSent, setSosSent] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeAction, setActiveAction] = useState<string | null>(null);

  const contacts = [
    { name: 'Mother', phone: '+91 98765 43210' },
    { name: 'Father', phone: '+91 97654 32109' },
    { name: 'Brother', phone: '+91 91234 56789' },
  ];

  const handleTriggerSos = () => {
    setSosSent(true);
    addNotification({
      type: 'CRITICAL',
      title: 'Family Safety Emergency Alert',
      message: 'Pilgrim Emergency SOS received from Family Safety! Location broadcast to nearest volunteers in Zone B.',
      actionLink: '/sos',
    });
    triggerSos({
      category: 'OTHER',
      locationName: 'Zone B - Main Pathway',
      coords: [21.12785, 79.0669],
      userName: 'Suresh (Citizen)',
      userPhone: '+91 98765 43210',
      description: 'Pilgrim Emergency SOS activated via 1-Click Family Safety.',
    });
    setTimeout(() => setSosSent(false), 6000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col h-full">
      {/* Title & Subtitle */}
      <div>
        <h3 className="text-base font-bold text-slate-900 tracking-tight">Family Safety</h3>
        <p className="text-xs text-slate-500 mt-0.5">Share contacts, one-click alert, live location and more.</p>
      </div>

      {/* My Contacts */}
      <div className="mt-4 flex-1">
        <div className="text-xs font-bold text-slate-800 mb-2">My Contacts</div>
        <div className="space-y-2">
          {contacts.map((c, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100 transition cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                  {c.name.charAt(0)}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800 leading-tight">{c.name}</div>
                  <div className="text-[10px] text-slate-500 font-mono leading-tight">{c.phone}</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          ))}
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="mt-2 text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" /> Add Contact
        </button>
      </div>

      {/* Big Crimson SOS Button */}
      <div className="mt-4">
        <button
          onClick={handleTriggerSos}
          className={`w-full py-3 px-4 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
            sosSent
              ? 'bg-emerald-600 text-white animate-pulse'
              : 'bg-red-600 hover:bg-red-700 active:scale-98 text-white shadow-red-500/20'
          }`}
        >
          <Radio className="w-4 h-4" />
          {sosSent ? 'Emergency Dispatched to Zone B!' : 'One-Click Emergency Alert'}
        </button>
      </div>

      {/* Quick Actions (Live Location, Voice Call, Video Call) */}
      <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-100">
        <button
          onClick={() => {
            setActiveAction('location');
            addNotification({
              type: 'INFO',
              title: 'Live Location Shared',
              message: 'Live GPS coordinates shared with Family Contacts & Desk-3',
              actionLink: '/map',
            });
          }}
          className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-slate-50 transition border border-slate-100 text-center"
        >
          <div className="w-8 h-8 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center">
            <Navigation className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-semibold text-slate-700">Live Location</span>
        </button>

        <button
          onClick={() => {
            setActiveAction('voice');
            alert('Initiating direct volunteer voice link to Zone B responder V-102...');
          }}
          className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-slate-50 transition border border-slate-100 text-center"
        >
          <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
            <Phone className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-semibold text-slate-700">Voice Call</span>
        </button>

        <button
          onClick={() => {
            setActiveAction('video');
            alert('Connecting WebRTC secure video feed to Desk-3 operator...');
          }}
          className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-slate-50 transition border border-slate-100 text-center"
        >
          <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
            <Video className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-semibold text-slate-700">Video Call</span>
        </button>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-slate-200">
            <h4 className="font-bold text-slate-900 text-base">Add Emergency Contact</h4>
            <p className="text-xs text-slate-500 mt-1">This contact will be alerted if SOS is activated.</p>
            <div className="space-y-3 mt-4">
              <input
                type="text"
                placeholder="Relation (e.g. Sister, Uncle)"
                className="w-full text-xs p-2 rounded-lg border border-slate-200"
              />
              <input
                type="tel"
                placeholder="Mobile Number (+91 ...)"
                className="w-full text-xs p-2 rounded-lg border border-slate-200"
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setModalOpen(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setModalOpen(false);
                  addNotification({
                    type: 'SUCCESS',
                    title: 'Contact Added',
                    message: 'Family contact registered successfully.',
                    actionLink: '/citizen',
                  });
                }}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700"
              >
                Save Contact
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
