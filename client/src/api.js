import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000", // Replace "5000" with the port your backend runs on
});

export default API;
