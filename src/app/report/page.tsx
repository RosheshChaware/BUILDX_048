'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FileText, ArrowRight, ShieldCheck } from 'lucide-react';
import { useSuraksha } from '@/hooks/useSuraksha';
import { IncidentType, Severity } from '@/types';

export default function GeneralReportPage() {
  const router = useRouter();
  const { createIncident } = useSuraksha();

  const [type, setType] = useState<IncidentType>('MEDICAL');
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('Central Dome Inner Plaza');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<Severity>('MEDIUM');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !name || !phone) {
      alert('Please fill all mandatory fields');
      return;
    }

    const incident = createIncident({
      type,
      title,
      reporter: {
        name,
        phone,
        role: 'CITIZEN',
      },
      location,
      coords: [21.12785, 79.06690],
      description,
      severity,
      verificationStatus: 'UNDER_REVIEW',
      initialStatus: 'REPORTED',
      nearbyCctvIds: ['CAM-09', 'CAM-10'],
      nearbyHelpDeskId: 'HD-05',
      tags: [type, 'Field Report'],
    });

    router.push(`/incidents/${incident.id}`);
  };

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-cyan-400" />
          <span>Submit Incident Report</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Every report generates an auditable Incident ID and engages the nearest ground response team.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 text-xs shadow-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-slate-300 font-bold block mb-1">Incident Category *</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as IncidentType)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500 font-medium"
            >
              <option value="MEDICAL">Medical Emergency / Collapse</option>
              <option value="MISSING_PERSON">Missing Person / Separation</option>
              <option value="CROWD_SURGE">Crowd Surge / Bottleneck</option>
              <option value="THEFT">Theft / Lost Property</option>
              <option value="HARASSMENT">Harassment / Safety Concern</option>
              <option value="FIRE">Fire / Electrical Hazard</option>
              <option value="SUSPICIOUS_ACTIVITY">Suspicious Activity</option>
              <option value="OTHER">Other Ground Issue</option>
            </select>
          </div>

          <div>
            <label className="text-slate-300 font-bold block mb-1">Priority / Severity *</label>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value as Severity)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500 font-medium"
            >
              <option value="CRITICAL">Critical (Immediate danger to life)</option>
              <option value="HIGH">High (Urgent response needed)</option>
              <option value="MEDIUM">Medium (Normal priority)</option>
              <option value="LOW">Low (Informational / minor)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-slate-300 font-semibold block mb-1">Incident Title *</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Elderly pilgrim collapsed near Dome tier 2..."
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div>
          <label className="text-slate-300 font-semibold block mb-1">Gathering Venue Location *</label>
          <input
            type="text"
            required
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. North Gate 1 / Near Tree #14..."
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div>
          <label className="text-slate-300 font-semibold block mb-1">Detailed Description *</label>
          <textarea
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Provide clear details on what happened and what assistance is required..."
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500 h-24"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-slate-300 font-semibold block mb-1">Your Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sunil Meshram"
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Contact Phone *</label>
            <input
              type="text"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. +91 98221 00000"
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg transition flex items-center gap-1.5"
          >
            <span>Log Report & Dispatch</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
