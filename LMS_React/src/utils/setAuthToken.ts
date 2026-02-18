import jwtAxios from "./axios";

export const setAuthToken = (token: string | null) => {
  if (token) {
    jwtAxios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete jwtAxios.defaults.headers.common["Authorization"];
  }
};
