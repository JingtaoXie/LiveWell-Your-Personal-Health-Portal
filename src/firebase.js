// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getDatabase } from "firebase/database"
// import { getVertexAI, getGenerativeModel } from "firebase/vertexai";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: ,
//   authDomain: ,
//   databaseURL:,
//   projectId: ,
//   storageBucket:,
//   messagingSenderId: ,
//   appId: ,
//   measurementId: 
// };


// // Initialize Firebase
// const app = initializeApp(firebaseConfig)

// // Initialize VertexAI
// const vertexAI = getVertexAI(app);
// const model = getGenerativeModel(vertexAI, { model: "gemini-1.5-flash" });

// // Initialize Database
// export const db = getDatabase(app);

// // firebase.js
// export const generateContent = async (prompt) => {
//   try {
//     const result = await model.generateContent(prompt);
//     return result;
//   } catch (error) {
//     console.error("Error generating content:", error);
//     throw error;
//   }
// };

// export default app;
