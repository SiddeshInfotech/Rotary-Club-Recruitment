import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Brain, AlertCircle, CheckCircle } from 'lucide-react';

const SCENARIOS = [
    {
        id: 1,
        title: "The Crisis Intervention",
        context: "Your team is two days away from a critical launch. The lead developer suddenly calls in sick, and a major bug is discovered in the core module.",
        question: "What is your immediate response?",
        options: [
            { text: "Take over the code yourself and work through the night to fix it.", trait: "Problem Solving" },
            { text: "Call an emergency meeting to redistribute tasks and reassure the team.", trait: "Leadership" },
            { text: "Delay the launch to prioritize quality and reduce team panic.", trait: "Empathy" },
            { text: "Create a rapid patch plan and consult the remaining senior engineers.", trait: "Collaboration" }
        ]
    },
    {
        id: 2,
        title: "The Critical Feedback",
        context: "During a public all-hands meeting, the CEO sharply criticizes a feature your specific sub-team recently deployed.",
        question: "How do you handle the situation?",
        options: [
            { text: "Defend your team's work calmly using data and metrics.", trait: "Resilience" },
            { text: "Stay quiet during the meeting, but speak to the CEO privately after.", trait: "Emotional Control" },
            { text: "Acknowledge the feedback openly and ask for specific improvement areas.", trait: "Growth Mindset" },
            { text: "Immediately message your team to prevent a drop in morale.", trait: "Empathy" }
        ]
    },
    {
        id: 3,
        title: "The Strategic Pivot",
        context: "You've spent six months building a product strategy. Market conditions change overnight, rendering 80% of your work obsolete.",
        question: "What is your reaction sequence?",
        options: [
            { text: "Salvage what components are reusable before planning the pivot.", trait: "Pragmatism" },
            { text: "Hold a highly transparent retro to mourn the loss, then pivot.", trait: "Transparency" },
            { text: "Quickly draft a wildly new strategy to capitalize on the changed market.", trait: "Adaptability" },
            { text: "Wait for executive direction before taking any action.", trait: "Caution" }
        ]
    }
];

export default function EQAssessment() {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const currentScenario = SCENARIOS[currentStep];
    const isFinished = currentStep >= SCENARIOS.length;

    const handleSelect = (optionIndex) => {
        setAnswers(prev => ({ ...prev, [currentStep]: optionIndex }));
    };

    const handleNext = () => {
        if (currentStep < SCENARIOS.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            setIsSubmitting(true);
            setTimeout(() => {
                navigate('/profile'); // Redirect after completion
            }, 3000);
        }
    };

    if (isSubmitting) {
        return (
            <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#0b1121] text-slate-900 dark:text-white items-center justify-center">
                <Brain className="w-16 h-16 text-blue-600 animate-pulse mb-6" />
                <h2 className="text-3xl font-black mb-2">Analyzing Cognitive Footprint...</h2>
                <p className="text-slate-500 font-medium tracking-wide">Mapping your traits to elite profiles</p>
                
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

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#0b1121] text-slate-900 dark:text-white font-sans">
            <header className="p-8 flex justify-between items-center z-10 border-b border-slate-200 dark:border-slate-800/60 bg-white/50 dark:bg-[#0b1121]/50 backdrop-blur-md sticky top-0">
                <div className="text-xl font-black tracking-tight flex items-center gap-2">
                    <Brain className="text-blue-600 w-6 h-6" />
                    EQ-Assessment
                </div>
                <div className="flex items-center gap-6">
                    <div className="text-xs uppercase tracking-widest font-bold text-slate-500">
                        Scenario {currentStep + 1} of {SCENARIOS.length}
                    </div>
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
                        <h2 className="text-4xl lg:text-5xl font-black leading-tight mb-4 tracking-tight">
                            {currentScenario.title}
                        </h2>
                        <div className="h-1 w-12 bg-blue-600 rounded-full mb-6"></div>
                        <p className="text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed italic">
                            "{currentScenario.context}"
                        </p>
                    </div>

                    {/* Right Column: Interactive Questions */}
                    <div className="md:col-span-7 flex flex-col">
                        <h3 className="text-xl font-bold mb-6 text-slate-900 dark:text-white">
                            {currentScenario.question}
                        </h3>

                        <div className="flex flex-col gap-3">
                            {currentScenario.options.map((option, index) => {
                                const isSelected = answers[currentStep] === index;
                                return (
                                    <button
                                        key={index}
                                        onClick={() => handleSelect(index)}
                                        className={`group relative w-full text-left p-5 rounded-[20px] border transition-all duration-200 ${
                                            isSelected 
                                                ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-600 shadow-md ring-1 ring-blue-600' 
                                                : 'bg-white dark:bg-[#131b2f] border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-sm'
                                        }`}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className={`mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors ${
                                                isSelected ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300 dark:border-slate-600'
                                            }`}>
                                                {isSelected && <CheckCircle className="w-3.5 h-3.5" />}
                                            </div>
                                            <div>
                                                <p className={`text-[15px] font-semibold leading-snug ${isSelected ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                                                    {option.text}
                                                </p>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        <div className="mt-8 flex justify-end">
                            <button
                                disabled={answers[currentStep] === undefined}
                                onClick={handleNext}
                                className={`flex items-center gap-2 px-8 py-4 rounded-[20px] text-xs font-black uppercase tracking-widest transition-all ${
                                    answers[currentStep] !== undefined 
                                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 shadow-md transform hover:-translate-y-0.5' 
                                        : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                                }`}
                            >
                                {currentStep === SCENARIOS.length - 1 ? 'Calculate Profile' : 'Next Scenario'}
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
