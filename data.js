/* ========================================================
   E.S.T — Default Data Store
   All site content is stored in localStorage so admins
   can edit it without touching source code.
   ======================================================== */

const DEFAULT_DATA = {

    // ---- Settings ----
    settings: {
        pageTitle: "E.S.T — Engineering Support Troop",
        frontDoorEmail: "esector-frontdoor@organisation.com",
        frontDoorPortalUrl: "#",
        frontDoorEmailSubject: "VRED Service Request - [Project Name]",
        frontDoorEmailBody: "Hi E Sector Team,\n\nI would like to request your services.",
        youAreHereBadge: "You are here",
        adminUser: "admin54321",
        adminPass: "admin12345",
        topBarLogo: "EST.png",
        heroLogo: "EST.png",
        topBarRightLogo: "O3.png",
        orgLabelTop: "Sector Leads",
        orgLabelMiddle: "Project Management",
        orgLabelBottom: "Tech Leads",
        orgLabelResources: "Team Resources"
    },

    // ---- Hero / Banner ----
    hero: {
        title: "E.S.T",
        subtitle: "Engineering Support Troop",
        tags: ["Android", "Web Applications", "Windows", "Linux", "IoT", "Malware Analysis"]
    },

    // ---- Who We Are ----
    whoWeAre: {
        paragraph: "E Sector is a specialist Vulnerability Research, Reverse Engineering, and Exploit Development (VRED) team operating in direct support of business priorities. We combine deep technical expertise with operational understanding to identify, analyse, and demonstrate real-world risk across a broad technology landscape \u2014 from Android and iOS applications to Windows and Linux operating systems, web platforms, IoT firmware, and bespoke software stacks. Our mission is to ensure that the most critical attack surfaces are assessed first, and that every finding translates directly into actionable intelligence for stakeholders and decision-makers."
    },

    // ---- Services We Offer ----
    services: [
        {
            id: "svc1",
            icon: "&#128270;",
            title: "Software Vulnerability Research",
            description: "E Sector conducts deep-dive vulnerability research across a broad technology landscape. Our analysts identify zero-day vulnerabilities, logic flaws, memory corruption issues, and authentication bypasses within Android applications, web platforms, Windows & Linux operating systems, and bespoke software stacks. Every engagement is driven by business priorities \u2014 ensuring the most critical attack surfaces are assessed first and that findings translate directly into actionable intelligence for stakeholders."
        },
        {
            id: "svc2",
            icon: "&#128295;",
            title: "Software Reverse Engineering",
            description: "Our reverse engineering capability dissects compiled binaries, obfuscated mobile applications, firmware images, and network protocols to understand how software truly operates beneath the surface. Using industry-leading tools and custom-built frameworks, E Sector transforms opaque targets into transparent, well-understood systems \u2014 enabling informed decision-making, capability development, and rapid response to emerging threats across all supported platforms."
        },
        {
            id: "svc3",
            icon: "&#9889;",
            title: "Exploit Development",
            description: "When vulnerabilities are discovered, E Sector\u2019s exploit development team transforms theoretical weaknesses into reliable, demonstrable proof-of-concept capabilities. From browser-based exploitation chains and Android privilege escalation to kernel-level attacks on Windows and Linux, our developers craft sophisticated tooling that validates risk, proves impact, and directly supports business objectives. All work is conducted within strict governance frameworks ensuring responsible handling and operational security."
        }
    ],

    // ---- Front Door Content ----
    frontDoor: {
        title: "Request Our Services",
        description: "The VRED Front Door is your single point of entry for engaging E Sector. Whether you require a targeted vulnerability assessment, a reverse engineering deep-dive, or bespoke exploit development, all requests are triaged through our front door process to ensure appropriate resourcing, prioritisation, and alignment with business objectives.",
        steps: [
            "Submit your request via the Front Door email or portal link below",
            "Our project management team triages, scopes, and resources the engagement",
            "Findings, reports, and tooling are delivered through secure channels"
        ]
    },

    // ---- Where We Sit (org chain) ----
    whereWeSit: [
        { id: "ws1", label: "Foreign Office", image: "fcdo.png" },
        { id: "ws2", label: "Intelligence Vector", image: "io.png" },
        { id: "ws3", label: "Cyber Force", image: "cf.png" },
        { id: "ws4", label: "SCC", image: "scc.png" },
        { id: "ws5", label: "O3", image: "O3.png" },
        { id: "ws6", label: "EST", image: "EST.png" }
    ],

    // ---- Section Titles ----
    sectionTitles: {
        whoWeAre: "About Us",
        services: "Services We Offer",
        leadership: "Team Leadership",
        orgStructure: "Team Structure",
        frontDoor: "VRED Front Door Portal",
        projects: "Current Projects",
        successes: "Project Successes",
        prevProjects: "Previous Projects",
        stats: "Technology Dashboard",
        links: "Important Links"
    },

    // ---- Footer ----
    footer: {
        text: "E.S.T \u2014 Engineering Support Troop. All rights reserved."
    },

    // ---- Leadership ----
    // tier: "top" = Sector Leads, "middle" = Project Management, "bottom" = Tech Leads
    // order: sort position within tier (lower = further left)
    leadership: [
        {
            id: "l1",
            name: "James Tavernier",
            role: "Sector Lead",
            initials: "JT",
            color: "#0052cc",
            phone: "+44 7700 900001",
            email: "james.tavernier@organisation.com",
            workId: "EST-001",
            tier: "top",
            order: 0
        },
        {
            id: "l2",
            name: "Connor Goldson",
            role: "Sector Project Manager",
            initials: "CG",
            color: "#6554c0",
            phone: "+44 7700 900002",
            email: "connor.goldson@organisation.com",
            workId: "EST-002",
            tier: "middle",
            order: 0
        },
        {
            id: "l3",
            name: "Todd Cantwell",
            role: "Sector Tech Lead \u2014 VR",
            initials: "TC",
            color: "#00875a",
            phone: "+44 7700 900003",
            email: "todd.cantwell@organisation.com",
            workId: "EST-003",
            tier: "bottom",
            order: 0
        },
        {
            id: "l4",
            name: "Cyriel Dessers",
            role: "Sector Tech Lead \u2014 RE",
            initials: "CD",
            color: "#de350b",
            phone: "+44 7700 900004",
            email: "cyriel.dessers@organisation.com",
            workId: "EST-004",
            tier: "bottom",
            order: 1
        },
        {
            id: "l5",
            name: "Tom Lawrence",
            role: "Sector Tech Lead \u2014 Exploit Dev",
            initials: "TL",
            color: "#ff8b00",
            phone: "+44 7700 900005",
            email: "tom.lawrence@organisation.com",
            workId: "EST-005",
            tier: "bottom",
            order: 2
        }
    ],

    // ---- Org Structure (groups below tech leads) ----
    orgGroups: [
        { id: "og1", label: "Staff Members", count: 7, type: "staff", icon: "&#128101;", image: "fo.png" },
        { id: "og2", label: "Military Integrees", count: 2, type: "military", icon: "&#127894;", image: "mod.png" },
        { id: "og3", label: "Capgemini Contractors", count: 3, type: "contractor", icon: "&#128188;", image: "cap.png" },
        { id: "og4", label: "BAE Systems Contractors", count: 15, type: "partner", icon: "&#127981;", image: "bae.png" }
    ],

    // ---- Current Projects ----
    projects: [
        {
            id: "p1",
            name: "Project VALKYRIE",
            description: "Full-scope vulnerability assessment of a critical Android messaging application used across defence networks. Includes static analysis, dynamic instrumentation, and network protocol fuzzing to identify exploitable vulnerabilities in the APK and its backend APIs.",
            status: "active",
            tags: ["Android", "API", "Fuzzing"]
        },
        {
            id: "p2",
            name: "Project CERBERUS",
            description: "Reverse engineering and exploit development targeting a bespoke Windows desktop application deployed across enterprise environments. Focus on binary analysis, DLL injection vectors, and privilege escalation from standard user to SYSTEM.",
            status: "active",
            tags: ["Windows", "Reverse Engineering", "Exploit Dev"]
        },
        {
            id: "p3",
            name: "Project TRIDENT",
            description: "Web application security assessment of a large-scale SaaS platform. Comprehensive testing of authentication flows, authorisation controls, API endpoints, and client-side security including XSS, CSRF, and IDOR vulnerability classes.",
            status: "active",
            tags: ["Web App", "API", "Auth Bypass"]
        },
        {
            id: "p4",
            name: "Project FENRIR",
            description: "Linux kernel module reverse engineering engagement. Analysing a custom kernel driver for a specialised hardware platform to identify memory corruption vulnerabilities and develop proof-of-concept exploits demonstrating full kernel compromise.",
            status: "active",
            tags: ["Linux", "Kernel", "Exploit Dev"]
        },
        {
            id: "p5",
            name: "Project PHANTOM",
            description: "Malware reverse engineering and capability development. Dissecting advanced persistent threat tooling to understand TTPs, extract IOCs, and develop defensive signatures and detection rules for enterprise deployment.",
            status: "review",
            tags: ["Malware", "Reverse Engineering", "Threat Intel"]
        },
        {
            id: "p6",
            name: "Project AEGIS",
            description: "Security assessment of an IoT device ecosystem including firmware extraction, embedded Linux analysis, Bluetooth Low Energy protocol assessment, and cloud API backend testing across the full device communication stack.",
            status: "planning",
            tags: ["IoT", "Firmware", "Linux"]
        }
    ],

    // ---- Project Successes ----
    successes: [
        {
            id: "s1",
            title: "Critical Zero-Day in Defence Messaging Platform",
            date: "November 2025",
            summary: "Discovered a chain of three vulnerabilities in a widely-deployed defence messaging application that, when combined, allowed unauthenticated remote code execution on both client and server components.",
            fullArticle: "<p>In November 2025, E Sector\u2019s vulnerability research team identified a critical chain of three previously unknown vulnerabilities within a messaging platform deployed across multiple defence organisations.</p><p>The research began with a routine static analysis of the application\u2019s Android APK, which revealed an insecure deserialization endpoint in the message parsing logic. Further investigation through dynamic instrumentation uncovered that the application\u2019s certificate pinning implementation could be bypassed through a subtle timing attack on the TLS handshake verification.</p><p>The third and most critical finding was a server-side template injection vulnerability in the message rendering engine that, when combined with the deserialization flaw, allowed an attacker to achieve unauthenticated remote code execution on both the client device and the backend message processing server.</p><p>E Sector developed a full proof-of-concept exploit chain demonstrating the impact, which was responsibly disclosed to the vendor. The findings led to an emergency patch cycle and a comprehensive security review of the entire platform architecture.</p>"
        },
        {
            id: "s2",
            title: "Windows Kernel Privilege Escalation \u2014 Enterprise Rollout Halted",
            date: "August 2025",
            summary: "Identified a privilege escalation vulnerability in a Windows kernel driver scheduled for enterprise-wide deployment, preventing a potential organisation-wide compromise.",
            fullArticle: "<p>During a routine pre-deployment security assessment, E Sector\u2019s reverse engineering team discovered a critical use-after-free vulnerability in a custom Windows kernel driver that was scheduled for organisation-wide deployment.</p><p>The vulnerability existed in the driver\u2019s IOCTL handler, where a race condition between two concurrent device operations could lead to a dangling pointer dereference in kernel pool memory. Our exploit development team crafted a reliable proof-of-concept that demonstrated escalation from a standard user account to NT AUTHORITY\\SYSTEM in under 30 seconds.</p><p>The discovery was immediately escalated through the appropriate channels, resulting in the deployment being halted pending a full code review and remediation.</p>"
        },
        {
            id: "s3",
            title: "Web Application Auth Bypass \u2014 Financial Data Exposure",
            date: "May 2025",
            summary: "Uncovered a critical authentication bypass in a financial reporting web application that exposed sensitive financial records of over 50,000 users through an IDOR combined with JWT manipulation.",
            fullArticle: "<p>E Sector was engaged to conduct a security assessment of a financial reporting platform processing sensitive financial data. Our web application testing team identified a critical authentication bypass that combined two vulnerability classes to devastating effect.</p><p>The first finding was an Insecure Direct Object Reference (IDOR) in the user profile API endpoint. The second was a JWT token manipulation vulnerability where the application accepted tokens signed with the \u2018none\u2019 algorithm, effectively allowing any user to forge administrative tokens.</p><p>When combined, these vulnerabilities allowed an unauthenticated attacker to access financial records for the platform\u2019s entire user base of over 50,000 individuals.</p>"
        },
        {
            id: "s4",
            title: "APT Malware Reverse Engineering \u2014 Campaign Attribution",
            date: "February 2025",
            summary: "Conducted deep reverse engineering of a sophisticated multi-stage malware implant, leading to successful attribution of an advanced persistent threat campaign targeting critical national infrastructure.",
            fullArticle: "<p>E Sector\u2019s reverse engineering capability was called upon to analyse a sophisticated piece of malware recovered from a compromised critical national infrastructure network. The implant exhibited advanced anti-analysis techniques including virtualised code, time-based execution guards, and environment-aware sandbox detection.</p><p>Over a three-week intensive analysis period, our team systematically defeated each anti-analysis layer, ultimately revealing a modular implant framework with capabilities including keylogging, screen capture, credential harvesting, and lateral movement.</p><p>Defensive signatures and YARA rules developed during this analysis were deployed across the organisation\u2019s detection infrastructure, leading to the identification of three additional compromised systems.</p>"
        },
        {
            id: "s5",
            title: "Android Banking Trojan \u2014 Supply Chain Interception",
            date: "October 2024",
            summary: "Reverse engineered a trojanised Android SDK distributed through a legitimate developer library, preventing its integration into multiple production banking applications.",
            fullArticle: "<p>E Sector identified a supply chain compromise affecting a widely-used Android development SDK distributed through a popular package repository. The trojanised library contained a dormant payload that would activate only when integrated into applications matching specific package name patterns \u2014 specifically targeting banking and financial applications.</p><p>The findings were reported to the package repository maintainers and affected banking application developers, leading to the removal of the compromised SDK and a coordinated advisory across the financial sector. An estimated 12 banking applications in active development were prevented from shipping with the compromised dependency.</p>"
        },
        {
            id: "s6",
            title: "IoT Firmware Backdoor \u2014 Critical Infrastructure Protected",
            date: "July 2024",
            summary: "Discovered a hardcoded backdoor account in IoT gateway firmware deployed across critical infrastructure sites, enabling immediate remediation before exploitation.",
            fullArticle: "<p>During a proactive firmware security assessment, E Sector\u2019s reverse engineering team extracted and analysed the firmware image from an IoT gateway device widely deployed across critical national infrastructure sites including energy and water utilities.</p><p>Deep analysis of the extracted filesystem revealed a hardcoded administrative account with a static password embedded in the device\u2019s web management interface. This backdoor, present since an early firmware version, would have granted an attacker full administrative control over any device reachable on the network \u2014 including the ability to modify sensor thresholds, disable alarms, and pivot into connected operational technology networks.</p><p>E Sector developed a proof-of-concept demonstrating remote exploitation across the network and coordinated responsible disclosure with the device manufacturer. An emergency firmware update was issued within 48 hours, and network-level mitigations were deployed across all affected sites within a week. Over 200 devices across 14 critical infrastructure sites were patched as a direct result of this finding.</p>"
        }
    ],

    // ---- Previous Projects ----
    previousProjects: [
        { id: "pp1", name: "Project TITAN", description: "Enterprise VPN client vulnerability assessment", link: "https://confluence.organisation.com/display/ESEC/TITAN", tags: ["Windows", "Vulnerability Research"] },
        { id: "pp2", name: "Project ODIN", description: "Linux server hardening and kernel exploit research", link: "https://confluence.organisation.com/display/ESEC/ODIN", tags: ["Linux", "Kernel", "Exploit Dev"] },
        { id: "pp3", name: "Project HYDRA", description: "Multi-platform browser extension security audit", link: "https://confluence.organisation.com/display/ESEC/HYDRA", tags: ["Web App", "Code Review"] },
        { id: "pp4", name: "Project ATLAS", description: "Cloud infrastructure penetration testing engagement", link: "https://confluence.organisation.com/display/ESEC/ATLAS", tags: ["Cloud", "Penetration Testing"] },
        { id: "pp5", name: "Project SPARTAN", description: "Android application reverse engineering for defence client", link: "https://confluence.organisation.com/display/ESEC/SPARTAN", tags: ["Android", "Reverse Engineering"] },
        { id: "pp6", name: "Project RAVEN", description: "Wireless protocol security research and exploitation", link: "https://confluence.organisation.com/display/ESEC/RAVEN", tags: ["IoT", "Exploit Dev", "Wireless"] },
        { id: "pp7", name: "Project SENTINEL", description: "SCADA/ICS vulnerability assessment for energy sector", link: "https://confluence.organisation.com/display/ESEC/SENTINEL", tags: ["IoT", "SCADA", "Vulnerability Research"] },
        { id: "pp8", name: "Project ECLIPSE", description: "Dark web threat intelligence platform assessment", link: "https://confluence.organisation.com/display/ESEC/ECLIPSE", tags: ["Threat Intel", "Web App"] },
        { id: "pp9", name: "Project COBALT", description: "Windows Active Directory attack path analysis", link: "https://confluence.organisation.com/display/ESEC/COBALT", tags: ["Windows", "Active Directory", "Penetration Testing"] },
        { id: "pp10", name: "Project VORTEX", description: "Embedded firmware reverse engineering for IoT devices", link: "https://confluence.organisation.com/display/ESEC/VORTEX", tags: ["IoT", "Firmware", "Reverse Engineering"] },
        { id: "pp11", name: "Project MERCURY", description: "Secure messaging application code review", link: "https://confluence.organisation.com/display/ESEC/MERCURY", tags: ["Android", "Code Review"] },
        { id: "pp12", name: "Project NOVA", description: "Zero-day research programme for mobile platforms", link: "https://confluence.organisation.com/display/ESEC/NOVA", tags: ["Android", "Vulnerability Research", "Exploit Dev"] },
        { id: "pp13", name: "Project PHOENIX", description: "Incident response tooling development and deployment", link: "https://confluence.organisation.com/display/ESEC/PHOENIX", tags: ["Threat Intel", "Automation"] },
        { id: "pp14", name: "Project STORM", description: "API gateway security assessment for financial platform", link: "https://confluence.organisation.com/display/ESEC/STORM", tags: ["API", "Web App", "Penetration Testing"] },
        { id: "pp15", name: "Project APEX", description: "Red team simulation against enterprise SOC capabilities", link: "https://confluence.organisation.com/display/ESEC/APEX", tags: ["Red Team", "Penetration Testing", "Windows"] }
    ],

    // ---- Statistics ----
    stats: {
        platforms: {
            "Android": 28,
            "Windows": 24,
            "Web Application": 22,
            "Linux": 14,
            "IoT / Firmware": 7,
            "Malware Analysis": 5
        },
        engagements: {
            "Vulnerability Research": 35,
            "Reverse Engineering": 28,
            "Exploit Development": 20,
            "Code Review": 10,
            "Threat Intelligence": 7
        },
        counters: [
            { label: "Projects Delivered", value: "87+" },
            { label: "Zero-Days Found", value: "34" },
            { label: "CVEs Published", value: "12" },
            { label: "Exploits Developed", value: "56" },
            { label: "Active Researchers", value: "25+" },
            { label: "Platforms Covered", value: "6" }
        ]
    },

    // ---- Important Links ----
    links: [
        { id: "lk1", name: "Confluence", description: "E Sector documentation wiki", url: "https://confluence.organisation.com/display/ESEC", icon: "&#128214;" },
        { id: "lk2", name: "Jira", description: "Project tracking & sprint board", url: "https://jira.organisation.com/browse/ESEC", icon: "&#128203;" },
        { id: "lk3", name: "Block Dopus", description: "Block Dopus platform", url: "https://blockdopus.organisation.com", icon: "&#128737;" },
        { id: "lk4", name: "O3 Confluence", description: "O3 documentation & resources", url: "https://confluence.organisation.com/display/O3", icon: "&#127760;" },
        { id: "lk5", name: "SCC Confluence", description: "SCC programme wiki", url: "https://confluence.organisation.com/display/SCC", icon: "&#9889;" }
    ]
};

// ---- Data Access Layer ----
function getSiteData() {
    const stored = localStorage.getItem('esector_data');
    if (stored) {
        try {
            const parsed = JSON.parse(stored);
            // Merge in any new keys from DEFAULT_DATA that don't exist in stored data
            const defaults = JSON.parse(JSON.stringify(DEFAULT_DATA));
            Object.keys(defaults).forEach(key => {
                if (!(key in parsed)) parsed[key] = defaults[key];
            });
            return parsed;
        } catch {
            return JSON.parse(JSON.stringify(DEFAULT_DATA));
        }
    }
    return JSON.parse(JSON.stringify(DEFAULT_DATA));
}

function saveSiteData(data) {
    localStorage.setItem('esector_data', JSON.stringify(data));
}

function resetSiteData() {
    localStorage.removeItem('esector_data');
}
