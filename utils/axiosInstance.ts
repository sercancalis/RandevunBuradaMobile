import axios from "axios";

export const mainService = axios.create({
  baseURL: "http://192.168.1.121:5278/api/",
  headers: {
    "Content-Type": "application/json",
    Accept: "*/*",
  },
});
