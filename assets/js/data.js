window.portfolioData = {
  // --- Personal Info ---
  name: "Muhammad Azim Bin Kamarudin",
  shortName: "Muhammad Azim", // Used for "Hi, I'm Azim"
  role: "Technical Support and Software Development",
  birthDate: "2001-06-21",
  location: "Pendang, Kedah",
  
  // --- Contact ---
  contact: {
    email: "muhdazimm21@gmail.com",
    phone: "+60 13 572 4995",
    whatsapp: "https://wa.me/60135724995",
    linkedin: "https://www.linkedin.com/in/muhdazim21",
    github: "https://github.com/muhdazimm21"
  },

  // --- Hero Section ---
  hero: {
    background: "assets/img/profile/hero-bg.png",
    typedItems: ["Fresh Graduated", "Major in Computer Science", "Looking for Job", "Open to Explore"]
  },

  // --- About Section ---
  about: {
    avatar: "assets/img/profile/heroImage.jpg",
    headline: "Experienced in Technical Support and Software Development",
    bio: "Detail-oriented Computer Science graduate with hands-on experience in academic projects, internships, and technical support. Skilled in application development, third-party system integration, and preparing technical documentation (RCA, PM, SOP). Familiar with preventive maintenance, basic network troubleshooting, and IT infrastructure support. Currently serving as a Resident Engineer on the client side, supporting Enterprise Service Management (ESM) operations and delivering reliable technical solutions.",
    details: [
      { label: "Degree", value: "Bachelor of Computer Science (Hons.)", icon: "bi-mortarboard" },
      { label: "Based In", value: "Pendang, Kedah", icon: "bi-geo-alt" },
      { label: "Email", value: "muhdazimm21@gmail.com", icon: "bi-envelope" },
      { label: "Phone", value: "+60 13 572 4995", icon: "bi-phone" },
      { label: "Availability", value: "Open to Work", icon: "bi-calendar-check" }
    ]
  },

  // --- Resume: Experience ---
  experience: [
    {
      title: "Technical Support Engineer",
      company: "Weststar Engineering",
      period: "December 2025 – February 2026",
      type: "Full-time",
      description: [
        "Serving as a Resident Engineer on the client side as SPOC, supporting Enterprise Service Management (ESM) migration and deployment.",
        "Performed troubleshooting for Access Control systems and prepared technical documentation, including reports and system records.",
        "Prepared RCA, PM, and SOP documentation."
      ]
    },
    {
      title: "Technical Support (K-Youth)",
      company: "Weststar Engineering",
      period: "June 2025 – September 2025",
      type: "Trainee",
      description: [
        "Performed Preventive Maintenance (PM) for Access Points.",
        "Prepared Root Cause Analysis (RCA), Preventive Maintenance (PM), and Standard Operating Procedure (SOP) documentation.",
        "Actively involved in the Switch Replacement Project, supporting project planning, device replacement, and network migration.",
        "Gained hands-on experience in campus core and data center core environments, enhancing understanding of enterprise network architecture."
      ]
    },
    {
      title: "Intern – Software Development",
      company: "Works25",
      period: "September 2024 – January 2025",
      type: "Internship",
      description: [
        "Integrated third-party software to enhance system functionality and compatibility.",
        "Created and updated system documentation and code tutorials for user guidance.",
        "Conducted bug testing and improved system usability.",
        "Developed a theme customization feature with different options.",
        "Created a feature for users to choose from pre-designed website templates."
      ]
    }
  ],

  // --- Resume: Education ---
  education: [
    {
      degree: "Bachelor of Computer Science (Hons.)",
      institution: "Universiti Teknologi MARA, Tapah Road, Perak",
      period: "2021 – 2025",
      details: ["Major in Computer Science", "CGPA of 3.4"]
    },
    {
      degree: "Sijil Tinggi Pelajaran Malaysia (STPM)",
      institution: "Sekolah Menengah Kebangsaan Kubor Panjang, Kedah",
      period: "2019 - 2020",
      details: [
        "Graduated with a CGPA of 3.84",
        "Achieved MUET Band 4",
        "Strong foundation in Social Science subjects, including Pengajian Am, Bahasa Melayu, Sejarah, and Seni Visual"
      ]
    }
  ],

  // --- Resume: Skills ---
  skills: {
    "Technical": [
      "JavaScript & SQL programming",
      "MySQL & SQLite database management",
      "Networking fundamentals & troubleshooting",
      "Access Control system support",
      "Enterprise Service Management (ESM)",
      "System diagnostics & optimization"
    ],
    "IT Operations": [
      "Preventive Maintenance (PM)",
      "Root Cause Analysis (RCA)",
      "SOP development",
      "Client-side technical support (SPOC)",
      "Data center environment exposure"
    ],
    "Tools": [
      "AI Tools (ChatGPT, Gemini, OpenART)",
      "AI content generation",
      "CapCut & Canva"
    ],
    "Professional": [
      "Technical documentation",
      "Research & evaluation",
      "Analytical problem-solving",
      "Team communication"
    ]
  },

  // --- Portfolio (Projects) ---
  projects: [
    {
      title: "Final Year Project - PhishSecure",
      category: "filter-development",
      image: "assets/img/portfolio/portfolio-1.png",
      description: "A web-based phishing course designed to educate users about phishing threats that implemented with gamification elements.",
      link: "https://muhdazimm21.github.io/PhishSecure/",
      linkText: "Live Preview",
      type: "link"
    },
    {
      title: "Voice-controlled Music Player",
      category: "filter-development",
      image: "assets/img/portfolio/portfolio-3.png",
      description: "A voice-controlled music player application that allows users to play, pause, and skip tracks using voice commands.",
      link: "assets/img/portfolio/portfolio-3.mp4",
      linkText: "View Demo",
      type: "video"
    },
    {
      title: "Web based PDF Tool",
      category: "filter-development",
      image: "assets/img/portfolio/portfolio-4.png",
      description: "A website that can split, merge or split and merge pdf based on your needs. convenient and user-friendly interface.",
      link: "https://muhdazimm21.github.io/PDFSelek/",
      linkText: "Live Preview",
      type: "link"
    },
    {
      title: "Web based Sejarah Quiz",
      category: "filter-development",
      image: "assets/img/portfolio/portfolio-6.png",
      description: "A web-based quiz application focused on history topics for form 4, featuring interactive questions and a user-friendly interface.",
      link: "https://muhdazimm21.github.io/JejakSejarahQ/",
      linkText: "Live Preview",
      type: "link"
    },
    {
      title: "Power BI Dashboard",
      category: "filter-digital",
      image: "assets/img/portfolio/portfolio-5.png",
      description: "Power BI Education Student Performance Dashboard which evaluating student progress, identifying areas for improvement, and tracking engagement.",
      link: "assets/img/portfolio/portfolio-5.png",
      linkText: "View Image",
      type: "image"
    },
    {
      title: "Ai Video Generation",
      category: "filter-creative",
      image: "assets/img/portfolio/portfolio-2.png",
      description: "Ai generated video content for PDRM. All the video generated are Ai generated only does not related to any real events.",
      link: "assets/img/portfolio/portfolio-2.mp4",
      linkText: "View Video",
      type: "video"
    }
  ],

  // --- Certificates ---
  certificates: [
    {
      title: "Google Cybersecurity Professional Certificate",
      issuer: "Coursera | Google",
      image: "assets/img/certificates/cert-1.png"
    },
    {
      title: "K-Youth Development Programme 2025",
      issuer: "K-Youth",
      image: "assets/img/certificates/cert-2.png"
    },
    {
      title: "AI For MY Future",
      issuer: "Copilot | AI",
      image: "assets/img/certificates/cert-3.png"
    },
    {
      title: "CGM Academy for Youth",
      issuer: "Climate Governance Malaysia",
      image: "assets/img/certificates/cert-4.png"
    },
    {
      title: "Career Essentials in Sustainable Tech",
      issuer: "Microsoft | LinkedIn",
      image: "assets/img/certificates/cert-5.png"
    },
    {
      title: "Digital Literacy Learning Pathway",
      issuer: "Digital Literacy",
      image: "assets/img/certificates/cert-6.png"
    },
    {
      title: "Professional Soft Skills",
      issuer: "Soft Skills",
      image: "assets/img/certificates/cert-7.png"
    }
  ]
};
