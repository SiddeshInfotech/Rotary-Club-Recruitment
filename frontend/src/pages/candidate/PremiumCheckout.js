import React, { useState } from "react";
import CandidateLayout from "../../layouts/CandidateLayout";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Lock, ArrowLeft, Loader2, CheckCircle, Zap, ShieldCheck, Star, Calendar } from "lucide-react";
import api from "../../services/api";

// Plan metadata
const PLAN_META = {
  "trial":   { label: "1 Month Free Trial", price: "$0",     duration: "30 days (trial)", savingsNote: "$1 refundable auth · $10/mo after trial" },
  "1month":  { label: "1 Month",            price: "$10",    duration: "30 days",         savingsNote: null },
  "6months": { label: "6 Months",           price: "$50",    duration: "180 days",        savingsNote: "Save $10 vs monthly" },
  "12months":{ label: "12 Months",          price: "$80",    duration: "365 days",        savingsNote: "Save $40 vs monthly" },
};

// Dynamically load the Razorpay checkout script
function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (document.getElementById("razorpay-script")) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.id = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function PremiumCheckout() {
  const navigate = useNavigate();
  const location = useLocation();

  // Plan passed from PremiumPricing via navigate state
  const plan = location.state?.plan || "1month";
  const meta = PLAN_META[plan] || PLAN_META["1month"];

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleCheckout = async () => {
    setLoading(true);
    setError("");

    try {
      // Step 1: Load Razorpay SDK
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setError("Could not load payment service. Please check your connection.");
        setLoading(false);
        return;
      }

      // Step 2: Create an order on our backend with the selected plan
      const orderRes = await api.post("/candidate-dashboard/create-order", { plan });
      if (!orderRes.data.success) {
        setError(orderRes.data.message || "Failed to create payment order.");
        setLoading(false);
        return;
      }

      const { orderId, amount, currency, keyId } = orderRes.data;

      if (keyId === "mock") {
        // Simulated payment flow for developer testing
        setTimeout(async () => {
          try {
            const verifyRes = await api.post("/candidate-dashboard/verify-payment", {
              razorpay_order_id: orderId,
              razorpay_payment_id: `pay_mock_${Math.random().toString(36).substring(2, 10)}${Date.now()}`,
              razorpay_signature: `sig_mock_${Math.random().toString(36).substring(2, 10)}${Date.now()}`,
              plan,
            });

            if (verifyRes.data.success) {
              setSuccess(true);
              setTimeout(() => navigate("/candidate"), 2500);
            } else {
              setError(verifyRes.data.message || "Payment verification failed.");
              setLoading(false);
            }
          } catch (err) {
            console.error(err);
            setError("Payment received but verification failed. Contact support with your payment ID.");
            setLoading(false);
          }
        }, 1500);
        return;
      }

      // Step 3: Open Razorpay checkout popup
      const options = {
        key: keyId || process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount,
        currency,
        name: "Rotary Club Portal",
        description: `Premium Membership — ${meta.label}`,
        order_id: orderId,
        theme: { color: "#2563eb" },
        config: {
          display: {
            blocks: {
              upi: {
                name: "Pay via UPI",
                instruments: [{ method: "upi" }],
              },
              cards: {
                name: "Pay via Card",
                instruments: [{ method: "card" }],
              },
              other: {
                name: "Other Methods",
                instruments: [{ method: "netbanking" }, { method: "wallet" }],
              },
            },
            sequence: ["block.upi", "block.cards", "block.other"],
            preferences: { show_default_blocks: false },
          },
        },
        handler: async function (response) {
          // Step 4: Verify payment on our backend
          try {
            const verifyRes = await api.post("/candidate-dashboard/verify-payment", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              plan,
            });

            if (verifyRes.data.success) {
              setSuccess(true);
              setTimeout(() => navigate("/candidate"), 2500);
            } else {
              setError(verifyRes.data.message || "Payment verification failed.");
              setLoading(false);
            }
          } catch (err) {
            console.error(err);
            setError("Payment received but verification failed. Contact support with your payment ID.");
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        setError(`Payment failed: ${response.error.description}`);
        setLoading(false);
      });
      rzp.open();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "An unexpected error occurred.");
      setLoading(false);
    }
  };

  return (
    <CandidateLayout>
      <div className="max-w-3xl mx-auto py-12 px-4">
        <Link
          to="/premium/pricing"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Pricing
        </Link>

        {success ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-emerald-500/30 shadow-[0_0_40px_rgba(16,185,129,0.15)] mt-8">
            <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-emerald-500" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4">
              Payment Successful!
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-2 font-medium">
              Welcome to Premium ({meta.label})!
            </p>
            <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto text-sm">
              We're generating your deep EQ insights right now. Redirecting you to your dashboard...
            </p>
            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mx-auto" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left: Info + Pay Button */}
            <div className="md:col-span-2">
              <h1 className="text-3xl font-black text-slate-900 dark:text-white font-serif mb-2">
                Complete Upgrade
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mb-8 text-sm">
                Secure payment powered by Razorpay — UPI, Cards, NetBanking & Wallets accepted.
              </p>

              {error && (
                <div className="p-4 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 rounded-xl text-sm font-medium mb-6">
                  {error}
                </div>
              )}

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 mb-6">
                <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-5">
                  What you're unlocking
                </h2>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <Zap className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-white text-sm">Deep AI EQ Insights</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Personalised strengths, weaknesses & growth roadmap.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Star className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-white text-sm">Priority Recruiter Visibility</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Premium badge — appear first in all recruiter searches.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-white text-sm">Active for {meta.duration}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Access valid for the full {meta.label} period from today.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-white text-sm">Instant Activation</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Premium status activates the moment payment is confirmed.</p>
                    </div>
                  </li>
                </ul>
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 transition-all text-lg disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Opening Payment...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    Pay {meta.price} Securely
                  </>
                )}
              </button>
              <p className="text-center text-xs text-slate-400 mt-3 flex items-center justify-center gap-1">
                <Lock className="w-3 h-3" /> Secured by Razorpay · 256-bit SSL Encryption
              </p>
            </div>

            {/* Right: Order Summary */}
            <div>
              <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sticky top-8">
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
                  Order Summary
                </h3>

                {/* Selected plan highlight */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-blue-800 dark:text-blue-200">
                      Premium · {meta.label}
                    </span>
                    <span className="font-black text-blue-700 dark:text-blue-300">{meta.price}</span>
                  </div>
                  {meta.savingsNote && (
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                      🎉 {meta.savingsNote}
                    </p>
                  )}
                  <p className="text-xs text-slate-500 mt-1">Active for {meta.duration}</p>
                </div>

                {/* Want a different plan? */}
                <Link
                  to="/premium/pricing"
                  className="block text-xs text-center text-blue-600 hover:underline mb-4"
                >
                  Change plan
                </Link>

                <div className="h-px bg-slate-200 dark:bg-slate-800 mb-4" />

                <div className="flex justify-between items-center text-lg mb-4">
                  <div className="font-bold text-slate-900 dark:text-white">Total</div>
                  <div className="font-black text-blue-600 dark:text-blue-400">{meta.price}</div>
                </div>

                <div className="space-y-2">
                  {["UPI", "VISA", "MC", "RuPay", "NetBanking"].map((label) => (
                    <span
                      key={label}
                      className="inline-block text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-1 rounded text-slate-600 dark:text-slate-300 mr-1 mb-1"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </CandidateLayout>
  );
}
