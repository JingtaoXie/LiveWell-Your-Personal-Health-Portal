import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../analysis.css"
import logo from "../asset/logo/Logo.png"
import myicon from "../asset/logo/myicon.jpg"
import universityicon from "../asset/logo/UniversityICON.png"
import buniversityicon from "../asset/logo/buniversityICON.jpeg"
import mclarenslogo from "../asset/logo/mclarenslogo.jpeg"
import osramlogo from "../asset/logo/osramlogo.png"
import coscologo from "../asset/logo/coscoicon.png"
import AV from 'leancloud-storage';



const ContactUs = () => {

    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);
    const [suggestionText, setSuggestionText] = useState("");


    const currentUser = document.cookie
    const currentUserName = currentUser.split("=")[1]

    const quitAndCleanCookies = async () => {
        navigate("/")
        document.cookie = `${currentUser}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`
    }

    AV.init({
            appId: "",
            appKey: "",
            serverURL:""
          });

    const saveSuggestion = async (userSuggestion) => {
        const timestamp = new Date().toISOString();
        const userIP = await fetch('https://api.ipify.org?format=json')
            .then(res => res.json())
            .then(data => data.ip)
            .catch(() => "Unknown");

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

            const suggestions = userEntry.get("suggestions") || {};
            suggestions[timestamp] = {
                suggestion: userSuggestion,
                timestamp,
                ip: userIP
            };

            userEntry.set("suggestions", suggestions);

            await userEntry.save();
            console.log("✅ Suggestion saved successfully.");
        } catch (err) {
            console.error("❌ Failed to save suggestion:", err);
        }
    };



    return (
        <div className="analysis-page flex flex-col min-h-screen">
            <header className="w-full max-w-screen mx-auto p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 cursor-pointer" onClick={() => navigate("/dashboard")}>
                        <img src={logo} className="w-12 h-12" alt="Logo" />
                        <h1 className="text-base font-bold">Contact Us</h1>
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
            <main className="flex flex-col md:flex-row w-full h-full">
                <div className="w-full md:w-[10%] bg-transparent" />

                <div className="w-full md:w-[80%] bg-gray-100 rounded-lg shadow-md flex flex-col md:flex-row">

                    <div className="flex-1 px-10 py-10 flex flex-col items-center justify-center">

                        <div className="flex flex-col items-center justify-center mb-6">
                            <img
                                src={myicon}
                                className="w-[200px] h-[200px] rounded-full object-cover animate-scaleIn mb-4"
                                alt="profile"
                            />
                            <h1 className="text-lg text-center">Jingtao Xie</h1>
                            <h1 className="text-base text-center font-sans">Independent Developer, Data Analyst</h1>
                        </div>

                        <div className="flex items-center justify-center mb-4 flex-col space-y-1">
                            <h1 className="text-sm">Education Experience</h1>
                            <div className="flex flex-row space-x-4 items-center justify-center">
                                <img src={universityicon} className="w-[30px] h-[30px]"></img>
                                <h1 className="text-xs font-sans">Master of Information Technology at UOA, First Class Honours, 2023-2025</h1>
                            </div>
                            <div className="flex flex-row space-x-4 items-center justify-center">
                                <img src={buniversityicon} className="w-[30px] h-[30px]"></img>
                                <h1 className="text-xs font-sans">Bachelor of Logistics Management at BNUZ, 2018-2022</h1>
                            </div>
                            <div className="flex flex-row space-x-4 items-center justify-center">
                                <img src={buniversityicon} className="w-[30px] h-[30px]"></img>
                                <h1 className="text-xs font-sans">Second Bachelor of Finance at BNUZ, 2018-2022</h1>
                            </div>
                        </div>

                        <div className="flex items-center justify-center mb-4 flex-col space-y-2">
                            <h1 className="text-sm">Career Experience</h1>
                            <div className="flex flex-row space-x-4 items-center justify-center">
                                <img src={mclarenslogo} className="w-[30px] h-[30px]"></img>
                                <h1 className="text-xs font-sans">IT Assistant/AI training and CIS control intern at McLarens NZ, 2025</h1>
                            </div>
                            <div className="flex flex-row space-x-4 items-center justify-center">
                                <img src={osramlogo} className="w-[30px] h-[30px]"></img>
                                <h1 className="text-xs font-sans">Supply Chain Planner/Analyst Intern at OSRAM Guangzhou, 2021</h1>
                            </div>
                            <div className="flex flex-row space-x-4 items-center justify-center">
                                <img src={coscologo} className="w-[30px] h-[30px]"></img>
                                <h1 className="text-xs font-sans">Business Specialist Intern at Zhenhua Shipping CO, 2020</h1>
                            </div>
                        </div>
                        <div className="flex items-center justify-center mb-4 flex-row space-x-2">
                            <h1 className="text-sm">More Information can be found:</h1>
                            <a
                                href="https://www.linkedin.com/in/jingtao-xie-559956284/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-sans text-sm text-blue-600 hover:underline text-center"
                            >
                                Jingtao (Toby) Xie - Linkedin profile
                            </a>
                        </div>
                        <h1 className="text-sm">Or email me: toby20000428@outlook.com</h1>

                    </div>

                    <div className="flex-1 px-10 py-10 flex flex-col items-center justify-start">
                        <div className="flex flex-col items-start justify-center mb-4 space-y-1 w-full">
                            <h1 className="text-lg font-bold">Project Background</h1>
                            <h1 className="text-sm font-sans text-justify">
                                As many of you may have noticed, wearable health devices are becoming increasingly common. These devices are capable of collecting a range of health data from users and storing it on their mobile devices. Even traditional medical equipment like blood glucose monitors is evolving toward smarter, more connected versions. This got me thinking—what if there were a website or system that could connect to these smart devices, collect the users' health data, and help analyze it?
                                <br /><br />
                                That idea inspired me to create <strong>LiveWell</strong>, a health portal that serves as an early attempt to address this real-world need.
                                <br /><br />
                                I'm not a medical professional, so there may be some medical inaccuracies in the current version of the site. However, if in the future LiveWell could collaborate with professional healthcare institutions to provide accurate medical advice, I believe this platform could reach its full potential. It could even help ease the pressure on healthcare systems (especially in countries with family doctor occupation) by offering users more accessible and proactive health support. Besides, if <strong>LiveWell</strong> can become a trusted partner of hospitals and healthcare institutions, the platform could even assist in identifying patients with urgent needs, enabling better resource allocation and helping more people receive timely care.
                            </h1>
                        </div>
                        <div className="flex flex-col items-start justify-start w-full mt-8">
                            <label htmlFor="userSuggestion" className="text-sm font-semibold mb-2">
                                Your Suggestion:
                            </label>
                            <textarea
                                id="userSuggestion"
                                placeholder="We'd love to hear your thoughts or suggestions about LiveWell..."
                                className="w-full h-32 p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                                onChange={(e) => setSuggestionText(e.target.value)}
                            />
                            <div className="w-full flex justify-center">
                                <button
                                    className="mt-4 px-6 py-2 bg-blue-500 text-white text-sm rounded-md shadow hover:bg-blue-600 transition duration-150"
                                    onClick={async () => {
                                        if (suggestionText.trim() === "") {
                                            alert("Please enter your suggestion before submitting.");
                                            return;
                                        }

                                        await saveSuggestion(suggestionText);
                                        alert("Thank you for your suggestion!");
                                        setSuggestionText("");
                                    }}
                                >
                                    Submit Suggestion
                                </button>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="w-full md:w-[10%] bg-transparent" />
            </main>



        </div>
    )
        ;
};

export default ContactUs; 