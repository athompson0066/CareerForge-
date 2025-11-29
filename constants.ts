import { ResumeData, ThemeType } from './types';

export const INITIAL_RESUME_DATA: ResumeData = {
  personalInfo: {
    fullName: "Linda Quaynor",
    email: "lindaquaynor@outlook.com",
    phone: "+234 802 295 1025",
    location: "Lagos, Nigeria",
    jobTitle: "Programme Director | Board Chair | Management Consultant",
    website: "www.linkedin.com/in/linda-quaynor",
    summary: "Dynamic and results-driven management consultant with over 20 years of experience in strategy development, financial inclusion, organizational transformation, and advocacy across Nigeria, South Africa, the UK, and Ghana. Proven expertise in leading high-impact projects for financial institutions, regulators, FMCG companies, public sector entities, and development organizations. Adept at engaging stakeholders at Ministerial, Board, and Executive levels to drive innovation and deliver measurable results.",
    photo: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  experience: [
    {
      id: '1',
      company: "Vircan Capital",
      position: "Senior Partner",
      startDate: "2024-01",
      endDate: "Present",
      current: true,
      description: "• Vice President at NewGlobe – Global Policy and Partnerships: Focuses on initiatives in Nigeria, Rwanda, CAR, Liberia, and India.\n• Lead Adviser to InfraCredit Nigeria Limited: Assisting in establishing a Credit Guarantee entity in Ghana to mobilize up to $4 billion for infrastructure projects.\n• Fundraising Advisor for Verdant Ventures: Supports the development of diplomatic housing for U.S. and other embassies across Africa.\n• Engagement Partner at RPA: Facilitates the spin-off of a funded project into a standalone entity."
    },
    {
      id: '2',
      company: "Delwik Group",
      position: "Board Chair & Chair of Investment Committee",
      startDate: "2023-01",
      endDate: "Present",
      current: true,
      description: "• Strategic Governance: Lead the Board in setting strategic direction, ensuring alignment with corporate goals and long-term sustainability.\n• Investment Oversight: Chair the Investment Committee, rigorously evaluating high-value opportunities and managing portfolio risk.\n• Stakeholder Management: Serve as the primary liaison between the Board and executive leadership, fostering a culture of accountability.\n• Policy Formulation: Drive the adoption of robust financial policies to optimize capital allocation and operational efficiency."
    },
    {
      id: '3',
      company: "Rockefeller Philanthropy Advisors",
      position: "Programme Director for Nigeria",
      startDate: "2023-01",
      endDate: "2023-12",
      current: false,
      description: "• Leader of the Nigeria Programme for FSP: Driving digital financial services, payments, and financial access at the sub-national level.\n• Policy Innovation Coordinator: Collaborating with FSP teams to unlock opportunities and achieve National Financial Inclusion Strategy (NFIS) targets.\n• Regulatory Advisor: Strengthening policies by applying global insights and data analytics to support financial inclusion.\n• Project Lead: Spearheading the establishment of a new intermediary."
    },
    {
      id: '4',
      company: "ARM Labs by ARM",
      position: "Chairman of Advisory Board",
      startDate: "2020-07",
      endDate: "Present",
      current: true,
      description: "• Innovation Strategy: Guide the accelerator’s vision to support fintech startups and foster a digital ecosystem in West Africa.\n• Mentorship & Growth: Provide high-level mentorship to cohort founders, aiding in product-market fit and scaling strategies.\n• Ecosystem Building: Facilitate partnerships between startups, corporate bodies, and investors to drive industry-wide innovation.\n• Governance: Oversee board operations to ensure ethical standards and strategic alignment with ARM’s broader objectives."
    },
    {
      id: '5',
      company: "Deloitte Consulting",
      position: "Partner, Strategy & Customer",
      startDate: "2018-03",
      endDate: "2022-12",
      current: false,
      description: "• Executive Leadership: Served as a member of EXCO, driving customer growth across portfolio businesses and strengthening client engagement.\n• Financial Services Lead: Held commercial responsibility for growing client revenue by 80% across portfolio businesses.\n• P&L and Team Management: Managed P&L for Strategy and Customer Marketing in West Africa, leading a team of 30.\n• Strategic Projects: Led multiple strategy and transformation initiatives for clients in Insurance, Banking, and Payments.\n• Payments Leadership: Currently Payments Lead for West Africa and member of Africa Leadco."
    },
    {
      id: '6',
      company: "InfraCredit Nigeria Limited",
      position: "Lead Adviser on Credit Guarantee Entity Setup",
      startDate: "2023-01",
      endDate: "Present",
      current: true,
      description: "• Assisting in establishing a Credit Guarantee entity in Ghana to mobilize up to $4 billion for infrastructure projects in collaboration with Ghana Infrastructure Investment Fund, AfDB, and Petra Trust."
    },
    {
      id: '7',
      company: "EFInA",
      position: "General Manager (CEO-equivalent)",
      startDate: "2017-05",
      endDate: "2018-03",
      current: false,
      description: "• Financial Inclusion Leadership: Led EFInA’s financial sector development program in Nigeria, working with regulators, banks, and fintechs.\n• Advocacy and Research: Championed digital financial services through advocacy, grant programs, and stakeholder engagement.\n• Operational Oversight: Managed EFInA’s day-to-day operations, including financial oversight, strategic planning, and talent management."
    },
    {
      id: '8',
      company: "Accenture",
      position: "Executive",
      startDate: "2010-09",
      endDate: "2016-07",
      current: false,
      description: "• Route to Market Leadership: Built and led the Route to Market team for Consumer Goods and Services in Nigeria, achieving $8 million in sales.\n• Strategy and Consulting Leadership: Led Accenture’s Strategy Practice in Lagos, managing a 12-person team.\n• Policy and Industry Advocacy: Served as NESG Policy Commission Champion for the Real Sector in Nigeria."
    },
    {
      id: '9',
      company: "Letsema Consulting",
      position: "Manager and Strategy Lead",
      startDate: "2006-08",
      endDate: "2009-12",
      current: false,
      description: "• Responsible for developing and executing plans for the strategy team in Johannesburg and leading a 10-person team.\n• Capability and Performance Review: Reviewed internal capabilities and financial performance of the South African Revenue Service.\n• Energy Advisory: Advised the Director General of South Africa's Department of Public Enterprises on electricity demand management."
    },
    {
      id: '10',
      company: "Ernst & Young",
      position: "Management Consultant",
      startDate: "2000-06",
      endDate: "2004-07",
      current: false,
      description: "• Public Broadcasting Advisory: Advised the Government of Ghana on restructuring and commercializing the public broadcasting corporation.\n• FMCG Business Optimization: Conducted business assessments and operational optimization for FMCG companies such as Unilever, Pepsi, and Coca-Cola.\n• Corporate Governance Development: Collaborated with a leading law firm to create a comprehensive corporate governance framework."
    }
  ],
  education: [
    {
      id: '1',
      school: "Harvard University (USA)",
      degree: "Executive Programme",
      field: "Strategic Management",
      startDate: "2015-08",
      endDate: "2015-08",
      current: false
    },
    {
      id: '2',
      school: "University of Kent at Canterbury (UK)",
      degree: "MBA",
      field: "Business Administration",
      startDate: "1996",
      endDate: "1998",
      current: false
    },
    {
      id: '3',
      school: "Middlesex University (UK)",
      degree: "BA",
      field: "Accounting & Finance",
      startDate: "1991",
      endDate: "1994",
      current: false
    }
  ],
  skills: [
    { id: '1', name: "Corporate Strategy & Governance", level: 5 },
    { id: '2', name: "Financial Inclusion Advocacy", level: 5 },
    { id: '3', name: "Digital Transformation", level: 5 },
    { id: '4', name: "Organizational Design", level: 5 },
    { id: '5', name: "Stakeholder Engagement", level: 5 },
    { id: '6', name: "Post-Merger Integration", level: 5 },
    { id: '7', name: "Customer Marketing", level: 5 },
    { id: '8', name: "Board Performance", level: 5 }
  ],
  socials: [
    { id: '1', platform: "Email", url: "mailto:lindaquaynor@outlook.com" },
    { id: '2', platform: "LinkedIn", url: "https://www.linkedin.com/in/linda-quaynor" }
  ],
  // Placeholder Data for other templates (Optional)
  listings: [
    {
      id: 'list1',
      address: "145 Bourdillon Road, Ikoyi",
      price: "$2,500,000",
      specs: "5 Bed | 6 Bath | 800sqm",
      status: "For Sale",
      description: "Ultra-luxury penthouse with panoramic views of the Lagos lagoon. Features smart home automation, private elevator, and rooftop infinity pool.",
      image: "https://images.unsplash.com/photo-1600596542815-e32cb141d3e6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }
  ],
  portfolio: [
    {
      id: 'p1',
      name: "GreenEnergy Africa",
      sector: "Renewable Energy",
      value: "$12M Series A",
      description: "Lead investor in West Africa's largest solar grid expansion project."
    },
    {
      id: 'p2',
      name: "FinTech Global",
      sector: "Financial Services",
      value: "3.5x ROI",
      description: "Early-stage investor in cross-border payment infrastructure."
    }
  ]
};

export const THEMES: { id: ThemeType; name: string; color: string }[] = [
  { id: 'modern', name: 'Modern Resume', color: 'bg-indigo-600' },
  { id: 'minimalist', name: 'Minimalist Resume', color: 'bg-slate-800' },
  { id: 'creative', name: 'Creative Resume', color: 'bg-teal-600' },
  { id: 'realtor', name: 'Realtor Luxury', color: 'bg-amber-600' },
  { id: 'finance', name: 'Wall Street Finance', color: 'bg-slate-900' },
  { id: 'wedding', name: 'Wedding Planner', color: 'bg-rose-400' },
];