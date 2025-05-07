import { createContext, useCallback, useState } from "react";
import axios from "axios";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  axios.defaults.withCredentials = true;

  const [events, setEvents] = useState([]);

  const login = async (data) => {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}/auth/login`,
      data
    );
    localStorage.setItem("currentUser", JSON.stringify(res.data)); // Persistent storage
  };

  const logout = async () => {
    await axios.post(`${process.env.REACT_APP_API_URL}/auth/logout`);
    localStorage.removeItem("currentUser"); // Clear persistent storage
  };

  const deletePostImage = async (id) => {
    try {
      // Delete the images from Cloudinary
      await axios.post(`${process.env.REACT_APP_API_URL}/img/cloudinary/delete`, {
        public_ids: [id],
      });
    } catch (err) {
      console.error(err);
      alert("An error occurred while deleting images from Cloudinary");
    }
  };

  // const getText = (html) => {
  //   const doc = new DOMParser().parseFromString(html, "text/html");
  //   return doc.body.textContent;
  // };

  const getEvents = useCallback(async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/events`);
      const data = res.data;
      const formattedEvents = data.map((event) => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end),
      }));
      setEvents(formattedEvents); // Update the global events state
    } catch (err) {
      console.error(err);
      alert(err.response.data);
    }
  }, []); // Empty dependency array ensures the function is memoized

  return (
    <AppContext.Provider
      value={{ login, logout, deletePostImage, events, getEvents }}
    >
      {children}
    </AppContext.Provider>
  );
};
