import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    ResponsiveContainer,
} from "recharts";

const data = [
    { subject: "Adaptability", value: 80 },
    { subject: "Loyalty", value: 75 },
    { subject: "Leadership", value: 85 },
    { subject: "Problem Solving", value: 78 },
    { subject: "Collaboration", value: 82 },
    { subject: "Teamwork", value: 88 },
    { subject: "Reliability", value: 90 },
    { subject: "Growth Mindset", value: 84 },
];

// Radar chart for EQ metrics using recharts
export default function EQProfileCard() {
    return (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">

            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-[17px] text-gray-900 tracking-tight">Your EQ Profile</h3>
                <span className="w-5 h-5 flex justify-center items-center rounded-full bg-gray-100 text-gray-500 text-[10px] font-bold cursor-pointer hover:bg-gray-200 transition">
                    i
                </span>
            </div>

            <div className="flex-1 w-full min-h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                        <PolarGrid stroke="#e5e7eb" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 10, fontWeight: 500 }} />
                        <Radar
                            dataKey="value"
                            stroke="#2563eb"
                            strokeWidth={2}
                            fill="#3b82f6"
                            fillOpacity={0.15}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>

            <p className="text-[11px] text-gray-400 text-center mt-4">
                Based on your 60-question assessment
            </p>

        </div>
    );
}