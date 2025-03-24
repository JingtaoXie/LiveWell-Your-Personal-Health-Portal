import React, { useEffect, useState } from "react";
import { data, useNavigate } from "react-router-dom";
// import { db } from "../firebase";
// import { ref, get } from "firebase/database";
import "../dashboard.css";
// import { generateContent } from '../firebase';
import AV from 'leancloud-storage';

import heart from "../asset/logo/heart.png"
import renal from "../asset/logo/renal.png"
import liver from "../asset/logo/liver.png"

import logo from "../asset/logo/Logo.png";
import weight from "../asset/logo/weight.png"
import height from "../asset/logo/height.png"
import bloodpressure from "../asset/logo/bloodpressure.png"
import reminder from "../asset/logo/reminder.png"
import warning from "../asset/logo/warning.png"
import bloodSugar from "../asset/logo/sugar-blood-level.png"
import lipid from "../asset/logo/lipid.png"
import heartRate from "../asset/logo/heartrate.png"
import hemoglobin from "../asset/logo/hemoglobin.png"
import urineGlucose from "../asset/logo/urineGlucose.png"
import urineAcid from "../asset/logo/urineacid.png"
import urea from "../asset/logo/urea.png"
import creatinine from "../asset/logo/creatinine.png"
import ALT from "../asset/logo/ALT.png"
import AST from "../asset/logo/AST.png"

import upperbody from "../asset/logo/upper-body.png"
import loading from "../asset/logo/loading.png"
import healthcheckup from "../asset/logo/healthcheckup.gif"
import suggestions from "../asset/logo/suggestions.gif"

