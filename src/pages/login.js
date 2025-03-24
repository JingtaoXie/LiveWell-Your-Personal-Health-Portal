import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { db } from "../firebase";
// import { ref, get, set } from "firebase/database";
import "../login.css"
import logo from "../asset/logo/Logo.png"
import AV from 'leancloud-storage';

const Login = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // const processLogin = async() => {
  //   // get user data from db, in order to do the password validation
  //   // console.log(password)
  //   // console.log(userName)
  //   const userDataPath = ref(db,`users/${userName}`);
  //   const userData = await get(userDataPath);
  //   document.cookie = `userName=${userName}; path=/; max-age=259200`

  //   // console.log(userData)
  //  // if user data can get successfully, that means the user exist, do not need to sign up
  //   if (userData.exists()){
  //     const passwordInDb = userData.val().password;
  //     const personalData = userData.val().personalData
  //     // console.log(passwordInDb)
  //     // console.log(personalData)
  //     if (passwordInDb == password){
  //       if (personalData){
  //         navigate("/dashboard")
  //       }else{
  //         navigate("/basicInfo")
  //       }
  //     }else{
  //       alert("Your password is incorrect, please enter again!")
  //     }
  //   }else{
  //     // if user data can not get successfully, that means the user do not exist, automatically sign up
  //     await set(userDataPath, { password });
  //     alert("User does not exist, successfully signed up");
  //     navigate("/basicInfo");
  //   }
  // }

  AV.init({
          appId: "",
          appKey: "",
          serverURL:""
        });


  const processLogin = async () => {
    try {
      const query = new AV.Query("personalData");
      query.equalTo("username", userName);

      const user = await query.first();

      document.cookie = `userName=${userName}; path=/; max-age=259200`;

      if (user) {
        const passwordInDb = user.get("password");
        const personalData = user.get("personalData");

        if (passwordInDb === password) {
          if (personalData) {
            navigate("/dashboard");
          } else {
            navigate("/basicInfo");
          }
        } else {
          alert("Your password is incorrect, please enter again!");
        }
      } else {
        const PersonalData = AV.Object.extend("personalData");
        const newUser = new PersonalData();
        newUser.set("username", userName);
        newUser.set("password", password);
        await newUser.save();
        alert("User does not exist, successfully signed up");
        navigate("/basicInfo");
      }
    } catch (error) {
      console.error("Login unsucessful", error);
      alert("Login failed, please try again later.");
    }
  };


  return <div className="login-page flex items-center justify-center min-h-screen bg-gray-100">
    <div className="login-window w-full max-w-md bg-white rounded-lg shadow-md p-10">
      <div id="title" className="flex flex-col items-center space-y-4">
        <img src={logo} className="w-24 h-24" alt="Logo" />
        <h1 className="text-5xl font-bold">LiveWell</h1>
        <h1 className="text-xl text-center">Your Personal Health Portal</h1>
      </div>
      <div className="flex flex-col items-center w-full mt-6 space-y-4">
        <input
          placeholder="User Name"
          className="text-lg w-full max-w-md border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-400 font-sans"
          onChange={(e) => setUserName(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="text-lg w-full max-w-md border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-400 font-sans"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button id="button"
          className="text-lg bg-lime-300 shadow-md p-2 rounded-lg w-full max-w-md transition-transform transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-lime-200"
          onClick={processLogin}
        >Log in</button>
        <h3 className="text-xs">First-time users will be automatically registered upon login.</h3>
      </div>
    </div>
  </div>
    ;
};

export default Login;
