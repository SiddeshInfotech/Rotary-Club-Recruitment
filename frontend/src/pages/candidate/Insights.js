import React, { useState, useEffect } from "react";
import CandidateLayout from "../../layouts/CandidateLayout";
import EQRadarChart from "../../components/profile/EQRadarChart";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { Crown, Target, TrendingUp, ShieldAlert, Zap, Compass, Briefcase, ChevronRight, Code2, Users, MessageSquare, AlertCircle } from "lucide-react";
import api, { aiApi } from "../../services/api";

// --- Premium Insight Generators ---

const getLeadershipPersona = (topTrait) => {
    const personas = {
        "Leadership": { title: "The Visionary Commander", desc: "You naturally take charge and inspire others towards a unified goal. You thrive in environments that require decisive action and forward-thinking strategies." },
        "Loyalty": { title: "The Steadfast Anchor", desc: "You build deep, trust-based relationships. Teams rely on you as a pillar of stability, making you invaluable for long-term project success and retention." },
        "Adaptability": { title: "The Agile Navigator", desc: "You pivot effortlessly when faced with change. In chaotic or rapidly scaling environments, you are the calm center that finds the optimal path forward." },
        "Growth Mindset": { title: "The Relentless Innovator", desc: "You see failures purely as data for your next iteration. Your constant drive for self and team improvement pushes organizations beyond their comfort zones." },
        "Reliability": { title: "The Bedrock Executor", desc: "If you say it will be done, it gets done. You are the operational backbone of any team, turning abstract ideas into concrete deliverables." },
        "Teamwork": { title: "The Synergistic Catalyst", desc: "You intuitively understand group dynamics. You elevate the performance of everyone around you by ensuring all voices are heard and utilized." },
        "Collaboration": { title: "The Master Connector", desc: "You seamlessly bridge gaps between disparate departments or silos. You excel at negotiating shared outcomes and building cross-functional alliances." },
        "Problem Solving": { title: "The Analytical Architect", desc: "You deconstruct complex challenges into solvable components. You don't just fix symptoms; you design robust systems to prevent future issues." }
    };
    return personas[topTrait] || { title: "The Balanced Professional", desc: "You possess a well-rounded emotional toolkit, allowing you to adapt your style to whatever the situation demands." };
};

const getCareerTrajectory = (topTrait) => {
    const trajectories = {
        "Leadership": "Executive Management, Founder/CEO roles, or Directorships in matrix organizations.",
        "Loyalty": "Chief of Staff, VP of Human Resources, or Client Success Leadership.",
        "Adaptability": "Turnaround Consultant, Crisis Management, or Early-Stage Startup Lead.",
        "Growth Mindset": "Product Innovation, R&D Leadership, or Agile Transformation Coach.",
        "Reliability": "Chief Operating Officer, Head of Infrastructure, or Quality Assurance VP.",
        "Teamwork": "Scrum Master, Head of Culture, or Operations Manager.",
        "Collaboration": "Partnerships Director, Cross-functional Program Manager, or M&A Integrator.",
        "Problem Solving": "Principal Engineer, Lead Strategist, or Data Science Director."
    };
    return trajectories[topTrait] || "Versatile roles requiring balanced interpersonal and technical skills.";
};

