# LiveWell - Your Health Portal Website

<img src="/src/asset/logo/Logo.png" width="75"></img>

Welcome to LiveWell — your personal health companion in the digital age.

LiveWell is a full-stack web platform designed to help you easily record your health data, get smart insights through analysis, and support you in making informed decisions for a healthier future. It's like having your own family doctor, right at your fingertips. I am Toby, the developer of this website, who is also a student graduated from University of Auckland. I am glad to be here and share this portal website to you.

You can access the LiveWell demo through the URL below. This version is specially optimized for users located in Mainland China. If you're outside Mainland China, you're still welcome to explore the demo. However, please note that by using this version, you consent to your data being stored on servers based in China. In addition, LiveWell integrates AI services provided by DeepSeek, a technology company based in Hangzhou, China. As a result, some of your information may also be processed by DeepSeek to support AI-driven health analysis.

Site: https://livewell-cn-portal-8dctd190f91ee-1309839424.ap-shanghai.app.tcloudbase.com/

# Function and Pages Component Introduction

This website is composed of 8 different subpages, each designed with a specific feature or purpose in mind. In the following sections, I will highlight and introduce the most important pages in more detail.

#### `Dashboard`

The Dashboard serves as the central hub of LiveWell. Here, users can view their key health indicators, as well as a summary of any detected health risks based on the collected data.
LiveWell currently focuses on analyzing health metrics related to blood, heart, liver, and kidney functions. Accordingly, the dashboard highlights potential issues associated with these four vital systems only.
On the left side of the dashboard, you'll find two key panels:

-Health Problem Analysis

-AI-Powered Health Suggestions

Both of these panels are powered by an AI backend, which interprets your health data and offers personalized insights.

<img src="/demoscreenshot/9.png" width="500"></img>

#### `Basic Info Collecting and Modify Info Pages`

The purpose of these two pages is clear — to help you record your personal health data. But LiveWell goes a step further. Instead of only manually entering your health information, you also have a faster, smarter option: QR code scanning. Just tap the middle button at the bottom of the screen, and you'll be taken to the scanning page. This feature automatically activates your device’s camera and scans the QR code you provide, making data input quick and effortless.

<img src="/demoscreenshot/6.png" width="500"></img>

<img src="/demoscreenshot/11(1).png" width="500"></img>

#### `Diets Assitant`

The Diet Assistant is an integrated tool designed to help users log their meals and physical activities, while estimating their daily energy surplus. Similar to the Dashboard, the calculation here is powered by DeepSeek and should be considered as an estimation rather than an exact result. In addition, the Diet Assistant allows users to track their diet and exercise milestones, making it easy to review their past habits and progress at any time.

<img src="/demoscreenshot/10.png" width="500"></img>

#### `Analysis and Disease Prediction Pages`

On the analysis pages, you'll find three deep-learning-powered prediction models developed for LiveWell:

-Diabetes Prediction

-Liver Disease Prediction

-Heart Disease Prediction

All three models are built using neural networks and trained on publicly available datasets from Kaggle, and they are both deployed in Render (a service provider which can provide API service, based in United States). While they are capable of providing users with a probability (likelihood) of having a particular condition, there is still plenty of room for further improvement. Enhancing the accuracy and robustness of these models is a key part of LiveWell’s future roadmap — our goal is to deliver even more reliable and personalized health insights.

⚠️ Caution:
Since the backend API is hosted on Render.com under the free tier, there might be a cold start delay of around 60 to 120 seconds when the server is inactive for a while.
If the prediction request doesn’t respond immediately, please be patient and try clicking the button again after a short wait.

<img src="/demoscreenshot/8.png" width="500"></img>

<img src="/demoscreenshot/7.png" width="500"></img>


#### `Your Health Report`

On this page, you can generate your health report and easily download it as a PDF file.

<img src="/demoscreenshot/12.png" width="500"></img>


# Local Deployment Guidance

### ⚠️ Caution: If you try to deploy this project directly using the standard deployment process, it may fail. This is because several essential services are not activated by default in the source code — including the AI service from DeepSeek, the Render-based API (used for disease prediction), and the database service (which supports almost every page of the app). For now, LiveWell are using AI solution provided by DeepSeek, database solution from LeanCloud and api solution from render, if you want to deploy LiveWell on your local devices and using the same solutions just like I did, you need to input these value in the source code properly.

<img src="/demoscreenshot/1.png" width="500"></img>

<img src="/demoscreenshot/2.png" width="500"></img>

<img src="/demoscreenshot/4.png" width="500"></img>

<img src="/demoscreenshot/13.png" width="500"></img>

For all the features mentioned above, make sure to correctly configure the App ID, App Key, and API URL provided by LeanCloud, DeepSeek, and Render. If you're unsure how to set them up, please refer to the official documentation of each service for guidance. 

To make LiveWell more accessible to everyone, I’ve also included an alternative deployment option using Google Firebase, which is significantly easier to set up on your own. Firebase provides an all-in-one, user-friendly backend solution—handling database, API, and even AI services—which simplifies the entire deployment process. In the source code, you’ll also find a commented-out sample function that demonstrates how to integrate Firebase into your local setup. This can serve as a helpful reference if you prefer to deploy LiveWell using Firebase instead.

<img src="/demoscreenshot/3.png" width="500"></img>

If you need guidance, feel free to visit the Google Firebase website and check out their official documentation — it's clear and beginner-friendly.

### 🛠️ You Can Also Use Your Own Backend Solution!

LiveWell is flexible — you're welcome to use your own preferred backend services instead of Firebase or the default ones like LeanCloud, DeepSeek, or Render. However, doing so may require some code refactoring to ensure compatibility with your setup.

### 🚀 Once everything is configured
After filling in all the required values (like App ID, API keys, and service URLs), you can deploy the project using any standard method for React-based applications (e.g., Vite, CRA, or static hosting platforms like Vercel, Netlify, or Tencent Cloud). Below is the guidance:

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
