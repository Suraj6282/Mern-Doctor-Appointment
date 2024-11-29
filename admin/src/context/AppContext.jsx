import { createContext } from "react";


export const AppContext = createContext()

const AppContextProvider = (props) => {

    const currency = import.meta.env.VITE_CURRENCY
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    // Function to format the date eg. ( 20_01_2000 => 20 Jan 2000 )
    const slotDateFormat = (slotDate) => {
        try {
            const isCustomFormat = slotDate.includes("_"); // Check if it's in "20_01_2000" format
            if (isCustomFormat) {
                const dateArray = slotDate.split('_');
                return `${dateArray[0]} ${months[Number(dateArray[1]) - 1]} ${dateArray[2]}`;
            }
    
            // Parse standard or ISO date strings
            const date = new Date(slotDate);
            if (isNaN(date)) {
                throw new Error("Invalid date");
            }
            return date.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            });
        } catch (error) {
            console.error("Error formatting date:", slotDate, error.message);
            return "Invalid date";
        }
    };
    

    // Function to calculate the age eg. ( 20_01_2000 => 24 )
    const calculateAge = (dob) => {
        const today = new Date()
        const birthDate = new Date(dob)
        let age = today.getFullYear() - birthDate.getFullYear()
        return age
    }

    const value = {
        backendUrl,
        currency,
        slotDateFormat,
        calculateAge,
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )

}

export default AppContextProvider