const getGrowthPlan = (lowestTrait) => {
    const plans = {
        "Leadership": [
            "Volunteer to lead a low-risk, cross-functional initiative.",
            "Practice 'speaking last' in meetings to guide rather than dictate.",
            "Take a course on situational leadership frameworks."
        ],
        "Loyalty": [
            "Set regular 1-on-1s focused purely on relationship building.",
            "Publicly acknowledge the specific contributions of peers.",
            "Commit to a long-term mentorship relationship (as a mentor or mentee)."
        ],
        "Adaptability": [
            "Intentionally disrupt your daily routine once a week.",
            "When faced with a change, write down 3 potential benefits before reacting.",
            "Practice scenario planning for worst-case project outcomes."
        ],
        "Growth Mindset": [
            "Reframe 'I don't know how' to 'I haven't learned this yet'.",
            "Ask for highly critical feedback on your next presentation.",
            "Dedicate 2 hours a week to learning a skill completely outside your field."
        ],
        "Reliability": [
            "Implement a strict 'under-promise, over-deliver' personal policy.",
            "Use time-blocking to ensure deep work isn't interrupted.",
            "Audit your commitments and practice saying 'no' to non-essentials."
        ],
        "Teamwork": [
            "Ask 'How can I support your piece of this project?' weekly.",
            "Identify team friction points and proactively mediate them.",
            "Share credit explicitly and extensively when a project succeeds."
        ],
        "Collaboration": [
            "Schedule coffee chats with members of departments you rarely interact with.",
            "Before starting a task, ask 'Who else does this impact?'",
            "Co-author a document or presentation with someone who has a differing viewpoint."
        ],
        "Problem Solving": [
            "Use the 'Five Whys' technique on your next roadblock.",
            "Before suggesting a fix, write out the problem statement clearly.",
            "Study mental models like First Principles or Second-Order Thinking."
        ]
    };
    return plans[lowestTrait] || ["Reflect on your recent challenges.", "Seek feedback from a trusted peer.", "Set one micro-goal for next week."];
};

const getBlindSpot = (lowestTrait) => {
    const blindSpots = {
        "Leadership": { trigger: "When authority is ambiguous", response: "You may step back and wait for direction, causing project stalls.", fix: "Propose a temporary decision-making framework until formal leadership is established." },
        "Loyalty": { trigger: "During high-turnover periods", response: "You might disengage emotionally to protect yourself from organizational churn.", fix: "Focus on the mission of the work rather than specific personnel attachments." },
        "Adaptability": { trigger: "Sudden scope changes", response: "You may experience high stress and resist the new direction aggressively.", fix: "Request a 24-hour processing period before committing to the new paradigm." },
        "Growth Mindset": { trigger: "Receiving unexpected critical feedback", response: "You might become defensive and rationalize why the feedback is invalid.", fix: "Adopt a default response of 'Thank you, let me think about that' to buy cognitive space." },
        "Reliability": { trigger: "When overwhelmed with requests", response: "You may start dropping the ball silently rather than communicating bandwidth issues.", fix: "Implement a visual Kanban board visible to your team to signal capacity limits." },
        "Teamwork": { trigger: "When working with low-performers", response: "You might isolate yourself and try to do all the work independently to ensure quality.", fix: "Invest time in coaching the underperformer rather than absorbing their workload." },
        "Collaboration": { trigger: "During siloed, high-pressure sprints", response: "You may make unilateral decisions that inadvertently break other teams' workflows.", fix: "Mandate a 5-minute daily sync with adjacent teams during critical phases." },
        "Problem Solving": { trigger: "When faced with highly ambiguous, novel issues", response: "You might default to applying old solutions that don't fit the new context.", fix: "Force yourself to brainstorm 3 radically different approaches before executing." }
    };
    return blindSpots[lowestTrait] || { trigger: "Under extreme stress", response: "You may revert to isolated baseline behaviors.", fix: "Take a tactical pause." };
};

