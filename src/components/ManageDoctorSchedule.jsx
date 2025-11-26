import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash, FaEdit, FaPlus } from "react-icons/fa";

export default function ManageDoctorSchedule() {
  const API_URL = import.meta.env.VITE_API_URL;

  const [doctors, setDoctors] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");

  const [form, setForm] = useState({
    id: null,
    doctor_id: "",
    day_of_week: "",
    start_time: "",
    end_time: "",
    break_start: "",
    break_end: ""
  });

  const days = [
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
  ];

  // Fetch doctors
  const fetchDoctors = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/doctor`);
      setDoctors(res.data.data);
    } catch (error) {
      console.error("Failed to fetch doctors:", error);
    }
  };

  // Fetch schedules
  const fetchSchedules = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/doctor-schedule`);
      setSchedules(res.data);
    } catch (error) {
      console.error("Failed to fetch schedules:", error);
    }
  };

  useEffect(() => {
    fetchDoctors();
    fetchSchedules();
  }, []);

  // Handle input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit create/update
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.doctor_id || !form.day_of_week || !form.start_time || !form.end_time) {
      alert("Please complete required fields");
      return;
    }

    try {
      if (form.id) {
        // update
        await axios.put(`${API_URL}/api/doctor-schedule/${form.id}`, form);
      } else {
        // create
        await axios.post(`${API_URL}/api/doctor-schedule`, form);
      }

      setForm({
        id: null,
        doctor_id: "",
        day_of_week: "",
        start_time: "",
        end_time: "",
        break_start: "",
        break_end: ""
      });

      fetchSchedules();
    } catch (error) {
      console.error("Failed to save schedule:", error);
    }
  };

  // Edit
  const handleEdit = (item) => {
    setForm({
      id: item.id,
      doctor_id: item.doctor_id,
      day_of_week: item.day_of_week,
      start_time: item.start_time,
      end_time: item.end_time,
      break_start: item.break_start || "",
      break_end: item.break_end || ""
    });
  };

  // Delete
  const handleDelete = async (id) => {
    if (!confirm("Delete this schedule?")) return;

    try {
      await axios.delete(`${API_URL}/api/doctor-schedule/${id}`);
      fetchSchedules();
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  };

  return (
    <div className="p-6 space-y-8">

      <h1 className="text-2xl font-bold">Manage Doctor Schedule</h1>

      {/* Filter by Doctor */}
      <div>
        <label className="font-semibold">Filter Doctor:</label>
        <select
          className="border p-2 ml-2 rounded"
          value={selectedDoctor}
          onChange={(e) => setSelectedDoctor(e.target.value)}
        >
          <option value="">All Doctors</option>
          {doctors.map((doc) => (
            <option key={doc.id} value={doc.id}>
              {doc.name}
            </option>
          ))}
        </select>
      </div>

      {/* Form Input */}
      <div className="border p-4 rounded shadow-md">
        <h2 className="font-semibold mb-3">
          {form.id ? "Edit Schedule" : "Add New Schedule"}
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Doctor */}
          <div>
            <label>Doctor</label>
            <select
              name="doctor_id"
              className="border p-2 rounded w-full"
              value={form.doctor_id}
              onChange={handleChange}
              required
            >
              <option value="">Select Doctor</option>
              {doctors.map((doc) => (
                <option key={doc.id} value={doc.id}>{doc.name}</option>
              ))}
            </select>
          </div>

          {/* Day of Week */}
          <div>
            <label>Day</label>
            <select
              name="day_of_week"
              className="border p-2 rounded w-full"
              value={form.day_of_week}
              onChange={handleChange}
              required
            >
              <option value="">Select Day</option>
              {days.map((d, index) => (
                <option key={index} value={index}>{d}</option>
              ))}
            </select>
          </div>

          {/* Start */}
          <div>
            <label>Start Time</label>
            <input
              type="time"
              name="start_time"
              className="border p-2 rounded w-full"
              value={form.start_time}
              onChange={handleChange}
              required
            />
          </div>

          {/* End */}
          <div>
            <label>End Time</label>
            <input
              type="time"
              name="end_time"
              className="border p-2 rounded w-full"
              value={form.end_time}
              onChange={handleChange}
              required
            />
          </div>

          {/* Break Start */}
          <div>
            <label>Break Start</label>
            <input
              type="time"
              name="break_start"
              className="border p-2 rounded w-full"
              value={form.break_start}
              onChange={handleChange}
            />
          </div>

          {/* Break End */}
          <div>
            <label>Break End</label>
            <input
              type="time"
              name="break_end"
              className="border p-2 rounded w-full"
              value={form.break_end}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700"
          >
            <FaPlus /> {form.id ? "Update" : "Save"}
          </button>

        </form>
      </div>

      {/* Table */}
      <div className="border p-4 rounded shadow-md">
        <h2 className="font-semibold mb-3">Schedules</h2>

        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Doctor</th>
              <th className="p-2 border">Day</th>
              <th className="p-2 border">Work Time</th>
              <th className="p-2 border">Break</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>

          <tbody>
            {schedules
              .filter((s) =>
                selectedDoctor ? s.doctor_id == selectedDoctor : true
              )
              .map((item) => (
                <tr key={item.id} className="border">
                  <td className="p-2 border">{item.Doctor?.name}</td>
                  <td className="p-2 border">{days[item.day_of_week]}</td>
                  <td className="p-2 border">
                    {item.start_time} - {item.end_time}
                  </td>
                  <td className="p-2 border">
                    {item.break_start && item.break_end
                      ? `${item.break_start} - ${item.break_end}`
                      : "-"}
                  </td>
                  <td className="p-2 border flex gap-3">
                    <button
                      className="text-blue-600"
                      onClick={() => handleEdit(item)}
                    >
                      <FaEdit />
                    </button>

                    <button
                      className="text-red-600"
                      onClick={() => handleDelete(item.id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {schedules.length === 0 && (
          <p className="text-center text-gray-500 mt-4">No schedules yet.</p>
        )}
      </div>
    </div>
  );
}
