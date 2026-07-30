import { useEffect, useState } from "react";
import schemes from "../data/schemes";
import { Link } from "react-router-dom";


function Dashboard(){

    const [recommended,setRecommended] = useState([]);



    useEffect(()=>{


        const profile =
        JSON.parse(
            localStorage.getItem("userProfile") || "null"
        );


        if(!profile){
            return;
        }


        const parsedAge = Number(profile.age);
        const parsedIncome = Number(profile.income);
        const occupation =
            (profile.occupation || "")
            .toString()
            .trim()
            .toLowerCase();
        const gender =
            (profile.gender || "")
            .toString()
            .trim()
            .toLowerCase();

        const isStudent = occupation.includes("student");
        const isFarmer = occupation.includes("farmer");
        const isBusinessOwner =
            occupation.includes("business") ||
            occupation.includes("owner") ||
            occupation.includes("entrepreneur") ||
            occupation.includes("msme");
        const isSeniorCitizen = parsedAge >= 60;
        const isWoman = gender === "female" || gender === "woman";



        const results = schemes.map((scheme)=>{


            let score = 0;

            let reasons = [];


            const criteria = scheme.eligibilityCriteria || {};
            const schemeName = (scheme.name || "").toLowerCase();
            const schemeCategory = (scheme.category || "").toLowerCase();
            const occupationCriteria =
                (criteria.occupation || "")
                .toString()
                .toLowerCase();
            const genderCriteria =
                (criteria.gender || "")
                .toString()
                .toLowerCase();


            if(isStudent){

                if(
                    occupationCriteria === "student" ||
                    schemeCategory.includes("scholarship") ||
                    schemeCategory.includes("skill") ||
                    schemeName.includes("education") ||
                    schemeName.includes("scholar")
                ){

                    score += 70;
                    reasons.push("Matches your student profile");

                }

            }


            if(isFarmer){

                if(
                    occupationCriteria === "farmer" ||
                    schemeCategory.includes("agriculture") ||
                    schemeName.includes("kisan") ||
                    schemeName.includes("fasal") ||
                    schemeName.includes("soil")
                ){

                    score += 70;
                    reasons.push("Matches your farming profile");

                }

            }


            if(isBusinessOwner){

                if(
                    occupationCriteria.includes("entrepreneur") ||
                    occupationCriteria.includes("msme") ||
                    schemeName.includes("msme") ||
                    schemeCategory.includes("business") ||
                    schemeCategory.includes("support")
                ){

                    score += 70;
                    reasons.push("Matches your business profile");

                }

            }


            if(isSeniorCitizen){

                if(
                    schemeCategory.includes("pension") ||
                    schemeCategory.includes("welfare") ||
                    schemeName.includes("pension") ||
                    schemeName.includes("welfare")
                ){

                    score += 70;
                    reasons.push("Matches your senior citizen profile");

                }

            }


            if(isWoman){

                if(
                    genderCriteria === "female" ||
                    schemeName.includes("sukanya") ||
                    schemeName.includes("women") ||
                    schemeName.includes("girl")
                ){

                    score += 50;
                    reasons.push("Matches your gender-based eligibility");

                }

            }


            if(
                Number(parsedIncome)
                <=
                Number(criteria.income)
            ){

                score += 15;
                reasons.push("Income criteria satisfied");

            }


            if(
                Number(parsedAge)
                <=
                Number(criteria.age)
            ){

                score += 15;
                reasons.push("Age criteria satisfied");

            }



            return {

                ...scheme,

                match:score,

                reasons

            };


        });



        setRecommended(

            results
            .filter(
                scheme=>scheme.match>=70
            )
            .sort(
                (a,b)=>b.match-a.match
            )

        );


    },[]);



    return(

        <div className="dashboard-page">


            <div className="dashboard-header">


                <h1>
                    🤖 AI Scheme Recommendations
                </h1>


                <p>
                    Schemes matched according to your profile
                </p>


            </div>




            {
                recommended.length===0 ?

                (

                    <div className="empty-dashboard">

                        <h2>
                            No matching schemes found
                        </h2>

                        <Link to="/profile">
                            Update Profile
                        </Link>

                    </div>

                )

                :

                (

                <div className="recommendation-grid">


                {
                    recommended.map((scheme)=>(


                    <div
                    className="recommendation-card"
                    key={scheme.id}
                    >



                        <h2>
                            {scheme.name}
                        </h2>



                        <span className="match-score">

                            {scheme.match}% Match

                        </span>




                        <h4>
                            Why you qualify:
                        </h4>



                        <ul>

                        {
                            scheme.reasons.map(
                                (reason,index)=>(

                                <li key={index}>
                                    ✅ {reason}
                                </li>

                                )

                            )
                        }

                        </ul>




                        <p>

                            <b>
                            Benefits:
                            </b>

                            <br/>

                            {scheme.benefits}

                        </p>




                        <Link
                        className="view-btn"
                        to={`/scheme/${scheme.id}`}
                        >

                            View Details

                        </Link>



                    </div>


                    ))

                }


                </div>

                )

            }



        </div>

    )


}


export default Dashboard;