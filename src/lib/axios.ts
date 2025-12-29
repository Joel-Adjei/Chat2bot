import axios from "axios";

const baseURL = import.meta.env.VITE_OPENAPI_BASEURL;
const apiKey = import.meta.env.VITE_API_KEY;

const useAxios = () =>
  axios.create({
    baseURL: baseURL,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
  });

export default useAxios;
