import axios from "axios";

const API_URL = "http://localhost:5000/api/attendance";

export const attendanceService = {
  markAttendance: async (status) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const res = await axios.post(`${API_URL}/mark`, { status }, {
      headers: { Authorization: `Bearer ${user.token}` }
    });
    return res.data;
  },

  getAttendance: async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const res = await axios.get(`${API_URL}`, {
      headers: { Authorization: `Bearer ${user.token}` }
    });
    return res.data;
  }
};