export default function Insights() {
    const { user } = useAuth();

    // Dynamically map backend database scores to Display Traits
    const dynamicEqScores = user?.eqScores ? {
        Leadership: user.eqScores.leadership || 0,
        Loyalty: user.eqScores.loyalty || 0,
        Adaptability: user.eqScores.adaptability || 0,
        "Growth Mindset": user.eqScores.growthMindset || 0,
        Reliability: user.eqScores.reliability || 0,
        Teamwork: user.eqScores.teamwork || 0,
        Collaboration: user.eqScores.collaboration || 0,
        "Problem Solving": user.eqScores.problemSolving || 0,
    } : {
        Leadership: 0, Loyalty: 0, Adaptability: 0, "Growth Mindset": 0,
        Reliability: 0, Teamwork: 0, Collaboration: 0, "Problem Solving": 0
    };

    let topAttribute = "Pending";
    let lowestAttribute = "Pending";
    let lowestScore = 0;
    
    if (user?.eqScores && user?.eqScores?.aggregate) {
        let maxScore = -1;
        let minScore = 999;
        Object.entries(dynamicEqScores).forEach(([trait, score]) => {
            if (score > maxScore) {
                maxScore = score;
                topAttribute = trait;
            }
            if (score < minScore) {
                minScore = score;
                lowestAttribute = trait;
                lowestScore = score;
            }
        });
    }

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // New premium state
    const [competitiveEdge, setCompetitiveEdge] = useState(null);
    const [interviewPrep, setInterviewPrep] = useState(null);
    const [generatingPrep, setGeneratingPrep] = useState(false);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const res = await api.get('/profile');
                if (res.data.success) {
                    const profileData = res.data.data;
                    setProfile(profileData);
                    
                    // If premium, fetch additional insights
                    if (profileData.isPremium) {
                        try {
                            const edgeRes = await api.get('/candidate-dashboard/competitive-edge');
                            if (edgeRes.data.success) {
                                setCompetitiveEdge(edgeRes.data.data);
                            }
                        } catch (e) {
                            console.error("Failed to fetch competitive edge", e);
                        }
                        
                        // Check if we have cached interview prep
                        if (profileData.premiumInsights?.interviewPrep) {
                            setInterviewPrep(profileData.premiumInsights.interviewPrep);
                        } else if (user?.id) {
                            // Automatically generate it if missing
                            generateInterviewPrep();
                        }
                    }
                }
            } catch (err) {
                console.error("Failed to fetch profile", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfileData();
    }, [user?.id]);
    
    const generateInterviewPrep = async () => {
        if (!user?.id) return;
        setGeneratingPrep(true);
        try {
            const res = await aiApi.post(`/interview-prep/generate/${user.id}`);
            if (res.data.success) {
                setInterviewPrep(res.data.data);
            }
        } catch (err) {
            console.error("Failed to generate interview prep:", err);
        } finally {
            setGeneratingPrep(false);
        }
    };

    const hasData = user?.eqScores && user?.eqScores?.aggregate;
    const isPremium = profile?.isPremium || false;

    // Dynamic AI Insights or Fallback
    const premiumData = profile?.premiumInsights;
    const persona = premiumData?.persona || getLeadershipPersona(topAttribute);
    const career = premiumData?.careerTrajectory || getCareerTrajectory(topAttribute);
    const growthPlan = premiumData?.growthPlan || getGrowthPlan(lowestAttribute);
    const blindSpot = premiumData?.blindSpot || getBlindSpot(lowestAttribute);

    return (
        <CandidateLayout>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-8">
                <div className="max-w-[700px]">
                    <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-[10px] tracking-widest font-bold text-slate-400 dark:text-slate-500 uppercase">ANALYTICS</h3>
                        <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm tracking-widest uppercase flex items-center gap-1 shadow-sm">
                            <Crown className="w-3 h-3" /> Premium
                        </span>
                    </div>
                    <h1 className="text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-4 font-serif">Deep EQ Insights</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-lg">
                        Go beyond the baseline. Unlock your leadership persona, career trajectory mapping, and actionable growth strategies based on your unique emotional footprint.
                    </p>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="w-10 h-10 border-4 border-slate-200 dark:border-slate-800 border-t-blue-600 rounded-full animate-spin"></div>
                </div>
            ) : !hasData ? (
                <div className="bg-white dark:bg-[#131b2f] border border-slate-200 dark:border-slate-800 rounded-[20px] p-12 shadow-sm flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-6">
                        <Zap className="w-10 h-10 text-blue-500" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-3">Awaiting Test Data</h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mb-8 max-w-md">
                        Take the EQ assessment to unlock your personalized premium insights, including your leadership persona and career trajectory.
                    </p>
                    <Link to="/eq-assessment" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-colors shadow-lg shadow-blue-500/30">
                        Take the Assessment Now
                    </Link>
                </div>
            ) : (
                <div className="relative">
                    {/* Non-Premium Overlay */}
                    {!isPremium && (
                        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/40 dark:bg-[#0b1120]/60 backdrop-blur-md rounded-[20px] border border-slate-200/50 dark:border-slate-800/50">
                            <div className="bg-white dark:bg-[#131b2f] p-8 rounded-2xl shadow-2xl flex flex-col items-center text-center max-w-md border border-slate-200 dark:border-slate-800">
                                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-orange-500/30">
                                    <Crown className="w-8 h-8 text-white" />
                                </div>
                                <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-3">Unlock Deep Insights</h2>
                                <p className="text-slate-500 dark:text-slate-400 font-medium mb-8">
                                    Upgrade to Premium to reveal your Leadership Persona, Actionable Growth Plan, and Cognitive Blind Spots.
                                </p>
                                <Link to="/premium/pricing" className="w-full bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2">
                                    Upgrade to Premium <ChevronRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    )}

                    <div className={!isPremium ? "pointer-events-none select-none opacity-40 blur-[4px] transition-all" : ""}>
                        {/* Top Section: Radar & Persona */}
                        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-8 mb-8">
                            {/* Radar Chart */}
                            <div className="bg-white dark:bg-[#131b2f] border border-slate-200 dark:border-slate-800 rounded-[20px] p-8 shadow-sm flex flex-col items-center justify-center">
                                <h3 className="text-sm font-bold tracking-widest text-slate-800 dark:text-slate-200 uppercase mb-8 self-start">COGNITIVE FOOTPRINT</h3>
                                <div className="w-full h-[320px]">
                                    <EQRadarChart scores={dynamicEqScores} />
                                </div>
                            </div>

                            {/* Leadership Persona */}
                            <div className="bg-gradient-to-br from-[#0d1b2a] to-[#1b263b] rounded-[20px] p-10 shadow-xl text-white relative overflow-hidden flex flex-col justify-center">
                                {/* Decorative background element */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                                
                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Crown className="w-5 h-5 text-amber-400" />
                                        <h4 className="text-[11px] uppercase tracking-widest font-bold text-amber-400">YOUR LEADERSHIP PERSONA</h4>
                                    </div>
                                    <h2 className="text-4xl font-black mb-6 font-serif tracking-tight">{persona.title}</h2>
                                    <p className="text-base text-slate-300 leading-relaxed font-medium mb-8 max-w-xl">
                                        {persona.desc}
                                    </p>
                                    
                                    <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-5 flex items-start gap-4 max-w-xl">
                                        <Briefcase className="w-6 h-6 text-blue-300 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <h5 className="text-xs font-bold uppercase tracking-wider text-blue-300 mb-1">Ideal Career Trajectory</h5>
                                            <p className="text-sm font-medium text-slate-200">{career}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* NEW PREMIUM FEATURE 1: Competitive Edge */}
                        {competitiveEdge && (
                            <div className="mb-10 bg-white dark:bg-[#131b2f] border border-slate-200 dark:border-slate-800 rounded-[20px] p-8 shadow-sm">
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <h4 className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-2">COMPETITIVE INTELLIGENCE</h4>
                                        <h2 className="text-2xl font-black text-slate-900 dark:text-white">Your Competitive Edge</h2>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">Benchmarked against {competitiveEdge.groupSize} candidates in: <span className="font-bold text-slate-700 dark:text-slate-300">{competitiveEdge.benchmarkGroup}</span></p>
                                    </div>
                                    <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/20 rounded-xl flex items-center justify-center">
                                        <Users className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {competitiveEdge.comparisons.map((comp, idx) => (
                                        <div key={idx} className="p-5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-[#0f172a]">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h5 className="text-sm font-bold text-slate-800 dark:text-slate-200">{comp.label}</h5>
                                                    <span className={`text-[9px] uppercase tracking-widest font-bold px-1.5 py-0.5 rounded ${comp.type === 'Tech' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                                                        {comp.type} Skill
                                                    </span>
                                                </div>
                                                <span className={`text-[10px] uppercase tracking-widest font-black px-2 py-1 rounded-md ${
                                                    comp.verdict === 'Exceptional' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                                    comp.verdict === 'Above Average' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                                    comp.verdict === 'Needs Focus' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                                    'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                                                }`}>
                                                    {comp.verdict}
                                                </span>
                                            </div>
                                            
                                            <div className="mb-2">
                                                <div className="flex justify-between text-xs font-medium text-slate-500 mb-1">
                                                    <span>Your Score</span>
                                                    <span className="font-bold text-slate-900 dark:text-white">{comp.yourScore}</span>
                                                </div>
                                                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                                                    <div className={`h-full rounded-full ${comp.yourScore > comp.groupAverage ? 'bg-emerald-500' : 'bg-blue-500'}`} style={{ width: `${comp.yourScore}%` }}></div>
                                                </div>
                                            </div>
                                            
                                            <div>
                                                <div className="flex justify-between text-xs font-medium text-slate-400 mb-1">
                                                    <span>Group Avg</span>
                                                    <span>{comp.groupAverage}</span>
                                                </div>
                                                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1 rounded-full overflow-hidden opacity-50">
                                                    <div className="h-full bg-slate-400 rounded-full" style={{ width: `${comp.groupAverage}%` }}></div>
                                                </div>
                                            </div>
                                            
                                            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 text-center">
                                                <span className="text-xs font-medium text-slate-500">Top <strong className="text-slate-800 dark:text-slate-200">{100 - comp.percentile}%</strong> of candidates</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* NEW PREMIUM FEATURE 2: Interview Prep Toolkit */}
                        <div className="mb-10 bg-white dark:bg-[#131b2f] border border-slate-200 dark:border-slate-800 rounded-[20px] p-8 shadow-sm">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h4 className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-2">AI-POWERED COACHING</h4>
                                    <h2 className="text-2xl font-black text-slate-900 dark:text-white">Interview Prep Toolkit</h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">Questions interviewers will likely ask to probe your weak areas, and how to answer them.</p>
                                </div>
                                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center cursor-pointer hover:scale-105 transition-transform" onClick={generateInterviewPrep}>
                                    <MessageSquare className={`w-6 h-6 text-blue-600 dark:text-blue-400 ${generatingPrep ? 'animate-pulse' : ''}`} />
                                </div>
                            </div>

                            {generatingPrep ? (
                                <div className="flex flex-col items-center justify-center py-10 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-slate-800 border-dashed">
                                    <div className="w-8 h-8 border-3 border-blue-200 dark:border-blue-900 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Generating personalized interview strategy...</p>
                                    <p className="text-xs text-slate-500 mt-1">Analyzing your EQ footprint and technical skills</p>
                                </div>
                            ) : interviewPrep ? (
                                <div>
                                    <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 p-5 rounded-xl mb-6">
                                        <h5 className="text-xs font-bold uppercase tracking-widest text-blue-800 dark:text-blue-300 mb-2">Overall Strategy</h5>
                                        <p className="text-sm text-blue-900 dark:text-blue-100 font-medium">{interviewPrep.overallStrategy}</p>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                                        <div className="lg:col-span-2 space-y-4">
                                            <h5 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4">Targeted Behavioral Questions</h5>
                                            {interviewPrep.questions.slice(0, 3).map((q, idx) => (
                                                <div key={idx} className="p-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0f172a]">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <span className="bg-slate-100 dark:bg-slate-800 text-xs font-bold px-2 py-1 rounded text-slate-600 dark:text-slate-400">Q{idx+1}</span>
                                                        <span className="text-xs font-bold uppercase tracking-widest text-amber-500">{q.targetTrait}</span>
                                                    </div>
                                                    <p className="text-base font-bold text-slate-900 dark:text-white mb-4">"{q.question}"</p>
                                                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
                                                        <p className="text-[11px] uppercase tracking-widest font-bold text-slate-400 mb-1">Ideal Response Strategy</p>
                                                        <p className="text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">{q.idealResponse}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        
                                        <div className="space-y-6">
                                            <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 rounded-xl p-5">
                                                <h5 className="text-xs font-bold uppercase tracking-widest text-emerald-800 dark:text-emerald-400 mb-4 flex items-center gap-2">
                                                    <Zap className="w-4 h-4" /> Power Phrases
                                                </h5>
                                                <ul className="space-y-3">
                                                    {interviewPrep.powerPhrases.map((phrase, idx) => (
                                                        <li key={idx} className="text-sm text-emerald-900 dark:text-emerald-100 font-medium pl-3 border-l-2 border-emerald-400">"{phrase}"</li>
                                                    ))}
                                                </ul>
                                            </div>
                                            
                                            <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-xl p-5">
                                                <h5 className="text-xs font-bold uppercase tracking-widest text-red-800 dark:text-red-400 mb-4 flex items-center gap-2">
                                                    <AlertCircle className="w-4 h-4" /> Red Flags to Avoid
                                                </h5>
                                                <ul className="space-y-3">
                                                    {interviewPrep.redFlags.map((flag, idx) => (
                                                        <li key={idx} className="text-sm text-red-900 dark:text-red-100 font-medium pl-3 border-l-2 border-red-400">{flag}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-6">
                                    <p className="text-sm text-slate-500">Failed to load interview prep.</p>
                                </div>
                            )}
                        </div>

                        {/* Bottom Section: Growth Plan & Blind Spots */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                            {/* Actionable Growth Plan */}
                            <div className="bg-white dark:bg-[#131b2f] border border-slate-200 dark:border-slate-800 rounded-[20px] p-8 shadow-sm">
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <h4 className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-2">ACTIONABLE GROWTH PLAN</h4>
                                        <h2 className="text-2xl font-black text-slate-900 dark:text-white">Optimizing {lowestAttribute}</h2>
                                    </div>
                                    <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                                        <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                    </div>
                                </div>
                                
                                <div className="mb-6">
                                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden mb-2">
                                        <div className="bg-amber-500 h-full rounded-full transition-all duration-1000" style={{ width: `${lowestScore}%` }}></div>
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium text-right">Current Score: {lowestScore}/100</p>
                                </div>

                                <div className="space-y-4">
                                    {growthPlan.map((step, index) => (
                                        <div key={index} className="flex gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-bold">
                                                {index + 1}
                                            </div>
                                            <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">{step}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Blind Spots & Stress Responses */}
                            <div className="bg-white dark:bg-[#131b2f] border border-slate-200 dark:border-slate-800 rounded-[20px] p-8 shadow-sm">
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <h4 className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-2">STRESS RESPONSE ANALYSIS</h4>
                                        <h2 className="text-2xl font-black text-slate-900 dark:text-white">Cognitive Blind Spots</h2>
                                    </div>
                                    <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 rounded-xl flex items-center justify-center">
                                        <ShieldAlert className="w-6 h-6 text-red-500" />
                                    </div>
                                </div>

                                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium mb-8">
                                    Under pressure, your lowest trait ({lowestAttribute.toLowerCase()}) can trigger default defense mechanisms. Being aware of these blind spots is the first step to mitigating them.
                                </p>

                                <div className="space-y-6">
                                    <div>
                                        <h5 className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-2">
                                            <Target className="w-4 h-4" /> The Trigger
                                        </h5>
                                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-300 font-medium">
                                            {blindSpot.trigger}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <h5 className="text-xs font-bold uppercase tracking-widest text-red-500 mb-2">Default Response</h5>
                                            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 text-sm text-red-900 dark:text-red-300 font-medium h-full">
                                                {blindSpot.response}
                                            </div>
                                        </div>
                                        <div>
                                            <h5 className="text-xs font-bold uppercase tracking-widest text-emerald-500 mb-2">Tactical Mitigation</h5>
                                            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 text-sm text-emerald-900 dark:text-emerald-300 font-medium h-full">
                                                {blindSpot.fix}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ===== TECHNICAL PROFICIENCY SECTION ===== */}
            {user?.technicalScores?.aggregate > 0 && (
                <div className="mt-12">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center">
                            <Code2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Technical Proficiency</h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Hard skills assessment results across 5 dimensions</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8">
                        {/* Proficiency Level Card */}
                        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-[20px] p-8 text-white flex flex-col items-center justify-center text-center shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                            <div className="relative z-10">
                                <h4 className="text-[10px] uppercase tracking-widest font-bold text-emerald-200 mb-4">PROFICIENCY LEVEL</h4>
                                <div className="text-6xl font-black mb-2">{user.technicalScores.aggregate}<span className="text-2xl text-emerald-200">%</span></div>
                                <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-2 rounded-lg mt-3">
                                    <div className={`w-2.5 h-2.5 rounded-full ${
                                        user.technicalScores.proficiencyLevel === 'expert' ? 'bg-yellow-400' :
                                        user.technicalScores.proficiencyLevel === 'advanced' ? 'bg-emerald-300' :
                                        user.technicalScores.proficiencyLevel === 'intermediate' ? 'bg-blue-300' :
                                        'bg-slate-300'
                                    }`}></div>
                                    <span className="text-sm font-bold capitalize">{user.technicalScores.proficiencyLevel?.replace('_', ' ') || 'Not Assessed'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Dimension Bars */}
                        <div className="bg-white dark:bg-[#131b2f] border border-slate-200 dark:border-slate-800 rounded-[20px] p-8 shadow-sm">
                            <h3 className="text-sm font-bold tracking-widest text-slate-800 dark:text-slate-200 uppercase mb-8">DIMENSION BREAKDOWN</h3>
                            <div className="space-y-6">
                                {[
                                    { key: 'fundamentals', label: 'Fundamentals', desc: 'Core concepts & syntax' },
                                    { key: 'architecture', label: 'Architecture', desc: 'System design & patterns' },
                                    { key: 'debugging', label: 'Debugging', desc: 'Bug identification & fixing' },
                                    { key: 'bestPractices', label: 'Best Practices', desc: 'Idiomatic & secure code' },
                                    { key: 'tooling', label: 'Tooling', desc: 'Dev tools & CI/CD' },
                                ].map(dim => {
                                    const score = user.technicalScores[dim.key] || 0;
                                    const color = score >= 80 ? 'bg-emerald-500' : score >= 60 ? 'bg-blue-500' : score >= 40 ? 'bg-amber-500' : 'bg-red-500';
                                    return (
                                        <div key={dim.key}>
                                            <div className="flex items-center justify-between mb-2">
                                                <div>
                                                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{dim.label}</span>
                                                    <span className="text-[11px] text-slate-400 ml-2 font-medium">{dim.desc}</span>
                                                </div>
                                                <span className="text-sm font-black text-slate-900 dark:text-white">{score}%</span>
                                            </div>
                                            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-1000 ${color}`}
                                                    style={{ width: `${score}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Tech Assessment CTA (if not taken) */}
            {(!user?.technicalScores || !user?.technicalScores?.aggregate) && (
                <div className="mt-12 bg-white dark:bg-[#131b2f] border border-slate-200 dark:border-slate-800 rounded-[20px] p-10 shadow-sm flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mb-5">
                        <Code2 className="w-8 h-8 text-emerald-500" />
                    </div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white mb-2">Technical Assessment Available</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-6 max-w-md">
                        Take the 25-question technical assessment to showcase your hard skills. Questions are tailored to your skill set with varying difficulty levels.
                    </p>
                    <Link to="/tech-assessment" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-bold transition-colors shadow-lg shadow-emerald-500/30">
                        Take Technical Assessment
                    </Link>
                </div>
            )}

        </CandidateLayout>
    );
}
