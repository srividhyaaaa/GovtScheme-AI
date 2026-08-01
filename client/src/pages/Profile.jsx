import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import Loader from "../components/Loader";


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
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");


    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        const loadProfile = async () => {
            try {
                setLoading(true);
                setError("");
                const response = await api.get("/student/profile");
                const student = response.data.student || {};
                setProfile({
                    name: student.name || "",
                    age: student.age || "",
                    gender: student.gender || "",
                    state: student.state || "",
                    income: student.familyIncome || student.income || "",
                    occupation: student.occupation || student.degree || "",
                    category: student.category || ""
                });
                localStorage.setItem("userProfile", JSON.stringify({
                    name: student.name || "",
                    age: student.age || "",
                    gender: student.gender || "",
                    state: student.state || "",
                    income: student.familyIncome || student.income || "",
                    occupation: student.occupation || student.degree || "",
                    category: student.category || ""
                }));
            } catch (err) {
                setError(err.response?.data?.message || "Unable to load your profile right now.");
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, [navigate]);



    const handleChange=(e)=>{

        setProfile({

            ...profile,

            [e.target.name]: e.target.value

        });

    };



    const handleSubmit=async (e)=>{

        e.preventDefault();

        try {
            setSaving(true);
            setError("");
            const payload = {
                name: profile.name,
                age: profile.age,
                gender: profile.gender,
                state: profile.state,
                familyIncome: profile.income,
                occupation: profile.occupation,
                category: profile.category,
            };
            const response = await api.post("/student/profile", payload);
            localStorage.setItem("userProfile", JSON.stringify(profile));
            localStorage.setItem("user", JSON.stringify(response.data.student || {}));
            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.message || "Unable to save your profile right now.");
        } finally {
            setSaving(false);
        }

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



                {error && <p className="error-message">{error}</p>}

                {loading ? (
                    <Loader label="Loading your profile..." />
                ) : (
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



                    <button type="submit" disabled={saving}>
                        {saving ? "Saving..." : "Save Profile"}
                    </button>



                </form>
                )}


            </div>


        </div>

    );

}


export default Profile;