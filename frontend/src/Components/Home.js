import { useEffect, useState } from 'react';
import axios from 'axios';

const Home = () => {
    // State to store multiple APOD (Astronomy Picture of the Day) entries
    const [apod, setApod] = useState([]);
    
    // State to store media items from the NASA Media Library
    const [media, setMedia] = useState([]);
    
    // Loading state to indicate when data is being fetched
    const [loading, setLoading] = useState(true);

    // Fetch data when the component is mounted (on load)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const currentDate = new Date(); // Get today's date
                const apodData = []; // Initialize an empty array to store APODs

                // Fetch the APOD data for the last 5 days
                for (let i = 0; i < 5; i++) {
                    const date = new Date(currentDate); // Create a copy of the current date
                    date.setDate(currentDate.getDate() - i); // Adjust the date by subtracting days
                    const formattedDate = date.toISOString().split('T')[0]; // Format date as 'YYYY-MM-DD'
                    
                    // Send a GET request to fetch APOD for each specific date
                    const response = await axios.get(`http://localhost:5000/api/apod?date=${formattedDate}`);
                    apodData.push(response.data); // Push each fetched APOD to the array
                }

                setApod(apodData); // Update state with the fetched APODs

                // Fetch the latest 5 media items related to 'Mars', 'Moon', 'Earth'
                const mediaResponse = await axios.get('http://localhost:5000/api/media?q=Mars Moon Earth&media_type=image');
                console.log("Media Response:", mediaResponse.data); // Log the media response for debugging
                setMedia(mediaResponse.data.collection.items.slice(0, 5) || []); // Set only the first 5 media items
            } catch (error) {
                // Log an error if the fetch fails
                console.error('Error fetching data:', error.response ? error.response.data : error.message);
            } finally {
                // Set loading state to false after all data is fetched
                setLoading(false);
            }
        };

        fetchData(); // Trigger data fetching on component mount
    }, []); // Empty dependency array means it only runs once when the component loads

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-5 underline underline-offset-2">Most Recent</h1>
            <h1 className="text-2xl font-semibold">Astronomy Picture of the Day</h1>
           
            {loading ? ( // Conditional rendering: Show loading indicator if data is being fetched
                <div className="flex justify-center items-center h-72">
                    <div className="loader">Loading...</div> {/* You can customize this loader with CSS or an animation */}
                </div>
            ) : apod.length > 0 ? ( // If APOD data is available, display it
                <div className="flex justify-around overflow-x-auto mt-4 space-x-4">
                    {/* Horizontal scroll container for displaying APOD thumbnails */}
                    {apod.map((item, index) => (
                        <div key={index} className="flex-none w-64 h-72 bg-white rounded-lg shadow-md"> {/* Fixed width for thumbnails */}
                            <h2 className="text-lg mb-2 h-12 overflow-hidden text-ellipsis whitespace-nowrap">{item.title}</h2> {/* Display APOD title */}
                            {/* Conditional rendering for image or video based on media_type */}
                            {item.media_type === 'image' ? (
                                <img 
                                    src={item.url} 
                                    alt={item.title} 
                                    className="rounded-lg w-full h-48 object-cover" 
                                />
                            ) : item.media_type === 'video' ? (
                                <iframe
                                    src={item.url}
                                    title={item.title}
                                    className="rounded-lg w-full h-48"
                                    allowFullScreen
                                />
                            ) : (
                                <p>Unsupported media type.</p> // Fallback for unsupported media types
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <p>No APOD data found.</p> // Display if no APOD data is available
            )}

            <h1 className="text-2xl font-semibold mt-8">NASA Media Library</h1>

            {loading ? ( // Show loading spinner while fetching media data
                <div className="flex justify-center items-center h-72">
                    <div className="loader">Loading...</div>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-4 mt-4">
                    {media.length > 0 ? ( // If media data is available, display it
                        media.map((item) => {
                            const mediaData = item.data ? item.data[0] : null; // Access the first element of data array
                            const mediaType = mediaData?.media_type; // Get media type (image or video)
                            const mediaLink = item.links && item.links.length > 0 ? item.links[0].href : null; // Access the first link

                            return (
                                <div key={mediaData?.nasa_id} className="border rounded p-4 w-full h-72 bg-white shadow-md">
                                    <h2 className="text-lg mb-2 h-12 overflow-hidden text-ellipsis whitespace-nowrap">{mediaData?.title || 'Untitled'}</h2>
                                    
                                    {/* Conditional rendering for image or video */}
                                    {mediaType === 'image' && mediaLink ? (
                                        <img 
                                            src={mediaLink} 
                                            alt={mediaData?.title || 'No Title Available'} 
                                            className="rounded w-full h-48 object-cover" 
                                        />
                                    ) : mediaType === 'video' && mediaLink ? (
                                        <iframe
                                            src={mediaLink}
                                            title={mediaData?.title || 'No Title Available'}
                                            className="rounded w-full h-48"
                                            allowFullScreen
                                        />
                                    ) : (
                                        <p>No media available.</p> // Fallback for missing media
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <p>No media found.</p> // Display if no media data is available
                    )}
                </div>
            )}
        </div>
    );
};

export default Home;
