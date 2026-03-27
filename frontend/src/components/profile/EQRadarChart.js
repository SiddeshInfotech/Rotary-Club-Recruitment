export default function EQRadarChart({ scores = {} }) {
    const cx = 120, cy = 120, radius = 90;

    const traits = [
        "Leadership", "Loyalty", "Adaptability", "Growth Mindset",
        "Reliability", "Teamwork", "Collaboration", "Problem Solving",
    ];

    const n = traits.length;
    const angle = (i) => ((i * 2 * Math.PI) / n) - Math.PI / 2;

    const gridPoints = (factor) =>
        traits.map((_, i) => {
            const a = angle(i);
            return `${cx + Math.cos(a) * radius * factor},${cy + Math.sin(a) * radius * factor}`;
        }).join(" ");

    const dataPolygon = traits.map((t, i) => {
        const a = angle(i);
        const val = (scores[t] ?? 70) / 100;
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
        <svg viewBox="0 0 240 240" className="w-full h-full" aria-label="EQ radar chart">
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

            {traits.map((_, i) => {
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
                fill="#2563eb"
                fillOpacity="0.15"
                stroke="#2563eb"
                strokeWidth="2.5"
                strokeLinejoin="round"
                className="dark:fill-blue-500/20 dark:stroke-blue-400"
            />

            {traits.map((t, i) => {
                const a = angle(i);
                const val = (scores[t] ?? 70) / 100;
                return (
                    <circle
                        key={t}
                        cx={cx + Math.cos(a) * radius * val}
                        cy={cy + Math.sin(a) * radius * val}
                        r="3.5"
                        fill="#2563eb"
                        className="dark:fill-blue-400"
                    />
                );
            })}

            {traits.map((t, i) => {
                const { x, y } = labelPos(i);
                return (
                    <text
                        key={t}
                        x={x} y={y}
                        textAnchor={textAnchor(i)}
                        dominantBaseline="middle"
                        fontSize="7"
                        fontWeight="700"
                        letterSpacing="0.05em"
                        className="fill-slate-500 dark:fill-slate-400 uppercase"
                    >
                        {t}
                    </text>
                );
            })}
        </svg>
    );
}
