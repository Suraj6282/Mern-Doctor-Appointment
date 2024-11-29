import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import mongoose from "mongoose";

// API for doctor Login 
// const loginDoctor = async (req, res) => {

//     try {

//         const { email, password } = req.body
//         const user = await doctorModel.findOne({ email })

//         if (!user) {
//             return res.json({ success: false, message: "Invalid credentials" })
//         }

//         const isMatch = await bcrypt.compare(password, user.password)

//         if (isMatch) {
//             const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
//             res.json({ success: true, token })
//         } else {
//             res.json({ success: false, message: "Invalid credentials" })
//         }


//     } catch (error) {
//         console.log(error)
//         res.json({ success: false, message: error.message })
//     }
// }

const loginDoctor = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Hardcoded email and password for testing
//     const hardcodedEmail = "testdoctor@example.com";
//     const hardcodedPassword = "password123";

//     if (email !== hardcodedEmail) {
//       return res.json({ success: false, message: "Invalid credentials" });
//     }

//     // You would usually hash the hardcoded password if stored in the database
//     const isMatch = password === hardcodedPassword;

//     if (isMatch) {
//       const token = jwt.sign({ id: "hardcodedDoctorId" }, process.env.JWT_SECRET);
//       res.json({ success: true, token });
//     } else {
//       res.json({ success: false, message: "Invalid credentials" });
//     }
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: error.message });
//   }

try {

    const { email, password } = req.body
    const user = await doctorModel.findOne({ email })

    if (!user) {
        return res.json({ success: false, message: "Invalid credentials" })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (isMatch) {
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
        res.json({ success: true, token })
    } else {
        res.json({ success: false, message: "Invalid credentials" })
    }


} catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
}
}


// API to get doctor appointments for doctor panel
const appointmentsDoctor = async (req, res) => {
    try {
        const { docId } = req.user; // Use docId from req.user (set by authDoctor middleware)
        console.log("Fetching appointments for doctor ID:", docId); // Debugging: Log docId

        // Fetch appointments for the doctor
        const appointments = await appointmentModel.find({ docId });

        if (appointments.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No appointments found for this doctor.",
            });
        }

        // Send response with appointments
        res.status(200).json({
            success: true,
            appointments,
        });
    } catch (error) {
        console.error("Error fetching doctor's appointments:", error.message);

        // Send error response
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching appointments. Please try again later.",
            errorDetails: process.env.NODE_ENV === "development" ? error.message : undefined, // Include error details only in development
        });
    }
};

// API to cancel appointment for doctor panel

const appointmentCancel = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.json({ success: false, message: 'No token provided' });
        }

        // Decode the token to extract the doctor's ID
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace with your JWT secret
        const docId = decoded.id;

        const { appointmentId } = req.body;

        console.log('Decoded Token:', decoded);
        console.log('docId:', docId, 'appointmentId:', appointmentId);

        const appointmentData = await appointmentModel.findById(appointmentId);

        if (!appointmentData) {
            return res.json({ success: false, message: 'Appointment not found' });
        }

        if (appointmentData.docId !== docId) {
            return res.json({ success: false, message: 'Invalid doctor for this appointment' });
        }

        // Update appointment status to cancelled
        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

        return res.json({ success: true, message: 'Appointment Cancelled' });
    } catch (error) {
        console.error('Error in appointmentCancel:', error);
        return res.json({ success: false, message: error.message });
    }
};

// API to mark appointment completed for doctor panel

const appointmentComplete = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.json({ success: false, message: 'No token provided' });
        }

        // Decode token to get doctor ID
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace with your JWT secret
        const docId = decoded.id;

        const { appointmentId } = req.body;

        console.log('Decoded Token:', decoded);
        console.log('docId:', docId, 'appointmentId:', appointmentId);

        const appointmentData = await appointmentModel.findById(appointmentId);

        if (!appointmentData) {
            return res.json({ success: false, message: 'Appointment not found' });
        }

        if (appointmentData.docId !== docId) {
            return res.json({ success: false, message: 'Invalid doctor for this appointment' });
        }

        // Update appointment status
        await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true });

        return res.json({ success: true, message: 'Appointment Completed' });
    } catch (error) {
        console.error('Error in appointmentComplete:', error);
        return res.json({ success: false, message: error.message });
    }
};


