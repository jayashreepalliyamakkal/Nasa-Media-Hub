import { useState } from 'react'; // Importing useState to manage component state
import axios from 'axios'; // Importing axios to make HTTP requests

const Apod = () => {
    // State to store the selected date for the APOD query
    const [date, setDate] = useState(''); 
    
    // State to store the fetched APOD data
    const [apodData, setApodData] = useState(null); 

    // Function to fetch APOD data based on the selected date
    const fetchApodByDate = async () => {
        if (date) { // Ensure a date is selected before making the request
            const response = await axios.get(`http://localhost:5000/api/apod/?date=${date}`); // API request to the backend with the selected date
            setApodData(response.data); // Update the state with the fetched data
        }
    };

    return (
        <div className="p-4 flex flex-col items-center"> {/* Main container with padding and center alignment */}
            <h1 className="text-2xl font-bold">Astronomy Picture of the Day (APOD)</h1> {/* Title of the page */}
            
            <div className="mt-4 flex flex-col items-center"> {/* Input and button container */}
                {/* Date input field */}
                <input
                    type="date" // HTML5 date picker
                    max={new Date().toISOString().split("T")[0]} // Restrict selection to today or earlier
                    value={date} // Bound to date state
                    onChange={(e) => setDate(e.target.value)} // Update state when the date changes
                    className="p-2 border rounded w-64" // Styling for the input
                />
                {/* Button to trigger the APOD fetch */}
                <button onClick={fetchApodByDate} className=" p-2 bg-blue-500 text-white rounded w-64 mt-2">
                    Search APOD
                </button>
                <p className="mt-2 italic text-gray-600">Select a date to get the APOD.</p> {/* Instructional text */}
            </div>

            {/* Conditional rendering of the APOD data if available */}
            {apodData && (
                <div className="mt-4 text-center"> {/* APOD content container */}
                    <h2 className="text-xl font-semibold">{apodData.title}</h2> {/* Display APOD title */}
                    
                    {/* Media container: either an image or an iframe for videos */}
                    <div className="flex justify-center mt-2"> 
                        {apodData.media_type === 'image' ? ( 
                            <img src={apodData.url} alt={apodData.title} className="rounded-lg" /> // Display image if media type is "image"
                        ) : (
                            <iframe src={apodData.url} title={apodData.title} className="rounded-lg" /> // Display iframe if media type is "video"
                        )}
                    </div>
                    <p className='mt-2'>{apodData.explanation}</p> {/* Display APOD description */}
                </div>
            )}
        </div>
    );
};

export default Apod;
