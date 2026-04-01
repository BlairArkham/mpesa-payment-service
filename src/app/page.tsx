// src/app/page.tsx
"use client";

import { useState } from "react";

export default function Home() {
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("1");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus("Requesting PIN prompt...");

    try {
      const res = await fetch("/api/stkpush", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, amount }),
      });

      const data = await res.json();

      if (data.ResponseCode === "0") {
        setStatus("Enter PIN on your phone to complete payment.");
      } else {
        setStatus("Error: " + (data.CustomerMessage || "Failed to trigger M-Pesa"));
      }
    } catch (err) {
      setStatus("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <form 
        onSubmit={handlePay}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border-t-4 border-green-500"
      >
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">M-Pesa Microservice</h1>
        <p className="text-center text-gray-500 mb-6 text-sm">Deployable to Vercel</p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700">Phone Number</label>
            <input
              type="text"
              required
              placeholder="254712345678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">Amount (KES)</label>
            <input
              type="number"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-black"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-all disabled:opacity-50"
          >
            {loading ? "Processing..." : "Lipa na M-Pesa"}
          </button>
        </div>

        {status && (
          <div className="mt-4 p-3 bg-blue-50 text-blue-700 text-sm rounded-lg text-center">
            {status}
          </div>
        )}
      </form>
    </div>
  );
}