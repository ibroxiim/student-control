// axios.js
import axios from "axios";

const instance = axios.create({
  baseURL: "https://kuro001.pythonanywhere.com/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
