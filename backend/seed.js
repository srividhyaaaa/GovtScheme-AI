const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Scholarship = require("./models/Scholarship");

dotenv.config();

const sampleScholarships = [
  {
    title: "AICTE Pragati Scholarship for Girls",
    provider: "All India Council for Technical Education (AICTE)",
    description: "Financial assistance to meritorious girl students pursuing technical degree and diploma education across recognized institutes in India.",
    eligibility: "Girl students admitted to 1st year of Degree/Diploma course in AICTE approved institutes with family income below ₹8 Lakhs/year.",
    amount: 50000,
    deadline: new Date("2026-12-31"),
    category: "Merit",
    state: "All India",
    applyLink: "https://scholarships.gov.in",
    isActive: true,
  },
  {
    title: "Post-Matric Scholarship for SC/ST Students",
    provider: "Ministry of Social Justice and Empowerment",
    description: "Scholarship support for post-matriculation or post-secondary stage education for scheduled caste and scheduled tribe students.",
    eligibility: "SC/ST students studying in class 11th, 12th, undergraduate or postgraduate courses with family income below ₹2.5 Lakhs/year.",
    amount: 35000,
    deadline: new Date("2026-11-30"),
    category: "Need-based",
    state: "All India",
    applyLink: "https://scholarships.gov.in",
    isActive: true,
  },
  {
    title: "Central Sector Scheme of Scholarships for College and University Students",
    provider: "Department of Higher Education, MHRD",
    description: "Financial support to meritorious students from low-income families to meet a part of their day-to-day expenses while pursuing higher studies.",
    eligibility: "Students above 80th percentile in Class 12 board examination pursuing regular college/university courses with annual income below ₹4.5 Lakhs.",
    amount: 20000,
    deadline: new Date("2026-10-31"),
    category: "Merit-cum-Means",
    state: "All India",
    applyLink: "https://scholarships.gov.in",
    isActive: true,
  },
  {
    title: "Prime Minister's Scholarship Scheme (PMSS)",
    provider: "Wards & Widows of Ex-servicemen / CAPF Personnel",
    description: "Encourages higher professional and technical education for dependent wards and widows of deceased/ex-service personnel of Armed Forces and CAPFs.",
    eligibility: "Wards/Widows of deceased or ex-CAPF/AR/Police personnel who secured at least 60% marks in minimum educational qualification.",
    amount: 36000,
    deadline: new Date("2026-12-15"),
    category: "Defense Personnel",
    state: "All India",
    applyLink: "https://ksb.gov.in",
    isActive: true,
  },
  {
    title: "Begum Hazrat Mahal National Scholarship",
    provider: "Maulana Azad Education Foundation (MAEF)",
    description: "Financial assistance to meritorious girl students belonging to national minority communities (Muslims, Christians, Sikhs, Buddhists, Parsis, Jains).",
    eligibility: "Minority girl students studying in Class 9 to 12 with at least 50% marks in previous exam and annual income below ₹2 Lakhs.",
    amount: 12000,
    deadline: new Date("2026-11-15"),
    category: "Minority",
    state: "All India",
    applyLink: "https://scholarships.gov.in",
    isActive: true,
  },
  {
    title: "Karnataka Vidyasiri Scholarship (ePASS)",
    provider: "Department of Backward Classes Welfare, Govt. of Karnataka",
    description: "Financial assistance for post-matric students of OBC, SC, and ST categories residing in hostels or rented accommodation.",
    eligibility: "Students domiciled in Karnataka with attendance above 75% and annual family income below ₹2.5 Lakhs.",
    amount: 15000,
    deadline: new Date("2026-12-01"),
    category: "State Scheme",
    state: "Karnataka",
    applyLink: "https://karepass.cgg.gov.in",
    isActive: true,
  },
];

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("MONGO_URI environment variable is missing in .env!");
    }

    await mongoose.connect(mongoUri);
    console.log("✅ Connected to MongoDB for seeding...");

    // Delete existing scholarships to avoid clutter or duplicates
    await Scholarship.deleteMany({});
    console.log("🧹 Cleared old scholarship records.");

    // Insert sample scholarships
    const inserted = await Scholarship.insertMany(sampleScholarships);
    console.log(`🎉 Successfully seeded ${inserted.length} government schemes & scholarships!`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Database seeding failed:", error.message);
    process.exit(1);
  }
};

seedDB();
