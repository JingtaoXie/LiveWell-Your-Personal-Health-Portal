import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../analysis.css"
import logo from "../asset/logo/Logo.png"
import diabeteslogo from "../asset/logo/diabetes-test.png"
import heartDisease from "../asset/logo/heart-disease.png"
import liverDisease from "../asset/logo/liver-disease.png"



const Analysis = () => {

    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);


    const currentUser = document.cookie
    const currentUserName = currentUser.split("=")[1]

    const quitAndCleanCookies = async () => {
        navigate("/")
        document.cookie = `${currentUser}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`
    }


    return (<div className="analysis-page flex flex-col min-h-screen">
        <header className="w-full max-w-screen mx-auto p-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 cursor-pointer" onClick={() => navigate("/dashboard")}>
                    <img src={logo} className="w-12 h-12" alt="Logo" />
                    <h1 className="text-base font-bold">LiveWell Analysis</h1>
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
        <main className="flex-1 flex flex-row justify-center">
            <div className="flex-1"></div>
            <div className="w-full max-w-6xl bg-gray-100 mx-5 my-4 p-2 rounded-lg shadow-md flex flex-col md:flex-row">
                <div className="first-model flex flex-col border-r w-full h-full p-4">
                    {/* <div className="flex-1"></div> */}
                    <div className="flex flex-col items-center justify-center flex-1">
                        <img src={diabeteslogo} className="w-20 h-20 mb-2 hover:animate-scaleIn" alt="Diabetes Logo" onClick={() => navigate("/diabetesPrediction")} />
                        <h1 className="text-center cursor-pointer" onClick={() => navigate("/diabetesPrediction")}>
                            Diabetes Prediction
                        </h1>
                    </div>
                    <div className="flex-2">
                        <h1 className="text-xs text-gray font-sans">This is a deep-learning-based algorithm designed to estimate the risk of diabetes using a neural network trained on comprehensive patient health data. Key features include age, body mass index (BMI), blood glucose levels, physical activity, genetic predisposition, and prior medical history. The model is implemented using TensorFlow/Keras and employs a feedforward neural network architecture for accurate binary classification.</h1>
                    </div>
                    <div className="flex-1 flex items-center justify-center flex-col space-y-2 mt-4">
                        <div className="flex-1 flex items-center justify-center flex-col space-y-2">
                            <h1 className="text-center text-sm font-semibold mb-2">Reference</h1>
                            <a
                                href="https://www.kaggle.com/datasets/iammustafatz/diabetes-prediction-dataset?resource=download"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-sans text-[10px] text-blue-600 hover:underline text-center"
                            >
                                Database reference: Kaggle Diabetes Prediction Dataset
                            </a>
                            <a
                                href="https://github.com/JingtaoXie/DiabetesPredictionAPI"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-sans text-[10px] text-blue-600 hover:underline text-center mt-1"
                            >
                                Model reference: GitHub - Diabetes Disease Prediction API
                            </a>
                        </div>
                        <h1 className="text-center text-xs font-semibold mb-2">Click above icon to try our model !!!</h1>
                    </div>
                </div>
                <div className="second-model flex flex-col border-r w-full h-full p-4">
                    {/* <div className="flex-1"></div> */}
                    <div className="flex flex-col items-center justify-center flex-1">
                        <img src={liverDisease} className="w-20 h-20 mb-2 hover:animate-scaleIn" alt="Diabetes Logo" onClick={() => navigate("/liverDiseasePrediction")} />
                        <h1 className="text-center cursor-pointer" onClick={() => navigate("/liverDiseasePrediction")}>
                            Liver Disease Prediction
                        </h1>
                    </div>
                    <div className="flex-2">
                        <h1 className="text-xs text-gray font-sans">This is a deep-learning-based algorithm designed to estimate the risk of liver disease using a neural network trained on comprehensive patient health data. Key features include age, body mass index (BMI), liver function indicators, alcohol consumption patterns, genetic predisposition, and prior medical history. The model is implemented using TensorFlow/Keras and employs a feedforward neural network architecture for accurate binary classification.</h1>
                    </div>
                    <div className="flex-1 flex items-center justify-center flex-col space-y-2 mt-4">
                        <div className="flex-1 flex items-center justify-center flex-col space-y-2">
                            <h1 className="text-center text-sm font-semibold mb-2">Reference</h1>
                            <a
                                href="https://www.kaggle.com/datasets/rabieelkharoua/predict-liver-disease-1700-records-dataset"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-sans text-[10px] text-blue-600 hover:underline text-center"
                            >
                                Database reference: Kaggle Liver Disease Dataset
                            </a>
                            <a
                                href="https://github.com/JingtaoXie/LiverDiseasePredictionAPI"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-sans text-[10px] text-blue-600 hover:underline text-center mt-1"
                            >
                                Model reference: GitHub - Liver Disease Prediction API
                            </a>
                        </div>
                        <h1 className="text-center text-xs font-semibold mb-2">Click above icon to try our model !!!</h1>
                    </div>
                </div>
                <div className="third-model flex flex-col border-r w-full h-full p-4">
                    {/* <div className="flex-1"></div> */}
                    <div className="flex flex-col items-center justify-center flex-1">
                        <img src={heartDisease} className="w-20 h-20 mb-2 hover:animate-scaleIn" alt="Diabetes Logo" onClick={() => navigate("/heartDiseasePrediction")} />
                        <h1 className="text-center cursor-pointer" onClick={() => navigate("/heartDiseasePrediction")}>
                            Heart Disease Prediction
                        </h1>
                    </div>
                    <div className="flex-2">
                        <h1 className="text-xs text-gray font-sans">This is a deep-learning-based algorithm that predicts the risk of heart disease using a neural network trained on patient health indicators such as age, cholesterol level, resting blood pressure, blood glucose, chest pain type, and other relevant medical attributes. Built with TensorFlow/Keras, it employs a feedforward neural network for binary classification to assess the presence or absence of heart disease. </h1>
                    </div>
                    <div className="flex-1 flex items-center justify-center flex-col space-y-2 mt-4">
                        <div className="flex-1 flex items-center justify-center flex-col space-y-2">
                            <h1 className="text-center text-sm font-semibold mb-2">Reference</h1>
                            <a
                                href="https://www.kaggle.com/code/desalegngeb/heart-disease-predictions"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-sans text-[10px] text-blue-600 hover:underline text-center"
                            >
                                Database reference: Kaggle Heart Disease Prediction Dataset
                            </a>
                            <a
                                href="https://github.com/JingtaoXie/HeartDiseasePredictionAPI"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-sans text-[10px] text-blue-600 hover:underline text-center mt-1"
                            >
                                Model reference: GitHub - Heart Disease Prediction API
                            </a>
                        </div>
                        <h1 className="text-center text-xs font-semibold mb-2">Click above icon to try our model !!!</h1>
                    </div>
                </div>
            </div>
            <div className="flex-1"></div>
        </main>
    </div>
    )
        ;
};

export default Analysis; 