import { createContext } from "react";
import axios from "axios";
import { API_URL } from "../apiPath";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  axios.defaults.withCredentials = true;

  const login = async (data) => {
    const res = await axios.post(`${API_URL}/auth/login`, data);
    localStorage.setItem("currentUser", JSON.stringify(res.data)); // Persistent storage
  };

  const logout = async () => {
    await axios.post(`${API_URL}/auth/logout`);
    localStorage.removeItem("currentUser"); // Clear persistent storage
  };

  const deletePostImage = async (id) => {
    try {
      // Delete the images from Cloudinary
      await axios.post("img/cloudinary/delete", {
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

  return (
    <AppContext.Provider value={{ login, logout, deletePostImage }}>
      {children}
    </AppContext.Provider>
  );
};
