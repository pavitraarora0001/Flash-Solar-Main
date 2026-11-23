"use client";

import * as React from "react";
import { Mail, CheckCircle2, Clock, Phone, User, X } from "lucide-react";
import { DBContactMessage } from "@/lib/db/store";

export default function AdminMessagesPage() {
  const [messages, setMessages] = React.useState<DBContactMessage[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedMessage, setSelectedMessage] = React.useState<DBContactMessage | null>(null);

  React.useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/contact");
        const data = await res.json();
        if (data.success) {
          setMessages(data.messages);
        }
      } catch (err) {
        console.error("Failed to load messages:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="pb-4 border-b border-midnight-800">
        <h1 className="text-2xl font-heading font-extrabold text-ivory-100 tracking-tight">
          Inbound Communications Inbox
        </h1>
        <p className="text-xs text-ivory-400 mt-1">
          Direct inquiries and communications submitted through public contact channels.
        </p>
      </div>

      <div className="bg-midnight-900 border border-midnight-800 rounded-xl overflow-hidden shadow">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-midnight-800 bg-midnight-950/60 text-ivory-400 uppercase font-mono text-[10px]">
              <th className="py-3 px-4">Ref</th>
              <th className="py-3 px-4">Sender</th>
              <th className="py-3 px-4">Subject</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Received</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-midnight-800/60">
            {messages.length > 0 ? (
              messages.map((msg) => (
                <tr key={msg.id} className="hover:bg-midnight-800/30 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-medium text-gold-400">
                    {msg.referenceNumber}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-ivory-100">{msg.name}</div>
                    <div className="text-[11px] text-ivory-400">{msg.email}</div>
                  </td>
                  <td className="py-3.5 px-4 text-ivory-200">{msg.subject || "General"}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono border ${
                        msg.status === "UNREAD"
                          ? "bg-amber-950/80 text-amber-300 border-amber-800"
                          : "bg-emerald-950/80 text-emerald-300 border-emerald-800"
                      }`}
                    >
                      {msg.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-ivory-400 text-[11px]">
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedMessage(msg)}
                      className="px-2.5 py-1 rounded bg-midnight-800 hover:bg-midnight-700 text-ivory-200 border border-midnight-700 text-xs"
                    >
                      Read
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-8 text-center text-ivory-400">
                  {loading ? "Loading inbox..." : "No contact messages received."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Message Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-midnight-900 border border-midnight-700 rounded-2xl w-full max-w-lg shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-midnight-800">
              <span className="font-mono text-xs text-gold-400">{selectedMessage.referenceNumber}</span>
              <button
                onClick={() => setSelectedMessage(null)}
                className="p-1 rounded text-ivory-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-ivory-100">
                {selectedMessage.subject || "General Inquiry"}
              </h3>
              <p className="text-xs text-ivory-400 mt-1">
                From: <strong>{selectedMessage.name}</strong> ({selectedMessage.email})
              </p>
              {selectedMessage.phone && (
                <p className="text-xs text-ivory-400">Phone: {selectedMessage.phone}</p>
              )}
            </div>
            <div className="p-4 rounded-xl bg-midnight-950 border border-midnight-800 text-xs text-ivory-200 leading-relaxed font-sans">
              {selectedMessage.message}
            </div>
            <div className="flex justify-end pt-2">
              <a
                href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject || "Flash Solar Inquiry"}`}
                className="px-4 py-2 rounded-lg bg-gold-500 hover:bg-gold-400 text-midnight-950 text-xs font-semibold"
              >
                Reply via Email
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
