import { useState } from "react";
import axios from "axios";

const NasaMedia = () => {
  // State to store the user's search input
  const [searchTerm, setSearchTerm] = useState("");

  // State to store the fetched media results
  const [media, setMedia] = useState([]);

  // State to track if data is currently being fetched (loading indicator)
  const [loading, setLoading] = useState(false);

  // State to store any error messages if the API request fails
  const [error, setError] = useState("");

  // State to handle cases where no results are found for the search
  const [noResults, setNoResults] = useState(false);

  // Debounce function to limit the number of API requests (delays execution)
  const debounce = (func, delay) => {
    let timer;
    return function (...args) {
      // Clear the previous timer on each call
      clearTimeout(timer);
      // Set a new timer that delays the function call by the given delay (e.g., 500ms)
      timer = setTimeout(() => func.apply(this, args), delay);
    };
  };

  // Function to search media based on the search term
  const searchMedia = async () => {
    if (searchTerm) {
      setLoading(true); // Show loading spinner
      setError(""); // Clear previous errors
      setNoResults(false); // Reset no results state

      try {
        // Make an API request to the backend, which fetches from NASA API
        const response = await axios.get(
          `http://localhost:5000/api/media?q=${searchTerm}`
        );
        // Set media data (fallback to an empty array if no results are returned)
        setMedia(response.data.collection.items || []);
        // Set noResults to true if no media items are returned
        if (response.data.collection.items.length === 0) {
          setNoResults(true);
        }
      } catch (error) {
        // Set an error message if the request fails
        setError("Error fetching media: " + error.message);
      } finally {
        setLoading(false); // Stop loading indicator
      }
    }
  };

  // Debounced version of the searchMedia function (limits frequent API calls)
  const debouncedSearch = debounce(searchMedia, 500);

  return (
    <div className="p-4 flex flex-col items-center">
      <h1 className="text-2xl font-bold">NASA Image and Video Library</h1>

      {/* Input field for the user to enter a search term */}
      <div className="mt-4 flex flex-col items-center">
        <input
          type="text"
          placeholder="Search for NASA Media"
          value={searchTerm} // Controlled input value from state
          onChange={(e) => {
            setSearchTerm(e.target.value); // Update searchTerm state as user types
            debouncedSearch(); // Trigger debounced search function
          }}
          className="p-2 border rounded w-64"
        />

        {/* Search button (though debounced search triggers as user types) */}
        <button
          onClick={searchMedia} // Manually trigger search on button click
          className=" p-2 bg-blue-500 text-white rounded w-64 mt-2"
        >
          Search NASA Media
        </button>

        {/* Suggestion text for users */}
        <p className="mt-2 italic text-gray-600">
          Enter "Mars", "Moons", or "Earth" to get NASA media.
        </p>
      </div>

      {/* Display loading message if the data is being fetched */}
      {loading && <p>Loading...</p>}

      {/* Display error message if there's an error in fetching media */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Display message if no results are found */}
      {noResults && <p>No media found for this search term.</p>}

      {/* Display fetched media in a grid */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        {/* Map through the first 10 media items and display them */}
        {media.slice(0, 10).map((item, index) => {
          // Extract media data (title, description, etc.) and media link (image/video URL)
          const mediaData = item.data && item.data[0] ? item.data[0] : null;
          const mediaType = mediaData?.media_type; // Type can be image, video, etc.
          const mediaLink =
            item.links && item.links[0] ? item.links[0].href : null;

          // Only render if mediaData and mediaLink exist
          return mediaData && mediaLink ? (
            <div
              key={mediaData.nasa_id || index} // Unique key for each media item
              className="border rounded bg-white flex flex-col items-center p-4"
            >
              {/* Display media title */}
              <h2 className="text-center font-semibold mb-2">
                {mediaData?.title || "Untitled"}{" "}
                {/* Fallback to 'Untitled' if no title */}
              </h2>

              {/* Render image or video based on the media type */}
              {mediaType === "image" ? (
                <img
                  src={mediaLink} // Display image
                  alt={mediaData.title}
                  className="rounded mb-2 w-full h-48 object-cover"
                />
              ) : mediaType === "video" ? (
                // Provide a clickable link to view the video
                <a
                  href={mediaLink} // Link to the video
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline mb-4 "
                >
                  Watch Video
                </a>
              ) : (
                <p>No media available</p> // Fallback message if no media is available
              )}

              <p className="mt-4 mb-4">
                <strong>Date Created:</strong> {mediaData.date_created || "N/A"}
              </p>
              <p className="mt-4">
                <strong>Description:</strong>{" "}
                {mediaData.description || "No description available."}
              </p>
            </div>
          ) : (
            // Fallback for incomplete media data
            <p key={index}>No media available</p>
          );
        })}
      </div>
    </div>
  );
};

export default NasaMedia;
