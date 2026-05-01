/**
 * EQProfileCard — Dynamic 8-Trait Radar Chart
 * Computes SVG polygon points from actual EQ scores (0–100).
 */
export default function EQProfileCard({ eqScores }) {
    // 8 traits in order (clockwise from top)
    const traitOrder = [
        'leadership', 'loyalty', 'adaptability', 'growthMindset',
        'reliability', 'teamwork', 'collaboration', 'problemSolving'
    ];

    const traitLabels = {
        leadership: 'LEADERSHIP',
        loyalty: 'LOYALTY',
        adaptability: 'ADAPTABILITY',
        growthMindset: 'GROWTH MINDSET',
        reliability: 'RELIABILITY',
        teamwork: 'TEAMWORK',
        collaboration: 'COLLABORATION',
        problemSolving: 'PROBLEM SOLVING',
    };

    const cx = 120, cy = 120, maxR = 100;

    // Compute (x, y) for a trait at index i with score 0–100
    function getPoint(index, score) {
        const angle = (Math.PI * 2 * index) / 8 - Math.PI / 2; // start from top
        const r = (score / 100) * maxR;
        return {
            x: cx + r * Math.cos(angle),
            y: cy + r * Math.sin(angle),
        };
    }

    // Grid polygons at 33%, 66%, 100%
    function getGridPolygon(scale) {
        return traitOrder.map((_, i) => {
            const p = getPoint(i, scale);
            return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
        }).join(' ');
    }

    // Data polygon from actual scores
    const scores = eqScores || {};
    const dataPoints = traitOrder.map((trait, i) => {
        const score = scores[trait] || 0;
        const p = getPoint(i, Math.max(score, 5)); // min 5 so the polygon is visible
        return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
    }).join(' ');

    // Circle positions for data points
    const circles = traitOrder.map((trait, i) => {
        const score = scores[trait] || 0;
        return getPoint(i, Math.max(score, 5));
    });

    // Axes
    const axes = traitOrder.map((_, i) => {
        const p = getPoint(i, 100);
        return { x2: p.x, y2: p.y };
    });

    // Label positions (outside the chart)
    const labelPositions = [
        { className: "absolute -top-3 left-1/2 -translate-x-1/2 text-center", key: 'leadership' },
        { className: "absolute top-6 -right-2", key: 'loyalty' },
        { className: "absolute top-1/2 -right-4 -translate-y-1/2", key: 'adaptability' },
        { className: "absolute bottom-6 -right-2 max-w-[60px] text-center leading-tight", key: 'growthMindset' },
        { className: "absolute -bottom-3 left-1/2 -translate-x-1/2 text-center", key: 'reliability' },
        { className: "absolute bottom-6 -left-2", key: 'teamwork' },
        { className: "absolute top-1/2 -left-4 -translate-y-1/2", key: 'collaboration' },
        { className: "absolute top-6 -left-2 max-w-[60px] text-center leading-tight", key: 'problemSolving' },
    ];

    return (
        <div className="bg-white dark:bg-[#131b2f] border border-slate-200 dark:border-[#1e293b] rounded-2xl p-5 w-full flex flex-col items-center justify-between shadow-sm dark:shadow-none hover:shadow-md transition relative overflow-hidden">
            <h3 className="text-[10px] tracking-widest font-bold uppercase text-slate-800 dark:text-slate-200 mb-6 w-full text-center">
                8-TRAIT EQ VISUALIZATION
            </h3>

            <div className="w-full flex items-center justify-center relative my-4">
                <svg viewBox="0 0 240 240" className="w-[220px] h-[220px] text-slate-200 dark:text-slate-700">
                    {/* Background Grids */}
                    <polygon points={getGridPolygon(100)} fill="none" stroke="currentColor" strokeWidth="1" />
                    <polygon points={getGridPolygon(66)} fill="none" stroke="currentColor" strokeWidth="1" />
                    <polygon points={getGridPolygon(33)} fill="none" stroke="currentColor" strokeWidth="1" />
                    
                    {/* Axes */}
                    {axes.map((a, i) => (
                        <line key={i} x1={cx} y1={cy} x2={a.x2} y2={a.y2} stroke="currentColor" strokeWidth="1" />
                    ))}

                    {/* Blue Data Polygon */}
                    <polygon
                        points={dataPoints}
                        fill="#2563eb"
                        fillOpacity="0.15"
                        stroke="#2563eb"
                        strokeWidth="2.5"
                        strokeLinejoin="round"
                        className="dark:fill-blue-500 dark:fill-opacity-20 dark:stroke-blue-400"
                    />
                    
                    {/* Data Points */}
                    {circles.map((c, i) => (
                        <circle key={i} cx={c.x.toFixed(1)} cy={c.y.toFixed(1)} r="3.5" fill="#2563eb" className="dark:fill-blue-400" />
                    ))}
                </svg>

                {/* Labels */}
                {labelPositions.map((lp) => (
                    <span
                        key={lp.key}
                        className={`${lp.className} text-[8px] sm:text-[9px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest bg-white/80 dark:bg-[#131b2f]/80 backdrop-blur-sm px-1 py-0.5 rounded`}
                    >
                        {traitLabels[lp.key]}
                    </span>
                ))}
            </div>

            <p className="text-[9px] uppercase font-bold tracking-widest text-slate-400 dark:text-slate-500 mt-6 w-full text-center leading-relaxed">
                Visual analysis based on your 60-point professional assessment.
            </p>
        </div>
    );
}