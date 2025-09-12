import axios from "axios";

const API_URL = "http://localhost:5000/api/timetable";

export const timetableService = {
  getTimetable: async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const res = await axios.get(`${API_URL}`, {
      headers: { Authorization: `Bearer ${user.token}` }
    });
    return res.data;
  }
};
