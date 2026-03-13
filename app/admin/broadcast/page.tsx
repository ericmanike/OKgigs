"use client";

import { useState, useEffect } from "react";
import { Megaphone, Send, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";

export default function AdminBroadcastPage() {
  const [stats, setStats] = useState({ users: 0 });
  const [broadcastForm, setBroadcastForm] = useState({
    subject: "",
    title: "",
    message: "",
    type: "promotion",
  });
  const [sendingBroadcast, setSendingBroadcast] = useState(false);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((d) => setStats(d))
      .catch(console.error);
  }, []);

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirm("Are you sure you want to send this broadcast to ALL users?")) return;
    setSendingBroadcast(true);
    try {
      const res = await fetch("/api/admin/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(broadcastForm),
      });
      const data = await res.json();
      if (res.ok) {
        alert(`Broadcast sent successfully! ${data.successful} emails sent.`);
        setBroadcastForm({ subject: "", title: "", message: "", type: "promotion" });
      } else {
        alert(data.error || "Failed to send broadcast");
      }
    } catch {
      alert("Error sending broadcast");
    } finally {
      setSendingBroadcast(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-400">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-zinc-900">System Broadcast</h2>
        <p className="text-zinc-500">Send an email notification to all registered users on MegaGigs.</p>
      </div>

      <Card className="border-zinc-200 bg-white shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="p-6 bg-zinc-50 border-b border-zinc-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                <Megaphone size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900">Email Campaign</h3>
                <p className="text-xs text-zinc-500">Recipients: {stats.users} users</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSendBroadcast} className="p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-700">Campaign Type</label>
                <select
                  className="w-full px-4 py-2 rounded-lg border border-zinc-200 focus:ring-2 focus:ring-slate-200 outline-none"
                  value={broadcastForm.type}
                  onChange={(e) => setBroadcastForm({ ...broadcastForm, type: e.target.value })}
                >
                  <option value="promotion">Promotion (Green)</option>
                  <option value="notice">Important Notice (Yellow)</option>
                  <option value="reminder">Account Reminder (Blue)</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-700">Email Subject</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Weekend Mega Deals!"
                  className="w-full px-4 py-2 rounded-lg border border-zinc-200 focus:ring-2 focus:ring-slate-200 outline-none"
                  value={broadcastForm.subject}
                  onChange={(e) => setBroadcastForm({ ...broadcastForm, subject: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-700">Internal Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Don't miss out on 50% discount"
                className="w-full px-4 py-2 rounded-lg border border-zinc-200 focus:ring-2 focus:ring-slate-200 outline-none"
                value={broadcastForm.title}
                onChange={(e) => setBroadcastForm({ ...broadcastForm, title: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-700">Message Content</label>
              <textarea
                required
                rows={6}
                placeholder="Write your message here... You can use plain text."
                className="w-full px-4 py-3 rounded-lg border border-zinc-200 focus:ring-2 focus:ring-slate-200 outline-none resize-none"
                value={broadcastForm.message}
                onChange={(e) => setBroadcastForm({ ...broadcastForm, message: e.target.value })}
              />
              <p className="text-[11px] text-zinc-400 italic">
                User's name will automatically be added as "Hi [Name],"
              </p>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={sendingBroadcast}
                className="w-full h-12 flex items-center justify-center gap-2 bg-zinc-900 text-white rounded-xl font-bold hover:bg-zinc-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-zinc-950/20"
              >
                {sendingBroadcast ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending to {stats.users} users...
                  </>
                ) : (
                  <>
                    <Send size={18} /> Send Broadcast Now
                  </>
                )}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 text-blue-700">
        <Shield size={20} className="shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <p className="font-bold">Security Notice</p>
          <p>Broadcasts are irreversible once sent. Please double check all details before clicking "Send."</p>
        </div>
      </div>
    </div>
  );
}