const Dashboard = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const currentUser = document.cookie;
  const currentUserName = currentUser.split("=")[1];

  const quitAndCleanCookies = async () => {
    navigate("/")
    document.cookie = `${currentUser}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`
  }

  const [personalData, setPersonalData] = useState(null);
  const [bmi, setBmi] = useState(null);
  const [bmiColor, setBmiColor] = useState(null);
  const [showNormalWeightRange, setShowNormalWeightRange] = useState(false)
  const [showNormalBmrRange, setShowNormalBmrRange] = useState(false)
  const [reasonableBmiRange, setReasonableBmiRange] = useState(null)
  const [overWeightMessage, setOverWeightMessage] = useState(null)

  const [bmr, setBmr] = useState(null)
  const [bmrColor, setBmrColor] = useState(null);
  const [reasonableBmrRange, setReasonableBmrRange] = useState(null)
  const [bmrMessage, setBmrMessage] = useState(null)


  const [reasonableBloodPressureRange, setReasonableBloodPressureRange] = useState(null)
  const [isBloodPressureNormal, setIsBloodPressureNormalBoolean] = useState(null)
  const [reasonableBloodSugarLevel, setReasonableBloodSugarLevel] = useState(null)
  const [isBloodSugarNormal, setIsBloodSugarNormalBoolean] = useState(null)
  const [reasonableBloodLipidsRange, setReasonableBloodLipidsRange] = useState(null)
  const [isBloodLipidsNormal, setIsBloodLipidsNormalBoolean] = useState(null)
  const [isHeartRateNormal, setIsHeartRateNormalBoolean] = useState(null)

  const [reasonableHb, setReasonableHb] = useState(null)
  const [isHbNormal, setIsHbNormalBoolean] = useState(null)

  const [reasonableUrineGlucoseLevel, setReasonableUrineGlucoseLevel] = useState(null)
  const [isUrineGlucoseNormal, setIsUrineGlucoseNormalBoolean] = useState(null)

  const [reasonableUrineAcidRange, setReasonableUrineAcidRange] = useState(null)
  const [isUrineAcidNormal, setIsUrineAcidNormalBoolean] = useState(null)

  const [reasonableUreaLevel, setReasonableUreaLevel] = useState(null)
  const [isUreaNormal, setIsUreaNormalBoolean] = useState(null)

  const [reasonableCreatinine, setReasonableCreatinine] = useState(null)
  const [isCreatinineNormal, setIsCreatinineNormalBoolean] = useState(null)

  const [reasonableAst, setReasonableAst] = useState(null)
  const [isAstNormal, setIsAstNormalBoolean] = useState(null)

  const [reasonableAlt, setReasonableAlt] = useState(null)
  const [isAltNormal, setIsAltNormalBoolean] = useState(null)

  const [problems, setProblems] = useState(null)

  const [aiHealthProblemsResult, setAiHealthProblemsResult] = useState(null)
  const [aiHealthSuggestion, setAiHealthSuggestion] = useState(null)
  const [isTypingProblems, setIsTypingProblems] = useState(false);
  const [isTypingSuggestions, setIsTypingSuggestions] = useState(false);




  const calculateBMI = (height, weight) => {
    const heightInMeters = height / 100;
    const bmiValue = (weight / (heightInMeters ** 2)).toFixed(2);
    return parseFloat(bmiValue);
  };

  const calculateBMIRange = (height) => {
    const heightInMeters = height / 100;
    const minWeight = 18.5 * (heightInMeters ** 2);
    const maxWeight = 24.9 * (heightInMeters ** 2);
    return {
      minBMI: 18.5,
      maxBMI: 24.9,
      minWeight: minWeight.toFixed(1),
      maxWeight: maxWeight.toFixed(1),
    };
  };

  const calculateBMR = (age, weight, height, gender) => {

    if (gender === "male") {
      return (88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age)).toFixed(0);
    } else {
      return (447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age)).toFixed(0);
    }
  };


  const getAge = (birth) => {
    const dateOfBirth = new Date(birth)
    const today = new Date()
    let age = today.getFullYear() - dateOfBirth.getFullYear();
    const isBeforeBirthday =
      today.getMonth() < dateOfBirth.getMonth() ||
      (today.getMonth() === dateOfBirth.getMonth() && today.getDate() < dateOfBirth.getDate());
    if (isBeforeBirthday) {
      age -= 1;
    }
    return age;
  }

  const getReasonableBloodPressureRange = (age, gender) => {
    if (age < 18) {
      return "60-120"
    }
    if (age >= 18 && age <= 39) {
      return "90/60-120/80";
    } else if (age >= 40 && age <= 59) {
      if (gender === "male") {
        return "110/70-130/85";
      } else if (gender === "female") {
        return "100/65-125/80";
      }
    } else if (age >= 60) {
      return "120/80-140/90";
    }
  }

  const getReasonableBloodSugarLevel = (age) => {
    if (age < 18) {
      return "3.9-5.6 mmol/L"
    } if (age >= 18 && age <= 60) {
      return "4.0-5.6 mmol/L"
    } else {
      return "4.4-6.1 mmol/L"
    }
  }


  const getReasonableBloodLipidsLevel = (age) => {
    if (age < 18) {
      return "< 4.4 mmol/L"
    } else if (age >= 18 && age < 40) {
      return "3.5-5.2 mmol/L"
    } else if (age >= 40 && age < 60) {
      return "4.0-5.8 mmol/L"
    } else {
      return "4.0-6.2 mmol/L"
    }
  }

  const getReasonableHbLevel = (age, gender) => {
    if (age < 18) {
      return "11.0 - 13.5";
    } else if (age >= 18 && age < 65) {
      if (gender === "male") {
        return "13.8 - 17.5";
      } else if (gender === "female") {
        return "12.1 - 15.1";
      }
    } else if (age >= 65) {
      if (gender === "male") {
        return "12.6 - 17.4";
      } else if (gender === "female") {
        return "11.7 - 16.1";
      }
    }
  };

  const getReasonableUrineGlucoseLevel = (age) => {
    if (age < 18) {
      return "0-10"
    } else if (age >= 18 && age < 60) {
      return "0-15"
    } else {
      return "0-25"
    }
  }

  const getReasonaUrineAcidLevel = (gender, age) => {
    if (gender == "male") {
      if (age < 10) {
        return "120-320";
      } else if (age >= 10 && age < 20) {
        return "210-400";
      } else {
        return "240-420";
      }
    } else {
      if (age < 10) {
        return "120-320";
      } else if (age >= 10 && age < 20) {
        return "140-360";
      } else if (age >= 20 && age < 55) {
        return "150-350";
      } else {
        return "200-430";
      }
    }
  };

  const getReasonableUreaLevel = (gender, age) => {
    if (gender == "male") {
      if (age < 18) {
        return "1.8-6.4";
      } else if (age >= 18 && age < 60) {
        return "3.5-7.2";
      } else {
        return "3.5-8.0";
      }
    } else {
      if (age < 18) {
        return "1.8-6.4";
      } else if (age >= 10 && age < 20) {
        return "2.6-6.7";
      } else {
        return "3.5-8.0";
      }
    }
  }

  const getReasonableCreatinineLevel = (age, gender) => {
    if (age < 18) {
      return "26-62"
    } else {
      if (gender == "male") {
        return "53-106"
      } else {
        return "44-96"
      }
    }
  }

  const getReasonableALT = (age, gender) => {
    if (age < 18) {
      return "5-40"
    } else {
      if (gender == "male") {
        return "<=40"
      } else {
        return "<=35"
      }
    }
  }

  const getReasonableAST = (age, gender) => {
    if (age < 18) {
      return "5-40"
    } else {
      if (gender == "male") {
        return "<=40"
      } else {
        return "<=35"
      }
    }
  }




  // To check if the blood pressure is in a normal range

  const evaluateIfBloodPressureNormal = (range, sBloodPressure, dBloodPressure) => {
    const [minBP, maxBP] = range.split("-");
    const [minSystolic, minDiastolic] = minBP.split("/").map(Number);
    const [maxSystolic, maxDiastolic] = maxBP.split("/").map(Number);

    if (
      sBloodPressure >= minSystolic &&
      sBloodPressure <= maxSystolic &&
      dBloodPressure >= minDiastolic &&
      dBloodPressure <= maxDiastolic
    ) {
      return true;
    }

    return false;
  };


  const evaluateIfBloodSugarNormal = (range, bloodSugar) => {
    const [minSugar, maxSugar] = range
      .replace(/[^\d\-\.]/g, "")
      .split("-")
      .map(Number);
    const numericBloodSugar = parseFloat(bloodSugar);
    if (numericBloodSugar >= minSugar && numericBloodSugar <= maxSugar) {
      return true;
    }
    return false;
  };

  const evaluateIfBloodLipidNormal = (range, bloodLipids) => {
    const [minLipid, maxLipid] = range
      .replace(/[^\d\-\.]/g, "")
      .split("-")
      .map(Number);

    const numericBloodLipids = parseFloat(bloodLipids);

    if (numericBloodLipids >= minLipid && numericBloodLipids <= maxLipid) {
      return true;
    }

    return false;
  };


  const evaluateIfHeartRateNormal = (heartRate) => {

    const numericHeartRate = parseFloat(heartRate)

    if (numericHeartRate >= 60 && numericHeartRate <= 100) {
      return true
    } else {
      return false
    }
  };

  const evaluateIfUrineGlucoseNormal = (urineGlucose, age) => {
    if (age < 18) {
      if (urineGlucose <= 10) {
        return true
      } else {
        return false
      }
    } else if (age >= 18 && age < 60) {
      if (urineGlucose <= 15) {
        return true
      } else {
        return false
      }
    } else {
      if (urineGlucose <= 25) {
        return true
      } else {
        return false
      }
    }
  }

  const evaluateIfHbNormal = (age, gender, hb) => {
    if (age < 18) {
      return hb >= 11.0 && hb <= 13.5;
    } else if (age >= 18 && age < 65) {
      if (gender === "male") {
        return hb >= 13.8 && hb <= 17.2;
      } else if (gender === "female") {
        return hb >= 12.1 && hb <= 15.1;
      }
    } else if (age >= 65) {
      if (gender === "male") {
        return hb >= 12.6 && hb <= 17.4;
      } else if (gender === "female") {
        return hb >= 11.7 && hb <= 16.1;
      }
    }
    return false;
  };

  const evaluateIfUrineAcidNormal = (gender, age, urineAcid) => {
    if (gender === "male") {
      if (age < 10) {
        return urineAcid >= 120 && urineAcid <= 320;
      } else if (age >= 10 && age < 20) {
        return urineAcid >= 210 && urineAcid <= 400;
      } else {
        return urineAcid >= 240 && urineAcid <= 420;
      }
    } else if (gender === "female") {
      if (age < 10) {
        return urineAcid >= 120 && urineAcid <= 320;
      } else if (age >= 10 && age < 20) {
        return urineAcid >= 140 && urineAcid <= 360;
      } else if (age >= 20 && age < 55) {
        return urineAcid >= 150 && urineAcid <= 350;
      } else {
        return urineAcid >= 200 && urineAcid <= 430;
      }
    }
    return false;
  };

  const evaluateIfUreaNormal = (gender, age, urea) => {
    if (gender === "male") {
      if (age < 18) {
        return urea >= 1.8 && urea < 6.4
      } else if (age >= 18 && age < 60) {
        return urea >= 3.5 && urea < 7.2;
      } else {
        return urea >= 3.5 && urea < 8.0;
      }
    } else if (gender === "female") {
      if (age < 18) {
        return urea >= 1.8 && urea < 6.4;
      } else if (age >= 18 && age < 60) {
        return urea >= 2.6 && urea < 6.7;
      } else {
        return urea >= 3.5 && urea < 8.0;
      }
    }
    return false;
  };

  const evaluateIfCreatinineNormal = (age, gender, creatinine) => {
    if (age <= 18) {
      return creatinine >= 0.3 && creatinine <= 0.7;
    } else {
      if (gender === "male") {
        return creatinine >= 0.6 && creatinine <= 1.2;
      } else if (gender === "female") {
        return creatinine >= 0.5 && creatinine <= 1.1;
      }
    }
    return false;
  };

  const evaluateIfALTNormal = (age, gender, alt) => {
    if (age <= 18) {
      return alt >= 5 && alt <= 40;
    } else {
      if (gender === "male") {
        return alt <= 40;
      } else if (gender === "female") {
        return alt <= 35;
      }
    }
    return false;
  };

  const evaluateIfASTNormal = (age, gender, ast) => {
    if (age <= 18) {
      return ast >= 5 && ast <= 40;
    } else {
      if (gender === "male") {
        return ast <= 40;
      } else if (gender === "female") {
        return ast <= 35;
      }
    }
    return false;
  };

  // get possible problems from above boolean
  const getPotentialProblematicViscera = (booleanList) => {
    const problems = [];

    if (!booleanList.isBloodPressureNormal ||
      !booleanList.isBloodLipidsNormal ||
      !booleanList.isBloodSugarNormal || !booleanList.isHeartRateNormal || !booleanList.isHbNormal) {
      problems.push("heart");
    }

    if (!booleanList.isAltNormal || booleanList.isAstNormal) {
      problems.push("liver");
    }

    if (!booleanList.isUrineGlucoseNormal || !booleanList.isUrineAcidNormal || !booleanList.isUreaNormal || !booleanList.isCreatinineNormal) {
      problems.push("kidney");
    }

    return problems;
  };

  // using the backend model (powered by VertexAI-Google Firebase)

  const fetchHealthInfoFromAI = async (userInfo) => {
    try {
      const prompt = `Give me a 100-word assumption of possible health problems for the user, do not tell me you are AI and not medical professional (I will remind users so you do not need to include them in your answer), The main health indicators of the user are: ${userInfo.gender},date of birth is ${userInfo.dateOfBirth}, height is ${userInfo.height} cm,weight is ${userInfo.weight} kg, blood pressure is ${userInfo.sBloodPressure}-${userInfo.dBloodPressure} mmHg, blood sugar level is ${userInfo.bloodSugar} mmol/L, blood lipids level is ${userInfo.bloodLipids} mmol/L, heart rate is ${userInfo.heartRate} bpm, hemoglobin is ${userInfo.hemoglobin} g/dL, urea is ${userInfo.urea} mmol/L, urine glucose is ${userInfo.urineGlucose} mg/dL, urine Acid is ${userInfo.urineAcid} µmol/L , creatinine is ${userInfo.creatinine} µmol/L, alanine Aminotransferase is ${userInfo.alt} U/L, Aspartate Aminotransferase is ${userInfo.ast} U/L `;

      const res = await fetch('https://example/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      return data.response;
    } catch (error) {
      console.error("Error calling AI:", error);
      return "AI is currently unavailable.";
    }
  };


  // const fetchHealthInfoFromAI = async (data) => {
  //   try {
  //     const prompt = `Give me a 200-word assumption of possible health problems for the user, do not tell me you are AI and not medical professional (I will remind users so you do not need to include them in your answer), The main health indicators of the user are: ${data.gender},date of birth is ${data.dateOfBirth}, height is ${data.height} cm,weight is ${data.weight} kg, blood pressure is ${data.sBloodPressure}-${data.dBloodPressure} mmHg, blood sugar level is ${data.bloodSugar} mmol/L, blood lipids level is ${data.bloodLipids} mmol/L, heart rate is ${data.heartRate} bpm, hemoglobin is ${data.hemoglobin} g/dL, urea is ${data.urea} mmol/L, urine glucose is ${data.urineGlucose} mg/dL, urine Acid is ${data.urineAcid} µmol/L , creatinine is ${data.creatinine} µmol/L, alanine Aminotransferase is ${data.alt} U/L, Aspartate Aminotransferase is ${data.ast} U/L `;
  //     const result = await generateContent(prompt);
  //     const response = result.response;
  //     const text = response.text();
  //     return text;
  //   } catch (error) {
  //     const text = "AI has no response, thank you so much";
  //     return text;
  //   }
  // };

  const fetchHealthSuggestionFromAI = async (userInfo) => {
    try {
      const prompt = `Give me a 100-word health suggestions to the user based on his/her health indicators, and the suggestions can be relative to life style, diet or medical treatment. Do not tell that you are AI and not medical professional (I will remind users so you do not need to include them in your answer), The main health indicators of the user are: ${userInfo.gender},date of birth is ${userInfo.dateOfBirth}, height is ${userInfo.height} cm,weight is ${userInfo.weight} kg, blood pressure is ${userInfo.sBloodPressure}-${userInfo.dBloodPressure} mmHg, blood sugar level is ${userInfo.bloodSugar} mmol/L, blood lipids level is ${userInfo.bloodLipids} mmol/L, heart rate is ${userInfo.heartRate} bpm, hemoglobin is ${userInfo.hemoglobin} g/dL, urea is ${userInfo.urea} mmol/L, urine glucose is ${userInfo.urineGlucose} mg/dL, urine Acid is ${userInfo.urineAcid} µmol/L , creatinine is ${userInfo.creatinine} µmol/L, alanine Aminotransferase is ${userInfo.alt} U/L, Aspartate Aminotransferase is ${userInfo.ast} U/L `;
      const res = await fetch('https://example/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      return data.response;
    } catch (error) {
      console.error("Error calling AI:", error);
      return "AI is currently unavailable.";
    }
  };

  // const fetchHealthSuggestionFromAI = async (data) => {
  //   try {
  //     const prompt = `Give me a 100-word health suggestions to the user based on his/her health indicators, and the suggestions can be relative to life style, diet or medical treatment. Do not tell that you are AI and not medical professional (I will remind users so you do not need to include them in your answer), The main health indicators of the user are: ${data.gender},date of birth is ${data.dateOfBirth}, height is ${data.height} cm,weight is ${data.weight} kg, blood pressure is ${data.sBloodPressure}-${data.dBloodPressure} mmHg, blood sugar level is ${data.bloodSugar} mmol/L, blood lipids level is ${data.bloodLipids} mmol/L, heart rate is ${data.heartRate} bpm, hemoglobin is ${data.hemoglobin} g/dL, urea is ${data.urea} mmol/L, urine glucose is ${data.urineGlucose} mg/dL, urine Acid is ${data.urineAcid} µmol/L , creatinine is ${data.creatinine} µmol/L, alanine Aminotransferase is ${data.alt} U/L, Aspartate Aminotransferase is ${data.ast} U/L `;
  //     const result = await generateContent(prompt);
  //     const response = result.response;
  //     const text = response.text();
  //     return text;
  //   } catch (error) {
  //     const text = "AI has no response, thank you so much";
  //     return text;
  //   }
  // };


  AV.init({
      appId: "",
      appKey: "",
      serverURL:""
    });
  
   

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



  useEffect(() => {

    const fetchData = async () => {

      const data = await getInfo();
      setPersonalData(data);

      const age = getAge(data.birth)

      const calculatedBMI = calculateBMI(data.height, data.weight);
      setBmi(calculatedBMI);

      const range = calculateBMIRange(data.height);
      setReasonableBmiRange(range)

      const bmr = calculateBMR(age, data.weight, data.height, data.gender)
      setBmr(bmr)


      if (calculatedBMI < range.minBMI) {
        setOverWeightMessage("Your BMI suggests you're below the healthy range. Adding more nutritious foods to your diet can help you feel stronger and healthier—you're capable of great progress!")
        setBmiColor("border-orange-500");
      }
      else if (calculatedBMI > range.maxBMI) {
        setOverWeightMessage("Your BMI suggests that you're slightly above the healthy range. Small changes to your diet and lifestyle can make a big difference—you're on the right path!")
        setBmiColor("border-red-500");
      }
      else {
        setOverWeightMessage("Great job! Your BMI is normal. Keep up the healthy lifestyle!")
        setBmiColor("border-green-500");
      }

      console.log(bmr)

      if (data.gender === "male") {
        if (bmr < 1600) {
          setReasonableBmrRange("1600-1900");
          setBmrColor("border-orange-500");
          setBmrMessage("Your metabolism seems a bit low. Incorporating some exercise into your routine might help boost it and make you feel great!");
        } else if (bmr >= 1600 && bmr < 1900) {
          setReasonableBmrRange("1600-1900");
          setBmrColor("border-green-500");
          setBmrMessage("Your metabolism is in a healthy range! Keep up your balanced routine to maintain this excellent state.");
        } else if (bmr >= 1900) {
          setReasonableBmrRange("1600-1900");
          setBmrColor("border-red-500");
          setBmrMessage("Your metabolism is on the higher side, which is great for staying energized. Just make sure to fuel your body with enough nutritious food!");
        }
      }

      if (data.gender === "female") {
        if (bmr < 1200) {
          setReasonableBmrRange("1200-1500");
          setBmrColor("border-red-500");
          setBmrMessage("Your metabolism seems a bit low. Incorporating some exercise into your routine might help boost it and make you feel great!");
        } else if (bmr >= 1200 && bmr < 1500) {
          setReasonableBmrRange("1200-1500");
          setBmrColor("border-green-500");
          setBmrMessage("Your metabolism is in a healthy range! Keep up your balanced routine to maintain this excellent state.");
        } else if (bmr >= 1500) {
          setReasonableBmrRange("1200-1500");
          setBmrColor("border-orange-500");
          setBmrMessage("Your metabolism is on the higher side, which is great for staying energized. Just make sure to fuel your body with enough nutritious food!");
        }
      }


      const bloodPressureRange = getReasonableBloodPressureRange(age, data.gender)

      const bloodSugarLevelRange = getReasonableBloodSugarLevel(age, data.gender)

      const bloodLipidsRange = getReasonableBloodLipidsLevel(age)

      const hbRange = getReasonableHbLevel(age, data.gender)

      const urineGlucoseRange = getReasonableUrineGlucoseLevel(age)

      const urineAcidRange = getReasonaUrineAcidLevel(data.gender, age)

      const ureaLevel = getReasonableUreaLevel(data.gender, age)

      const creatinineLevel = getReasonableCreatinineLevel(age, data.gender)

      const altLevel = getReasonableALT(age, data.gender)

      const astLevel = getReasonableAST(age, data.gender)

      const isBloodPressureNormal = evaluateIfBloodPressureNormal(bloodPressureRange, data.sBloodPressure, data.dBloodPressure)

      const isBloodSugarNormal = evaluateIfBloodSugarNormal(bloodSugarLevelRange, data.bloodSugar)

      const isBloodLipidsNormal = evaluateIfBloodLipidNormal(bloodLipidsRange, data.bloodLipids)

      const isHeartRateNormal = evaluateIfHeartRateNormal(data.heartRate)

      const isHbNormal = evaluateIfHbNormal(age, data.gender, data.hemoglobin)

      const isUrineGlucoseNormal = evaluateIfUrineGlucoseNormal(data.urineGlucose, age)

      const isUrineAcidNormal = evaluateIfUrineAcidNormal(data.gender, age, data.urineAcid)

      const isUreaNormal = evaluateIfUreaNormal(data.gender, age, data.urea)

      const isCreatinineNormal = evaluateIfCreatinineNormal(age, data.gender)

      const isAstNormal = evaluateIfASTNormal(age, data.gender, data.ast)

      const isAltNormal = evaluateIfALTNormal(age, data.gender, data.alt)


      setReasonableBloodPressureRange(bloodPressureRange)
      setIsBloodPressureNormalBoolean(isBloodPressureNormal)

      setReasonableBloodSugarLevel(bloodSugarLevelRange)
      setIsBloodSugarNormalBoolean(isBloodSugarNormal)

      setReasonableBloodLipidsRange(bloodLipidsRange)
      setIsBloodLipidsNormalBoolean(isBloodLipidsNormal)

      setIsHeartRateNormalBoolean(isHeartRateNormal)

      setReasonableHb(hbRange)
      setIsHbNormalBoolean(isHbNormal)

      setReasonableUrineGlucoseLevel(urineGlucoseRange)
      setIsUrineGlucoseNormalBoolean(isUrineGlucoseNormal)

      setReasonableUrineAcidRange(urineAcidRange)
      setIsUrineAcidNormalBoolean(isUrineAcidNormal)

      setReasonableUreaLevel(ureaLevel)
      setIsUreaNormalBoolean(isUreaNormal)

      setReasonableCreatinine(creatinineLevel)
      setIsCreatinineNormalBoolean(isCreatinineNormal)

      setReasonableAst(astLevel)
      setIsAstNormalBoolean(isAstNormal)

      setReasonableAlt(altLevel)
      setIsAltNormalBoolean(isAltNormal)

      const booleanList = [isBloodPressureNormal, isBloodLipidsNormal, isBloodSugarNormal, isHeartRateNormal, isHbNormal, isUrineGlucoseNormal, isUrineAcidNormal, isUreaNormal, isCreatinineNormal, isAstNormal, isAltNormal]

      setProblems(getPotentialProblematicViscera(booleanList))

    };

    fetchData();
  }, []);


  useEffect(() => {
    const fetchAIanswer = async () => {
      setIsTypingProblems(true);
      setAiHealthProblemsResult('');
      let allowTyping = false;

      const timeout = setTimeout(() => {
        allowTyping = true;
        setIsTypingProblems(false);
      }, 5000);

      const personalInfo = await getInfo();
      const response = await fetchHealthInfoFromAI(personalInfo);

      if (!response) {
        setAiHealthProblemsResult("Unable to fetch AI response.");
        setIsTypingProblems(false);
        clearTimeout(timeout);
        return;
      }

      let index = 0;
      let currentText = "";

      const interval = setInterval(() => {
        if (allowTyping) {
          if (index < response.length) {
            currentText += response[index];
            setAiHealthProblemsResult(currentText);
            index++;
          } else {
            clearInterval(interval);
          }
        }
      }, 10);

      return () => {
        clearTimeout(timeout);
        clearInterval(interval);
      };
    };

    fetchAIanswer();
  }, []);




  useEffect(() => {
    const fetchAIanswer = async () => {
      setIsTypingSuggestions(true);
      setAiHealthSuggestion('');
      let allowTyping = false;

      const timeout = setTimeout(() => {
        allowTyping = true;
        setIsTypingSuggestions(false);
      }, 5000);

      const personalInfo = await getInfo();
      const suggestions = await fetchHealthSuggestionFromAI(personalInfo);

      let index = 0;
      let currentText = "";

      const interval = setInterval(() => {
        if (allowTyping) {
          if (index < suggestions.length) {
            currentText += suggestions[index];
            setAiHealthSuggestion(currentText);
            index++;
          } else {
            clearInterval(interval);
          }
        }
      }, 10);

      return () => {
        clearTimeout(timeout);
        clearInterval(interval);
      };
    };

    fetchAIanswer();
  }, []);




  if (!personalData) {
    return (
      <div className="dashboard-page flex items-center justify-center min-h-screen bg-gray-100">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          <h1 className="text-gray-700 text-sm font-semibold mt-4">Loading...</h1>
        </div>
      </div>
    );
  }


  return (
    <div className="dashboard-page flex flex-col min-h-screen">
      <header className="w-full max-w-screen mx-auto p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 cursor-pointer" onClick={() => navigate("/dashboard")}>
            <img src={logo} className="w-12 h-12" alt="Logo" />
            <h1 className="text-base font-bold">LiveWell Dashboard</h1>
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
      <main className="flex flex-col sm:flex-row flex-1 bg-gray-100 mx-5 my-4 p-6 rounded-lg shadow-md items-start">
        <div className="flex-1 flex flex-col items-center justify-start sm:border-r border-gray-300 sm:w-1/2">
          <h1 className="text-lg font-bold mb-4">Your Health Index</h1>
          <div className="basic-body-index-container flex flex-row items-center justify-between border border-gray-300 p-6 rounded-lg shadow-md w-9/12">
            <div className="flex flex-row items-center space-x-2">
              <img src={height} className="w-10 h-10"></img>
              <h2>Your Height: {personalData.height} cm</h2>
            </div>
            <div className="flex flex-row items-center space-x-2">
              <img src={weight} className="w-10 h-10"></img>
              <h2>Your Weight: {personalData.weight} kg</h2>
            </div>
          </div>
          <div className="index-container flex flex-row items-center justify-between space-x-20">
            <div
              className={`bmr-container w-25 h-25 rounded-full border-4 ${bmiColor} flex items-center justify-center bg-white shadow-md mt-5`} onMouseEnter={() => setShowNormalWeightRange(true)} onMouseLeave={() => setShowNormalWeightRange(false)}
            >
              <h2 className="bmi-text text-xl font-bold text-center">
                Your BMI: {bmi}
              </h2>
              {showNormalWeightRange && (
                <div className="absolute bg-white text-black border border-gray-400 p-3 rounded shadow-md">
                  <p className="text-sm text-center">Normal Weight Range: {reasonableBmiRange.minWeight} kg - {reasonableBmiRange.maxWeight} kg</p>
                  <p className="text-xs">{overWeightMessage}</p>
                  <p className="text-xs font-sans text-center">*BMI (Body Mass Index): A measure of body fat based on weight and height.</p>
                </div>
              )}
            </div>
            <div
              className={`bmr-container w-25 h-25 rounded-full border-4 ${bmrColor} flex items-center justify-center bg-white shadow-md mt-5`} onMouseEnter={() => setShowNormalBmrRange(true)} onMouseLeave={() => setShowNormalBmrRange(false)}
            >
              <h2 className="bmr-text text-xl font-bold text-center">
                Your BMR: {bmr}
              </h2>
              {showNormalBmrRange && (
                <div className="absolute bg-white text-black border border-gray-400 p-3 rounded shadow-md">
                  <p className="text-sm text-center">Reasonable BMR Range: {reasonableBmrRange}</p>
                  <p className="text-xs">{bmrMessage}</p>
                  <p className="text-xs font-sans text-center">*BMR (Basal Metabolic Rate): Minimum energy required for basic body functions at rest.</p>
                </div>
              )}
            </div>
          </div>
          <div className="legend my-4">
            <ul className="flex space-x-4">
              <li className="flex items-center">
                <div className="w-3 h-3 bg-red-500 mr-2"></div>
                <h1 className="text-xs font-sans">Above Normal Range</h1>
              </li>
              <li className="flex items-center">
                <div className="w-3 h-3 bg-orange-500 mr-2"></div>
                <h1 className="text-xs font-sans">Under Normal Range</h1>
              </li>
              <li className="flex items-center">
                <div className="w-3 h-3 bg-green-500 mr-2"></div>
                <h1 className="text-xs font-sans">Normal</h1>
              </li>
            </ul>
          </div>
          <div className="otherInfo-container flex flex-col mt-2 border border-gray-300 p-6 rounded-lg shadow-md w-11/12 mb-2">
            <div className="before-divider flex flex-col items-center justify-between">
              <img src={heart} className="w-8 h-8 hover:animate-shake"></img>
              <p className="text-sm">Heart & Blood Health Indicators</p>
            </div>
            <div className="divider border-t border-dashed border-gray-300 my-3"></div>
            <div className={"bloodPressure-container flex flex-row items-center justify-between space-x-8"}>
              <div className="currentInfo-container flex flex-row items-center space-x-2">
                <img src={bloodpressure} className="w-8 h-8"></img>
                <h2 className="text-sm">Your Blood Pressure: <h2 className="text-sm font-sans inline">{personalData.dBloodPressure} - {personalData.sBloodPressure} mmHg</h2></h2>
              </div>
              <div className="normalIndex-container flex flex-row items-center space-x-2">
                <img
                  src={isBloodPressureNormal ? reminder : warning}
                  className="w-6 h-6"
                  alt={isBloodPressureNormal ? "Normal" : "Warning"}
                />
                <h2 className="text-sm"><h2 className="text-sm font-sans inline">{reasonableBloodPressureRange}</h2></h2>
              </div>
            </div>
            <div className="bloodSugar-container flex flex-row items-center justify-between space-x-8 mt-3">
              <div className="currentInfo-container flex flex-row items-center space-x-2">
                <img src={bloodSugar} className="w-8 h-8"></img>
                <h2 className="text-sm">Your Blood Sugar Level: <h2 className="text-sm font-sans inline">{personalData.bloodSugar} mmol/L</h2></h2>
              </div>
              <div className="normalIndex-container flex flex-row items-center space-x-2">
                <img
                  src={isBloodSugarNormal ? reminder : warning}
                  className="w-6 h-6"
                  alt={isBloodPressureNormal ? "Normal" : "Warning"}
                />
                <h2 className="text-sm"><h2 className="text-sm font-sans inline">{reasonableBloodSugarLevel}</h2></h2>
              </div>
            </div>
            <div className="bloodLipid-container flex flex-row items-center justify-between space-x-8 mt-3">
              <div className="currentInfo-container flex flex-row items-center space-x-2">
                <img src={lipid} className="w-8 h-8"></img>
                <h2 className="text-sm">Your Blood Lipid Level: <h2 className="text-sm font-sans inline">{personalData.bloodLipids} mmol/L</h2></h2>
              </div>
              <div className="normalIndex-container flex flex-row items-center space-x-2">
                <img
                  src={isBloodLipidsNormal ? reminder : warning}
                  className="w-6 h-6"
                  alt={isBloodLipidsNormal ? "Normal" : "Warning"}
                />
                <h2 className="text-sm"><h2 className="text-sm font-sans inline">{reasonableBloodLipidsRange}</h2></h2>
              </div>

            </div>
            <div className="heartRate-container flex flex-row items-center justify-between space-x-8 mt-3">
              <div className="currentInfo-container flex flex-row items-center space-x-2">
                <img src={heartRate} className="w-8 h-8"></img>
                <h2 className="text-sm">Your Heart Rate: <h2 className="text-sm font-sans inline">{personalData.heartRate} bpm</h2></h2>
              </div>
              <div className="normalIndex-container flex flex-row items-center space-x-2">
                <img
                  src={isHeartRateNormal ? reminder : warning}
                  className="w-6 h-6"
                  alt={isHeartRateNormal ? "Normal" : "Warning"}
                />
                <h2 className="text-sm font-sans">60-100 bpm</h2>
              </div>
            </div>
            <div className="hemoglobin-container flex flex-row items-center justify-between space-x-8 mt-3">
              <div className="currentInfo-container flex flex-row items-center space-x-2">
                <img src={hemoglobin} className="w-8 h-8"></img>
                <h2 className="text-sm">Your Hemoglobin Level: <h2 className="text-sm font-sans inline">{personalData.hemoglobin} g/dL</h2></h2>
              </div>
              <div className="normalIndex-container flex flex-row items-center space-x-2">
                <img
                  src={isHbNormal ? reminder : warning}
                  className="w-6 h-6"
                  alt={isHbNormal ? "Normal" : "Warning"}
                />
                <h2 className="text-sm font-sans">{reasonableHb} g/dL</h2>
              </div>
            </div>
            <div className="before-divider flex flex-col items-center justify-between mt-3">
              <img src={renal} className="w-8 h-8 hover:animate-shake"></img>
              <p className="text-sm">Renal Function Indicators</p>
            </div>
            <div className="divider border-t border-dashed border-gray-300 my-3"></div>
            <div className="urineGlucose-container flex flex-row items-center justify-between space-x-8">
              <div className="currentInfo-container flex flex-row items-center space-x-2">
                <img src={urineGlucose} className="w-8 h-8"></img>
                <h2 className="text-sm">Urine Glucose Level: <h2 className="text-sm font-sans inline">{personalData.urineGlucose} mg/dL</h2></h2>
              </div>
              <div className="normalIndex-container flex flex-row items-center space-x-2">
                <img
                  src={isUrineGlucoseNormal ? reminder : warning}
                  className="w-6 h-6"
                  alt={isUrineGlucoseNormal ? "Normal" : "Warning"}
                />
                <h2 className="text-sm font-sans">{reasonableUrineGlucoseLevel} mg/dL</h2>
              </div>
            </div>
            <div className="urineAcid-container flex flex-row items-center justify-between space-x-8 mt-2">
              <div className="currentInfo-container flex flex-row items-center space-x-2">
                <img src={urineAcid} className="w-8 h-8"></img>
                <h2 className="text-sm">Urine Acid Level: <h2 className="text-sm font-sans inline">{personalData.urineAcid} µmol/L</h2></h2>
              </div>
              <div className="normalIndex-container flex flex-row items-center space-x-2">
                <img
                  src={isUrineAcidNormal ? reminder : warning}
                  className="w-6 h-6"
                  alt={isUrineAcidNormal ? "Normal" : "Warning"}
                />
                <h2 className="text-sm font-sans">{reasonableUrineAcidRange} mg/dL</h2>
              </div>
            </div>
            <div className="urineAcid-container flex flex-row items-center justify-between space-x-8 mt-2">
              <div className="currentInfo-container flex flex-row items-center space-x-2">
                <img src={urea} className="w-8 h-8"></img>
                <h2 className="text-sm">Urea Level: <h2 className="text-sm font-sans inline">{personalData.urea} mmol/L</h2></h2>
              </div>
              <div className="normalIndex-container flex flex-row items-center space-x-2">
                <img
                  src={isUreaNormal ? reminder : warning}
                  className="w-6 h-6"
                  alt={isUreaNormal ? "Normal" : "Warning"}
                />
                <h2 className="text-sm font-sans">{reasonableUreaLevel} mmol/L</h2>
              </div>
            </div>
            <div className="creatinine-container flex flex-row items-center justify-between space-x-8 mt-2">
              <div className="currentInfo-container flex flex-row items-center space-x-2">
                <img src={creatinine} className="w-8 h-8"></img>
                <h2 className="text-sm">Creatine Level: <h2 className="text-sm font-sans inline">{personalData.creatinine} μmol/L</h2></h2>
              </div>
              <div className="normalIndex-container flex flex-row items-center space-x-2">
                <img
                  src={isCreatinineNormal ? reminder : warning}
                  className="w-6 h-6"
                  alt={isCreatinineNormal ? "Normal" : "Warning"}
                />
                <h2 className="text-sm font-sans">{reasonableCreatinine} μmol/L</h2>
              </div>
            </div>
            <div className="before-divider flex flex-col items-center justify-between mt-3">
              <img src={liver} className="w-8 h-8 hover:animate-shake"></img>
              <p className="text-sm">Liver Function Indicators</p>
            </div>
            <div className="divider border-t border-dashed border-gray-300 my-3"></div>
            <div className="alt-container flex flex-row items-center justify-between space-x-8 mt-2">
              <div className="currentInfo-container flex flex-row items-center space-x-2">
                <img src={ALT} className="w-8 h-8"></img>
                <h2 className="text-sm">ALT (Alanine Aminotransferase): <h2 className="text-sm font-sans inline">{personalData.alt} U/L</h2></h2>
              </div>
              <div className="normalIndex-container flex flex-row items-center space-x-2">
                <img
                  src={isAltNormal ? reminder : warning}
                  className="w-6 h-6"
                  alt={isAltNormal ? "Normal" : "Warning"}
                />
                <h2 className="text-sm font-sans">{reasonableAlt} U/L</h2>
              </div>
            </div>
            <div className="ast-container flex flex-row items-center justify-between space-x-8 mt-2">
              <div className="currentInfo-container flex flex-row items-center space-x-2">
                <img src={AST} className="w-8 h-8"></img>
                <h2 className="text-sm">AST (Aspartate Aminotransferase): <h2 className="text-sm font-sans inline">{personalData.ast} U/L</h2></h2>
              </div>
              <div className="normalIndex-container flex flex-row items-center space-x-2">
                <img
                  src={isAstNormal ? reminder : warning}
                  className="w-6 h-6"
                  alt={isAstNormal ? "Normal" : "Warning"}
                />
                <h2 className="text-sm font-sans">{reasonableAst} U/L</h2>
              </div>
            </div>
            <div className="legend-for-indicators flex flex-row items-center justify-center w-full space-x-4 mt-3">
              <div className="flex flex-row items-center space-x-4">
                <img src={reminder} className="w-5 h-5"></img>
                <h2 className="text-xs font-sans">In the normal range</h2>
              </div>
              <div className="flex flex-row items-center space-x-2">
                <img src={warning} className="w-5 h-5"></img>
                <h2 className="text-xs font-sans">Not in the normal range</h2>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center">
          <h1 className="text-lg">Problems Demo</h1>
          <div className="problems-displayer flex flex-col my-4">
            <div className="visualization relative">
              <img src={upperbody} className="w-60 h-60"></img>
              {problems.includes("heart") && (
                <div
                  className="absolute bg-red-500 bg-opacity-75 rounded-full animate-pulse"
                  style={{
                    top: "32%",
                    left: "55%",
                    width: "50px",
                    height: "50px",
                    transform: "translate(-50%, -50%)",
                    clipPath: "path('M30,50 C20,30 10,10 30,5 C50,0 70,15 70,35 C70,55 50,70 30,50 Z')",
                  }}
                ></div>
              )}
              {problems.includes("liver") && (
                <div
                  className="absolute bg-yellow-500 bg-opacity-75 rounded-full animate-pulse"
                  style={{
                    top: "50%",
                    left: "45%",
                    width: "85px",
                    height: "40px",
                    transform: "translate(-50%, -50%)",
                    clipPath: "path('M10,30 C20,10 60,10 70,30 C70,40 60,50 30,50 C10,50 10,40 10,30 Z')",
                  }}
                ></div>
              )}
              {problems.includes("kidney") && (
                <div
                  className="absolute bg-blue-500 bg-opacity-75 rounded-full animate-pulse"
                  style={{
                    top: "72%",
                    left: "50%",
                    width: "50px",
                    height: "70px",
                    transform: "translate(-50%, -50%)",
                    clipPath: "path('M20,50 C10,30 10,10 30,5 C50,0 50,30 40,50 C30,60 20,50 20,50 Z')",
                  }}
                ></div>
              )}
              <div className="legend absolute bottom--20 left-1/2 transform -translate-x-1/2">
                <ul className="flex space-x-4">
                  <li className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 mr-2"></div>
                    <h1 className="text-xs font-sans">Heart</h1>
                  </li>
                  <li className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-500 mr-2"></div>
                    <h1 className="text-xs font-sans">Liver</h1>
                  </li>
                  <li className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 mr-2"></div>
                    <h1 className="text-xs font-sans">Kidney</h1>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="problems-explain-container flex flex-row items-center justify-between border border-gray-300 p-6 rounded-lg shadow-md w-10/12 mt-5">
            <div>
              <div className="flex items-center justify-center">
                <img src={healthcheckup} className="w-12 h-12" />
              </div>
              <h1>Diagnosis based on your health indicators:</h1>
              {isTypingProblems ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="flex flex-col items-center justify-center my-4"><img src={loading} className="w-10 h-10" /><p className="text-xs font-sans">Loading AI response...</p></div>
                </div>
              ) : (
                <p className="text-xs font-sans">{aiHealthProblemsResult}</p>
              )}
              <h1 className="text-sm mt-2">*This diagnosis is not completely accurate, please contact the hospital or follow your doctor's advice</h1>
            </div>
          </div>
          <div className="suggestions-container flex flex-row items-center justify-between border border-gray-300 p-6 rounded-lg shadow-md w-10/12 mt-5">
            <div>
              <div className="flex items-center justify-center">
                <img src={suggestions} className="w-12 h-12" />
              </div>
              <h1>Suggestions based on your health indicators:</h1>
              {isTypingSuggestions ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="flex flex-col items-center justify-center my-4"><img src={loading} className="w-10 h-10" /><p className="text-xs font-sans">Loading AI response...</p></div>
                </div>
              ) : (
                <p className="text-xs font-sans">{aiHealthSuggestion}</p>
              )}
              <h1 className="text-sm mt-2">*This diagnosis is not completely accurate, please contact the hospital or follow your doctor's advice</h1>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
