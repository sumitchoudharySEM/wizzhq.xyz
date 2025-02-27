'use client';
import React, { useState } from "react";
// import { AlertCircle, CheckCircle2, Send } from "lucide-react";

export default function EmailSenderPage() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);

  const sendEmails = async () => {
    if (!confirm("Are you sure you want to send emails to everyone?")) {
      return;
    }

    setLoading(true);
    setStatus(null);
    setError(null);

    try {
      const response = await fetch("/api/mail/everyone", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to send emails");
      }

      const data = await response.json();
      setStatus({
        totalAttempted: data.totalAttempted,
        approximateSuccessCount: data.approximateSuccessCount,
        approximateFailedCount: data.approximateFailedCount,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Send Email to All Users</h1>
        <p className="text-red-600 font-medium">
          ⚠️ Admin Only: Don't use this if you are not CoolSem
        </p>
      </div>

      <button
        onClick={sendEmails}
        disabled={loading}
        className={`
          flex items-center gap-2 px-4 py-2 rounded
          ${loading 
            ? 'bg-gray-300 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700'
          } 
          text-white font-medium transition-colors
        `}
      >
        {/* <Send size={20} /> */}
        {loading ? 'Sending...' : 'Send Emails'}
      </button>

      {status && (
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 text-green-700 mb-2">
            {/* <CheckCircle2 size={20} /> */}
            <h2 className="font-semibold">Email Sending Results</h2>
          </div>
          <div className="space-y-1 text-green-800">
            <p>Total Attempted: {status.totalAttempted}</p>
            <p>Approximate Successful: {status.approximateSuccessCount}</p>
            {status.approximateFailedCount > 0 && (
              <p className="text-amber-600">
                Approximate Failed: {status.approximateFailedCount}
              </p>
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
          <div className="flex items-center gap-2 text-red-700 mb-2">
            {/* <AlertCircle size={20} /> */}
            <h2 className="font-semibold">Error</h2>
          </div>
          <p className="text-red-800">{error}</p>
        </div>
      )}
    </div>
  );
}