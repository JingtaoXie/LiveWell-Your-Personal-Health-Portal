import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../analysis.css"
import logo from "../asset/logo/Logo.png"
import diabeteslogo from "../asset/logo/diabetes-test.png"
// import { ref, get, set, update } from "firebase/database";
// import { db } from "../firebase";
import sick from "../asset/logo/sick.png"
import healthy from "../asset/logo/healthy.png"
import AV from 'leancloud-storage';



const DiabetesPrediction = () => {

    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);

    const [personalData, setPersonalData] = useState();
    const [bmi, setBMI] = useState();
    const [formValues, setFormValues] = useState({
        gender: "",
        age: "",
        height: "",
        weight: "",
        hemoglobin: "",
        blood_glucose: "",
        hypertension: "",
        heart_disease: "",
        smoking_history: "",

    });

    const [predictionResult, setPredictionResult] = useState(null);
    const [predictionFeatures, setPredictionFeatures] = useState(
        {
            gender: "",
            age: "",
            hypertension: "",
            heart_disease: "",
            smoking_history: "",
            bmi: "",
            hemoglobin: "",
            blood_glucose: ""
        }
    )


    const currentUser = document.cookie;
    const currentUserName = currentUser.split("=")[1]

    const quitAndCleanCookies = async () => {
        navigate("/")
        document.cookie = `${currentUser}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`
    }


    AV.init({
        appId: "93Qe7j4J4hd9DF6H8vG0d36a-gzGzoHsz",
        appKey: "MfKclPpBwhsva7NPLWrjUvbu",
        serverURL:"https://93qe7j4j.lc-cn-n1-shared.com"
      });
    
    //   AV.init({
    //     appId: "Ptwt58ZYseekGbBCxuinUUCm-MdYXbMMI",
    //     appKey: "CLwL76b1hVyCxZOqhX7V1Wsm",
    //   });


    const getInfo = async () => {
        try {
            const query = new AV.Query("personalData");
            query.equalTo("username", currentUserName);
            const user = await query.first();

            if (user) {
                const personalInfo = user.get("personalData");
                return personalInfo || null;
            } else {
                return null;
            }
        } catch (error) {
            console.error("Failed in capturing users data:", error);
            return null;
        }
    };



    const saveRecordinDataBase = async () => {
        const currentUser = document.cookie.split("=")[1];
        const processedPrediction = Array.isArray(predictionResult) ? predictionResult[0] : predictionResult;

        const newPrediction = {
            timestamp: new Date().toISOString(),
            prediction: processedPrediction,
        };

        try {
            const query = new AV.Query("personalData");
            query.equalTo("username", currentUser);
            const existing = await query.first();

            let userEntry;
            if (existing) {
                userEntry = existing;
            } else {
                const PersonalData = AV.Object.extend("personalData");
                userEntry = new PersonalData();
                userEntry.set("username", currentUser);
            }

            const predictionResult = userEntry.get("predictionResult") || {};
            predictionResult["diabetesPrediction"] = newPrediction;

            userEntry.set("predictionResult", predictionResult);
            await userEntry.save();

            console.log("✅ Diabetes prediction saved successfully!");
        } catch (error) {
            console.error("❌ Error saving diabetes prediction:", error);
        }
    };


    //   const getInfo = async () => {
    //     const storagePath = ref(db, `users/${currentUserName}/personalData`);
    //     try {
    //         const userInfo = await get(storagePath);
    //         if (userInfo.exists()) {
    //             return userInfo.val();
    //         } else {
    //             return null;
    //         }
    //     } catch (error) {
    //         return null;
    //     }
    // };

    // const saveRecordinDataBase = async () => {
    //     const currentUser = document.cookie.split("=")[1];
    //     const storagePath = ref(db, `users/${currentUser}/predictionResult/diabetesPrediction`);

    //     const processedPrediction = Array.isArray(predictionResult) ? predictionResult[0] : predictionResult;

    //     const dataToSave = {
    //         timestamp: new Date().toISOString(),
    //         prediction: processedPrediction,
    //     };

    //     try {
    //         await update(storagePath, dataToSave);
    //         console.log("Prediction saved successfully!");
    //     } catch (error) {
    //         console.error("Error saving prediction:", error);
    //     }
    // };


    const handleInputChange = (field, value) => {
        setFormValues((prevState) => ({
            ...prevState,
            [field]: value,
        }));
    };

    const calculateAge = (dob) => {
        if (!dob) return "";
        const birthDate = new Date(dob);
        const today = new Date();

        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        const dayDiff = today.getDate() - birthDate.getDate();

        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
            age--;
        }
        return parseInt(age);
    };


    const calculateBMI = (height, weight) => {
        if (!height || !weight) return 0;
        return parseFloat((weight / Math.pow(height / 100, 2)).toFixed(2));
    };

    const transferGlucose = (glucose) => {
        const newglucose = glucose * 18.2
        return newglucose
    }

    const transferHemoglobin = (hemoglobin) => {
        const newHemoglobin = hemoglobin / 0.6206
        return newHemoglobin
    }

    const diabetesPredictionAlgorithm = (featurelist) => {
        console.log("Sending feature list:", featurelist);
        fetch("https://diabetespredictionapi-hp42.onrender.com/predict", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(featurelist)
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => {
                        console.error("API Error:", err);
                        throw new Error(`API Error: ${response.status}`);
                    });
                }
                return response.json();
            })
            .then(data => {
                console.log("Predict result:", data.prediction);
                setPredictionResult(data.prediction || "No result available");
            })
            .catch(error => console.error("Error:", error));
    };

    const isPredictionValid = () => {
        return Object.values(predictionFeatures).every(value => value !== null && !isNaN(value) && value !== "");
    };


    useEffect(() => {
        const fetchData = async () => {

            const data = await getInfo();
            setPersonalData(data);

        };
        fetchData()
    }, [])

    useEffect(() => {
        if (personalData?.birth) {
            setFormValues(prev => ({
                ...prev,
                age: calculateAge(personalData.birth)
            }));
        }
    }, [personalData]);

    useEffect(() => {
        if (formValues?.height && formValues?.weight) {
            setBMI(calculateBMI(formValues.height, formValues.weight));
        }
    }, [formValues.height, formValues.weight]);


    useEffect(() => {
        if (personalData) {
            setFormValues(prev => ({
                ...prev,
                age: parseInt(calculateAge(personalData.birth)),
                gender: personalData.gender ?? "",
                height: personalData.height ?? "",
                weight: personalData.weight ?? "",
                blood_glucose: personalData.bloodSugar ?? "",
                hemoglobin: personalData.hemoglobin ?? "",
                hypertension: "",
                heart_disease: "",
                smoking_history: "",
            }));
        }
    }, [personalData]);

    useEffect(() => {
        setPredictionFeatures(prev => {
            const newFeatures = {
                gender: formValues.gender === "male" ? 1 : 0,
                age: formValues.age,
                hypertension: formValues.hypertension,
                heart_disease: formValues.heart_disease,
                smoking_history: formValues.smoking_history,
                bmi: calculateBMI(formValues.height, formValues.weight),
                hemoglobin: transferHemoglobin(formValues.hemoglobin),
                blood_glucose: transferGlucose(formValues.blood_glucose)
            };
            return JSON.stringify(prev) !== JSON.stringify(newFeatures) ? newFeatures : prev;
        });
    }, [formValues]);

    useEffect(() => {
        if (predictionResult !== null && predictionResult !== undefined && predictionResult !== "") {
            saveRecordinDataBase();
        }
    }, [predictionResult]);

    const test = () => {
        console.log(formValues)
        console.log(predictionFeatures)

    }


    return (
        <div className="analysis-page flex flex-col min-h-screen">
            <header className="w-full max-w-screen mx-auto p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 cursor-pointer" onClick={() => navigate("/dashboard")}>
                        <img src={logo} className="w-12 h-12" alt="Logo" />
                        <h1 className="text-base font-bold">LiveWell Diabetes Prediction</h1>
                    </div>

                    <div className="md:hidden relative">
                        <button onClick={() => setShowMenu(!showMenu)} className="focus:outline-none">
                            <svg className="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm0 5.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm0 5.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3z" />
                            </svg>
                        </button>
                        {showMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-xl z-50 text-xs">
                                <div className="flex items-center justify-center px-4 py-2 border-b">
                                    <img src={logo} className="w-6 h-6" alt="Menu Logo" />
                                    <span className="font-semibold text-gray-700">Menu</span>
                                </div>
                                <button className="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md" onClick={() => navigate("/analysis")}>
                                    📊 Analysis
                                </button>
                                <button className="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md" onClick={() => navigate("/modifyInfo")}>
                                    ✏️ Modify Profile
                                </button>
                                <button className="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md" onClick={() => navigate("/dietStats")}>
                                    🥗 Diets Assistance
                                </button>
                                <button className="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md" onClick={() => navigate("/yourHealthReport")}>
                                    📃 Your Health Report
                                </button>
                                <button className="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md" onClick={() => navigate("/contactUs")}>
                                    📧 Contact Us
                                </button>
                                <button className="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md" onClick={() => quitAndCleanCookies}>
                                    📴 Log out
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="hidden md:flex flex-row justify-between items-center">
                        <button className="text-sm font-semibold hover:text-blue-700 underline px-3 py-2" onClick={() => navigate("/analysis")}>
                            Analysis
                        </button>
                        <button className="text-sm font-semibold hover:text-blue-700 underline px-3 py-2" onClick={() => navigate("/modifyInfo")}>
                            Modify Profile
                        </button>
                        <button className="text-sm font-semibold hover:text-blue-700 underline px-3 py-2" onClick={() => navigate("/dietStats")}>
                            Diets Assistance
                        </button>
                        <button className="text-sm font-semibold hover:text-blue-700 underline px-3 py-2" onClick={() => navigate("/yourHealthReport")}>
                            Your Health Report
                        </button>
                        <button className="text-sm font-semibold hover:text-blue-700 underline px-3 py-2" onClick={() => navigate("/contactUs")}>
                            Contact Us
                        </button>
                        <button className="text-sm font-semibold hover:text-blue-700 underline px-3 py-2" onClick={quitAndCleanCookies}>
                            Log out
                        </button>
                    </div>
                </div>
            </header>
            <main className="flex flex-col sm:flex-row flex-1 bg-gray-100 mx-5 my-4 p-6 rounded-lg shadow-md">
                <div className="sm:w-3/5 flex flex-col items-start space-y-6">
                    <div className="flex flex-row w-full items-center">
                        <div className="flex flex-col w-1/2 px-2">
                            <label className="font-bold text-xs mb-1">Gender:</label>
                            <select
                                id="gender"
                                className="border border-gray-300 rounded p-2 text-xs w-full"
                                value={formValues.gender || ""}
                                onChange={(e) => handleInputChange("gender", e.target.value)}
                            >
                                <option value="">Select an option</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>
                        <div className="flex flex-col w-1/2 px-2">
                            <label className="font-bold text-xs mb-1">Age:</label>
                            <input
                                placeholder="e.g. 2000-01-01"
                                className="text-xs border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-400 font-sans"
                                value={formValues.age}
                                onChange={(e) => handleInputChange("age", e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex flex-row w-full items-center">
                        <div className="flex flex-col w-1/3 px-2">
                            <label className="text-xs font-bold mb-1">Height:</label>
                            <input
                                type="number"
                                placeholder="Height (cm)"
                                className="text-xs border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-400 font-sans"
                                value={formValues.height || ""}
                                onChange={(e) => handleInputChange("height", e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col w-1/3 px-2">
                            <label className="text-xs font-bold mb-1">Weight:</label>
                            <input
                                type="number"
                                placeholder="Weight (kg)"
                                className="text-xs border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-400 font-sans"
                                value={formValues.weight || ""}
                                onChange={(e) => handleInputChange("weight", e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col w-1/3 text-xs">
                            <h1 className="text-gray-800 font-bold text-s">Your current BMI</h1>
                            <p className="text-gray-700 text-sm">{bmi ?? "N/A"}</p>
                        </div>
                    </div>
                    <div className="flex flex-row w-full items-center">
                        <div className="flex flex-col w-1/2 px-2">
                            <label className="text-xs font-bold mb-1">Blood Sugar:</label>
                            <input
                                type="number"
                                placeholder="mmol/L"
                                className="text-xs border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-400 font-sans"
                                value={formValues.blood_glucose || ""}
                                onChange={(e) => handleInputChange("blood_glucose", e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col w-1/2 px-2">
                            <label className="text-xs font-bold mb-1">Hemoglobin:</label>
                            <input
                                type="number"
                                placeholder="g/dL"
                                className="text-xs border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-400 font-sans"
                                value={formValues.hemoglobin || ""}
                                onChange={(e) => handleInputChange("hemoglobin", e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col px-2 w-full space-y-2">
                        <label htmlFor="hypertension" className="font-bold text-xs">Hypertension:</label>
                        <select
                            id="hypertension"
                            className="border border-gray-300 rounded p-2 text-xs w-full"
                            value={formValues.hypertension === 1 ? "Yes" : formValues.hypertension === 0 ? "No" : ""}
                            onChange={(e) => handleInputChange("hypertension", e.target.value === "Yes" ? 1 : 0)}
                        >
                            <option value="" disabled>Select an option</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </div>
                    <div className="flex flex-col px-2 w-full space-y-2">
                        <label htmlFor="hypertension" className="font-bold text-xs">Heart Disease:</label>
                        <select
                            id="heartDisease"
                            className="border border-gray-300 rounded p-2 text-xs w-full"
                            value={formValues.heart_disease === 1 ? "Yes" : formValues.heart_disease === 0 ? "No" : ""}
                            onChange={(e) => handleInputChange("heart_disease", e.target.value === "Yes" ? 1 : 0)}
                        >
                            <option value="" disabled>Select an option</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </div>
                    <div className="flex flex-col px-2 w-full space-y-2">
                        <label htmlFor="smokingHistory" className="font-bold text-xs">Smoking History:</label>
                        <select
                            id="smokingHistory"
                            className="border border-gray-300 rounded p-2 text-xs w-full"
                            value={formValues.smoking_history !== "" ? formValues.smoking_history : ""}
                            onChange={(e) => handleInputChange("smoking_history", parseInt(e.target.value))}
                        >
                            <option value="" disabled>Select an option</option>
                            <option value="0">Never (means you never smoke before)</option>
                            <option value="1">Former (means you smoked before but quited)</option>
                            <option value="2">Current (currently smoking)</option>
                            <option value="3">No Info (You don't want to share this info)</option>
                        </select>
                    </div>
                    <div className="w-full flex justify-start items-center justify-center">
                        <button
                            onClick={() => { setPredictionResult(null); diabetesPredictionAlgorithm(predictionFeatures) }}
                            disabled={!isPredictionValid()}
                            className={`text-white font-bold py-2 px-6 rounded shadow transition 
            ${isPredictionValid() ? "bg-blue-500 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"}
        `}
                        >
                            To check if you have diabetes or not
                        </button>
                    </div>
                    <div className="flex flex-col justify-center items-center w-full">
                        <h1 className="text-xs mb-3 text-center font-sans">
                            * This algorithm does not guarantee 100% accuracy, for reference only
                        </h1>
                        <h1 className="text-xs mb-3 text-center font-sans">* The response speed may be slow when the algorithm is used for the first time. If no prediction result is obtained, try again after 60 seconds</h1>
                    </div>
                </div>
                <div className="sm:w-2/5 flex flex-col mt-5">
                    <div className="flex-1"></div>
                    <div className="flex flex-col items-center justify-center flex-2">
                        {predictionResult === null ? (
                            <div className="flex flex-col items-center justify-center space-y-5">
                                <div className="w-60 h-60 border-4 border-black border-t-transparent rounded-full animate-spin-slow flex items-center justify-center relative">
                                    <img src={logo} className="w-20 h-20 absolute inset-0 m-auto transform -rotate-0" alt="Logo" />
                                </div>
                                <h1 className="text-black text-lg mt-2 text-center">Waiting for your health index...</h1>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center space-y-3">
                                <div className={`w-40 h-40 rounded-full relative flex items-center justify-center ${predictionResult > 0.55 ? "bg-red-500" : "bg-green-500"} animate-scaleIn`}
                                >
                                    <img src={predictionResult > 0.55 ? sick : healthy} className="w-20 h-20" alt="Health Status" />
                                </div>
                                <h1 className={`text-lg mt-2 text-center ${predictionResult > 0.55 ? "text-red-500" : "text-green-500"} animate-scaleIn`}>
                                    {predictionResult > 0.55 ? "High risk of diabetes" : "Low risk of diabetes"}
                                </h1>
                                <h1 className={`text-sm mt-2 text-center font-sans ${predictionResult > 0.55 ? "text-red-500" : "text-green-500"} animate-scaleIn`}>
                                    Our analysis suggests a {predictionResult ? (predictionResult * 100).toString().match(/^\d+(\.\d{0,4})?/)[0] : "0.00"}% likelihood of diabetes.
                                </h1>
                                <h1 className={`text-sm mt-2 text-center font-sans 
    ${predictionResult > 0.55 ? "text-red-500" : "text-green-500"} animate-scaleIn`}>
                                    {predictionResult > 0.55
                                        ? `Please maintain a healthy diet and regular lifestyle. If you experience any discomfort, we recommend consulting a doctor as soon as possible.`
                                        : `Great news! You’re in good health. Keep maintaining your healthy lifestyle!`}
                                </h1>
                            </div>
                        )}
                    </div>
                    <div className="flex-1">

                    </div>
                </div>
            </main>
        </div>
    );
};

export default DiabetesPrediction; 