import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../dietStats.css"
import logo from "../asset/logo/Logo.png"
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { generateContent } from '../firebase';
// import { db } from "../firebase";
// import { ref, get, update } from "firebase/database";
import { motion } from "framer-motion";
import eating from "../asset/logo/eating.png"
import exerciselogo from "../asset/logo/exercise.png"
import clock from "../asset/logo/clock.png"
import AV from 'leancloud-storage';


const Diets = () => {

    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);
    const currentUser = document.cookie;
    const currentUserName = currentUser.split("=")[1];

    const quitAndCleanCookies = async () => {
        navigate("/")
        document.cookie = `${currentUser}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`
    }


    const [personalData, setPersonalData] = useState();

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [allDietConsumption, setAllDietConsumption] = useState();
    const [exercise, setExercise] = useState();
    const [energySurplusResult, setEnergySurplusResult] = useState();
    const [loading, setLoading] = useState();
    const [gainLoseWeightBoolean, setGainLoseWeightBoolean] = useState(null);
    const [todayMilestone, setTodayMileStoneBoolean] = useState(null);
    const [historyRecord, setHistoryRecord] = useState();

    AV.init({
        appId: "93Qe7j4J4hd9DF6H8vG0d36a-gzGzoHsz",
        appKey: "MfKclPpBwhsva7NPLWrjUvbu",
        serverURL:"https://93qe7j4j.lc-cn-n1-shared.com"
      });
    
    //   AV.init({
    //     appId: "Ptwt58ZYseekGbBCxuinUUCm-MdYXbMMI",
    //     appKey: "CLwL76b1hVyCxZOqhX7V1Wsm",
    //   });


    const handleDateChange = (date) => {
        setSelectedDate(date);
    };


    const dailyCaloricSurplusCalculation = async (allDietConsumption, exercise) => {
        try {
            setLoading(true);

            const prompt = `User's diet: ${allDietConsumption || "None"}, exercise: ${exercise || "None"}. The user weighs ${personalData.weight} kg and is ${personalData.height} cm tall. Calculate the daily caloric surplus in kcal **ONLY based on the provided food intake and exercise data**. Do not assume additional energy intake or expenditure beyond the provided values. Answer with one single number: positive if surplus, negative if deficit. No need to explain.`;

            const res = await fetch("", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ prompt }),
            });

            const data = await res.json();

            setTimeout(() => {
                setEnergySurplusResult(data.response.trim());
                setLoading(false);
            }, 2000);

            return data.response;
        } catch (error) {
            console.error("AI failed in responsing:", error);

            setTimeout(() => {
                setEnergySurplusResult("No value returned");
                setLoading(false);
            }, 2000);

            return "No value returned";
        }
    };


    // const dailyCaloricSurplusCalculation = async (allDietConsumption, exercise) => {
    //     try {
    //         setLoading(true);

    //         const prompt = `User's diet: ${allDietConsumption || "None"}, exercise: ${exercise || "None"}. The user weighs ${personalData.weight} kg and is ${personalData.height} cm tall. Calculate the daily caloric surplus in kcal **ONLY based on the provided food intake and exercise data**. Do not assume additional energy intake or expenditure beyond the provided values. Answer with one single number: positive if surplus, negative if deficit. No need to explain`;

    //         const result = await generateContent(prompt);
    //         const response = result.response;
    //         const text = await response.text();

    //         setTimeout(() => {
    //             setEnergySurplusResult(text.trim());
    //             setLoading(false);
    //         }, 2000);
    //     } catch {
    //         setTimeout(() => {
    //             setEnergySurplusResult("No value returned");
    //             setLoading(false);
    //         }, 2000);
    //     }
    // };


    const ifGainWeightOrLoseWeight = async () => {
        try {
            setLoading(true);
            setGainLoseWeightBoolean(null);

            const prompt = `The user has the following health indicators: gender is ${personalData.gender}, date of birth is ${personalData.birth}, height is ${personalData.height} cm, weight is ${personalData.weight} kg, blood pressure is ${personalData.sBloodPressure}-${personalData.dBloodPressure} mmHg, blood sugar level is ${personalData.bloodSugar} mmol/L, blood lipids level is ${personalData.bloodLipids} mmol/L, heart rate is ${personalData.heartRate} bpm, hemoglobin is ${personalData.hemoglobin} g/dL, urea is ${personalData.urea} mmol/L, urine glucose is ${personalData.urineGlucose} mg/dL, uric acid is ${personalData.urineAcid} µmol/L, creatinine is ${personalData.creatinine} µmol/L, alanine aminotransferase (ALT) is ${personalData.alt} U/L, and aspartate aminotransferase (AST) is ${personalData.ast} U/L. Based on BMI, metabolic health, and cardiovascular risk factors, determine whether this user needs to gain weight. Return only true if the user needs to gain weight, otherwise return false. No explanations needed.`;

            const result = await generateContent(prompt);
            const response = result.response;
            const text = await response.text();

            setTimeout(() => {
                setGainLoseWeightBoolean(text.trim() === "true");
                setLoading(false);
            }, 2000);
        } catch {
            setTimeout(() => {
                setGainLoseWeightBoolean(null);
                setLoading(false);
            }, 2000);
        }
    };


    const formatDateToUserTimeZone = (date) => {
        const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        const formatter = new Intl.DateTimeFormat('en-CA', {
            timeZone: userTimeZone,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });

        return formatter.format(date);
    };


    const saveRecord = async () => {
        const formattedDate = formatDateToUserTimeZone(selectedDate);

        try {
            const query = new AV.Query("personalData");
            query.equalTo("username", currentUserName);
            const existing = await query.first();

            let userEntry;
            if (existing) {
                userEntry = existing;
            } else {
                const PersonalData = AV.Object.extend("personalData");
                userEntry = new PersonalData();
                userEntry.set("username", currentUserName);
            }

            const dietAndExercise = userEntry.get("dietAndExercise") || {};
            dietAndExercise[formattedDate] = {
                allDietConsumption,
                exercise,
                todayMilestone
            };
            userEntry.set("dietAndExercise", dietAndExercise);

            await userEntry.save();
        } catch (err) {
            console.error("Failed in tracking your diet and exercise situation:", err);
        }
    };

    const getRecord = async () => {
        try {
            const formattedDate = formatDateToUserTimeZone(selectedDate)

            const query = new AV.Query("personalData");
            query.equalTo("username", currentUserName);
            const result = await query.first();

            if (result) {
                const dietAndExercise = result.get("dietAndExercise") || {};
                if (dietAndExercise[formattedDate]) {
                    setHistoryRecord(dietAndExercise[formattedDate]);
                } else {
                    setHistoryRecord("No record is found");
                }
            } else {
                setHistoryRecord("No record is found");
            }
        } catch (err) {
            console.error("Failed in capturing your record", err);
            setHistoryRecord("No record is found");
        }
    };


    const getInfo = async () => {
        try {
            const query = new AV.Query("personalData");
            query.equalTo("username", currentUserName);
            const result = await query.first();

            if (result) {
                const data = result.get("personalData");
                return data || null;
            } else {
                return null;
            }
        } catch (err) {
            console.error("Failed in getting info:", err);
            return null;
        }
    };



    // const saveRecord = async () => {
    //     const formattedDate = selectedDate.toLocaleDateString('en-CA');
    //     const storagePath = ref(db, `users/${currentUserName}/dietAndExercise/${formattedDate}`);
    //     await update(storagePath, { allDietConsumption, exercise, todayMilestone });
    // };

    // const getRecord = async () => {
    //     try {
    //         const formattedDate = selectedDate.toLocaleDateString('en-CA');
    //         const storagePath = ref(db, `users/${currentUserName}/dietAndExercise/${formattedDate}`);
    //         const record = await get(storagePath);
    //         if (record.exists()) {
    //             setHistoryRecord(record.val());
    //         } else {
    //             setHistoryRecord("No record is found");
    //         }
    //     } catch {
    //         setHistoryRecord("No record is found");
    //     }
    // };

    // const getInfo = async () => {
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

    useEffect(() => {
        const fetchData = async () => {
            const data = await getInfo();
            setPersonalData(data);
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (gainLoseWeightBoolean !== null && energySurplusResult !== null) {
            const energySurplus = parseFloat(energySurplusResult);
            if (!isNaN(energySurplus)) {
                setTodayMileStoneBoolean(gainLoseWeightBoolean ? energySurplus > 0 : energySurplus < 0);
            }
        }
    }, [gainLoseWeightBoolean, energySurplusResult]);


    useEffect(() => {
        setHistoryRecord(null)
        getRecord();
        console.log(selectedDate)
        console.log(selectedDate.toISOString().split('T')[0])
    }, [selectedDate]);



    return (
        <div className="dietStats-page flex flex-col min-h-screen">
            <header className="w-full max-w-screen mx-auto p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 cursor-pointer" onClick={() => navigate("/dashboard")}>
                        <img src={logo} className="w-12 h-12" alt="Logo" />
                        <h1 className="text-base font-bold">LiveWell Diet Assistant</h1>
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
            <main className="flex-1 bg-gray-100 mx-5 my-4 p-6 rounded-lg shadow-md flex flex-col justify-between md:flex-row">
                <div className="flex-1 border-r p-8">
                    <div className="flex flex-col items-center p-6 rounded-lg">
                        <h2 className="text-xl font-bold mb-4">Calendar</h2>
                        <Calendar
                            onChange={handleDateChange}
                            value={selectedDate}
                            className="border rounded-md shadow-md"
                        />
                    </div>
                    <div className="flex-1 record-situation mt-6 bg-white p-4 mx-5 my-4 p-6 rounded-lg shadow-md justify-between item-center text-center md:flex-row">
                        <div className="flex flex-col mb-3">
                            <img src={clock} className="w-10 h-10 mx-auto" alt="clock" />
                            <h1>{selectedDate.getFullYear()}-{(selectedDate.getMonth() + 1).toString().padStart(2, '0')}-{selectedDate.getDate().toString().padStart(2, '0')} 's diet and exercise report</h1>
                        </div>
                        <div>
                            <h1 className="text-blue-600 text-sm font-sans">
                                {historyRecord?.allDietConsumption
                                    ? `Your diet on that day was : ${historyRecord.allDietConsumption}`
                                    : "No record found"}
                            </h1>
                            <h1 className="text-blue-600 text-sm font-sans">{historyRecord?.exercise ? `Your exercise on that day was : ${historyRecord.exercise}` : "No record found"}</h1>
                        </div>
                        <h1 className="text-center text-blue-600 mt-4 font-bold">
                            {historyRecord
                                ? (historyRecord.todayMilestone
                                    ? "✅ You met the standard"
                                    : "❌ You did not meet the standard")
                                : null}
                        </h1>
                    </div>
                </div>
                <div className="flex-1 p-4 flex flex-col">
                    <div className="diet-situation flex-[0.4]">
                        <div className="flex items-center space-x-4">
                            <img src={eating} className="w-10 h-10" />
                            <h1>Keep track of what you have eat today</h1>
                        </div>
                        <div className="diet-recorder bg-white p-4 rounded-lg shadow-md mt-6">
                            <div className="flex flex-row mt-2 gap-x-6">
                                <input
                                    type="text"
                                    placeholder="Input what you have eat today (e.g. Breakfast 8:00 a.m. cereral 150g)"
                                    className="text-xs w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-400 font-sans mb-4"
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setAllDietConsumption(value);
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 consumption-situation mt-6 mb-6">
                        <div className="exercise-situation flex-[0.4]">
                            <div className="flex items-center space-x-4">
                                <img src={exerciselogo} className="w-10 h-10" />
                                <h1>Keep track of the exercises you did today</h1>
                            </div>
                            <div className="exercise-recorder bg-white p-4 rounded-lg shadow-md mt-6">
                                <div className="flex flex-row mt-2 gap-x-6">
                                    <input
                                        type="text"
                                        placeholder="Input what you have eat today (e.g. Jogging 1km)"
                                        className="text-xs w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-400 font-sans mb-4"
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setExercise(value);
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={async () => {
                            await dailyCaloricSurplusCalculation(allDietConsumption, exercise);
                            console.log("Updated Diet:", allDietConsumption);
                            console.log("Updated Exercise:", exercise);

                            await ifGainWeightOrLoseWeight();
                            console.log("Updated Gain/Lose Boolean:", gainLoseWeightBoolean);
                        }}
                        className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md transition-transform duration-150 active:scale-95 hover:bg-blue-600"
                    >
                        Calculate and Analyze your today's energy surplus
                    </button>
                    <div className="flex-1 consumption-situation mt-6 bg-gray-100 mx-5 my-4 p-6 rounded-lg shadow-md justify-between md:flex-row">
                        {loading ? (
                            <h1 className="text-center text-gray-600 mt-4 animate-pulse">Calculating...</h1>
                        ) : (
                            energySurplusResult && (
                                <h1 className="text-center text-green-600 mt-4 font-bold">Your energy surplus consumption today is: {energySurplusResult} kcal</h1>
                            )
                        )}
                        {loading ? (
                            <h1 className="text-center text-gray-600 mt-4 animate-pulse">Calculating...</h1>
                        ) : gainLoseWeightBoolean !== null && (
                            <h1 className="text-center text-blue-600 mt-4 font-bold">
                                {gainLoseWeightBoolean ? "You should gain weight ✅" : "You should lose weight ❌"}
                            </h1>
                        )}
                        {loading ? (
                            <h1 className="text-center text-gray-600 mt-4 animate-pulse">Analyzing...</h1>
                        ) : todayMilestone !== null && (
                            <div className="flex flex-col items-center mt-4">
                                <motion.div
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.5, ease: "easeOut" }}
                                    className={`w-24 h-24 flex items-center justify-center rounded-full text-white text-4xl font-bold shadow-lg
                ${todayMilestone ? "bg-green-500" : "bg-red-500"}`}
                                >
                                    {todayMilestone ? "✅" : "❌"}
                                </motion.div>
                                <h1 className="text-center text-blue-600 mt-4 font-bold text-lg">
                                    {todayMilestone ? "You meet the standard today" : "You do not meet the standard"}
                                </h1>
                            </div>
                        )}
                    </div>
                    <button onClick={saveRecord} className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md transition-transform duration-150 active:scale-95 hover:bg-blue-600">
                        Keep track of your milestone.
                    </button>
                </div>
            </main >
        </div >
    )
};

export default Diets; 