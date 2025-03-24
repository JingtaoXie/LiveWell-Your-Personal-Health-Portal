import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import { db } from "../firebase";
// import { ref, update, get } from "firebase/database";
import "../basicInfoCollection.css";
import logo from "../asset/logo/Logo.png";
import barcode from "../asset/logo/barcode.png";
import qrcode from "../asset/logo/qrcode.png";
import AV from 'leancloud-storage';

const ModifyInfo = () => {
  const navigate = useNavigate();

  // State for all fields
  const [personalData, setPersonalData] = useState({
    realName: "",
    gender: "",
    birth: "",
    height: "",
    weight: "",
    bloodSugar: "",
    sBloodPressure: "",
    dBloodPressure: "",
    bloodLipids: "",
    heartRate: "",
    hemoglobin: "",
    urineGlucose: "",
    urineAcid: "",
    urea: "",
    creatinine: "",
    alt: "",
    ast: "",
  });

  const currentUser = document.cookie;
  const currentUserName = currentUser.split("=")[1];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const query = new AV.Query("personalData");
        query.equalTo("username", currentUserName);
        const result = await query.first();
  
        if (result) {
          const data = result.get("personalData");
          if (data) {
            setPersonalData(data);
          }
        }
      } catch (error) {
        console.error("Failed in capturing data", error);
      }
    };
  
    if (currentUserName) {
      fetchData();
    }
  }, [currentUserName]);
  

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const storagePath = ref(db, `users/${currentUserName}/personalData`);
  //     const snapshot = await get(storagePath);
  //     if (snapshot.exists()) {
  //       setPersonalData(snapshot.val());
  //     }
  //   };

  //   fetchData();
  // }, [currentUserName]);

  const handleInputChange = (field, value) => {
    setPersonalData((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  // const infoEntrying = async () => {
  //   const storagePath = ref(db, `users/${currentUserName}/personalData`);

  //   try {
  //     await update(storagePath, personalData);
  //     navigate("/dashboard");
  //   } catch {
  //     alert("Your input does not fit the format, please re-enter");
  //   }
  // };

  AV.init({
      appId: "93Qe7j4J4hd9DF6H8vG0d36a-gzGzoHsz",
      appKey: "MfKclPpBwhsva7NPLWrjUvbu",
      serverURL:"https://93qe7j4j.lc-cn-n1-shared.com"
    });
  
    // AV.init({
    //   appId: "Ptwt58ZYseekGbBCxuinUUCm-MdYXbMMI",
    //   appKey: "CLwL76b1hVyCxZOqhX7V1Wsm",
    // });

  const infoEntrying = async () => {
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
  
      const structuredData = {
        realName: personalData.realName,
        gender: personalData.gender,
        birth: personalData.birth,
        height: Number(personalData.height),
        weight: Number(personalData.weight),
        bloodSugar: Number(personalData.bloodSugar),
        sBloodPressure: Number(personalData.sBloodPressure),
        dBloodPressure: Number(personalData.dBloodPressure),
        bloodLipids: Number(personalData.bloodLipids),
        heartRate: Number(personalData.heartRate),
        hemoglobin: Number(personalData.hemoglobin),
        urineGlucose: Number(personalData.urineGlucose),
        urineAcid: Number(personalData.urineAcid),
        urea: Number(personalData.urea),
        creatinine: Number(personalData.creatinine),
        alt: Number(personalData.alt),
        ast: Number(personalData.ast),
      };
  
      userEntry.set("personalData", structuredData);
  
      await userEntry.save();
      navigate("/dashboard");
    } catch (err) {
      console.error("Failed in inputting data", err);
      alert("Your input does not fit the format, please re-enter");
    }
  };
  

  return (
    <div className="profile-page flex items-center justify-center min-h-screen bg-gray-100">
      <div className="profile-window w-full max-w-5xl bg-white rounded-lg shadow-md p-10 flex flex-col">
        <div className="flex flex-col items-center mb-6">
          <img src={logo} className="w-16 h-16 mb-4" alt="Logo" />
          <h1 className="text-2xl font-bold text-center">Your Personal Profile</h1>
        </div>
        <div className="flex flex-row justify-between mb-6">
          <div className="w-1/3 pr-4">
            <h1 className="text-xs font-bold mb-1">Your Name</h1>
            <input
              className="text-xs w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-400 font-sans mb-4"
              value={personalData.realName}
              onChange={(e) => handleInputChange("realName", e.target.value)}
            />
            <div className="flex items-center justify-center mb-4">
              <label htmlFor="gender" className="font-bold text-xs mr-2">Gender:</label>
              <select
                id="gender"
                className="border border-gray-300 rounded p-2 text-xs"
                value={personalData.gender}
                onChange={(e) => handleInputChange("gender", e.target.value)}
              >
                <option value="">Select an option</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <h1 className="text-xs font-bold mb-1">Date of Birth</h1>
            <input
              placeholder="e.g.2000-01-01"
              className="text-xs w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-400 font-sans mb-4"
              value={personalData.birth}
              onChange={(e) => handleInputChange("birth", e.target.value)}
            />
            <h1 className="text-xs font-bold mb-1">Height</h1>
            <input
              type="number"
              placeholder="Enter your height (cm)"
              className="text-xs w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-400 font-sans mb-4"
              value={personalData.height}
              onChange={(e) => handleInputChange("height", e.target.value)}
            />
            <h1 className="text-xs font-bold mb-1">Weight</h1>
            <input
              type="number"
              placeholder="Enter your weight (kg)"
              className="text-xs w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-400 font-sans mb-4"
              value={personalData.weight}
              onChange={(e) => handleInputChange("weight", e.target.value)}
            />
          </div>
          <div className="w-1/3 px-4">
            <h1 className="text-xs font-bold mb-1">Blood Sugar Level</h1>
            <input
              type="number"
              placeholder="Enter your blood sugar level (mmol/L)"
              className="text-xs w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-400 font-sans mb-4"
              value={personalData.bloodSugar}
              onChange={(e) => handleInputChange("bloodSugar", e.target.value)}
            />
            <h1 className="text-xs font-bold mb-1">Blood Pressure (Systolic)</h1>
            <input
              type="number"
              placeholder="Enter your blood pressure (mmHg)"
              className="text-xs w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-400 font-sans mb-4"
              value={personalData.sBloodPressure}
              onChange={(e) => handleInputChange("sBloodPressure", e.target.value)}
            />
            <h1 className="text-xs font-bold mb-1">Blood Pressure (Diastolic)</h1>
            <input
              type="number"
              placeholder="Enter your blood pressure (mmHg)"
              className="text-xs w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-400 font-sans mb-4"
              value={personalData.dBloodPressure}
              onChange={(e) => handleInputChange("dBloodPressure", e.target.value)}
            />
            <h1 className="text-xs font-bold mb-1">Blood Lipid</h1>
            <input
              type="number"
              placeholder="Enter your blood lipids level (mmol/L)"
              className="text-xs w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-400 font-sans mb-4"
              value={personalData.bloodLipids}
              onChange={(e) => handleInputChange("bloodLipids", e.target.value)}
            />
            <h1 className="text-xs">Heart Rate</h1>
            <input
              type="number"
              placeholder="Enter your heart rate (bpm)"
              className="text-xs w-full max-w-md border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-400 font-sans"
              value={personalData.heartRate}
              onChange={(e) => handleInputChange("heartRate", e.target.value)}
            />
            <h1 className="text-xs mt-3">Hemoglobin</h1>
            <input
              type="number"
              placeholder="Enter your hemoglobin level (g/dL)"
              className="text-xs w-full max-w-md border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-400 font-sans"
              value={personalData.hemoglobin}
              onChange={(e) => handleInputChange("hemoglobin", e.target.value)}
            />
          </div>
          <div className="w-1/3 pl-4 px-4">
            <h1 className="text-xs">Urine Glucose</h1>
            <input
              type="number"
              placeholder="Enter your urine glucose level (mg/dL)"
              className="text-xs w-full max-w-md border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-400 font-sans"
              value={personalData.urineGlucose}
              onChange={(e) => handleInputChange("urineGlucose", e.target.value)}
            />
            <h1 className="text-xs mt-5">Urine Acid</h1>
            <input
              type="number"
              placeholder="Enter your urine acid level (µmol/L)"
              className="text-xs w-full max-w-md border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-400 font-sans"
              value={personalData.urineAcid}
              onChange={(e) => handleInputChange("urineAcid", e.target.value)}
            />
            <h1 className="text-xs mt-5">Urea</h1>
            <input
              type="number"
              placeholder="Enter your urea level (mmol/L)"
              className="text-xs w-full max-w-md border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-400 font-sans"
              value={personalData.urea}
              onChange={(e) => handleInputChange("urea", e.target.value)}
            />
            <h1 className="text-xs mt-5">Creatinine</h1>
            <input
              type="number"
              placeholder="Enter your creatinine level (µmol/L)"
              className="text-xs w-full max-w-md border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-400 font-sans"
              value={personalData.creatinine}
              onChange={(e) => handleInputChange("creatinine", e.target.value)}
            />
            <h1 className="text-xs mt-5">ALT</h1>
            <input
              type="number"
              placeholder="Enter your ALT level (U/L)"
              className="text-xs w-full max-w-md border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-400 font-sans"
              value={personalData.alt}
              onChange={(e) => handleInputChange("alt", e.target.value)}
            />
            <h1 className="text-xs mt-5">AST</h1>
            <input
              type="number"
              placeholder="Enter your AST level (U/L)"
              className="text-xs w-full max-w-md border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-400 font-sans"
              value={personalData.ast}
              onChange={(e) => handleInputChange("ast", e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-center space-x-4">
          <button
            id="button"
            className="text-lg bg-lime-300 shadow-md p-2 rounded-lg w-32 transition-transform transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-lime-200"
            onClick={infoEntrying}
          >
            Submit
          </button>
          <button
            id="button"
            className="text-lg bg-lime-300 shadow-md p-2 rounded-lg w-32 transition-transform transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-lime-200"
            onClick={() => navigate("/dashboard")}
          >
            Back
          </button>
          <button
            id="button"
            className="text-lg bg-lime-300 shadow-md p-2 rounded-lg w-32 transition-transform transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-lime-200"
            onClick={() => navigate("/scanning")}
          >
            <div className="flex flex-row justify-between items-center">
              <img src={barcode} className="w-5 h-5" alt="barcode" />
              <img src={qrcode} className="w-5 h-5" alt="qrcode" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModifyInfo;