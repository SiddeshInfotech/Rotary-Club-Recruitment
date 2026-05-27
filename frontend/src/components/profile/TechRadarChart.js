export default function TechRadarChart({ scores = {} }) {
    const cx = 120, cy = 120, radius = 90;

    const dimensions = [
        { key: 'fundamentals', label: 'Fundamentals' },
        { key: 'architecture', label: 'Architecture' },
        { key: 'debugging', label: 'Debugging' },
        { key: 'bestPractices', label: 'Best Practices' },
        { key: 'tooling', label: 'Tooling' }
    ];

    const n = dimensions.length;
    const angle = (i) => ((i * 2 * Math.PI) / n) - Math.PI / 2;

    const gridPoints = (factor) =>
        dimensions.map((_, i) => {
            const a = angle(i);
            return `${cx + Math.cos(a) * radius * factor},${cy + Math.sin(a) * radius * factor}`;
        }).join(" ");

    const dataPolygon = dimensions.map((d, i) => {
        const a = angle(i);
        const val = (scores[d.key] ?? 70) / 100;
        return `${cx + Math.cos(a) * radius * val},${cy + Math.sin(a) * radius * val}`;
    }).join(" ");

    const labelPos = (i) => {
        const a = angle(i);
        return { x: cx + Math.cos(a) * (radius + 20), y: cy + Math.sin(a) * (radius + 20) };
    };

    const textAnchor = (i) => {
        const cos = Math.cos(angle(i));
        if (Math.abs(cos) < 0.15) return "middle";
        return cos > 0 ? "start" : "end";
    };

    return (
        <svg viewBox="0 0 240 240" className="w-full h-full" aria-label="Tech radar chart">
            {[0.3, 0.55, 0.8, 1.0].map((f, idx) => (
                <polygon
                    key={idx}
                    points={gridPoints(f)}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    className="text-slate-200 dark:text-slate-700"
                />
            ))}

            {dimensions.map((_, i) => {
                const a = angle(i);
                return (
                    <line
                        key={i}
                        x1={cx} y1={cy}
                        x2={cx + Math.cos(a) * radius}
                        y2={cy + Math.sin(a) * radius}
                        stroke="currentColor"
                        strokeWidth="1"
                        className="text-slate-200 dark:text-slate-700"
                    />
                );
            })}

            <polygon
                points={dataPolygon}
                fill="#059669"
                fillOpacity="0.15"
                stroke="#059669"
                strokeWidth="2.5"
                strokeLinejoin="round"
                className="dark:fill-emerald-500/20 dark:stroke-emerald-400"
            />

            {dimensions.map((d, i) => {
                const a = angle(i);
                const val = (scores[d.key] ?? 70) / 100;
                return (
                    <circle
                        key={d.key}
                        cx={cx + Math.cos(a) * radius * val}
                        cy={cy + Math.sin(a) * radius * val}
                        r="3.5"
                        fill="#059669"
                        className="dark:fill-emerald-400"
                    />
                );
            })}

            {dimensions.map((d, i) => {
                const { x, y } = labelPos(i);
                return (
                    <text
                        key={d.key}
                        x={x} y={y}
                        textAnchor={textAnchor(i)}
                        dominantBaseline="middle"
                        fontSize="7"
                        fontWeight="700"
                        letterSpacing="0.05em"
                        className="fill-slate-500 dark:fill-slate-400 uppercase"
                    >
                        {d.label}
                    </text>
                );
            })}
        </svg>
    );
}
