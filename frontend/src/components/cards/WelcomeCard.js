export default function WelcomCard() {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">

            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">
                    Welcome to Rotary Club Recruitment Portal
                </h2>
                <span className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
                    Dependable guardian
                </span>
            </div>

            <p className="text-gray-500 text-sm mt-2 leading-relaxed">
                Your EQ profile is actively matching you with recruiters who value
                reliability and structured problem solving.
            </p>

            <div className="mt-5 bg-gray-50 p-4 rounded-lg border">

                <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Profile completion</span>
                    <span className="text-blue-600 font-medium">85%</span>
                </div>

                <div className="w-full bg-gray-200 h-2 rounded-full"></div>

            </div>

        </div>
    )
}