const schemes = [

  {
    id: 1,

    name: "PM Kisan Samman Nidhi",

    ministry: "Ministry of Agriculture",

    category: "Agriculture",

    eligibility: "Small and Marginal Farmers",

    eligibilityCriteria:{
      occupation:"Farmer",
      income:800000,
      age:65
    },

    benefits: "₹6,000 per year",

    documents:[
      "Aadhaar",
      "Bank Passbook",
      "Land Records"
    ],

    apply:"https://pmkisan.gov.in"

  },



  {
    id: 2,

    name: "Ayushman Bharat",

    ministry: "Ministry of Health",

    category: "Health",

    eligibility: "Economically Weaker Families",

    eligibilityCriteria:{
      occupation:"Any",
      income:300000,
      age:70
    },

    benefits:"Health Insurance up to ₹5 Lakhs",

    documents:[
      "Aadhaar",
      "Ration Card"
    ],

    apply:"https://pmjay.gov.in"

  },



  {
    id: 3,

    name:"PM Awas Yojana",

    ministry:"Ministry of Housing",

    category:"Housing",

    eligibility:"Low Income Families",

    eligibilityCriteria:{
      occupation:"Any",
      income:600000,
      age:60
    },


    benefits:
    "Financial assistance for house construction",

    documents:[
      "Aadhaar",
      "Income Certificate"
    ],

    apply:"https://pmaymis.gov.in"

  },



  {
    id:4,

    name:"Skill India Mission",

    ministry:"Ministry of Skill Development",

    category:"Education",

    eligibility:"Youth above 18 years",

    eligibilityCriteria:{
      occupation:"Student",
      income:1000000,
      age:45
    },


    benefits:"Free Skill Training",

    documents:[
      "Aadhaar",
      "Educational Certificate"
    ],

    apply:"https://www.skillindia.gov.in"

  },



  {
    id:5,

    name:"Startup India",

    ministry:"Ministry of Commerce",

    category:"Business",

    eligibility:"Entrepreneurs",

    eligibilityCriteria:{
      occupation:"Entrepreneur",
      income:1000000,
      age:45
    },


    benefits:"Funding and Tax Benefits",

    documents:[
      "PAN",
      "Aadhaar"
    ],


    apply:"https://www.startupindia.gov.in"

  },



  {
    id:6,

    name:"National Scholarship Portal",

    ministry:"Ministry of Education",

    category:"Scholarship",

    eligibility:"Eligible Students",

    eligibilityCriteria:{
      occupation:"Student",
      income:500000,
      age:35
    },


    benefits:"Scholarship Assistance",

    documents:[
      "Aadhaar",
      "Income Certificate",
      "Bonafide"
    ],


    apply:"https://scholarships.gov.in"

  }


];


export default schemes;