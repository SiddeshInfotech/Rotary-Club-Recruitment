import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Brain, AlertCircle, Loader } from 'lucide-react';
import ThemeToggle from "../../components/common/ThemeToggle";
import api, { aiApi } from "../../services/api";
import { useAuth } from '../../context/AuthContext';

export default function EQAssessment() {
    const [scenarios, setScenarios] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [assessmentId, setAssessmentId] = useState(null);
    const [candidateId, setCandidateId] = useState(null);
    
    const navigate = useNavigate();
    const { user } = useAuth(); // <-- Grabbing actual logged in user!

    useEffect(() => {
        const initAssessment = async () => {
            try {
                if (!user || (!user.id && !user._id)) {
                     console.error("No logged in user found");
                     return;
                }
                const cid = user.id || user._id;
                setCandidateId(cid);

                // Tell AI Service to Generate unique EQ questions for this candidate based on their skills
                const res = await aiApi.post(`/assessment/generate/${cid}`);
                if (res.data.success) {
                    setScenarios(res.data.data.questions);
                    setAssessmentId(res.data.data.assessmentId);
                }
            } catch (err) {
                console.error("Failed to generate assessment:", err);
            } finally {
                setIsLoading(false);
            }
        };

        initAssessment();
    }, []);

    const currentScenario = scenarios[currentStep];

    const handleAnswerChange = (text) => {
        setAnswers(prev => ({ ...prev, [currentScenario?.id]: text }));
    };

    const handleNext = async () => {
        if (currentStep < scenarios.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            setIsSubmitting(true);
            try {
                // Format written answers into what the backend expects
                const formattedAnswers = Object.entries(answers).map(([qId, txt]) => ({
                    questionId: parseInt(qId),
                    answer: txt
                }));
                
                // Submit to Google Gemini for evaluation
                await aiApi.post(`/assessment/evaluate/${assessmentId}`, { answers: formattedAnswers });
                
                setTimeout(() => {
                    navigate('/profile'); // Redirect once scores are saved
                }, 3000);
            } catch (error) {
                console.error("Evaluation failed", error);
                setIsSubmitting(false);
            }
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-[#0b1121] text-slate-900 dark:text-white">
                <Brain className="w-12 h-12 mb-4 animate-pulse text-blue-600" />
                <p className="font-bold tracking-widest uppercase text-sm">Generating Personalized Assessment...</p>
            </div>
        );
    }

    if (isSubmitting) {
        return (
            <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#0b1121] text-slate-900 dark:text-white items-center justify-center">
                <Brain className="w-16 h-16 text-blue-600 animate-bounce mb-6" />
                <h2 className="text-3xl font-black mb-2">Analyzing Cognitive Footprint...</h2>
                <p className="text-slate-500 font-medium tracking-wide">Mapping your traits via Google Gemini AI</p>
                
                <div className="mt-10 w-64 h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="w-full h-full bg-blue-600 rounded-full animate-[progress_3s_ease-in-out]" />
                </div>
                
                <style>{`
                    @keyframes progress {
                        0% { width: 0%; }
                        20% { width: 40%; }
                        50% { width: 50%; }
                        80% { width: 90%; }
                        100% { width: 100%; }
                    }
                `}</style>
            </div>
        );
    }

    if (!scenarios || scenarios.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-[#0b1121] text-slate-900 dark:text-white">
                <p className="text-slate-500 font-medium">Failed to load scenarios. Please ensure both backends are running.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#0b1121] text-slate-900 dark:text-white font-sans">
            <header className="p-8 flex justify-between items-center z-10 border-b border-slate-200 dark:border-slate-800/60 bg-white/50 dark:bg-[#0b1121]/50 backdrop-blur-md sticky top-0">
                <div className="text-xl font-black tracking-tight flex items-center gap-2">
                    <Brain className="text-blue-600 w-6 h-6" />
                    EQ-Assessment
                </div>
                <div className="flex items-center gap-6">
                    <div className="text-xs uppercase tracking-widest font-bold text-slate-500">
                        Scenario {currentStep + 1} of {scenarios.length}
                    </div>
                    <ThemeToggle />
                </div>
            </header>

            <main className="flex-1 max-w-4xl w-full mx-auto p-6 pt-12 xl:pt-20">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                    {/* Left Column: Context */}
                    <div className="md:col-span-5 flex flex-col pt-4">
                        <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-500 bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-full mb-6 self-start">
                            <AlertCircle className="w-3.5 h-3.5" />
                            Behavioral Engine Active
                        </div>
                        <h2 className="text-3xl lg:text-4xl font-black leading-tight mb-4 tracking-tight capitalize break-words pr-4">
                            {currentScenario.dimension ? currentScenario.dimension.replace(/([A-Z])/g, ' $1').trim() : "Scenario"} Focus
                        </h2>
                        <div className="h-1 w-12 bg-blue-600 rounded-full mb-6"></div>
                        <p className="text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed italic">
                            "{currentScenario.context || currentScenario.question}"
                        </p>
                    </div>

                    {/* Right Column: Interactive Text Box */}
                    <div className="md:col-span-7 flex flex-col">
                        <h3 className="text-xl font-bold mb-6 text-slate-900 dark:text-white">
                            {currentScenario.context ? currentScenario.question : "Please provide your detailed approach:"}
                        </h3>

                        <textarea
                            value={answers[currentScenario.id] || ""}
                            onChange={(e) => handleAnswerChange(e.target.value)}
                            placeholder="Type how you would respond in this situation..."
                            rows={8}
                            className="w-full bg-white dark:bg-[#131b2f] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 text-[15px] focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none resize-none transition-all shadow-sm"
                        />

                        <div className="mt-8 flex justify-end">
                            <button
                                disabled={!answers[currentScenario.id] || answers[currentScenario.id].trim() === ""}
                                onClick={handleNext}
                                className={`flex items-center gap-2 px-8 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                                    answers[currentScenario.id]?.trim()
                                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 shadow-md transform hover:-translate-y-0.5' 
                                        : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                                }`}
                            >
                                {currentStep === scenarios.length - 1 ? 'Evaluate with Gemini' : 'Next Scenario'}
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
