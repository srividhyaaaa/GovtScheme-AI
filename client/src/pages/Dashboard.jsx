import { useEffect, useState } from "react";
import schemes from "../data/schemes";
import { Link } from "react-router-dom";


function Dashboard(){

    const [recommended,setRecommended] = useState([]);



    useEffect(()=>{


        const profile =
        JSON.parse(
            localStorage.getItem("userProfile")
        );


        if(!profile){
            return;
        }



        const results = schemes.map((scheme)=>{


            let score = 0;

            let reasons = [];


            const criteria =
            scheme.eligibilityCriteria;



            // Occupation Match

            if(
                criteria.occupation === "Any" ||
                criteria.occupation === profile.occupation
            ){

                score += 40;

                reasons.push(
                    "Occupation criteria matched"
                );

            }



            // Income Match

            if(
                Number(profile.income)
                <=
                criteria.income
            ){

                score += 30;

                reasons.push(
                    "Income criteria satisfied"
                );

            }



            // Age Match

            if(
                Number(profile.age)
                <=
                criteria.age
            ){

                score += 30;

                reasons.push(
                    "Age criteria satisfied"
                );

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
                scheme=>scheme.match>=50
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