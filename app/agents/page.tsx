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
      message: '',
    });
    setTimeout(() => setStatus('idle'), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:pt-28 pt-24 pb-16 space-y-10">
      <section className="grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold">
            <Handshake size={16} />
            Become an Agent / Reseller
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
            Grow your earnings with RiskWhiz data reselling
          </h1>
          <p className="text-slate-600">
            Join our network of partners and start selling affordable data
            bundles with instant delivery, transparent pricing, and responsive
            support. We help you launch fast and scale with confidence.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="#apply"
              className="px-5 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold inline-flex items-center gap-2 transition"
            >
              Apply now
              <Rocket size={18} />
            </Link>
            <Link
              href="/contact"
              className="px-5 py-3 rounded-lg bg-white border border-slate-200 text-slate-900 font-semibold inline-flex items-center gap-2 hover:border-blue-300 transition"
            >
              Talk to us
              <MessageCircle size={18} />
            </Link>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <ShieldCheck size={16} className="text-green-600" />
            No setup fees · Pay-as-you-sell · Support in minutes
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {perks.map((perk) => (
            <motion.div
              key={perk.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="p-4 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center mb-3">
                <perk.icon size={20} />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">{perk.title}</h3>
              <p className="text-sm text-slate-600">{perk.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-4">
          How it works
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <div key={step.title} className="relative">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center font-semibold">
                  {index + 1}
                </div>
                <h3 className="font-semibold text-slate-900">{step.title}</h3>
              </div>
              <p className="text-sm text-slate-600">{step.description}</p>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute -right-3 top-5 h-px w-8 bg-slate-200" />
              )}
            </div>
          ))}
        </div>
      </section>

      <section
        id="apply"
        className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm"
      >
        <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Tell us about you
            </h2>
            <p className="text-sm text-slate-600">
              Share a few details and we will follow up with pricing and
              onboarding within a few minutes.
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


