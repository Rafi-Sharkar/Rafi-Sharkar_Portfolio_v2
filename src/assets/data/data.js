// Static fallback data + profile metadata.
// Image and document URLs are served from /public, so they're plain paths.

export const Gallery_01 = [
    {img: '/photos/Photo_000.jpg'},
    {img: '/photos/Photo_001.jpg'},
    {img: '/photos/Photo_002.jpg'},
    {img: '/photos/Photo_003.jpg'},
    {img: '/photos/Photo_004.jpg'},
    {img: '/photos/Photo_006.jpg'},
    {img: '/photos/Photo_007.jpg'},
]

export const Cert = [
    {img: '/photos/CiscoCF.jpeg'}
]

export const Projects1 = [
    {
        name: "Rent On",
        img: '/photos/RentOnProject02.jpg',
        scode: "https://github.com/Rafi-Sharkar/Rent-Now",
        link: ""
    },
    {
        name: "HEXA Shop",
        img: '/photos/hexashop.jpg',
        scode: "https://github.com/Rafi-Sharkar/Hexa-Shop",
        link: ""
    },
    {
        name: "Rafi SharKar",
        img: '/photos/RSportfolio.jpg',
        scode: "https://github.com/Rafi-Sharkar/Rafi-Sharkar_Portfolio",
        link: "https://rafi-sharkar-0777.netlify.app"
    },
    {
        name: "K-mean Cluster",
        img: '/photos/kmeanCluster.jpg',
        scode: "https://github.com/Rafi-Sharkar/Data_mining_-_Data_warehouse",
        link: ""
    },
    {
        name: "Poultry Supply Chain Management System",
        img: '/photos/PSCMS.jpg',
        scode: "https://github.com/Rafi-Sharkar/Poultry-Supply-Chain-Management-System",
        link: ""
    },
]

export const WorkExperiences = [
    {
        id: 'exp-1',
        role: 'System Design and Backend Engineer',
        company: 'Softvence IT Ltd',
        location: 'Dhaka, Bangladesh',
        period: 'Sep 2025 – Present',
        startDate: '2025-09-01',
        isCurrent: true,
        keySkills: [
            'System Design',
            'Microservices Architecture',
            'Node.js',
            'NestJS',
            'PostgreSQL',
            'Redis',
            'AWS',
            'Docker',
            'API Gateway',
            'Load Balancing',
            'JWT/OAuth2',
            'RBAC',
        ],
        bullets: [
            'Promoted from Backend Developer to lead system design for two live production platforms — childcareregister.com and readytoworkapp.com — serving 500+ active users with 99.9% uptime on AWS.',
            'Own end-to-end architecture decisions: service boundaries, database schema design, caching strategy (Redis), and API gateway/load-balancing configuration for scalable multi-tenant delivery.',
            'Lead design and code review for 30+ REST API endpoints secured with JWT, OAuth2, and multi-tier RBAC, reducing unauthorized access incidents to zero.',
            'Drive CI/CD and containerization strategy (Docker, GitHub Actions), reducing deployment time by 40% and enabling zero-downtime releases.',
            'Mentor junior engineers and coordinate with frontend, UI/UX, and AI teams in an Agile/Scrum workflow, delivering 3+ sprint releases on schedule.',
        ],
    },
    {
        id: 'exp-2',
        role: 'Backend Developer',
        company: 'Softvence IT Ltd',
        location: 'Dhaka, Bangladesh',
        period: 'Sep 2024 – Sep 2025',
        startDate: '2024-09-01',
        endDate: '2025-09-01',
        isCurrent: false,
        keySkills: [
            'Node.js',
            'NestJS',
            'TypeScript',
            'PostgreSQL',
            'WebSocket (Socket.io)',
            'BullMQ',
            'Stripe API',
            'Jest',
            'Docker',
            'GitHub Actions',
        ],
        bullets: [
            'Built and maintained core backend services for childcareregister.com and readytoworkapp.com using Node.js, NestJS, and PostgreSQL.',
            'Built real-time chat and notification system using Node.js, WebSocket (Socket.io), and BullMQ, cutting notification delivery latency by approximately 60% versus polling.',
            'Integrated Stripe payment processing handling end-to-end transaction flows; wrote unit and integration tests using Jest achieving 80%+ code coverage.',
            'Containerized services with Docker and set up initial CI/CD pipelines with GitHub Actions.',
        ],
    },
    {
        id: 'exp-3',
        role: 'Fullstack Developer',
        company: 'Metamorphosis',
        location: 'Remote',
        period: 'Sep 2023 – Sep 2024',
        startDate: '2023-09-01',
        endDate: '2024-09-01',
        isCurrent: false,
        keySkills: [
            'React.js',
            'Next.js',
            'Node.js',
            'Express.js',
            'PostgreSQL',
            'MongoDB',
            'JWT',
            'RBAC',
            'REST API Design',
        ],
        bullets: [
            'Developed and maintained fullstack features across React/Next.js frontends and Node.js/Express backends for client web applications.',
            'Designed REST APIs and integrated them with PostgreSQL/MongoDB databases, handling authentication (JWT) and role-based access control.',
            'Collaborated with designers and product owners in an Agile workflow to ship UI components and backend endpoints in the same sprint cycle.',
        ],
    },
    {
        id: 'exp-4',
        role: 'Remote Frontend Developer',
        company: 'Unitechnology',
        location: 'Remote',
        period: 'Sep 2022 – Sep 2023',
        startDate: '2022-09-01',
        endDate: '2023-09-01',
        isCurrent: false,
        keySkills: [
            'React.js',
            'Next.js',
            'JavaScript',
            'HTML5',
            'CSS3/SASS',
            'Redux',
            'REST API Integration',
            'Responsive UI Design',
        ],
        bullets: [
            'Built responsive, cross-browser user interfaces using React.js and Next.js, translating Figma designs into reusable components.',
            'Integrated frontend applications with REST APIs and managed application state using Redux/Context API.',
            'Optimized page load performance and collaborated with backend engineers to refine API contracts.',
        ],
    },
];

export const Self =
    {
        name: "Mustakim Billah Rafi",
        job_title: "System Design and Backend Engineer",
        profile_pic: '/photos/RS_002.jpg',
        cover_pic: '/photos/RS_0022.jpg',
        FB_link: "https://www.facebook.com/rafi.sharkar.90/",
        IG_link: "https://www.instagram.com/rafi_sharkar_0777/",
        GH_link: "https://github.com/Rafi-Sharkar",
        LI_link: "https://www.linkedin.com/in/rafi-sharkar/",
        CV_down: '/documents/MUSTAKIM_BILLAH_RAFI.pdf',
    }