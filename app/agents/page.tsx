'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Handshake,
  Rocket,
  ShieldCheck,
  Wallet,
  PhoneCall,
  MessageCircle,
  CheckCircle2,
} from 'lucide-react';

type FormState = {
  name: string;
  email: string;
  phone: string;
  businessName: string;
  monthlyVolume: string;
  ghanaCard: string;
  message: string;
};

const perks = [
  {
    title: 'High Margins',
    description: 'Earn competitive commissions on every bundle you sell.',
    icon: Wallet,
  },
  {
    title: 'Instant Delivery',
    description: 'Automated fulfilment keeps your customers happy and loyal.',
    icon: Rocket,
  },
  {
    title: 'Priority Support',
    description: 'Dedicated help when you need it via WhatsApp or phone.',
    icon: PhoneCall,
  },
  {
    title: 'Secure Platform',
    description: 'Built-in fraud checks and reliable uptime for your sales.',
    icon: ShieldCheck,
  },
];

const steps = [
  {
    title: 'Share your details',
    description: 'Tell us about your business and expected monthly volumes.',
  },
  {
    title: 'We set you up',
    description: 'Get onboarding, best practices, and pricing for agents.',
  },
  {
    title: 'Start earning',
    description: 'Sell instantly from day one and track earnings in real time.',
  },
];

export default function AgentsPage() {
  const [formData, setFormData] = useState<FormState>({
    name: '',
    email: '',
    phone: '',
    businessName: '',
    monthlyVolume: '',
    ghanaCard: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!formData.name.trim()) nextErrors.name = 'Name is required';
    if (!formData.email.trim()) nextErrors.email = 'Email is required';
    if (!formData.phone.trim()) nextErrors.phone = 'Phone number is required';
    if (!formData.businessName.trim())
      nextErrors.businessName = 'Business name is required';
    if (!formData.monthlyVolume.trim())
      nextErrors.monthlyVolume = 'Estimated volume is required';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus('sending');
    const message = [
      'New agent / reseller request',
      `Name: ${formData.name}`,
      `Email: ${formData.email}`,
      `Phone: ${formData.phone}`,
      `Business: ${formData.businessName}`,
      `Monthly Volume: ${formData.monthlyVolume}`,
      `Notes: ${formData.message || 'N/A'}`,
    ].join('\n');

    const whatsappUrl = `https://wa.me/233543442518?text=${encodeURIComponent(
      message,
    )}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

    setStatus('sent');
    setFormData({
      name: '',
      email: '',
      phone: '',
      businessName: '',
      monthlyVolume: '',
      ghanaCard: '',
      message: '',
    });
    setTimeout(() => setStatus('idle'), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:pt-28 pt-24 pb-16 space-y-10">
  
      <section
        id="apply"
        className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm"
      >
        <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
          AFA Registration
            </h2>
            <p className="text-sm text-slate-600">
            Fill out the form below to register for AFA Package   
            <br/>
            <h2>Registration Fee is 50 GHS </h2>
        
            </p>
          </div>
          {status === 'sent' && (
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 text-green-700 text-sm font-semibold">
              <CheckCircle2 size={16} />
              Request sent
            </span>
          )}
        </div>

        <form className="grid md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label className="text-sm text-slate-700">Full name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="Ama Mensah"
            />
            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
          </div>
          <div className="space-y-1">
            <label className="text-sm text-slate-700">Email</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email}</p>
            )}
          </div>
          <div className="space-y-1">
            <label className="text-sm text-slate-700">Phone / WhatsApp</label>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="+233 54 344 2518"
            />
            {errors.phone && (
              <p className="text-xs text-red-500">{errors.phone}</p>
            )}
          </div>
          <div className="space-y-1">
            <label className="text-sm text-slate-700">Business name</label>
            <input
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="e.g., FastConnect Ventures"
            />
            {errors.businessName && (
              <p className="text-xs text-red-500">{errors.businessName}</p>
            )}
          </div>
          <div className="space-y-1">
            <label className="text-sm text-slate-700">
              Estimated monthly data volume
            </label>
            <input
              name="monthlyVolume"
              value={formData.monthlyVolume}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="e.g., 200 bundles"
            />
            {errors.monthlyVolume && (
              <p className="text-xs text-red-500">{errors.monthlyVolume}</p>
            )}
          </div>
          <div className="space-y-1 md:col-span-2">
            <label className="text-sm text-slate-700">
              Anything else we should know?
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="Share your goals or questions for the team."
            />
          </div>

          <button
            type="submit"
            disabled={status === 'sending'}
            className="md:col-span-2 w-full md:w-auto px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold transition flex items-center gap-2 justify-center"
          >
            {status === 'sending' ? 'Sending...' : 'Send to WhatsApp'}
            <PhoneCall size={18} />
          </button>
        </form>

        <div className="mt-4 text-sm text-slate-600 flex items-center gap-2">
          Prefer email? Reach us at{' '}
          <a
            className="text-blue-600 font-semibold"
            href="mailto:support@riskwhiz.com"
          >
            support@riskwhiz.com
          </a>
        </div>
      </section>
    </div>
  );
}


