import axios from "axios";

const baseURL = import.meta.env.VITE_OPENAPI_BASEURL;

const useAxios = () =>
  axios.create({
    baseURL: baseURL,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_API}`,
    },
  });

export default useAxios;
