import React, { useState } from "react";
import CandidateLayout from "../../layouts/CandidateLayout";
import { useNavigate } from "react-router-dom";
import { Check, Star, Zap, Shield, Gift, Sparkles } from "lucide-react";
import api from "../../services/api";

const PLANS = [
  {
    id: "1month",
    label: "1 Month",
    price: 10,
    inr: 830,
    perMonth: 10,
    duration: "1 month",
    savings: null,
    badge: null,
  },
  {
    id: "6months",
    label: "6 Months",
    price: 50,
    inr: 4150,
    perMonth: 8.33,
    duration: "6 months",
    savings: "Save $10",
    badge: "Best Value",
  },
  {
    id: "12months",
    label: "12 Months",
    price: 80,
    inr: 6640,
    perMonth: 6.67,
    duration: "1 year",
    savings: "Save $40",
    badge: "Best Deal",
  },
];

const PREMIUM_FEATURES = [
  {
    icon: <Zap className="w-5 h-5 text-yellow-400" />,
    title: "Deep AI EQ Insights",
    desc: "Personalized strengths, weaknesses & growth recommendations powered by AI.",
  },
  {
    icon: <Star className="w-5 h-5 text-blue-400 fill-blue-400" />,
    title: "Priority Recruiter Visibility",
    desc: "Premium badge — appear at the top of every recruiter search.",
  },
  {
    icon: <Check className="w-5 h-5 text-emerald-400" />,
    title: "Top 1% Sorting Priority",
    desc: "You're shown first before all free-tier candidates.",
  },
  {
    icon: <Shield className="w-5 h-5 text-purple-400" />,
    title: "Actionable Growth Plan",
    desc: "Personalised roadmap to grow your EQ and land better roles.",
  },
];

export default function PremiumPricing() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState("6months");

  const activePlan = PLANS.find((p) => p.id === selectedPlan);

  return (
    <CandidateLayout>
      <div className="max-w-5xl mx-auto py-12 px-4">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5" /> Premium Membership
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white font-serif mb-4">
            Supercharge Your Career
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Unlock deep AI-driven EQ insights, stand out to top recruiters, and accelerate your hiring journey.
          </p>
        </div>

        {/* Free Trial Banner — like LinkedIn */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 md:p-8 mb-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-emerald-500/20">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white mb-1">Try Premium free for 1 month</h2>
              <p className="text-emerald-100 text-sm">
                Full access to all premium features. Cancel before 30 days to avoid billing.
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2 shrink-0">
            <button
              onClick={() => navigate("/premium/checkout", { state: { plan: "trial" } })}
              className="px-8 py-3 rounded-xl bg-white text-emerald-700 font-black text-sm hover:bg-emerald-50 transition-all shadow-lg whitespace-nowrap"
            >
              Start Free Trial
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left: Features list */}
          <div className="lg:col-span-2 flex flex-col justify-center">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6">
              Everything included
            </h2>
            <ul className="space-y-5">
              {PREMIUM_FEATURES.map((f) => (
                <li key={f.title} className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                    {f.icon}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 dark:text-white text-sm">{f.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-0.5">{f.desc}</p>
                  </div>
                </li>
              ))}
            </ul>

            {/* Free vs Premium mini table */}
            <div className="mt-8 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="grid grid-cols-3 text-xs font-bold text-center bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                <div className="p-3 text-left text-slate-700 dark:text-slate-300">Feature</div>
                <div className="p-3 text-slate-500">Free</div>
                <div className="p-3 text-blue-600 dark:text-blue-400">Premium</div>
              </div>
              {[
                ["EQ Assessment", true, true],
                ["AI EQ Insights", false, true],
                ["Recruiter Boost", false, true],
                ["Growth Roadmap", false, true],
              ].map(([feat, free, premium]) => (
                <div key={feat} className="grid grid-cols-3 text-center text-xs border-b last:border-0 border-slate-100 dark:border-slate-800">
                  <div className="p-3 text-left text-slate-600 dark:text-slate-400">{feat}</div>
                  <div className="p-3">{free ? <Check className="w-4 h-4 text-emerald-500 mx-auto" /> : <span className="text-slate-300">—</span>}</div>
                  <div className="p-3">{premium ? <Check className="w-4 h-4 text-blue-500 mx-auto" /> : <span className="text-slate-300">—</span>}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Plan selector */}
          <div className="lg:col-span-3">
            <div className="bg-gradient-to-b from-blue-950 to-slate-900 rounded-3xl p-8 border border-blue-500/20 shadow-[0_0_50px_rgba(59,130,246,0.1)]">
              <div className="flex items-center gap-2 mb-6">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <h3 className="text-lg font-black text-white">Choose Your Plan</h3>
              </div>

              {/* Plan toggle */}
              <div className="space-y-3 mb-8">
                {PLANS.map((plan) => (
                  <button
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                      selectedPlan === plan.id
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-slate-700 bg-slate-800/50 hover:border-slate-500"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedPlan === plan.id ? "border-blue-400" : "border-slate-600"}`}>
                        {selectedPlan === plan.id && <div className="w-2 h-2 rounded-full bg-blue-400" />}
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-bold text-sm">{plan.label}</span>
                          {plan.badge && (
                            <span className="text-xs bg-blue-600 text-white font-bold px-2 py-0.5 rounded-full">{plan.badge}</span>
                          )}
                        </div>
                        {plan.savings && (
                          <span className="text-emerald-400 text-xs font-semibold">{plan.savings}</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-black">${plan.price}</div>
                      <div className="text-slate-400 text-xs">${plan.perMonth.toFixed(2)}/mo</div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Summary */}
              {activePlan && (
                <div className="bg-slate-800/60 rounded-xl p-4 mb-6 text-sm">
                  <div className="flex justify-between text-slate-400 mb-2">
                    <span>Premium ({activePlan.duration})</span>
                    <span className="text-white font-bold">${activePlan.price}</span>
                  </div>
                  <div className="h-px bg-slate-700 mb-2" />
                  <div className="flex justify-between font-bold">
                    <span className="text-white">Total</span>
                    <span className="text-blue-400 text-base">${activePlan.price}</span>
                  </div>
                </div>
              )}

              <button
                onClick={() => navigate("/premium/checkout", { state: { plan: selectedPlan } })}
                className="w-full py-4 rounded-xl font-black text-base bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-white shadow-lg shadow-blue-500/30 transition-all transform hover:-translate-y-0.5"
              >
                Continue with {activePlan?.label} Plan →
              </button>

              <p className="text-center text-xs text-slate-500 mt-4">
                🔒 Secured by Razorpay · UPI, Cards, NetBanking accepted
              </p>
            </div>
          </div>
        </div>
      </div>
    </CandidateLayout>
  );
}