// API to get all doctors list for Frontend
const doctorList = async (req, res) => {
    try {

        const doctors = await doctorModel.find({}).select(['-password', '-email'])
        res.json({ success: true, doctors })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to change doctor availablity for Admin and Doctor Panel
const changeAvailablity = async (req, res) => {
    try {

        const { docId } = req.body

        const docData = await doctorModel.findById(docId)
        await doctorModel.findByIdAndUpdate(docId, { available: !docData.available })
        res.json({ success: true, message: 'Availablity Changed' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get doctor profile for  Doctor Panel
// const doctorProfile = async (req, res) => {
//     try {

//         const { docId } = req.body
//         const profileData = await doctorModel.findById(docId).select('-password')

//         res.json({ success: true, profileData })

//     } catch (error) {
//         console.log(error)
//         res.json({ success: false, message: error.message })
//     }
// }
const doctorProfile = async (req, res) => {
    try {
        console.log('Incoming Request to /api/doctor/profile');
        
        const { docId } = req.user;
        console.log('Extracted docId:', docId);

        if (!docId) {
            return res.status(400).json({ success: false, message: 'Doctor ID not found' });
        }

        const profileData = await doctorModel.findById(docId).select('-password');
        console.log('Profile Data:', profileData);

        if (!profileData) {
            return res.status(404).json({ success: false, message: 'Profile not found' });
        }

        res.json({ success: true, profileData });
    } catch (error) {
        console.error('Error in doctorProfile:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};



// API to update doctor profile data from  Doctor Panel
// const updateDoctorProfile = async (req, res) => {
//     try {

//         const { docId, fees, address, available } = req.body

//         await doctorModel.findByIdAndUpdate(docId, { fees, address, available })

//         res.json({ success: true, message: 'Profile Updated' })

//     } catch (error) {
//         console.log(error)
//         res.json({ success: false, message: error.message })
//     }
// }


const updateDoctorProfile = async (req, res) => {
    try {
        const { id: docId } = req.decoded; // Extract doctor ID from decoded token
        const { address, fees, about, available } = req.body;

        // Check if docId is available
        if (!docId) {
            return res.status(400).json({ success: false, message: 'Doctor ID is missing' });
        }

        // Check for missing required fields
        if (!address || !fees || !about || available === undefined) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        // Attempt to update the profile
        const updatedProfile = await doctorModel.findByIdAndUpdate(
            docId,
            { address, fees, about, available },
            { new: true } // Return the updated profile
        );

        // Check if the profile was found and updated
        if (!updatedProfile) {
            return res.status(404).json({ success: false, message: 'Doctor profile not found' });
        }

        // Return success with updated profile data
        res.json({
            success: true,
            message: 'Profile updated successfully',
            updatedProfile
        });
    } catch (error) {
        // Log error to the server
        console.error('Error updating profile:', error);

        // Return more detailed error message
        res.status(500).json({
            success: false,
            message: 'An error occurred while updating the profile',
            error: error.message // Return specific error message
        });
    }
};




// API to get dashboard data for doctor panel
// const doctorDashboard = async (req, res) => {
//     try {
//         console.log(req.body);
//         const { docId } = req.body

//         const appointments = await appointmentModel.find({ docId })

//         let earnings = 0

//         // appointments.map((item) => {
//         //     if (item.isCompleted || item.payment) {
//         //         earnings += item.amount
//         //     }
//         // })

//         appointments.forEach((item) => {
//             console.log('Appointment Item:', item);
//             if (item.isCompleted || item.payment) {
//                 earnings += item.amount;
//             }
//         });
        

//         let patients = []

//         appointments.map((item) => {
//             if (!patients.includes(item.userId)) {
//                 patients.push(item.userId)
//             }
//         })



//         const dashData = {
//             earnings,
//             appointments: appointments.length,
//             patients: patients.length,
//             latestAppointments: appointments.reverse()
//         }

//         res.json({ success: true, dashData })

//     } catch (error) {
//         console.log(error)
//         res.json({ success: false, message: error.message })
//     }
// }

const doctorDashboard = async (req, res) => {
    try {
        // Assuming docId comes from the authenticated user's context
        const { docId } = req.user; // Update this if docId is passed differently

        console.log('Doctor ID:', docId);

        const appointments = await appointmentModel.find({ docId });
        console.log('Appointments:', appointments);

        let earnings = 0;
        appointments.forEach((item) => {
            console.log('Appointment Item:', item);
            if (item.isCompleted || item.payment) {
                earnings += Number(item.amount); // Ensure amount is a number
            }
        });

        let patients = [];
        appointments.forEach((item) => {
            if (!patients.includes(item.userId)) {
                patients.push(item.userId);
            }
        });

        const dashData = {
            earnings,
            appointments: appointments.length,
            patients: patients.length,
            latestAppointments: [...appointments].reverse() // Avoid mutating the original array
        };

        res.json({ success: true, dashData });

    } catch (error) {
        console.error('Error in doctorDashboard:', error);
        res.json({ success: false, message: error.message });
    }
};


export {
    loginDoctor,
    appointmentsDoctor,
    appointmentCancel,
    doctorList,
    changeAvailablity,
    appointmentComplete,
    doctorDashboard,
    doctorProfile,
    updateDoctorProfile
}