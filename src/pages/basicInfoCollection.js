import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import { db } from "../firebase";
// import { ref, get, set, update } from "firebase/database";
import "../basicInfoCollection.css"
import logo from "../asset/logo/Logo.png"
import barcode from "../asset/logo/barcode.png"
import qrcode from "../asset/logo/qrcode.png"
import AV from 'leancloud-storage';

const BasicInfo = () => {

  const navigate = useNavigate();

  const [realName, setRealName] = useState('');
  const [gender, setGender] = useState('');
  const [birth, setBirth] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bloodSugar, setBloodSugar] = useState('');
  const [sBloodPressure, setSBloodPressure] = useState('');
  const [dBloodPressure, setDBloodPressure] = useState('')
  const [bloodLipids, setBloodLipids] = useState('');
  const [heartRate, setHeartRate] = useState('');
  const [hemoglobin, setHemoglobin] = useState('');
  const [urineGlucose, setUrineGlucose] = useState('');
  const [urineAcid, setUrineAcid] = useState('');
  const [urea, setUrea] = useState('');
  const [creatinine, setCreatinine] = useState('');
  const [alt, setAlt] = useState('');
  const [ast, setAst] = useState('');

  const currentUser = document.cookie
  const currentUserName = currentUser.split("=")[1]
  console.log(currentUserName)
  

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
  
      let record;
      if (existing) {
        record = existing;
      } else {
        const PersonalData = AV.Object.extend("personalData");
        record = new PersonalData();
        record.set("username", currentUserName);
      }
  
      const healthData = {
        realName:realName,
        gender:gender,
        birth:birth,
        height: Number(height),
        weight: Number(weight),
        bloodSugar: Number(bloodSugar),
        sBloodPressure: Number(sBloodPressure),
        dBloodPressure: Number(dBloodPressure),
        bloodLipids: Number(bloodLipids),
        heartRate: Number(heartRate),
        hemoglobin: Number(hemoglobin),
        urineGlucose: Number(urineGlucose),
        urineAcid: Number(urineAcid),
        urea: Number(urea),
        creatinine: Number(creatinine),
        alt: Number(alt),
        ast: Number(ast),
      };

      record.set("personalData", healthData);
  
      await record.save();
      navigate("/dashboard");
    } catch (err) {
      console.error("Loading Failed", err);
      alert("Your input does not fit the format, please re-enter");
    }
  };
  



  // const infoEntrying = async () => {
  //   const storagePath = ref(db, `users/${currentUserName}/personalData`);
  //   try {
  //     await update(storagePath, { realName, gender, birth, height, weight, bloodSugar, sBloodPressure, dBloodPressure, bloodLipids, heartRate, hemoglobin, urineGlucose, urineAcid, urea, creatinine, alt, ast })
  //     navigate("/dashboard")
  //   } catch {
  //     alert("Your input does not fit the format, please re-enter")
  //   }
  // }

  const quitAndCleanCookies = async () => {
    navigate("/")
    document.cookie = `${currentUser}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`
  }


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
              onChange={(e) => setRealName(e.target.value)}
            />
            <div className="flex items-center justify-center mb-4">
              <label htmlFor="gender" className="font-bold text-xs mr-2">Gender:</label>
              <select
                id="gender"
                className="border border-gray-300 rounded p-2 text-xs"
                onChange={(e) => setGender(e.target.value)}
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
              onChange={(e) => setBirth(e.target.value)}
            />
            <h1 className="text-xs font-bold mb-1">Height</h1>
            <input
              type="number"
              placeholder="Enter your height (cm)"
              className="text-xs w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-400 font-sans mb-4"
              onChange={(e) => setHeight(e.target.value)}
            />
            <h1 className="text-xs font-bold mb-1">Weight</h1>
            <input
              type="number"
              placeholder="Enter your weight (kg)"
              className="text-xs w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-400 font-sans mb-4"
              onChange={(e) => setWeight(e.target.value)}
            />
          </div>
          <div className="w-1/3 px-4">
            <h1 className="text-xs font-bold mb-1">Blood Sugar Level</h1>
            <input
              type="number"
              placeholder="Enter your blood sugar level (mmol/L)"
              className="text-xs w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-400 font-sans mb-4"
              onChange={(e) => setBloodSugar(e.target.value)}
            />
            <h1 className="text-xs font-bold mb-1">Blood Pressure (Systolic)</h1>
            <input
              type="number"
              placeholder="Enter your blood pressure (mmHg)"
              className="text-xs w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-400 font-sans mb-4"
              onChange={(e) => setSBloodPressure(e.target.value)}
            />
            <h1 className="text-xs font-bold mb-1">Blood Pressure (Diastolic)</h1>
            <input
              type="number"
              placeholder="Enter your blood pressure (mmHg)"
              className="text-xs w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-400 font-sans mb-4"
              onChange={(e) => setDBloodPressure(e.target.value)}
            />
            <h1 className="text-xs font-bold mb-1">Blood Lipid</h1>
            <input
              type="number"
              placeholder="Enter your blood lipids level (mmol/L)"
              className="text-xs w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-400 font-sans mb-4"
              onChange={(e) => setBloodLipids(e.target.value)}
            />
            <h1 className="text-xs">Heart Rate</h1>
            <input type="number" placeholder="Enter your heart rate (bpm)"
              className="text-xs w-full max-w-md border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-400 font-sans"
              onChange={(e) => setHeartRate(e.target.value)} />
            <h1 className="text-xs mt-3">Hemoglobin</h1>
            <input type="number" placeholder="Enter your hemoglobin level (g/dL)"
              className="text-xs w-full max-w-md border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-400 font-sans"
              onChange={(e) => setHemoglobin(e.target.value)} />
          </div>
          <div className="w-1/3 pl-4 px-4">
            <h1 className="text-xs">Urine Glucose</h1>
            <input type="number" placeholder="Enter your urine glucose level (mg/dL)"
              className="text-xs w-full max-w-md border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-400 font-sans"
              onChange={(e) => setUrineGlucose(e.target.value)} />
            <h1 className="text-xs mt-5">Urine Acid</h1>
            <input type="number" placeholder="Enter your urine acid level (µmol/L)"
              className="text-xs w-full max-w-md border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-400 font-sans"
              onChange={(e) => setUrineAcid(e.target.value)} />
            <h1 className="text-xs mt-5">Urea</h1>
            <input type="number" placeholder="Enter your urea level (mmol/L)"
              className="text-xs w-full max-w-md border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-400 font-sans"
              onChange={(e) => setUrea(e.target.value)} />
            <h1 className="text-xs mt-5">Creatinine</h1>
            <input type="number" placeholder="Enter your creatinine level (µmol/L)"
              className="text-xs w-full max-w-md border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-400 font-sans"
              onChange={(e) => setCreatinine(e.target.value)} />
            <h1 className="text-xs mt-5">ALT</h1>
            <input type="number" placeholder="Enter your ALT level (U/L)"
              className="text-xs w-full max-w-md border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-400 font-sans"
              onChange={(e) => setAlt(e.target.value)} />
            <h1 className="text-xs mt-5">AST</h1>
            <input type="number" placeholder="Enter your AST level (U/L)"
              className="text-xs w-full max-w-md border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-400 font-sans"
              onChange={(e) => setAst(e.target.value)} />
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
            onClick={() => navigate("/scanning")}
          >
            <div className="flex flex-row justify-between items-center">
              <img src={barcode} className="w-5 h-5"></img>
              <img src={qrcode} className="w-5 h-5"></img>
            </div>
          </button>
          <button
            id="button"
            className="text-lg bg-lime-300 shadow-md p-2 rounded-lg w-32 transition-transform transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-lime-200"
            onClick={quitAndCleanCookies}
          >
            Quit
          </button>
        </div>
      </div>
    </div>
  );
}

export default BasicInfo; 