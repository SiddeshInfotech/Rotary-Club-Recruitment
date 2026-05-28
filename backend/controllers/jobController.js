const Job = require("../models/Job");

// GET /api/jobs — List all jobs - teammate's original code
// exports.getAllJobs = async (req, res) => {
// try {
// const jobs = await Job.find().sort({ createdAt: -1 });
// res.json({ success: true, count: jobs.length, data: jobs });
// } catch (error) {
// res.status(500).json({ success: false, message: error.message });
// }
// };


// exports.getAllJobs = async (req, res) => {
// try {
// const { keyword, location, jobType, skills, remote } = req.query;
// // Only show "Active" jobs to candidates
// let query = { status: "Active" };

// if (keyword) {
// query.$or = [
// { title: { $regex: keyword, $options: "i" } },
// { description: { $regex: keyword, $options: "i" } },
// { companyName: { $regex: keyword, $options: "i" } }
// ];
// }
// if (location) query.location = { $regex: location, $options: "i" };
// if (remote === 'true') query.location = { $regex: "remote", $options: "i" };
// if (jobType && jobType !== 'All') query.type = jobType;
// if (skills) {
// query.skillsRequired = { $in: skills.split(',').map(s => s.trim()) };
// }

// const jobs = await Job.find(query).sort({ createdAt: -1 });
// res.json({ success: true, count: jobs.length, data: jobs });
// } catch (error) {
// res.status(500).json({ success: false, message: error.message });
// }
// };

exports.getAllJobs = async (req, res) => {
    try {
        // 1. Extract page/limit from the request
        const { keyword, location, jobType, skills, remote, page, limit } = req.query;
        
        // 2. Pagination Math
        const pageNumber = parseInt(page) || 1;
        const limitNumber = parseInt(limit) || 50;
        const skip = (pageNumber - 1) * limitNumber;

        let query = { status: "Active" };

        // ... (Keep your existing filtering logic here)
        if (keyword) {
            query.$or = [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
                { companyName: { $regex: keyword, $options: "i" } }
            ];
        }
        if (location) query.location = { $regex: location, $options: "i" };
        if (remote === 'true') query.location = { $regex: "remote", $options: "i" };
        if (jobType && jobType !== 'All') query.type = jobType;
        if (skills) {
            query.skillsRequired = { $in: skills.split(',').map(s => s.trim()) };
        }

        // 3. Update the Find command
        const jobs = await Job.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)           // Jump over already loaded jobs
            .limit(limitNumber);  // Only take the next "chunk"

        const totalJobs = await Job.countDocuments(query);

        res.json({ 
            success: true, 
            count: jobs.length, 
            totalJobs,
            hasNextPage: skip + jobs.length < totalJobs, // Tells frontend to show/hide button
            data: jobs 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/jobs/:id — Get single job - teammate's original code
// exports.getJobById = async (req, res) => {
// try {
// const job = await Job.findById(req.params.id);
// if (!job) {
// return res.status(404).json({ success: false, message: "Job not found" });
// }
// res.json({ success: true, data: job });
// } catch (error) {
// res.status(500).json({ success: false, message: error.message });
// }
// };

exports.getJobById = async (req, res) => {
try {
const job = await Job.findById(req.params.id).populate("recruiter", "name email company");
if (!job) {
return res.status(404).json({ success: false, message: "Job not found" });
}
res.json({ success: true, data: job });
} catch (error) {
res.status(500).json({ success: false, message: error.message });
}
};

// POST /api/jobs — Create a new job - teammate's original code
// exports.createJob = async (req, res) => {
// try {
// const job = await Job.create(req.body);
// res.status(201).json({ success: true, data: job });
// } catch (error) {
// res.status(400).json({ success: false, message: error.message });
// }
// };

exports.createJob = async (req, res) => {
try {
const job = await Job.create({
...req.body,
recruiter: req.user._id, // LINKING: Uses the ID from Auth Middleware
companyName: req.user.company || "EQ Hire Partner" // Pulls from user profile
});
res.status(201).json({ success: true, data: job });
} catch (error) {
res.status(400).json({ success: false, message: error.message });
}
};

// PUT /api/jobs/:id — Update a job - teammate's original code
// exports.updateJob = async (req, res) => {
// try {
// const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
// new: true,
// runValidators: true,
// });
// if (!job) {
// return res.status(404).json({ success: false, message: "Job not found" });
// }
// res.json({ success: true, data: job });
// } catch (error) {
// res.status(400).json({ success: false, message: error.message });
// }
// };

exports.updateJob = async (req, res) => {
try {
let job = await Job.findById(req.params.id);

if (!job) return res.status(404).json({ success: false, message: "Job not found" });

// SECURITY: Check if logged-in user is the one who posted it
if (job.recruiter.toString() !== req.user._id.toString()) {
return res.status(401).json({ success: false, message: "Unauthorized to update this job" });
}

job = await Job.findByIdAndUpdate(req.params.id, req.body, {
new: true,
runValidators: true,
});

res.json({ success: true, data: job });
} catch (error) {
res.status(400).json({ success: false, message: error.message });
}
};

// DELETE /api/jobs/:id — Delete a job - teammate's original code
// exports.deleteJob = async (req, res) => {
// try {
// const job = await Job.findByIdAndDelete(req.params.id);
// if (!job) {
// return res.status(404).json({ success: false, message: "Job not found" });
// }
// res.json({ success: true, message: "Job deleted successfully" });
// } catch (error) {
// res.status(500).json({ success: false, message: error.message });
// }
// };

exports.deleteJob = async (req, res) => {
try {
const job = await Job.findById(req.params.id);

if (!job) return res.status(404).json({ success: false, message: "Job not found" });

// SECURITY: Ensure owner is the one deleting
if (job.recruiter.toString() !== req.user._id.toString()) {
return res.status(401).json({ success: false, message: "Unauthorized" });
}

await job.deleteOne();
res.json({ success: true, message: "Job deleted successfully" });
} catch (error) {
res.status(500).json({ success: false, message: error.message });
}
};

// PATCH /api/jobs/:id/pause — Toggle job between Active and Paused - teammate's original code
// exports.pauseJob = async (req, res) => {
// try {
// const job = await Job.findById(req.params.id);
// if (!job) {
// return res.status(404).json({ success: false, message: "Job not found" });
// }
// job.status = job.status === "Paused" ? "Active" : "Paused";
// await job.save();
// res.json({ success: true, data: job });
// } catch (error) {
// res.status(500).json({ success: false, message: error.message });
// }
// };

exports.pauseJob = async (req, res) => {
try {
const job = await Job.findById(req.params.id);
if (!job) return res.status(404).json({ success: false, message: "Job not found" });

// SECURITY check
if (job.recruiter.toString() !== req.user._id.toString()) {
return res.status(401).json({ success: false, message: "Unauthorized" });
}

job.status = job.status === "Paused" ? "Active" : "Paused";
await job.save();
res.json({ success: true, data: job });
} catch (error) {
res.status(500).json({ success: false, message: error.message });
}
};