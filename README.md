# EQ-Hire (Rotary-Club-Recruitment)

**EQ-Hire** is an elite recruitment platform centered around Emotional Intelligence (EQ). It connects top-tier candidates with strategic roles across communities like the Rotary Club, Lions Club, and BNI Global Networks based on cognitive resonance and empathic intelligence.

## Candidate Platform Features

We've developed a comprehensive suite of candidate-facing pages derived from the high-fidelity design prototypes:

- **The EQ Journey (`EQJourney.js`)**: The immersive entry point for candidates to start their 12-minute Emotional Intelligence assessment. It sets a premium, data-driven tone.
- **Candidate Dashboard (`Dashboard.js`)**: The main "Candidate Intelligence" hub featuring the user's aggregate EQ score, global percentile, an interactive EQ Core DNA Analysis radar chart, AI-recommended matches, and active applications.
- **Curated Matches (`Matches.js` & `JobSearch.js`)**: Allows candidates to browse, filter, and review global opportunities. Highlights "Resonance Metrics" directly on job cards with detailed breakdowns of role alignment.
- **Candidate Portfolio (`CandidateProfile.js`)**: A highly detailed profile layout showing the user's Growth Journey, specific trait breakdowns, verified community memberships, and cognitive footprint.
- **Community Feed (`Network.js`)**: A premium network forum to engage with high-resonance leaders and discuss career development. Features suggested connections and dynamic post layouts.
- **Growth Tracking (`Growth.js`)**: Tracks leadership development and continuous EQ improvement over time with targeted recommendations.
- **Referral Portal (`Referrals.js`)**: A robust system to refer other elites into the ecosystem and track their progress through the interview and hiring pipeline.
- **EQ Analytics (`Insights.js`)**: Deep analytics breaking down the user’s cognitive footprint, identifying dominant leadership traits and potential areas to optimize.

## Key Developer Implementation Details

- **Responsive Grid System**: All pages utilize modern Tailwind (v3+) CSS techniques (e.g., `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` and `flex-wrap`) to maintain the beautiful 12-column layout requested by the designs across desktop and mobile viewing.
- **Unified Design Language**: We enforced a precise, contrast-heavy aesthetic combining `slate-900` / `blue-600` accents on light-mode, and `bg-[#0b1121]` deep navy in dark mode. Components utilize Lucide icons natively to ensure uniformity in iconography.
- **Route Injection**: The main front-end architecture uses standard `react-router-dom` mappings (`App.js`), tightly coupled with our custom `CandidateLayout.js` which houses the overarching sidebar and header contexts dynamically responsive to the active viewport state.

## Getting Started

1. Navigate to the `frontend/` directory.
2. Ensure you have dependencies installed (`npm install`).
3. Boot the environment using `npm run start` or `npm run dev`. Navigate to `/candidate` and interact with the newly mapped left-sidebar sections designed exclusively for the candidate UX.