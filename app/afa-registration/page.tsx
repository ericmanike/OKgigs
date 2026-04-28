'use client';

import React, { useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';

export default function AfaRegistrationPage() {
  const [succeeded, setSucceeded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (succeeded) {
    return (
      <div className="max-w-6xl mx-auto px-4 md:pt-28 pt-24 pb-16">
        <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm text-center max-w-2xl mx-auto">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} className="text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Registration Request Received!</h2>
          <p className="text-slate-600 text-lg mb-8">
            Thank you for applying for the AFA Package. Our team will review your details and contact you shortly regarding the next steps.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-slate-600 text-white font-semibold rounded-lg hover:bg-slate-700 transition-all shadow-md"
          >
            Submit Another Request
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    const nextErrors: Record<string, string> = {};

    const full_name = formData.get('full_name') as string;
    const phone = formData.get('phone') as string;
    const ghana_card = formData.get('ghana_card') as string;
    const location = formData.get('location') as string;

    if (!full_name) nextErrors.full_name = 'Full name is required';
    if (!phone) nextErrors.phone = 'Phone number is required';
    if (!ghana_card) nextErrors.ghana_card = 'Ghana card number is required';
    if (!location) nextErrors.location = 'Location is required';

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    // try {
    //   const res = await fetch('/api/spendless/afa', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ full_name, phone, ghana_card, location })
    //   });

    //   const data = await res.json();

    //   if (res.ok && data.status !== 'error') {
    //     setSucceeded(true);
    //   } else {
    //     setErrorMsg(data.message || 'An error occurred during submission.');
    //   }
    // } catch (error) {
    //   setErrorMsg('Failed to connect to the server. Please check your internet connection.');
    // } finally {
    //   setSubmitting(false);
    // }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:pt-28 pt-24 pb-16 space-y-10">
      <section className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm max-w-2xl mx-auto">
        <div className="flex items-center justify-between gap-3 mb-8 flex-wrap border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              AFA Registration
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Fill out the form below to register for the AFA Package
            </p>
            <div className="mt-3 inline-flex px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-widest rounded-lg">
              Registration Fee is 15 GHS
            </div>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm font-medium text-center">
            {errorMsg}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          {Object.keys(errors).length > 0 && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-sm font-medium text-center">
              Please fill in all required fields to continue.
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="full_name" className="text-sm font-bold text-slate-700">Full Name</label>
            <input
              id="full_name"
              name="full_name"
              className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 transition-all font-medium bg-slate-50/50"
              placeholder="e.g. Ama Mensah"
            />
            {errors.full_name && <p className="text-xs text-red-500 font-bold mt-1">{errors.full_name}</p>}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="phone" className="text-sm font-bold text-slate-700">Phone Number</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 transition-all font-medium bg-slate-50/50"
              placeholder="e.g. 054XXXXXXX"
            />
            {errors.phone && <p className="text-xs text-red-500 font-bold mt-1">{errors.phone}</p>}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="ghana_card" className="text-sm font-bold text-slate-700">Ghana Card Number</label>
            <input
              id="ghana_card"
              name="ghana_card"
              className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 transition-all font-medium bg-slate-50/50"
              placeholder="e.g. GHA-XXXXXXXXX-X"
            />
            {errors.ghana_card && <p className="text-xs text-red-500 font-bold mt-1">{errors.ghana_card}</p>}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="location" className="text-sm font-bold text-slate-700">Location</label>
            <input
              id="location"
              name="location"
              className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800 transition-all font-medium bg-slate-50/50"
              placeholder="e.g. Accra"
            />
            {errors.location && <p className="text-xs text-red-500 font-bold mt-1">{errors.location}</p>}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-6 px-6 py-4 rounded-xl bg-slate-800 hover:bg-slate-900 disabled:opacity-60 text-white font-bold transition-all flex items-center gap-2 justify-center shadow-lg hover:shadow-xl active:scale-[0.98]"
          >
            {submitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Submit Registration
                <CheckCircle2 size={18} />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-sm font-medium text-slate-500 flex items-center justify-center gap-1.5 border-t border-slate-100 pt-6">
          Need help? Reach us at{' '}
          <a
            className="text-slate-800 font-bold hover:underline"
            href="mailto:support@megagigs.net"
          >
            euginesogtinye@gmail.com
          </a>
        </div>
      </section>
    </div>
  );
}
