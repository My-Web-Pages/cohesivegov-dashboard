// GLOBAL DATA STORE - Government Initiative Model
window.INITIATIVE_DATA = [
    {
        id: "INIT-2025-001",
        title: "Dismantle DEI Act",
        focusArea: "Social Subjects",
        leadAgency: "TBD",
        status: "Planned",
        progress: 0,
        priority: "High",
        vision: "Eliminate DEI initiatives across the government.",
        rationale: "Current DEI programs have created administrative burden and diverted resources from core governmental functions. There is growing concern about equity versus equality in federal programs and the need to refocus on merit-based systems.",
        goals: ["Draft legislation", "Gain legislative support", "Enact the law"],
        actionPlan: [
            { quarter: "Q1 2025", action: "Draft initial legislation and circulate for stakeholder review", status: "In Progress" },
            { quarter: "Q2 2025", action: "Present to relevant committees and gather feedback", status: "Planned" },
            { quarter: "Q3 2025", action: "Revise legislation based on committee input", status: "Planned" },
            { quarter: "Q4 2025", action: "Submit for congressional vote", status: "Planned" }
        ],
        referenceLinks: [
            { title: "Executive Order on DEI", url: "https://example.gov/eo-dei" },
            { title: "Congressional Research Service Report", url: "https://example.gov/crs-report" }
        ],
        stakeholders: [
            { name: "Congress", role: "Legislative Authority" },
            { name: "Executive Office", role: "Policy Oversight" }
        ],
        tags: ["Social Subjects", "Government Operations"],
        roadmap: {
            origin: "Concept Phase",
            destination: "Full Implementation",
            currentPhase: "Legislative Draft",
            milestones: ["Concept", "Draft", "Review", "Vote", "Enact"]
        },
        metrics: {
            projectStatus: "Behind Schedule",
            targetDate: "Q4 2025",
            lastUpdate: "2025-01-12",
            budget: "$2.5M"
        },
        statusNotes: "Legislative draft in progress. Awaiting committee review and stakeholder alignment on key provisions.",
        buyIn: "Divergent" // Stakeholder consensus: Unified, Divergent, Blocked
    },
    {
        id: "INIT-2025-003",
        title: "Department of Government Efficiency (DOGE)",
        focusArea: "Government Operations",
        leadAgency: "USDS",
        status: "In Progress",
        progress: 15,
        priority: "Critical",
        vision: "To modernize federal technology and software, thereby maximizing governmental efficiency and productivity.",
        goals: ["Reorganize USDS into DOGE", "Establish DOGE Teams in agencies", "Launch Software Modernization Initiative"],
        stakeholders: [
            { name: "USDS", role: "Lead Implementation" },
            { name: "Executive Office", role: "Executive Sponsor" },
            { name: "Federal Agencies", role: "Stakeholder" }
        ],
        tags: ["Executive Order", "Government Efficiency", "Software Modernization", "Interagency Collaboration"],
        roadmap: {
            origin: "Executive Order",
            destination: "Full Agency Integration",
            currentPhase: "Team Formation",
            milestones: ["EO Signed", "Team Formation", "Pilot Programs", "Rollout", "Integration"]
        },
        metrics: {
            projectStatus: "On Track",
            targetDate: "Q2 2026",
            lastUpdate: "2025-01-12",
            budget: "$125M"
        },
        statusNotes: "Team formation proceeding smoothly. Initial agency partnerships established and pilot programs scheduled for Q1 2025.",
        buyIn: "Unified"
    },
    {
        id: "INIT-2025-007",
        title: "U.S. Lithium Independence Innovation",
        focusArea: "Critical Minerals and Clean Energy",
        leadAgency: "DOE",
        status: "Planned",
        progress: 5,
        priority: "High",
        vision: "Secure the U.S. long-term supply of lithium by investing in clean, sustainable extraction methods from domestic sources.",
        goals: ["Fund low-impact harvesting R&D", "Digital mapping of sources", "Reduce foreign dependency by 40%"],
        stakeholders: [
            { name: "DOE", role: "Lead Agency" },
            { name: "Interior", role: "Resource Management" },
            { name: "Industry Partners", role: "Private Sector" }
        ],
        tags: ["Critical Minerals", "Energy Independence", "Lithium", "Clean Tech", "Domestic Mining"],
        roadmap: {
            origin: "Research Phase",
            destination: "Commercial Production",
            currentPhase: "Feasibility Study",
            milestones: ["Research", "Feasibility", "Pilot", "Scale-up", "Production"]
        },
        metrics: {
            projectStatus: "On Track",
            targetDate: "Q3 2027",
            lastUpdate: "2025-01-10",
            budget: "$500M"
        },
        statusNotes: "Feasibility studies underway. Environmental impact assessments in progress with positive early indicators.",
        buyIn: "Divergent"
    },
    {
        id: "INIT-2025-009",
        title: "Joint Legislation Development Team",
        focusArea: "Government Operations",
        leadAgency: "Legislative Branch",
        status: "In Progress",
        progress: 50,
        priority: "Medium",
        vision: "Improve legislative efficiency through collaboration.",
        goals: ["Form a joint team", "Develop collaborative platforms", "Implement joint sessions"],
        stakeholders: [
            { name: "Congress", role: "Primary Authority" },
            { name: "Committee Staff", role: "Support" }
        ],
        tags: ["Government Operations", "Technology and Innovation"],
        roadmap: {
            origin: "Proposal",
            destination: "Operational",
            currentPhase: "Platform Development",
            milestones: ["Proposal", "Team Formation", "Platform Dev", "Testing", "Launch"]
        },
        metrics: {
            projectStatus: "On Track",
            targetDate: "Q2 2025",
            lastUpdate: "2025-01-11",
            budget: "$8M"
        },
        statusNotes: "Platform development at 50% completion. User testing scheduled for next month with positive stakeholder feedback.",
        buyIn: "Unified"
    },
    {
        id: "INIT-2025-012",
        title: "National Cybersecurity Framework Update",
        focusArea: "Technology and Innovation",
        leadAgency: "CISA",
        status: "In Progress",
        progress: 35,
        priority: "Critical",
        vision: "Strengthen national cybersecurity posture through updated frameworks and standards.",
        goals: ["Update NIST framework", "Agency compliance program", "Public-private partnerships"],
        stakeholders: [
            { name: "CISA", role: "Lead Agency" },
            { name: "NIST", role: "Standards Development" },
            { name: "Private Sector", role: "Implementation Partner" }
        ],
        tags: ["Cybersecurity", "Technology", "National Security", "Standards"],
        roadmap: {
            origin: "Framework Review",
            destination: "National Adoption",
            currentPhase: "Standards Development",
            milestones: ["Review", "Draft Standards", "Public Comment", "Finalize", "Adoption"]
        },
        metrics: {
            projectStatus: "On Track",
            targetDate: "Q4 2025",
            lastUpdate: "2025-01-12",
            budget: "$75M"
        },
        statusNotes: "Draft standards completed. Public comment period opening next week with strong industry engagement anticipated.",
        buyIn: "Unified"
    },
    {
        id: "INIT-2025-015",
        title: "Rural Broadband Expansion Act",
        focusArea: "Infrastructure",
        leadAgency: "FCC",
        status: "Planned",
        progress: 0,
        priority: "High",
        vision: "Ensure universal broadband access across rural America.",
        goals: ["Allocate funding", "Partner with ISPs", "Deploy infrastructure"],
        stakeholders: [
            { name: "FCC", role: "Regulatory Authority" },
            { name: "USDA", role: "Rural Development" },
            { name: "ISPs", role: "Service Providers" }
        ],
        tags: ["Infrastructure", "Technology", "Rural Development", "Connectivity"],
        roadmap: {
            origin: "Legislative Proposal",
            destination: "Full Coverage",
            currentPhase: "Funding Allocation",
            milestones: ["Proposal", "Funding", "Partnerships", "Deployment", "Coverage"]
        },
        metrics: {
            projectStatus: "Behind Schedule",
            targetDate: "Q1 2028",
            lastUpdate: "2025-01-08",
            budget: "$2.1B"
        },
        statusNotes: "Funding allocation delayed due to budget negotiations. ISP partnership discussions ongoing with positive interest.",
        buyIn: "Blocked"
    }
];
