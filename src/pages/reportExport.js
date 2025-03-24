import React from 'react';
import {
    Document,
    Page,
    Image,
    Text,
    View,
    StyleSheet,
} from '@react-pdf/renderer';
import { Font } from '@react-pdf/renderer'
import logo from "../asset/logo/Logo.png"

Font.register({
    family: 'Roboto',
    src: 'https://fonts.gstatic.com/s/roboto/v29/KFOmCnqEu92Fr1Mu4mxP.ttf',
});

const cleanText = (text) => text ? text.normalize("NFKC") : "";

const getFormattedDate = () => {
    const date = new Date();
    return date.toISOString().split('T')[0];
};

const calculateAge = (dob) => {
    if (!dob) return "";
    const birthDate = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
    }
    return parseInt(age);
};

const formatDate = (unprocessedDate) => {
    if (!unprocessedDate) return "Unknown";
    const date = new Date(unprocessedDate);
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

const getLast7Days = () => {
    const today = new Date();
    return [...Array(7)].map((_, i) => {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        return date.toISOString().split('T')[0];
    });
};

const getRecentDietAndExercise = (dietAndExerciseData) => {
    const last7Days = getLast7Days();
    return last7Days.map(date => ({
        date,
        diet: dietAndExerciseData?.[date]?.allDietConsumption ?? "No data",
        exercise: dietAndExerciseData?.[date]?.exercise ?? "No data",
        milestone: dietAndExerciseData?.[date]?.todayMilestone === true
            ? "Achieved"
            : dietAndExerciseData?.[date]?.todayMilestone === false
                ? "Not achieved"
                : "No data"
    }));
};


const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontSize: 12,
        position: 'relative',
    },
    section: {
        marginBottom: 10,
    },
    text: {
        fontSize: 14,
        fontFamily: 'Roboto',
    },
    logoContainer: {
        marginTop: 200,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: 400,
        height: 400,
        objectFit: 'contain',
        marginBottom: 10,
    },
    title: {
        fontSize: 36,
        fontFamily: 'Roboto',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    smalltitle: {
        fontSize: 12,
        fontFamily: 'Roboto',
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 10,
    },
    infoContainer: {
        fontSize: 18,
        fontFamily: 'Roboto',
        textAlign: 'center',
        marginTop: 150,
    },
    table: {
        display: "table",
        width: "auto",
        borderStyle: "solid",
        borderWidth: 1,
        borderRightWidth: 0,
        borderBottomWidth: 0,
        marginTop: 10,
    },
    tableRow: {
        flexDirection: "row",
    },
    tableColHeader: {
        width: "50%",
        borderStyle: "solid",
        borderBottomWidth: 1,
        borderRightWidth: 1,
        backgroundColor: "#f2f2f2",
        padding: 5,
        textAlign: "center",
        fontWeight: "bold",
    },
    tableCol: {
        width: "50%",
        borderStyle: "solid",
        borderBottomWidth: 1,
        borderRightWidth: 1,
        padding: 5,
        textAlign: "center",
    },
});

