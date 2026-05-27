import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Code2, AlertCircle, CheckCircle, ChevronLeft, Terminal, Cpu } from 'lucide-react';
import ThemeToggle from "../../components/common/ThemeToggle";
import api, { aiApi } from "../../services/api";
import { useAuth } from '../../context/AuthContext';

// --- Code Editor Display Component ---
function CodeEditor({ code, language }) {
    if (!code) return null;

    // Simple line numbering and syntax display
    const lines = code.split('\n');

    return (
        <div className="my-5 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-lg">
            {/* Editor Title Bar */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#1e1e2e] border-b border-slate-700">
                <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono ml-2 tracking-wide">
                        {language || 'code'}
                    </span>
                </div>
                <div className="flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Read Only</span>
                </div>
            </div>

            {/* Code Content */}
            <div className="bg-[#1e1e2e] overflow-x-auto">
                <pre className="p-0 m-0">
                    <code className="block text-sm font-mono leading-6">
                        {lines.map((line, index) => (
                            <div
                                key={index}
                                className="flex hover:bg-white/5 transition-colors"
                            >
                                {/* Line Number */}
                                <span className="select-none text-right text-slate-600 w-12 flex-shrink-0 pr-4 pl-4 border-r border-slate-700/50 text-xs leading-6 font-mono">
                                    {index + 1}
                                </span>
                                {/* Line Content */}
                                <span className="pl-4 pr-6 text-[#cdd6f4] whitespace-pre">
                                    {highlightSyntax(line, language)}
                                </span>
                            </div>
                        ))}
                    </code>
                </pre>
            </div>

            {/* Editor Footer */}
            <div className="flex items-center justify-between px-4 py-1.5 bg-[#181825] border-t border-slate-700/50">
                <span className="text-[10px] text-slate-500 font-mono">
                    {lines.length} lines
                </span>
                <span className="text-[10px] text-slate-500 font-mono uppercase">
                    {language || 'plain text'}
                </span>
            </div>
        </div>
    );
}

// --- Basic Syntax Highlighting ---
function highlightSyntax(line, language) {
    if (!language) return line;

    const lang = language.toLowerCase();
    const parts = [];
    let remaining = line;
    let key = 0;

    // Define keyword sets by language family
    const jsKeywords = /\b(const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|try|catch|finally|throw|new|delete|typeof|instanceof|class|extends|import|export|default|from|async|await|yield|this|super|null|undefined|true|false|console|require|module)\b/g;
    const pyKeywords = /\b(def|class|import|from|return|if|elif|else|for|while|try|except|finally|raise|with|as|lambda|yield|pass|break|continue|and|or|not|is|in|None|True|False|self|print|len|range|type|int|str|list|dict|set|tuple)\b/g;
    const javaKeywords = /\b(public|private|protected|static|final|abstract|class|interface|extends|implements|new|return|if|else|for|while|do|switch|case|break|continue|try|catch|finally|throw|throws|void|int|String|boolean|double|float|long|char|byte|short|null|true|false|this|super|import|package|System)\b/g;

    let keywordPattern;
    if (['javascript', 'js', 'typescript', 'ts', 'jsx', 'tsx', 'node', 'nodejs'].includes(lang)) {
        keywordPattern = jsKeywords;
    } else if (['python', 'py'].includes(lang)) {
        keywordPattern = pyKeywords;
    } else if (['java', 'c', 'cpp', 'c++', 'csharp', 'c#'].includes(lang)) {
        keywordPattern = javaKeywords;
    } else {
        keywordPattern = jsKeywords; // Default fallback
    }

    // Handle comments first
    const commentIndex = line.indexOf('//');
    const hashComment = line.indexOf('#');
    let commentStart = -1;

    if (commentIndex !== -1 && ['javascript', 'js', 'typescript', 'ts', 'java', 'c', 'cpp'].includes(lang)) {
        commentStart = commentIndex;
    } else if (hashComment !== -1 && ['python', 'py'].includes(lang)) {
        commentStart = hashComment;
    }

    if (commentStart !== -1) {
        const beforeComment = line.substring(0, commentStart);
        const comment = line.substring(commentStart);
        return (
            <>
                {highlightLine(beforeComment, keywordPattern)}
                <span style={{ color: '#6c7086', fontStyle: 'italic' }}>{comment}</span>
            </>
        );
    }

    return highlightLine(line, keywordPattern);
}

function highlightLine(text, keywordPattern) {
    if (!text) return text;

    const parts = [];
    let lastIndex = 0;
    let match;

    // Reset regex
    keywordPattern.lastIndex = 0;

    while ((match = keywordPattern.exec(text)) !== null) {
        // Add text before the keyword
        if (match.index > lastIndex) {
            parts.push(
                <span key={`t-${lastIndex}`}>{highlightStrings(text.substring(lastIndex, match.index))}</span>
            );
        }
        // Add the keyword with highlighting
        parts.push(
            <span key={`k-${match.index}`} style={{ color: '#cba6f7', fontWeight: 600 }}>{match[0]}</span>
        );
        lastIndex = keywordPattern.lastIndex;
    }

    // Add remaining text
    if (lastIndex < text.length) {
        parts.push(
            <span key={`t-${lastIndex}`}>{highlightStrings(text.substring(lastIndex))}</span>
        );
    }

    return parts.length > 0 ? <>{parts}</> : highlightStrings(text);
}

function highlightStrings(text) {
    if (!text) return text;

    // Highlight strings (both single and double quotes)
    const stringPattern = /(["'`])(?:(?!\1|\\).|\\.)*\1/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = stringPattern.exec(text)) !== null) {
        if (match.index > lastIndex) {
            parts.push(<span key={`s-${lastIndex}`}>{highlightNumbers(text.substring(lastIndex, match.index))}</span>);
        }
        parts.push(
            <span key={`str-${match.index}`} style={{ color: '#a6e3a1' }}>{match[0]}</span>
        );
        lastIndex = stringPattern.lastIndex;
    }

    if (lastIndex < text.length) {
        parts.push(<span key={`s-${lastIndex}`}>{highlightNumbers(text.substring(lastIndex))}</span>);
    }

    return parts.length > 0 ? <>{parts}</> : highlightNumbers(text);
}

function highlightNumbers(text) {
    if (!text) return text;

    const numberPattern = /\b(\d+\.?\d*)\b/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = numberPattern.exec(text)) !== null) {
        if (match.index > lastIndex) {
            parts.push(text.substring(lastIndex, match.index));
        }
        parts.push(
            <span key={`n-${match.index}`} style={{ color: '#fab387' }}>{match[0]}</span>
        );
        lastIndex = numberPattern.lastIndex;
    }

    if (lastIndex < text.length) {
        parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? <>{parts}</> : text;
}

// --- Difficulty Badge ---
function DifficultyBadge({ difficulty }) {
    const config = {
        easy: { label: 'Easy', bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800' },
        medium: { label: 'Medium', bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-800' },
        hard: { label: 'Hard', bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400', border: 'border-red-200 dark:border-red-800' },
    };

    const c = config[difficulty] || config.medium;

    return (
        <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border ${c.bg} ${c.text} ${c.border}`}>
            {c.label}
        </span>
    );
}

// --- Dimension Labels ---
const dimensionLabels = {
    fundamentals: 'Fundamentals',
    architecture: 'Architecture',
    debugging: 'Debugging',
    bestPractices: 'Best Practices',
    tooling: 'Tooling',
};

// ===== MAIN COMPONENT =====

export default function TechAssessment() {
    const [scenarios, setScenarios] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [assessmentId, setAssessmentId] = useState(null);
    const [candidateId, setCandidateId] = useState(null);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const { user, updateUser } = useAuth();

    useEffect(() => {
        const initAssessment = async () => {
            try {
                if (!user || (!user.id && !user._id)) {
                    console.error("No logged in user found");
                    setError("Please log in to take the technical assessment.");
                    return;
                }
                const cid = user.id || user._id;
                setCandidateId(cid);

                // Tell AI Service to Generate unique technical questions for this candidate
                const res = await aiApi.post(`/tech-assessment/generate/${cid}`);
                if (res.data.success) {
                    setScenarios(res.data.data.questions);
                    setAssessmentId(res.data.data.assessmentId);
                }
            } catch (err) {
                console.error("Failed to generate technical assessment:", err);
                if (err.response?.status === 429) {
                    setError(err.response.data.message || "You have already taken this assessment recently.");
                } else {
                    setError("Failed to generate assessment. Please ensure your profile has skills listed.");
                }
            } finally {
                setIsLoading(false);
            }
        };

        initAssessment();
    }, [user]);

    const currentScenario = scenarios[currentStep];

    const handleSelect = (optionId) => {
        setAnswers(prev => ({ ...prev, [currentScenario?.id]: optionId }));
    };

    const handleNext = async () => {
        if (currentStep < scenarios.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            setIsSubmitting(true);
            try {
                // Submit formatted answers to backend evaluator
                const formattedAnswers = Object.entries(answers).map(([qId, optId]) => ({
                    questionId: parseInt(qId),
                    answer: optId
                }));

                const res = await aiApi.post(`/tech-assessment/evaluate/${assessmentId}`, { answers: formattedAnswers });

                if (res.data && res.data.success) {
                    updateUser({
                        technicalScores: {
                            ...res.data.data.dimensionScores,
                            aggregate: res.data.data.overallScore,
                            proficiencyLevel: res.data.data.proficiencyLevel,
                        },
                        lastTechAssessedAt: new Date().toISOString()
                    });
                }

                setTimeout(() => {
                    navigate('/candidate');
                }, 3500);
            } catch (error) {
                console.error("Technical evaluation failed", error);
                setIsSubmitting(false);
            }
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    // --- Loading State ---
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-[#0b1121] text-slate-900 dark:text-white">
                <div className="relative">
                    <Cpu className="w-14 h-14 text-emerald-500 animate-pulse" />
                    <div className="absolute -inset-4 border-2 border-emerald-500/20 rounded-full animate-ping"></div>
                </div>
                <p className="font-bold tracking-widest uppercase text-sm mt-6">Generating Technical Assessment...</p>
                <p className="text-xs text-slate-500 mt-2 font-medium">Tailoring questions to your skill set</p>
            </div>
        );
    }

    // --- Error State ---
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-[#0b1121] text-slate-900 dark:text-white px-4">
                <AlertCircle className="w-12 h-12 mb-4 text-amber-500" />
                <h2 className="text-2xl font-bold mb-3 text-center">Assessment Unavailable</h2>
                <p className="text-slate-500 font-medium text-center max-w-md mb-8">{error}</p>
                <button
                    onClick={() => navigate('/candidate')}
                    className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-3 rounded-xl font-bold hover:opacity-90 transition-all"
                >
                    Back to Dashboard
                </button>
            </div>
        );
    }

    // --- Submitting State ---
    if (isSubmitting) {
        return (
            <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#0b1121] text-slate-900 dark:text-white items-center justify-center">
                <div className="relative mb-8">
                    <Code2 className="w-16 h-16 text-emerald-500" />
                    <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s' }}>
                        <div className="absolute top-0 left-1/2 w-2 h-2 bg-emerald-400 rounded-full -translate-x-1/2 -translate-y-4"></div>
                    </div>
                </div>
                <h2 className="text-3xl font-black mb-2">Analyzing Technical Proficiency...</h2>
                <p className="text-slate-500 font-medium tracking-wide">Computing your skill matrix across all dimensions</p>

                <div className="mt-10 w-72 h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full animate-[progress_3.5s_ease-in-out]" />
                </div>

                <div className="mt-8 flex gap-3">
                    {['Fundamentals', 'Architecture', 'Debugging', 'Practices', 'Tooling'].map((dim, i) => (
                        <span
                            key={dim}
                            className="text-[10px] font-bold tracking-widest uppercase text-slate-400 animate-pulse"
                            style={{ animationDelay: `${i * 0.4}s` }}
                        >
                            {dim}
                        </span>
                    ))}
                </div>

                <style>{`
                    @keyframes progress {
                        0% { width: 0%; }
                        15% { width: 25%; }
                        40% { width: 45%; }
                        65% { width: 70%; }
                        85% { width: 92%; }
                        100% { width: 100%; }
                    }
                `}</style>
            </div>
        );
    }

    // --- No Scenarios ---
    if (!scenarios || scenarios.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-[#0b1121] text-slate-900 dark:text-white">
                <p className="text-slate-500 font-medium flex flex-col items-center">
                    <AlertCircle className="w-10 h-10 mb-4 text-red-500" />
                    Failed to load technical questions. Please try again.
                </p>
            </div>
        );
    }

    // --- Progress Calculation ---
    const answeredCount = Object.keys(answers).length;
    const progressPercent = Math.round((answeredCount / scenarios.length) * 100);

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#0b1121] text-slate-900 dark:text-white font-sans">
            {/* Header */}
            <header className="p-6 flex justify-between items-center z-10 border-b border-slate-200 dark:border-slate-800/60 bg-white/50 dark:bg-[#0b1121]/50 backdrop-blur-md sticky top-0">
                <div className="text-xl font-black tracking-tight flex items-center gap-2">
                    <Code2 className="text-emerald-500 w-6 h-6" />
                    <span>Tech Assessment</span>
                </div>
                <div className="flex items-center gap-6">
                    {/* Progress Bar */}
                    <div className="hidden sm:flex items-center gap-3">
                        <div className="w-32 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                        <span className="text-[10px] font-bold tracking-widest text-slate-500">
                            {answeredCount}/{scenarios.length}
                        </span>
                    </div>
                    <div className="text-xs uppercase tracking-widest font-bold text-slate-500">
                        Q{currentStep + 1} of {scenarios.length}
                    </div>
                    <ThemeToggle />
                </div>
            </header>

            <main className="flex-1 max-w-5xl w-full mx-auto p-6 pt-10 xl:pt-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Left Column: Dimension & Difficulty */}
                    <div className="lg:col-span-4 flex flex-col pt-4">
                        <div className="flex items-center gap-2 mb-5">
                            <DifficultyBadge difficulty={currentScenario.difficulty} />
                        </div>

                        <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-full mb-5 self-start">
                            <Cpu className="w-3.5 h-3.5" />
                            {dimensionLabels[currentScenario.dimension] || currentScenario.dimension}
                        </div>

                        <h2 className="text-3xl lg:text-4xl font-black leading-tight mb-4 tracking-tight">
                            {dimensionLabels[currentScenario.dimension] || currentScenario.dimension}
                        </h2>
                        <div className="h-1 w-12 bg-emerald-500 rounded-full mb-5"></div>

                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                            {currentScenario.difficulty === 'easy' && 'Fundamental knowledge check — test your core understanding.'}
                            {currentScenario.difficulty === 'medium' && 'Applied knowledge — demonstrate practical understanding.'}
                            {currentScenario.difficulty === 'hard' && 'Advanced challenge — prove deep expertise and edge-case awareness.'}
                        </p>

                        {/* Dimension Progress */}
                        <div className="mt-8 space-y-2">
                            {Object.entries(dimensionLabels).map(([key, label]) => {
                                const dimQuestions = scenarios.filter(s => s.dimension === key);
                                const dimAnswered = dimQuestions.filter(s => answers[s.id]).length;
                                const pct = dimQuestions.length > 0 ? Math.round((dimAnswered / dimQuestions.length) * 100) : 0;
                                const isActive = currentScenario.dimension === key;
                                return (
                                    <div key={key} className={`flex items-center gap-3 text-xs transition-all ${isActive ? 'opacity-100' : 'opacity-50'}`}>
                                        <span className="w-24 font-bold text-slate-600 dark:text-slate-400 truncate">{label}</span>
                                        <div className="flex-1 h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                                        </div>
                                        <span className="text-slate-400 font-mono w-8 text-right">{dimAnswered}/{dimQuestions.length}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right Column: Question + Code + Options */}
                    <div className="lg:col-span-8 flex flex-col">
                        <h3 className="text-lg font-bold mb-2 text-slate-900 dark:text-white leading-relaxed">
                            {currentScenario.question}
                        </h3>

                        {/* Code Editor Display */}
                        {currentScenario.codeSnippet && (
                            <CodeEditor
                                code={currentScenario.codeSnippet}
                                language={currentScenario.codeLanguage}
                            />
                        )}

                        {/* Options */}
                        <div className="flex flex-col gap-3 mt-3">
                            {currentScenario.options?.map((option) => {
                                const isSelected = answers[currentScenario.id] === option.id;
                                return (
                                    <button
                                        key={option.id}
                                        onClick={() => handleSelect(option.id)}
                                        className={`group relative w-full text-left p-5 rounded-[16px] border transition-all duration-200 ${
                                            isSelected
                                                ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 shadow-md ring-1 ring-emerald-500'
                                                : 'bg-white dark:bg-[#131b2f] border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-sm'
                                        }`}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className={`mt-0.5 w-7 h-7 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-colors text-xs font-black ${
                                                isSelected
                                                    ? 'border-emerald-500 bg-emerald-500 text-white'
                                                    : 'border-slate-300 dark:border-slate-600 text-slate-400'
                                            }`}>
                                                {isSelected ? <CheckCircle className="w-4 h-4" /> : option.id}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-[14px] font-semibold leading-snug ${
                                                    isSelected ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'
                                                }`}>
                                                    {/* Render inline code within option text */}
                                                    {renderOptionText(option.text)}
                                                </p>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Navigation */}
                        <div className="mt-8 flex justify-between items-center">
                            <button
                                disabled={currentStep === 0}
                                onClick={handlePrevious}
                                className={`flex items-center gap-2 px-6 py-3.5 rounded-[16px] text-xs font-bold uppercase tracking-widest transition-all ${
                                    currentStep > 0
                                        ? 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700'
                                        : 'text-slate-300 dark:text-slate-700 cursor-not-allowed'
                                }`}
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Previous
                            </button>

                            <button
                                disabled={!answers[currentScenario.id]}
                                onClick={handleNext}
                                className={`flex items-center gap-2 px-8 py-3.5 rounded-[16px] text-xs font-black uppercase tracking-widest transition-all ${
                                    answers[currentScenario.id]
                                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 shadow-md transform hover:-translate-y-0.5'
                                        : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                                }`}
                            >
                                {currentStep === scenarios.length - 1 ? 'Calculate Proficiency' : 'Next Question'}
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

// --- Helper: Render option text with inline code formatting ---
function renderOptionText(text) {
    if (!text) return text;

    // Split on backtick-wrapped code: `code here`
    const parts = text.split(/(`[^`]+`)/g);

    return parts.map((part, index) => {
        if (part.startsWith('`') && part.endsWith('`')) {
            return (
                <code
                    key={index}
                    className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 text-[13px] font-mono font-medium"
                >
                    {part.slice(1, -1)}
                </code>
            );
        }
        return part;
    });
}
