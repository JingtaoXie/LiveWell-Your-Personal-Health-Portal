import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import { db } from "../firebase";
// import { ref, update } from "firebase/database";
import "../scanning.css";
import logo from "../asset/logo/Logo.png";
import QrScanner from 'react-qr-scanner';
import AV from 'leancloud-storage';

const Scanning = () => {
  const [scanResult, setScanResult] = useState(null);
  const [tempScanResult, setTempScanResult] = useState({});
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();


  const currentUser = document.cookie;
  const currentUserName = currentUser.split("=")[1];


  const quitAndCleanCookies = async () => {
    navigate("/")
    document.cookie = `${currentUser}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`
  }

  const handleScan = (data) => {
    if (data) {
      try {
        const parsedData = JSON.parse(data.text);
        setScanResult(parsedData);
        setTempScanResult(parsedData);
      } catch (error) {
        console.error("Invalid JSON format:", error);
      }
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  useEffect(() => {
    if (scanResult) {
      setTempScanResult(scanResult);
    }
  }, [scanResult]);

  AV.init({
      appId: "93Qe7j4J4hd9DF6H8vG0d36a-gzGzoHsz",
      appKey: "MfKclPpBwhsva7NPLWrjUvbu",
      serverURL:"https://93qe7j4j.lc-cn-n1-shared.com"
    });
  
    // AV.init({
    //   appId: "Ptwt58ZYseekGbBCxuinUUCm-MdYXbMMI",
    //   appKey: "CLwL76b1hVyCxZOqhX7V1Wsm",
    // });


  const handleUpdate = async () => {
    const currentUser = document.cookie.split("=")[1];

    try {
      const query = new AV.Query("personalData");
      query.equalTo("username", currentUser);
      const existing = await query.first();

      if (!existing) {
        alert("User not found!");
        return;
      }

      const updatedData = existing.get("personalData") || {};
      const mergedData = {
        ...updatedData,
        ...tempScanResult
      };

      existing.set("personalData", mergedData);
      await existing.save();

      alert("Data updated successfully!");
      navigate("/dashboard");
    } catch (error) {
      alert("Error updating data: " + error.message);
      console.error("Update failed:", error);
    }
  };


  return (
    <div className="scanning-page flex flex-col items-center bg-gray-100 min-h-screen">
      <header className="w-full max-w-screen mx-auto p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 cursor-pointer" onClick={() => navigate("/dashboard")}>
            <img src={logo} className="w-12 h-12" alt="Logo" />
            <h1 className="text-base font-bold">LiveWell Scanning</h1>
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
      <main className="main-window flex-1 flex flex-row w-full">
        <div className="scanning-window bg-gray-100 mx-5 my-4 p-4 rounded-lg shadow-md flex-1 flex flex-col h-fit">
          <h2 className="text-lg mb-2">Scanning Window</h2>
          <div className="scanner">
            <QrScanner delay={300} onScan={handleScan} onError={handleError} />
          </div>
        </div>
        <div className="result-window flex-1 bg-gray-100 mx-5 my-4 p-4 rounded-lg shadow-md flex flex-col h-fit">
          <h2 className="text-lg font-semibold mb-2">Scanning Result</h2>
          {tempScanResult ? (
            <>
              <div className="big-window flex flex-row space-x-4">
                <div className="left-side">
                  <div className="flex flex-row items-center justify-start space-x-4 space-y-2">
                    <h1 className="text-xs font-bold">Your Name</h1>
                    <input
                      value={tempScanResult.realName || ''}
                      className="text-xs w-fit border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-400 font-sans"
                      onChange={(e) => setTempScanResult({ ...tempScanResult, realName: e.target.value })}
                    />
                  </div>
                  <div className="flex flex-row items-center justify-start space-x-4 space-y-2">
                    <label htmlFor="gender" className="font-bold text-xs mr-2">Gender:</label>
                    <select
                      id="gender"
                      value={tempScanResult.gender || ''}
                      className="border border-gray-300 rounded p-2 text-xs"
                      onChange={(e) => setTempScanResult({ ...tempScanResult, gender: e.target.value })}
                    >
                      <option value="">Select an option</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                  <div className="flex flex-row items-center justify-start space-x-4 space-y-2">
                    <h1 className="text-xs font-bold mb-1">Date of Birth</h1>
                    <input
                      value={tempScanResult.birth || ''}
                      placeholder="e.g.2000-01-01"
                      className="text-xs w-fit border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-400 font-sans mb-4"
                      onChange={(e) => setTempScanResult({ ...tempScanResult, birth: e.target.value })}
                    />
                  </div>
                  <div className="flex flex-row items-center justify-start space-x-4 space-y-2">
                    <h1 className="text-xs font-bold mb-1">Height</h1>
                    <input
                      value={tempScanResult.height || ''}
                      type="number"
                      placeholder="Enter your height (cm)"
                      className="text-xs w-fit border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-400 font-sans mb-4"
                      onChange={(e) => setTempScanResult({ ...tempScanResult, height: e.target.value })}
                    />
                  </div>
                  <div className="flex flex-row items-center justify-start space-x-4 space-y-2">
                    <h1 className="text-xs font-bold mb-1">Weight</h1>
                    <input
                      type="number"
                      value={tempScanResult.weight || ''}
                      placeholder="Enter your weight (kg)"
                      className="text-xs w-fit border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-400 font-sans mb-4"
                      onChange={(e) => setTempScanResult({ ...tempScanResult, weight: e.target.value })}
                    />
                  </div>
                  <div className="flex flex-row items-center justify-start space-x-4 space-y-2">
                    <h1 className="text-xs font-bold mb-1">Blood Sugar Level</h1>
                    <input
                      value={tempScanResult.bloodSugar || ''}
                      type="number"
                      placeholder="Enter your blood sugar level (mmol/L)"
                      className="text-xs w-fit border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-400 font-sans mb-4"
                      onChange={(e) => setTempScanResult({ ...tempScanResult, bloodSugar: e.target.value })}
                    />
                  </div>
                  <div className="flex flex-row items-center justify-start space-x-4 space-y-2">
                    <h1 className="text-xs font-bold mb-1">Blood Pressure (Systolic)</h1>
                    <input
                      type="number"
                      value={tempScanResult.sBloodPressure || ''}
                      placeholder="Enter your blood pressure (mmHg)"
                      className="text-xs w-fit border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-400 font-sans mb-4"
                      onChange={(e) => setTempScanResult({ ...tempScanResult, sBloodPressure: e.target.value })}
                    />
                  </div>
                  <div className="flex flex-row items-center justify-start space-x-4 space-y-2">
                    <h1 className="text-xs font-bold mb-1">Blood Pressure (Diastolic)</h1>
                    <input
                      value={tempScanResult.dBloodPressure || ''}
                      type="number"
                      placeholder="Enter your blood pressure (mmHg)"
                      className="text-xs w-fit border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-400 font-sans mb-4"
                      onChange={(e) => setTempScanResult({ ...tempScanResult, dBloodPressure: e.target.value })}
                    />
                  </div>
                  <div className="flex flex-row items-center justify-start space-x-4 space-y-2">
                    <h1 className="text-xs font-bold mb-1">Blood Lipid</h1>
                    <input
                      type="number"
                      value={tempScanResult.bloodLipids || ''}
                      placeholder="Enter your blood lipids level (mmol/L)"
                      className="text-xs w-fit border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-400 font-sans mb-4"
                      onChange={(e) => setTempScanResult({ ...tempScanResult, bloodLipids: e.target.value })}
                    />
                  </div>
                </div>
                <div className="border border-gray-300 rounded-lg"></div>
                <div className="right-side">
                  <div className="flex flex-row items-center justify-start space-x-4 space-y-2">
                    <h1 className="text-xs">Heart Rate</h1>
                    <input type="number" placeholder="Enter your heart rate (bpm)"
                      value={tempScanResult.heartRate || ''}
                      className="text-xs w-fit max-w-md border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-400 font-sans"
                      onChange={(e) => setTempScanResult({ ...tempScanResult, heartRate: e.target.value })} />
                  </div>
                  <div className="flex flex-row items-center justify-start space-x-4 space-y-2">
                    <h1 className="text-xs mt-3">Hemoglobin</h1>
                    <input type="number" placeholder="Enter your hemoglobin level (g/dL)"
                      value={tempScanResult.hemoglobin || ''}
                      className="text-xs w-fit max-w-md border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-400 font-sans"
                      onChange={(e) => setTempScanResult({ ...tempScanResult, hemoglobin: e.target.value })} />
                  </div>
                  <div className="flex flex-row items-center justify-start space-x-4 space-y-2">
                    <h1 className="text-xs">Urine Glucose</h1>
                    <input type="number" placeholder="Enter your urine glucose level (mg/dL)"
                      value={tempScanResult.urineGlucose || ''}
                      className="text-xs w-fit max-w-md border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-400 font-sans"
                      onChange={(e) => setTempScanResult({ ...tempScanResult, urineGlucose: e.target.value })} />
                  </div>
                  <div className="flex flex-row items-center justify-start space-x-4 space-y-2">
                    <h1 className="text-xs mt-5">Urine Acid</h1>
                    <input type="number" placeholder="Enter your urine acid level (µmol/L)"
                      value={tempScanResult.urineAcid || ''}
                      className="text-xs w-fit max-w-md border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-400 font-sans"
                      onChange={(e) => setTempScanResult({ ...tempScanResult, urineAcid: e.target.value })} />
                  </div>
                  <div className="flex flex-row items-center justify-start space-x-4 space-y-2">
                    <h1 className="text-xs mt-5">Urea</h1>
                    <input type="number" placeholder="Enter your urea level (mmol/L)"
                      value={tempScanResult.urea || ''}
                      className="text-xs w-fit max-w-md border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-400 font-sans"
                      onChange={(e) => setTempScanResult({ ...tempScanResult, urea: e.target.value })} />
                  </div>
                  <div className="flex flex-row items-center justify-start space-x-4 space-y-2">
                    <h1 className="text-xs mt-5">Creatinine</h1>
                    <input type="number" placeholder="Enter your creatinine level (µmol/L) w-fit"
                      value={tempScanResult.creatinine || ''}
                      className="text-xs w-fit max-w-md border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-400 font-sans"
                      onChange={(e) => setTempScanResult({ ...tempScanResult, creatinine: e.target.value })} />
                  </div>
                  <div className="flex flex-row items-center justify-start space-x-4 space-y-2">
                    <h1 className="text-xs mt-5">ALT</h1>
                    <input type="number" placeholder="Enter your ALT level (U/L)"
                      value={tempScanResult.alt || ''}
                      className="text-xs w-fit max-w-md border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-400 font-sans"
                      onChange={(e) => setTempScanResult({ ...tempScanResult, alt: e.target.value })} />
                  </div>
                  <div className="flex flex-row items-center justify-start space-x-4 space-y-2">
                    <h1 className="text-xs mt-5">AST</h1>
                    <input type="number" placeholder="Enter your AST level (U/L)"
                      value={tempScanResult.ast || ''}
                      className="text-xs w-fit max-w-md border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-400 font-sans"
                      onChange={(e) => setTempScanResult({ ...tempScanResult, ast: e.target.value })} />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <p className="text-gray-500">Loading Result</p>
          )}
          <button
            id="button"
            className="text-lg items-center bg-lime-300 shadow-md p-2 rounded-lg w-32 transition-transform transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-lime-200 mt-5"
            onClick={handleUpdate}
          >
            Update
          </button>
        </div>
      </main>
    </div>
  );
};

export default Scanning;

