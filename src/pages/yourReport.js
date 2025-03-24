import React, { useEffect, useState } from 'react';
import {
    pdf,
    PDFDownloadLink,
} from '@react-pdf/renderer';
// import { ref, get } from "firebase/database";
// import { db } from "../firebase";
import ReportExport from './reportExport';
import { useNavigate } from "react-router-dom";
import "../analysis.css"
import logo from "../asset/logo/Logo.png"
import AV from 'leancloud-storage';



const YourReport = () => {
    const [user, setUser] = useState(null);
    const [pdfBlobUrl, setPdfBlobUrl] = useState(null);


    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);

    const currentUser = document.cookie;
    const currentUserName = currentUser.split("=")[1];

    const quitAndCleanCookies = async () => {
        navigate("/")
        document.cookie = `${currentUser}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`
    }


    const [fileName, setFileName] = useState();

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

            const result = await query.first();
            if (result) {
                return {
                    username: result.get("username"),
                    personalData: result.get("personalData") || {},
                    dietAndExercise: result.get("dietAndExercise") || {},
                    predictionResult: result.get("predictionResult") || {}
                };
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error getting user info:", error);
            return null;
        }
    };


    //   const getInfo = async () => {
    //     const storagePath = ref(db, `users/${currentUserName}`);
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
        const fetchUserData = async () => {
            const fetchedUser = await getInfo();
            setUser(fetchedUser);
            setFileName(fetchedUser.personalData.realName + "_health_report")
        };
        fetchUserData();
    }, []);


    useEffect(() => {

        const generatePdfPreview = async () => {
            if (user) {
                const blob = await pdf(<ReportExport user={user} />).toBlob();
                const url = URL.createObjectURL(blob);
                setPdfBlobUrl(url);
            }
        };

        generatePdfPreview();

        return () => {
            if (pdfBlobUrl) {
                URL.revokeObjectURL(pdfBlobUrl);
            }
        };
    }, [user]);

    return (
        <div className="analysis-page">
            <header className="w-full max-w-screen mx-auto p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 cursor-pointer" onClick={() => navigate("/dashboard")}>
                        <img src={logo} className="w-12 h-12" alt="Logo" />
                        <h1 className="text-base font-bold">LiveWell Health Report</h1>
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
                <div className="basis-full sm:basis-2/3 p-5 flex flex-col items-center">
                    <h2 className='text-center text-lg mb-4'>Preview your report here</h2>
                    {user && pdfBlobUrl ? (
                        <embed
                            src={pdfBlobUrl}
                            type="application/pdf"
                            width="100%"
                            height="500px"
                            className="border"
                        />
                    ) : (
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                            <h1 className="text-gray-700 text-sm font-semibold mt-4">Loading...</h1>
                        </div>
                    )}
                </div>

                <div className="basis-full sm:basis-1/3 flex items-center justify-center">
                    <div className="flex flex-col items-center">
                        <PDFDownloadLink document={<ReportExport user={user} />} fileName={fileName}>
                            {({ loading }) => (
                                <button className="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg shadow-md hover:bg-blue-600 transition" disabled={loading}>
                                    {loading ? "Report is generating..." : "Download your report"}
                                </button>
                            )}
                        </PDFDownloadLink>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default YourReport;
