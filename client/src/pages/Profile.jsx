import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


function Profile(){

    const navigate = useNavigate();


    const [profile,setProfile] = useState({

        name:"",
        age:"",
        gender:"",
        state:"",
        income:"",
        occupation:"",
        category:""

    });


    useEffect(() => {

        const savedProfile = localStorage.getItem("userProfile");

        if (savedProfile) {

            try {

                setProfile(JSON.parse(savedProfile));

            } catch (error) {

                console.error("Failed to load saved profile", error);

            }

        }

    }, []);



    const handleChange=(e)=>{

        setProfile({

            ...profile,

            [e.target.name]: e.target.value

        });

    };



    const handleSubmit=(e)=>{

        e.preventDefault();


        localStorage.setItem(
            "userProfile",
            JSON.stringify(profile)
        );


        alert("Profile Saved Successfully");


        // Redirect to Dashboard
        navigate("/dashboard");

    };



    return(

        <div className="profile-page">


            <div className="profile-card">


                <h1>
                    👤 Complete Your Profile
                </h1>


                <p>
                    Help AI find schemes suitable for you
                </p>



                <form onSubmit={handleSubmit}>


                    <input
                    name="name"
                    placeholder="Full Name"
                    value={profile.name}
                    onChange={handleChange}
                    required
                    />


                    <input
                    name="age"
                    placeholder="Age"
                    type="number"
                    value={profile.age}
                    onChange={handleChange}
                    required
                    />



                    <select
                    name="gender"
                    value={profile.gender}
                    onChange={handleChange}
                    required
                    >

                        <option value="">
                            Select Gender
                        </option>

                        <option>
                            Male
                        </option>

                        <option>
                            Female
                        </option>

                        <option>
                            Other
                        </option>

                    </select>



                    <input
                    name="state"
                    placeholder="State"
                    value={profile.state}
                    onChange={handleChange}
                    required
                    />



                    <input
                    name="income"
                    placeholder="Annual Income"
                    value={profile.income}
                    onChange={handleChange}
                    required
                    />



                    <input
                    name="occupation"
                    placeholder="Occupation"
                    value={profile.occupation}
                    onChange={handleChange}
                    required
                    />



                    <select
                    name="category"
                    value={profile.category}
                    onChange={handleChange}
                    required
                    >

                        <option value="">
                            Select Category
                        </option>

                        <option>
                            General
                        </option>

                        <option>
                            OBC
                        </option>

                        <option>
                            SC
                        </option>

                        <option>
                            ST
                        </option>


                    </select>



                    <button type="submit">
                        Save Profile
                    </button>



                </form>


            </div>


        </div>

    );

}


export default Profile;