const ReportLoading = ({ user }) => {



    const diabetesPrediction = user?.predictionResult?.diabetesPrediction || {};
    const heartDiseasePrediction = user?.predictionResult?.heartDiseasePrediction || {};
    const liverDiseasePrediction = user?.predictionResult?.liverDiseasePrediction || {};

    const personalData = user?.personalData || {};

    const birth = personalData.birth ?? "Unknown";
    const gender = personalData.gender ?? "Unknown";
    const realName = personalData.realName ?? "Unknown";
    const height = personalData.height ?? "Unknown";
    const weight = personalData.weight ?? "Unknown";
    const bloodSugar = personalData.bloodSugar ?? "Unknown";
    const bloodLipids = personalData.bloodLipids ?? "Unknown";
    const hemoglobin = personalData.hemoglobin ?? "Unknown";
    const heartRate = personalData.heartRate ?? "Unknown";
    const creatinine = personalData.creatinine ?? "Unknown";
    const dBloodPressure = personalData.dBloodPressure ?? "Unknown";
    const sBloodPressure = personalData.sBloodPressure ?? "Unknown";
    const urea = personalData.urea ?? "Unknown";
    const urineAcid = personalData.urineAcid ?? "Unknown";
    const urineGlucose = personalData.urineGlucose ?? "Unknown";
    const ast = personalData.ast ?? "Unknown";
    const alt = personalData.alt ?? "Unknown";

    const dietAndExercise = getRecentDietAndExercise(user?.dietAndExercise || {});


    const formatPrediction = (value) => {
        return typeof value === "number" ? value.toFixed(2) : "Unknown";
    };

    const calculateBMI = (height, weight) => {
        const heightInMeters = height / 100;
        const bmiValue = (weight / (heightInMeters ** 2)).toFixed(2);
        return parseFloat(bmiValue);
    };

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.logoContainer}>
                    <Text style={styles.title}>
                        LiveWell Health Report
                    </Text>
                </View>
                <View style={styles.infoContainer}>
                    <Text style={styles.text}>
                        User Real Name: {realName}
                    </Text>
                    <Text style={styles.text}>
                        User birth: {birth}
                    </Text>
                    <Text style={styles.text}>
                        User age: {calculateAge(birth)} years old
                    </Text>
                    <Text style={styles.text}>
                        User gender: {gender}
                    </Text>
                    <Text style={styles.text}>
                        Report issued date: {getFormattedDate()}
                    </Text>
                </View>
            </Page>
            <Page size="A4" style={styles.page}>
                <Text style={styles.smalltitle}>Basic Health Info</Text>
                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCol}>Height</Text>
                        <Text style={styles.tableCol}>{height}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCol}>Weight</Text>
                        <Text style={styles.tableCol}>{weight}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCol}>BMI</Text>
                        <Text style={styles.tableCol}>{calculateBMI(height, weight)}</Text>
                    </View>
                </View>
                <Text style={styles.smalltitle}>Heart and Blood Indicators</Text>
                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableColHeader}>Indicators Name</Text>
                        <Text style={styles.tableColHeader}>Indicators Index</Text>
                        <Text style={styles.tableColHeader}>Status</Text>
                        <Text style={styles.tableColHeader}>Reasonable Range</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCol}>Blood Sugar</Text>
                        <Text style={styles.tableCol}>{bloodSugar} mmol/L</Text>
                        <Text style={styles.tableCol}>{bloodSugar >= 4.0 && bloodSugar <= 5.6 ? "Normal" : "Warning"}</Text>
                        <Text style={styles.tableCol}>4.0 - 5.6 mmol/L</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCol}>Blood Lipid</Text>
                        <Text style={styles.tableCol}>{bloodLipids} mmol/L</Text>
                        <Text style={styles.tableCol}>{bloodLipids <= 5.2 ? "Normal" : "Warning"}</Text>
                        <Text style={styles.tableCol}>3.5 - 5.2 mmol/L</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCol}>Systolic Blood Pressure (SBP)</Text>
                        <Text style={styles.tableCol}>{sBloodPressure} mmHg</Text>
                        <Text style={styles.tableCol}>{sBloodPressure >= 90 && sBloodPressure <= 120 ? "Normal" : "Warning"}</Text>
                        <Text style={styles.tableCol}>90 - 120 mmHg</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCol}>Diastolic Blood Pressure (DBP)</Text>
                        <Text style={styles.tableCol}>{dBloodPressure} mmHg</Text>
                        <Text style={styles.tableCol}>{dBloodPressure >= 60 && dBloodPressure <= 80 ? "Normal" : "Warning"}</Text>
                        <Text style={styles.tableCol}>60 - 80 mmHg</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCol}>Hemoglobin</Text>
                        <Text style={styles.tableCol}>{hemoglobin} g/dL</Text>
                        <Text style={styles.tableCol}>{hemoglobin >= 12.1 && hemoglobin <= 15.1 ? "Normal" : "Warning"}</Text>
                        <Text style={styles.tableCol}>12.1 - 15.1 g/dL</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCol}>Heart Rate</Text>
                        <Text style={styles.tableCol}>{heartRate} bpm</Text>
                        <Text style={styles.tableCol}>{heartRate >= 60 && heartRate <= 100 ? "Normal" : "Warning"}</Text>
                        <Text style={styles.tableCol}>60 - 100 bpm</Text>
                    </View>
                </View>
                <Text style={styles.smalltitle}>Renal Function Indicators</Text>
                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableColHeader}>Indicators Name</Text>
                        <Text style={styles.tableColHeader}>Indicators Index</Text>
                        <Text style={styles.tableColHeader}>Status</Text>
                        <Text style={styles.tableColHeader}>Reasonable Range</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCol}>Urine Glucose</Text>
                        <Text style={styles.tableCol}>{urineGlucose} mg/dL</Text>
                        <Text style={styles.tableCol}>{urineGlucose <= 15 ? "Normal" : "Warning"}</Text>
                        <Text style={styles.tableCol}>0 - 15 mg/dL</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCol}>Urine Acid</Text>
                        <Text style={styles.tableCol}>{urineAcid} µmol/L</Text>
                        <Text style={styles.tableCol}>{urineAcid >= 150 && urineAcid <= 350 ? "Normal" : "Warning"}</Text>
                        <Text style={styles.tableCol}>150 - 350 µmol/L</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCol}>Urea</Text>
                        <Text style={styles.tableCol}>{urea} mmol/L</Text>
                        <Text style={styles.tableCol}>{urea >= 3.5 && urea <= 8.0 ? "Normal" : "Warning"}</Text>
                        <Text style={styles.tableCol}>3.5 - 8.0 mmol/L</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCol}>Creatinine</Text>
                        <Text style={styles.tableCol}>{creatinine} µmol/L</Text>
                        <Text style={styles.tableCol}>{creatinine >= 44 && creatinine <= 96 ? "Normal" : "Warning"}</Text>
                        <Text style={styles.tableCol}>44 - 96  μmol/L</Text>
                    </View>
                </View>
                <Text style={styles.smalltitle}>Liver Function Indicators</Text>
                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableColHeader}>Indicators Name</Text>
                        <Text style={styles.tableColHeader}>Indicators Index</Text>
                        <Text style={styles.tableColHeader}>Status</Text>
                        <Text style={styles.tableColHeader}>Reasonable Range</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCol}>ALT (Alanine Aminotransferase)</Text>
                        <Text style={styles.tableCol}>{alt} U/L</Text>
                        <Text style={styles.tableCol}>{alt <= 35 ? "Normal" : "Warning"}</Text>
                        <Text style={styles.tableCol}>Less than or equal to 35 U/L</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCol}>AST (Aspartate Aminotransferase)</Text>
                        <Text style={styles.tableCol}>{ast} U/L</Text>
                        <Text style={styles.tableCol}>{ast <= 35 ? "Normal" : "Warning"}</Text>
                        <Text style={styles.tableCol}>Less than or equal to 35 U/L</Text>
                    </View>
                </View>
                <Text style={styles.smalltitle}>Disease Likelihood</Text>
                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableColHeader}>Disease</Text>
                        <Text style={styles.tableColHeader}>Probability</Text>
                        <Text style={styles.tableColHeader}>Prediction Date</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCol}>Diabetes</Text>
                        <Text style={styles.tableCol}>{diabetesPrediction.prediction}</Text>
                        <Text style={styles.tableCol}>{formatDate(diabetesPrediction.timestamp)}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCol}>Heart Disease</Text>
                        <Text style={styles.tableCol}>{heartDiseasePrediction.prediction}</Text>
                        <Text style={styles.tableCol}>{formatDate(heartDiseasePrediction.timestamp)}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCol}>Liver Disease</Text>
                        <Text style={styles.tableCol}>{liverDiseasePrediction.prediction}</Text>
                        <Text style={styles.tableCol}>{formatDate(liverDiseasePrediction.timestamp)}</Text>
                    </View>
                </View>
            </Page>
            <Page size="A4" style={styles.page}>
                <Text style={styles.smalltitle}>Diet & Exercise (Last 7 Days)</Text>
                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableColHeader}>Date</Text>
                        <Text style={styles.tableColHeader}>Diet</Text>
                        <Text style={styles.tableColHeader}>Exercise</Text>
                        <Text style={styles.tableColHeader}>Reach Target Or Not？</Text>
                    </View>
                    {dietAndExercise.map((entry, index) => (
                        <View style={styles.tableRow} key={index}>
                            <Text style={styles.tableCol}>{entry.date}</Text>
                            <Text style={styles.tableCol}>{entry.diet}</Text>
                            <Text style={styles.tableCol}>{entry.exercise}</Text>
                            <Text style={styles.tableCol}>{entry.milestone}</Text>
                        </View>
                    ))}
                </View>
            </Page>
        </Document>
    );
};

export default ReportLoading;
