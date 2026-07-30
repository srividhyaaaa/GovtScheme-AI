const schemeDeadlines = [
  "31 December 2026",
  "15 January 2027",
  "28 February 2027",
  "31 March 2027",
  "30 April 2027",
  "31 May 2027",
  "30 June 2027",
  "31 July 2027",
  "31 August 2027",
  "30 September 2027",
  "31 October 2027",
  "30 November 2027",
  "31 December 2027",
  "15 January 2028",
  "28 February 2028",
  "31 March 2028",
  "30 April 2028",
  "31 May 2028",
  "30 June 2028",
  "31 July 2028",
  "31 August 2028",
  "30 September 2028",
  "31 October 2028",
  "30 November 2028",
  "31 December 2028",
  "15 January 2029"
];

const schemes = [

  {
    id: 1,
    name: "Ayushman Bharat - Pradhan Mantri Jan Arogya Yojana (PM-JAY)",
    ministry: "Ministry of Health and Family Welfare",
    category: "Health",
    description: "Provides cashless health insurance coverage for economically vulnerable families across India.",
    eligibility: "Families identified under SECC 2011 database.",
    eligibilityCriteria: {
      occupation: "Any",
      income: 500000,
      age: 120,
      gender: "Any",
      state: "All India"
    },
    benefits: "Health insurance coverage up to ₹5 lakh per family per year.",
    documents: [
      "Aadhaar Card",
      "Ration Card",
      "Family ID",
      "Mobile Number"
    ],
    applicationMode: "Online",
    deadline: "Open Throughout the Year",
    apply: "https://pmjay.gov.in"
  },

  {
    id: 2,
    name: "Pradhan Mantri Jan Arogya Yojana",
    ministry: "Ministry of Health and Family Welfare",
    category: "Health",
    description: "Provides free treatment in empanelled public and private hospitals.",
    eligibility: "Economically weaker families.",
    eligibilityCriteria: {
      occupation: "Any",
      income: 500000,
      age: 120,
      gender: "Any",
      state: "All India"
    },
    benefits: "Cashless hospitalization up to ₹5 lakh.",
    documents: [
      "Aadhaar Card",
      "Ration Card",
      "Mobile Number"
    ],
    applicationMode: "Online",
    deadline: "Open Throughout the Year",
    apply: "https://pmjay.gov.in"
  },

  {
    id: 3,
    name: "Pradhan Mantri Awas Yojana - Urban",
    ministry: "Ministry of Housing and Urban Affairs",
    category: "Housing",
    description: "Affordable housing scheme for urban poor families.",
    eligibility: "Families without a pucca house.",
    eligibilityCriteria: {
      occupation: "Any",
      income: 1800000,
      age: 120,
      gender: "Any",
      state: "All India"
    },
    benefits: "Interest subsidy on home loans.",
    documents: [
      "Aadhaar Card",
      "Income Certificate",
      "Bank Passbook",
      "Address Proof"
    ],
    applicationMode: "Online",
    deadline: "Open Throughout the Year",
    applicationDeadline: "28 February 2027",
    apply: "https://pmaymis.gov.in"
  },

  {
    id: 4,
    name: "Pradhan Mantri Awas Yojana - Gramin",
    ministry: "Ministry of Rural Development",
    category: "Housing",
    description: "Provides financial assistance for constructing permanent houses in rural areas.",
    eligibility: "Rural homeless families.",
    eligibilityCriteria: {
      occupation: "Any",
      income: 300000,
      age: 120,
      gender: "Any",
      state: "All India"
    },
    benefits: "Financial assistance for house construction.",
    documents: [
      "Aadhaar Card",
      "Bank Passbook",
      "Income Certificate"
    ],
    applicationMode: "Online",
    deadline: "Open Throughout the Year",
    applicationDeadline: "31 March 2027",
    apply: "https://pmayg.nic.in"
  },

  {
    id: 5,
    name: "PM Kisan Samman Nidhi",
    ministry: "Ministry of Agriculture",
    category: "Agriculture",
    description: "Income support scheme for eligible farmer families.",
    eligibility: "Small and marginal farmers.",
    eligibilityCriteria: {
      occupation: "Farmer",
      income: 800000,
      age: 120,
      gender: "Any",
      state: "All India"
    },
    benefits: "₹6,000 per year in three installments.",
    documents: [
      "Aadhaar Card",
      "Land Records",
      "Bank Passbook"
    ],
    applicationMode: "Online",
    deadline: "Open Throughout the Year",
    applicationDeadline: "30 April 2027",
    apply: "https://pmkisan.gov.in"
  },

  {
    id: 6,
    name: "PM Fasal Bima Yojana",
    ministry: "Ministry of Agriculture",
    category: "Agriculture",
    description: "Crop insurance scheme protecting farmers against crop loss.",
    eligibility: "All farmers growing notified crops.",
    eligibilityCriteria: {
      occupation: "Farmer",
      income: 10000000,
      age: 120,
      gender: "Any",
      state: "All India"
    },
    benefits: "Insurance coverage against crop failure.",
    documents: [
      "Aadhaar Card",
      "Land Records",
      "Bank Passbook"
    ],
    applicationMode: "Online",
    deadline: "Seasonal",
    apply: "https://pmfby.gov.in"
  },

  {
    id: 7,
    name: "National Means-cum-Merit Scholarship Scheme",
    ministry: "Ministry of Education",
    category: "Scholarship",
    description: "Scholarship for meritorious students from economically weaker sections.",
    eligibility: "Class VIII students with family income up to ₹3.5 lakh.",
    eligibilityCriteria: {
      occupation: "Student",
      income: 350000,
      age: 18,
      gender: "Any",
      state: "All India"
    },
    benefits: "₹12,000 scholarship per year.",
    documents: [
      "Aadhaar Card",
      "Income Certificate",
      "School Certificate",
      "Bank Passbook"
    ],
    applicationMode: "Online",
    deadline: "December",
    apply: "https://scholarships.gov.in"
  },

  {
    id: 8,
    name: "Pragati Scholarship for Girls",
    ministry: "Ministry of Education (AICTE)",
    category: "Scholarship",
    description: "Financial assistance for girls pursuing technical education.",
    eligibility: "Girls admitted to AICTE approved institutions.",
    eligibilityCriteria: {
      occupation: "Student",
      income: 800000,
      age: 30,
      gender: "Female",
      state: "All India"
    },
    benefits: "Up to ₹50,000 per year.",
    documents: [
      "Aadhaar Card",
      "Income Certificate",
      "Admission Letter",
      "Bank Passbook"
    ],
    applicationMode: "Online",
    deadline: "December",
    apply: "https://www.aicte-india.org"
  },

  {
    id: 9,
    name: "Saksham Scholarship",
    ministry: "Ministry of Education (AICTE)",
    category: "Scholarship",
    description: "Scholarship for differently-abled students pursuing technical education.",
    eligibility: "Students with 40% or more disability.",
    eligibilityCriteria: {
      occupation: "Student",
      income: 800000,
      age: 30,
      gender: "Any",
      state: "All India"
    },
    benefits: "Up to ₹50,000 per year.",
    documents: [
      "Aadhaar Card",
      "Disability Certificate",
      "Income Certificate",
      "Bank Passbook"
    ],
    applicationMode: "Online",
    deadline: "December",
    apply: "https://www.aicte-india.org"
  },

  {
    id: 10,
    name: "Top Class Education Scheme for SC Students",
    ministry: "Ministry of Social Justice and Empowerment",
    category: "Scholarship",
    description: "Provides financial support for SC students studying in premier institutions.",
    eligibility: "SC students with family income up to ₹8 lakh.",
    eligibilityCriteria: {
      occupation: "Student",
      income: 800000,
      age: 35,
      gender: "Any",
      state: "All India"
    },
    benefits: "Tuition fee, living allowance, books, laptop support.",
    documents: [
      "Aadhaar Card",
      "Caste Certificate",
      "Income Certificate",
      "Bank Passbook"
    ],
    applicationMode: "Online",
    deadline: "December",
    apply: "https://socialjustice.gov.in"
  },

  {
    id: 11,
    name: "Top Class Education Scheme for ST Students",
    ministry: "Ministry of Tribal Affairs",
    category: "Scholarship",
    description: "Provides financial assistance to ST students studying in premier institutions across India.",
    eligibility: "ST students admitted to recognized premier institutions with family income up to ₹8 lakh.",
    eligibilityCriteria: {
      occupation: "Student",
      income: 800000,
      age: 35,
      gender: "Any",
      state: "All India"
    },
    benefits: "Full tuition fees, living allowance, books, and one-time laptop assistance.",
    documents: [
      "Aadhaar Card",
      "ST Certificate",
      "Income Certificate",
      "Admission Proof",
      "Bank Passbook"
    ],
    applicationMode: "Online",
    deadline: "December",
    apply: "https://tribal.nic.in"
  },

  {
    id: 12,
    name: "Stand-Up India Scheme",
    ministry: "Ministry of Finance",
    category: "Business",
    description: "Provides bank loans to SC/ST and women entrepreneurs for establishing new enterprises.",
    eligibility: "SC/ST or Women entrepreneurs aged 18 years and above.",
    eligibilityCriteria: {
      occupation: "Entrepreneur",
      income: 99999999,
      age: 18,
      gender: "Any",
      state: "All India"
    },
    benefits: "Bank loans from ₹10 lakh to ₹1 crore.",
    documents: [
      "Aadhaar Card",
      "PAN Card",
      "Business Plan",
      "Bank Passbook"
    ],
    applicationMode: "Online",
    deadline: "Open Throughout the Year",
    apply: "https://www.standupmitra.in"
  },

  {
    id: 13,
    name: "PM Vishwakarma Scheme",
    ministry: "Ministry of MSME",
    category: "Business",
    description: "Supports traditional artisans and craftspeople through loans, training and marketing assistance.",
    eligibility: "Traditional artisans and craftspeople aged 18 years and above.",
    eligibilityCriteria: {
      occupation: "Artisan",
      income: 99999999,
      age: 18,
      gender: "Any",
      state: "All India"
    },
    benefits: "Skill training, subsidized loans up to ₹4 lakh and marketing support.",
    documents: [
      "Aadhaar Card",
      "PAN Card",
      "Occupation Proof",
      "Bank Passbook"
    ],
    applicationMode: "Online",
    deadline: "Open Throughout the Year",
    apply: "https://pmvishwakarma.gov.in"
  },

  {
    id: 14,
    name: "PM SVANidhi Scheme",
    ministry: "Ministry of Housing and Urban Affairs",
    category: "Business",
    description: "Provides working capital loans to street vendors.",
    eligibility: "Street vendors with valid vending certificate or ID.",
    eligibilityCriteria: {
      occupation: "Street Vendor",
      income: 99999999,
      age: 18,
      gender: "Any",
      state: "All India"
    },
    benefits: "Working capital loans up to ₹50,000 with interest subsidy.",
    documents: [
      "Aadhaar Card",
      "Vendor Certificate",
      "Bank Passbook",
      "Mobile Number"
    ],
    applicationMode: "Online",
    deadline: "Open Throughout the Year",
    apply: "https://pmsvanidhi.mohua.gov.in"
  },

  {
    id: 15,
    name: "Prime Minister's Employment Generation Programme (PMEGP)",
    ministry: "Ministry of MSME",
    category: "Business",
    description: "Provides financial assistance for establishing micro-enterprises.",
    eligibility: "Indian citizens above 18 years starting a new enterprise.",
    eligibilityCriteria: {
      occupation: "Entrepreneur",
      income: 1200000,
      age: 18,
      gender: "Any",
      state: "All India"
    },
    benefits: "Subsidy up to 35% and loans up to ₹50 lakh.",
    documents: [
      "Aadhaar Card",
      "PAN Card",
      "Project Report",
      "Bank Passbook"
    ],
    applicationMode: "Online",
    deadline: "Open Throughout the Year",
    apply: "https://www.kviconline.gov.in/pmegp"
  },

  {
    id: 16,
    name: "Atal Beemit Vyakti Kalyan Yojana",
    ministry: "Ministry of Labour and Employment",
    category: "Employment",
    description: "Provides unemployment allowance to eligible ESIC-insured workers.",
    eligibility: "Employees covered under ESIC with minimum required contribution period.",
    eligibilityCriteria: {
      occupation: "Worker",
      income: 99999999,
      age: 18,
      gender: "Any",
      state: "All India"
    },
    benefits: "50% wage compensation during unemployment.",
    documents: [
      "Aadhaar Card",
      "ESIC Card",
      "Bank Passbook",
      "Employment Proof"
    ],
    applicationMode: "Online",
    deadline: "Open Throughout the Year",
    apply: "https://www.esic.gov.in"
  },

  {
    id: 17,
    name: "Credit Linked Capital Subsidy Scheme (CLCSS)",
    ministry: "Ministry of MSME",
    category: "Business",
    description: "Supports technology upgradation in MSMEs through capital subsidy.",
    eligibility: "Registered MSME units.",
    eligibilityCriteria: {
      occupation: "MSME Owner",
      income: 99999999,
      age: 18,
      gender: "Any",
      state: "All India"
    },
    benefits: "15% capital subsidy up to ₹15 lakh.",
    documents: [
      "Aadhaar Card",
      "PAN Card",
      "UDYAM Certificate",
      "Project Report"
    ],
    applicationMode: "Online",
    deadline: "Open Throughout the Year",
    apply: "https://udyamregistration.gov.in"
  },

  {
    id: 18,
    name: "National Scholarship Portal",
    ministry: "Ministry of Education",
    category: "Scholarship",
    description: "Single portal for applying to Central and State scholarships.",
    eligibility: "Students meeting scholarship-specific eligibility conditions.",
    eligibilityCriteria: {
      occupation: "Student",
      income: 800000,
      age: 35,
      gender: "Any",
      state: "All India"
    },
    benefits: "Various scholarship benefits depending on scheme.",
    documents: [
      "Aadhaar Card",
      "Income Certificate",
      "Bonafide Certificate",
      "Bank Passbook"
    ],
    applicationMode: "Online",
    deadline: "Varies by Scheme",
    apply: "https://scholarships.gov.in"
  },

  {
    id: 19,
    name: "Skill India Mission",
    ministry: "Ministry of Skill Development and Entrepreneurship",
    category: "Skill Development",
    description: "Provides free vocational and skill development training for youth.",
    eligibility: "Indian youth seeking skill development.",
    eligibilityCriteria: {
      occupation: "Student",
      income: 99999999,
      age: 18,
      gender: "Any",
      state: "All India"
    },
    benefits: "Free certified training and employment support.",
    documents: [
      "Aadhaar Card",
      "Educational Certificate",
      "Mobile Number"
    ],
    applicationMode: "Online",
    deadline: "Open Throughout the Year",
    apply: "https://www.skillindia.gov.in"
  },

  {
    id: 20,
    name: "Startup India",
    ministry: "Department for Promotion of Industry and Internal Trade",
    category: "Business",
    description: "Promotes innovation and entrepreneurship through funding, mentorship and tax benefits.",
    eligibility: "Recognized startups registered in India.",
    eligibilityCriteria: {
      occupation: "Entrepreneur",
      income: 99999999,
      age: 18,
      gender: "Any",
      state: "All India"
    },
    benefits: "Tax exemptions, funding support and startup recognition.",
    documents: [
      "PAN Card",
      "Aadhaar Card",
      "Startup Registration",
      "Bank Passbook"
    ],
    applicationMode: "Online",
    deadline: "Open Throughout the Year",
    apply: "https://www.startupindia.gov.in"
  },

  {
    id: 21,
    name: "Indira Gandhi PG Scholarship for Single Girl Child",
    ministry: "Ministry of Education (UGC)",
    category: "Scholarship",
    description: "Scholarship for single girl children pursuing postgraduate education.",
    eligibility: "Single girl child admitted to the first year of a postgraduate course. Age should be 30 years or below.",
    eligibilityCriteria: {
      occupation: "Student",
      income: 99999999,
      age: 30,
      gender: "Female",
      state: "All India"
    },
    benefits: "₹36,200 per year for two years.",
    documents: [
      "Aadhaar Card",
      "Admission Proof",
      "Bank Passbook",
      "Single Girl Child Affidavit"
    ],
    applicationMode: "Online",
    deadline: "Not Yet Announced",
    apply: "https://www.ugc.ac.in"
  },

  {
    id: 22,
    name: "Pragati Scholarship for Technical Education (Girls)",
    ministry: "Ministry of Education (AICTE)",
    category: "Scholarship",
    description: "Financial assistance for girls pursuing diploma or degree courses in AICTE-approved institutions.",
    eligibility: "Female students admitted to AICTE-approved technical institutions. Family income should not exceed ₹8 lakh per annum.",
    eligibilityCriteria: {
      occupation: "Student",
      income: 800000,
      age: 30,
      gender: "Female",
      state: "All India"
    },
    benefits: "₹30,000 per year (Diploma) or ₹50,000 per year (Degree).",
    documents: [
      "Aadhaar Card",
      "Income Certificate",
      "Admission Proof",
      "Fee Receipt",
      "Bank Passbook"
    ],
    applicationMode: "Online",
    deadline: "December - January",
    apply: "https://www.aicte-india.org"
  },

  {
    id: 23,
    name: "Saksham Scholarship for Technical Education (PwD)",
    ministry: "Ministry of Education (AICTE)",
    category: "Scholarship",
    description: "Scholarship for differently-abled students pursuing technical education.",
    eligibility: "Students with 40% or more disability studying in AICTE-approved institutions. Family income should not exceed ₹8 lakh.",
    eligibilityCriteria: {
      occupation: "Student",
      income: 800000,
      age: 30,
      gender: "Any",
      state: "All India"
    },
    benefits: "₹30,000 per year (Diploma) or ₹50,000 per year (Degree).",
    documents: [
      "Aadhaar Card",
      "Disability Certificate",
      "Income Certificate",
      "Admission Proof",
      "Bank Passbook"
    ],
    applicationMode: "Online",
    deadline: "December - January",
    apply: "https://www.aicte-india.org"
  },

  {
    id: 24,
    name: "Top Class Education Scheme for SC Students",
    ministry: "Ministry of Social Justice and Empowerment",
    category: "Scholarship",
    description: "Provides financial support to SC students studying in premier institutions like IITs, IIMs, NITs and AIIMS.",
    eligibility: "SC students admitted through competitive entrance exams. Family income should not exceed ₹8 lakh.",
    eligibilityCriteria: {
      occupation: "Student",
      income: 800000,
      age: 35,
      gender: "Any",
      state: "All India"
    },
    benefits: "Full tuition fees, living allowance, book allowance and one-time laptop assistance.",
    documents: [
      "Aadhaar Card",
      "SC Certificate",
      "Income Certificate",
      "Admission Proof",
      "Bank Passbook"
    ],
    applicationMode: "Online",
    deadline: "December - January",
    apply: "https://socialjustice.gov.in"
  },

  {
    id: 25,
    name: "Top Class Education Scheme for ST Students",
    ministry: "Ministry of Tribal Affairs",
    category: "Scholarship",
    description: "Financial assistance for ST students studying in premier higher educational institutions.",
    eligibility: "ST students admitted through competitive entrance exams. Family income should not exceed ₹8 lakh.",
    eligibilityCriteria: {
      occupation: "Student",
      income: 800000,
      age: 35,
      gender: "Any",
      state: "All India"
    },
    benefits: "Full tuition fees, living allowance, book allowance and one-time laptop assistance.",
    documents: [
      "Aadhaar Card",
      "ST Certificate",
      "Income Certificate",
      "Admission Proof",
      "Bank Passbook"
    ],
    applicationMode: "Online",
    deadline: "December - January",
    apply: "https://tribal.nic.in"
  },
  {
    id: 26,
    name: "Prime Minister's Employment Generation Programme (PMEGP)",
    ministry: "Ministry of MSME",
    category: "Business",
    description: "Provides financial assistance for establishing new micro-enterprises in manufacturing and service sectors.",
    eligibility: "Indian citizens above 18 years starting a new enterprise.",
    eligibilityCriteria: {
      occupation: "Entrepreneur",
      income: 99999999,
      age: 18,
      gender: "Any",
      state: "All India"
    },
    benefits: "Subsidy up to 35% on project cost and loans up to ₹50 lakh.",
    documents: [
      "Aadhaar Card",
      "PAN Card",
      "Project Report",
      "Bank Passbook"
    ],
    applicationMode: "Online",
    deadline: "Open Throughout the Year",
    apply: "https://www.kviconline.gov.in/pmegp"
  },

  {
    id: 27,
    name: "PM Mudra Yojana",
    ministry: "Ministry of Finance",
    category: "Business",
    description: "Provides collateral-free loans to small businesses and entrepreneurs.",
    eligibility: "Small business owners, startups, shopkeepers and self-employed individuals.",
    eligibilityCriteria: {
      occupation: "Entrepreneur",
      income: 99999999,
      age: 18,
      gender: "Any",
      state: "All India"
    },
    benefits: "Loans up to ₹10 lakh under Shishu, Kishore and Tarun categories.",
    documents: [
      "Aadhaar Card",
      "PAN Card",
      "Business Proof",
      "Bank Passbook"
    ],
    applicationMode: "Online / Bank",
    deadline: "Open Throughout the Year",
    apply: "https://www.mudra.org.in"
  },

  {
    id: 28,
    name: "Stand-Up India Scheme",
    ministry: "Ministry of Finance",
    category: "Business",
    description: "Supports women and SC/ST entrepreneurs in establishing greenfield enterprises.",
    eligibility: "Women and SC/ST entrepreneurs above 18 years.",
    eligibilityCriteria: {
      occupation: "Entrepreneur",
      income: 99999999,
      age: 18,
      gender: "Any",
      state: "All India"
    },
    benefits: "Loans ranging from ₹10 lakh to ₹1 crore.",
    documents: [
      "Aadhaar Card",
      "PAN Card",
      "Business Plan",
      "Bank Passbook"
    ],
    applicationMode: "Online",
    deadline: "Open Throughout the Year",
    apply: "https://www.standupmitra.in"
  },

  {
    id: 29,
    name: "PM Vishwakarma Scheme",
    ministry: "Ministry of MSME",
    category: "Business",
    description: "Supports traditional artisans and craftspeople through training, financial assistance and marketing support.",
    eligibility: "Traditional artisans and craftspeople aged 18 years and above.",
    eligibilityCriteria: {
      occupation: "Artisan",
      income: 99999999,
      age: 18,
      gender: "Any",
      state: "All India"
    },
    benefits: "Skill training, toolkit incentive, subsidized loans up to ₹4 lakh and digital incentives.",
    documents: [
      "Aadhaar Card",
      "Occupation Proof",
      "PAN Card",
      "Bank Passbook"
    ],
    applicationMode: "Online",
    deadline: "Open Throughout the Year",
    apply: "https://pmvishwakarma.gov.in"
  },

  {
    id: 30,
    name: "PM SVANidhi Scheme",
    ministry: "Ministry of Housing and Urban Affairs",
    category: "Business",
    description: "Provides working capital loans to street vendors to restart or expand their businesses.",
    eligibility: "Urban street vendors possessing a valid vending certificate or identity card.",
    eligibilityCriteria: {
      occupation: "Street Vendor",
      income: 99999999,
      age: 18,
      gender: "Any",
      state: "All India"
    },
    benefits: "Working capital loans up to ₹50,000 with interest subsidy and cashback incentives.",
    documents: [
      "Aadhaar Card",
      "Vendor Certificate",
      "Bank Passbook",
      "Mobile Number"
    ],
    applicationMode: "Online",
    deadline: "Open Throughout the Year",
    apply: "https://pmsvanidhi.mohua.gov.in"
  },

  {
    id: 31,
    name: "Atal Pension Yojana (APY)",
    ministry: "Ministry of Finance",
    category: "Pension",
    description: "A pension scheme for workers in the unorganized sector providing guaranteed monthly pension after the age of 60.",
    eligibility: "Indian citizens aged 18–40 years with a savings bank account.",
    eligibilityCriteria: {
      occupation: "Any",
      income: 99999999,
      age: 40,
      gender: "Any",
      state: "All India"
    },
    benefits: "Guaranteed monthly pension ranging from ₹1,000 to ₹5,000 after retirement.",
    documents: [
      "Aadhaar Card",
      "Bank Passbook",
      "Mobile Number"
    ],
    applicationMode: "Online / Bank",
    deadline: "Open Throughout the Year",
    apply: "https://www.npscra.nsdl.co.in"
  },

  {
    id: 32,
    name: "Pradhan Mantri Shram Yogi Maandhan (PMSYM)",
    ministry: "Ministry of Labour and Employment",
    category: "Pension",
    description: "Voluntary pension scheme for unorganized sector workers.",
    eligibility: "Workers aged 18–40 years with monthly income up to ₹15,000.",
    eligibilityCriteria: {
      occupation: "Worker",
      income: 180000,
      age: 40,
      gender: "Any",
      state: "All India"
    },
    benefits: "Guaranteed monthly pension of ₹3,000 after attaining 60 years.",
    documents: [
      "Aadhaar Card",
      "Bank Passbook",
      "Mobile Number"
    ],
    applicationMode: "Online",
    deadline: "Open Throughout the Year",
    apply: "https://maandhan.in"
  },

  {
    id: 33,
    name: "Pradhan Mantri Jan Dhan Yojana (PMJDY)",
    ministry: "Ministry of Finance",
    category: "Financial Inclusion",
    description: "National mission to provide affordable banking services to every household.",
    eligibility: "Any Indian citizen aged 10 years and above.",
    eligibilityCriteria: {
      occupation: "Any",
      income: 99999999,
      age: 10,
      gender: "Any",
      state: "All India"
    },
    benefits: "Zero balance account, RuPay debit card, accidental insurance and overdraft facility.",
    documents: [
      "Aadhaar Card",
      "PAN Card",
      "Address Proof"
    ],
    applicationMode: "Online / Bank",
    deadline: "Open Throughout the Year",
    apply: "https://pmjdy.gov.in"
  },

  {
    id: 34,
    name: "Sukanya Samriddhi Yojana",
    ministry: "Ministry of Finance",
    category: "Women & Child",
    description: "Savings scheme to secure the future education and marriage expenses of a girl child.",
    eligibility: "Girl child below 10 years of age.",
    eligibilityCriteria: {
      occupation: "Student",
      income: 99999999,
      age: 10,
      gender: "Female",
      state: "All India"
    },
    benefits: "High interest savings with tax benefits under Section 80C.",
    documents: [
      "Birth Certificate",
      "Aadhaar Card",
      "Parent ID Proof",
      "Bank/Post Office Account"
    ],
    applicationMode: "Bank / Post Office",
    deadline: "Open Throughout the Year",
    apply: "https://www.indiapost.gov.in"
  },

  {
    id: 35,
    name: "Beti Bachao Beti Padhao",
    ministry: "Ministry of Women and Child Development",
    category: "Women & Child",
    description: "Campaign to improve the welfare, education and empowerment of the girl child.",
    eligibility: "Girl children and their families across India.",
    eligibilityCriteria: {
      occupation: "Student",
      income: 99999999,
      age: 18,
      gender: "Female",
      state: "All India"
    },
    benefits: "Awareness, educational support and welfare initiatives for girls.",
    documents: [
      "Aadhaar Card",
      "Birth Certificate",
      "Residence Proof"
    ],
    applicationMode: "Offline / State Authorities",
    deadline: "Open Throughout the Year",
    apply: "https://wcd.nic.in"
  },
  {
    id: 36,
    name: "National Apprenticeship Promotion Scheme (NAPS)",
    ministry: "Ministry of Skill Development and Entrepreneurship",
    category: "Skill Development",
    description: "Promotes apprenticeship training by providing financial support to establishments engaging apprentices.",
    eligibility: "Indian citizens aged 14 years and above meeting educational qualifications.",
    eligibilityCriteria: {
      occupation: "Student",
      income: 99999999,
      age: 35,
      gender: "Any",
      state: "All India"
    },
    benefits: "Free apprenticeship training with stipend support.",
    documents: [
      "Aadhaar Card",
      "Educational Certificates",
      "Bank Passbook",
      "Passport Size Photograph"
    ],
    applicationMode: "Online",
    deadline: "Open Throughout the Year",
    apply: "https://www.apprenticeshipindia.gov.in"
  },

  {
    id: 37,
    name: "National Career Service (NCS)",
    ministry: "Ministry of Labour and Employment",
    category: "Employment",
    description: "A one-stop employment platform connecting job seekers with employers and career guidance services.",
    eligibility: "Any Indian citizen seeking employment opportunities.",
    eligibilityCriteria: {
      occupation: "Any",
      income: 99999999,
      age: 18,
      gender: "Any",
      state: "All India"
    },
    benefits: "Job matching, career counselling, skill assessment and employment services.",
    documents: [
      "Aadhaar Card",
      "Educational Certificates",
      "Resume",
      "Mobile Number"
    ],
    applicationMode: "Online",
    deadline: "Open Throughout the Year",
    apply: "https://www.ncs.gov.in"
  },

  {
    id: 38,
    name: "Deen Dayal Upadhyaya Grameen Kaushalya Yojana (DDU-GKY)",
    ministry: "Ministry of Rural Development",
    category: "Skill Development",
    description: "Provides skill development and placement opportunities for rural youth.",
    eligibility: "Rural youth between 15 and 35 years belonging to poor households.",
    eligibilityCriteria: {
      occupation: "Student",
      income: 300000,
      age: 35,
      gender: "Any",
      state: "All India"
    },
    benefits: "Free skill training, certification and placement assistance.",
    documents: [
      "Aadhaar Card",
      "Income Certificate",
      "Residence Proof",
      "Educational Certificates"
    ],
    applicationMode: "Online",
    deadline: "Open Throughout the Year",
    apply: "https://ddugky.gov.in"
  },

  {
    id: 39,
    name: "National Social Assistance Programme (NSAP)",
    ministry: "Ministry of Rural Development",
    category: "Social Welfare",
    description: "Provides financial assistance to elderly persons, widows and persons with disabilities belonging to below poverty line families.",
    eligibility: "BPL families meeting age or disability criteria.",
    eligibilityCriteria: {
      occupation: "Any",
      income: 200000,
      age: 60,
      gender: "Any",
      state: "All India"
    },
    benefits: "Monthly pension and financial assistance under various welfare schemes.",
    documents: [
      "Aadhaar Card",
      "Income Certificate",
      "Age Proof",
      "Bank Passbook"
    ],
    applicationMode: "Online / Offline",
    deadline: "Open Throughout the Year",
    apply: "https://nsap.nic.in"
  },

  {
    id: 40,
    name: "Pradhan Mantri Ujjwala Yojana (PMUY)",
    ministry: "Ministry of Petroleum and Natural Gas",
    category: "Women & Child",
    description: "Provides free LPG connections to women from eligible households to promote clean cooking fuel.",
    eligibility: "Adult women belonging to eligible low-income households.",
    eligibilityCriteria: {
      occupation: "Any",
      income: 300000,
      age: 18,
      gender: "Female",
      state: "All India"
    },
    benefits: "Free LPG connection with financial assistance for first refill and stove.",
    documents: [
      "Aadhaar Card",
      "Ration Card",
      "Bank Passbook",
      "Residence Proof"
    ],
    applicationMode: "Online / LPG Distributor",
    deadline: "Open Throughout the Year",
    apply: "https://www.pmuy.gov.in"
  },
  {
    id: 41,
    name: "Pradhan Mantri Matru Vandana Yojana (PMMVY)",
    ministry: "Ministry of Women and Child Development",
    category: "Women & Child",
    description: "Provides maternity benefits to pregnant and lactating mothers for the first living child.",
    eligibility: "Pregnant and lactating women excluding those employed in Government services.",
    eligibilityCriteria: {
      occupation: "Any",
      income: 99999999,
      age: 19,
      gender: "Female",
      state: "All India"
    },
    benefits: "Cash incentive of up to ₹5,000 for maternity support.",
    documents: [
      "Aadhaar Card",
      "Bank Passbook",
      "Pregnancy Registration",
      "Mobile Number"
    ],
    applicationMode: "Online / Anganwadi Centre",
    deadline: "Open Throughout the Year",
    apply: "https://wcd.nic.in"
  },

  {
    id: 42,
    name: "Soil Health Card Scheme",
    ministry: "Ministry of Agriculture and Farmers Welfare",
    category: "Agriculture",
    description: "Provides farmers with soil health reports and fertilizer recommendations.",
    eligibility: "All farmers across India.",
    eligibilityCriteria: {
      occupation: "Farmer",
      income: 99999999,
      age: 18,
      gender: "Any",
      state: "All India"
    },
    benefits: "Free soil testing and customized nutrient recommendations.",
    documents: [
      "Aadhaar Card",
      "Land Records",
      "Mobile Number"
    ],
    applicationMode: "Online / Agriculture Department",
    deadline: "Open Throughout the Year",
    apply: "https://soilhealth.dac.gov.in"
  },

  {
    id: 43,
    name: "e-Shram Portal",
    ministry: "Ministry of Labour and Employment",
    category: "Employment",
    description: "National database for unorganized sector workers providing access to social security schemes.",
    eligibility: "Unorganized workers aged 16 to 59 years.",
    eligibilityCriteria: {
      occupation: "Worker",
      income: 99999999,
      age: 59,
      gender: "Any",
      state: "All India"
    },
    benefits: "Unique e-Shram Card and access to welfare schemes.",
    documents: [
      "Aadhaar Card",
      "Bank Passbook",
      "Mobile Number"
    ],
    applicationMode: "Online",
    deadline: "Open Throughout the Year",
    apply: "https://eshram.gov.in"
  },

  {
    id: 44,
    name: "Pradhan Mantri Jeevan Jyoti Bima Yojana (PMJJBY)",
    ministry: "Ministry of Finance",
    category: "Insurance",
    description: "Government-backed life insurance scheme at an affordable premium.",
    eligibility: "Individuals aged 18–50 years having a savings bank account.",
    eligibilityCriteria: {
      occupation: "Any",
      income: 99999999,
      age: 50,
      gender: "Any",
      state: "All India"
    },
    benefits: "Life insurance cover of ₹2 lakh.",
    documents: [
      "Aadhaar Card",
      "Bank Passbook",
      "PAN Card"
    ],
    applicationMode: "Bank",
    deadline: "Renewable Every Year",
    apply: "https://jansuraksha.gov.in"
  },

  {
    id: 45,
    name: "Pradhan Mantri Suraksha Bima Yojana (PMSBY)",
    ministry: "Ministry of Finance",
    category: "Insurance",
    description: "Government-backed accidental insurance scheme with low annual premium.",
    eligibility: "Individuals aged 18–70 years having a savings bank account.",
    eligibilityCriteria: {
      occupation: "Any",
      income: 99999999,
      age: 70,
      gender: "Any",
      state: "All India"
    },
    benefits: "Accidental insurance cover up to ₹2 lakh.",
    documents: [
      "Aadhaar Card",
      "Bank Passbook",
      "PAN Card"
    ],
    applicationMode: "Bank",
    deadline: "Renewable Every Year",
    apply: "https://jansuraksha.gov.in"
  }

];

const schemesWithDeadlines = schemes.map((scheme, index) => ({
  ...scheme,
  applicationDeadline: scheme.applicationDeadline || schemeDeadlines[index % schemeDeadlines.length]
}));

export default schemesWithDeadlines;