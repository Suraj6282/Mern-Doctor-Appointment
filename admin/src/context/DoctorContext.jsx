// import { createContext, useState } from "react";
// import axios from 'axios'
// import { toast } from 'react-toastify'


// export const DoctorContext = createContext()

// const DoctorContextProvider = (props) => {

//     const backendUrl = import.meta.env.VITE_BACKEND_URL

//     const [dToken, setDToken] = useState(localStorage.getItem('dToken') ? localStorage.getItem('dToken') : '')
//     const [appointments, setAppointments] = useState([])
//     const [dashData, setDashData] = useState(false)
//     const [profileData, setProfileData] = useState(false)

//     // Getting Doctor appointment data from Database using API
//     const getAppointments = async () => {
//         try {
//           const response = await axios.get(backendUrl + '/api/doctor/appointments', {
//             headers: {
//               Authorization: `Bearer ${dToken}` // Ensure the token is included
//             }
//           });
//           if (response.data.success) {
//             setAppointments(response.data.appointments); // Store the appointments data
//           } else {
//             toast.error("Failed to fetch appointments: " + response.data.message);
//           }
//         } catch (error) {
//           if (error.response && error.response.status === 401) {
//             toast.error("Unauthorized. Please login again.");
//             // Redirect to login page or logout the user
//           } else {
//             console.error("Error fetching appointments:", error);
//             toast.error("Error fetching appointments");
//           }
//         }
//       };
      


//     // Getting Doctor profile data from Database using API
//     const getProfileData = async () => {
//         try {
//             const { data } = await axios.get(backendUrl + '/api/doctor/profile', { headers: { Authorization: `Bearer ${dToken}` } })
//             console.log(data.profileData)
//             setProfileData(data.profileData)

//         } catch (error) {
//             console.log(error)
//             toast.error(error.message)
//         }
//     }

//     // Function to cancel doctor appointment using API
//     const cancelAppointment = async (appointmentId) => {

//         try {

//             const { data } = await axios.post(backendUrl + '/api/doctor/cancel-appointment', { appointmentId }, { headers: { Authorization: `Bearer ${dToken}` } })

//             if (data.success) {
//                 toast.success(data.message)
//                 getAppointments()
//                 // after creating dashboard
//                 getDashData()
//             } else {
//                 toast.error(data.message)
//             }

//         } catch (error) {
//             toast.error(error.message)
//             console.log(error)
//         }

//     }

//     // Function to Mark appointment completed using API
//     const completeAppointment = async (appointmentId) => {

//         try {

//             const { data } = await axios.post(backendUrl + '/api/doctor/complete-appointment', { appointmentId }, { headers: { Authorization: `Bearer ${dToken}` } })

//             if (data.success) {
//                 toast.success(data.message)
//                 getAppointments()
//                 // Later after creating getDashData Function
//                 getDashData()
//             } else {
//                 toast.error(data.message)
//             }

//         } catch (error) {
//             toast.error(error.message)
//             console.log(error)
//         }

//     }

//     // Getting Doctor dashboard data using API
//     const getDashData = async () => {
//         try {

//             const { data } = await axios.get(`${backendUrl}/api/doctor/dashboard`, {
//                 headers: { Authorization: `Bearer ${dToken}` }
//             });



//             if (data.success) {
//                 setDashData(data.dashData)
//             } else {
//                 toast.error(data.message)
//             }

//         } catch (error) {
//             console.log(error)
//             toast.error(error.message)
//         }

//     }

//     const value = {
//         dToken, setDToken, backendUrl,
//         appointments,
//         getAppointments,
//         cancelAppointment,
//         completeAppointment,
//         dashData, getDashData,
//         profileData, setProfileData,
//         getProfileData,
//     }

//     return (
//         <DoctorContext.Provider value={value}>
//             {props.children}
//         </DoctorContext.Provider>
//     )


// }

// export default DoctorContextProvider


import { createContext, useState } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';

export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [dToken, setDToken] = useState(localStorage.getItem('dToken') ? localStorage.getItem('dToken') : '');
    const [appointments, setAppointments] = useState([]);
    const [dashData, setDashData] = useState(false);
    const [profileData, setProfileData] = useState(false);

    // Function to get appointments data
    const getAppointments = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/doctor/appointments`, {
                headers: {
                    Authorization: `Bearer ${dToken}`,
                },
            });
    
            console.log("API Response:", response.data);
    
            if (response.data.success) {
                if (Array.isArray(response.data.appointments)) {
                    setAppointments(response.data.appointments);
                    console.log("Appointments set successfully:", response.data.appointments);
                } else {
                    console.error("Unexpected appointments format:", response.data.appointments);
                }
            } else {
                toast.error("Failed to fetch appointments: " + response.data.message);
            }
        } catch (error) {
            console.error("Error in getAppointments:", error.response || error.message);
            if (error.response && error.response.status === 401) {
                toast.error("Unauthorized. Please login again.");
                setDToken('');
                localStorage.removeItem('dToken');
            } else {
                toast.error("Error fetching appointments");
            }
        }
    };
    

    // Function to get profile data
    const getProfileData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/doctor/profile', { 
                headers: { Authorization: `Bearer ${dToken}` } 
            });
            setProfileData(data.profileData);
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    // Function to cancel an appointment
    const cancelAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/doctor/cancel-appointment', { appointmentId }, { 
                headers: { Authorization: `Bearer ${dToken}` } 
            });
            if (data.success) {
                toast.success(data.message);
                getAppointments();
                getDashData(); // Refresh dashboard data after canceling appointment
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
            console.log(error);
        }
    };

    // Function to mark an appointment as completed
    const completeAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/doctor/complete-appointment', { appointmentId }, { 
                headers: { Authorization: `Bearer ${dToken}` } 
            });
            if (data.success) {
                toast.success(data.message);
                getAppointments();
                getDashData(); // Refresh dashboard data after completing appointment
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
            console.log(error);
        }
    };

    // Function to get dashboard data
    const getDashData = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/doctor/dashboard`, {
                headers: { Authorization: `Bearer ${dToken}` }
            });
            if (data.success) {
                setDashData(data.dashData);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
            console.log(error);
        }
    };

    const value = {
        dToken, setDToken, backendUrl,
        appointments,
        getAppointments,
        cancelAppointment,
        completeAppointment,
        dashData, getDashData,
        profileData, setProfileData,
        getProfileData,
    };

    return (
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    );
};

export default DoctorContextProvider;
