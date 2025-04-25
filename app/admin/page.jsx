"use client";

import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const Page = () => {
  const [filterDate, setFilterDate] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [page, setPage] = useState(1);
  const [reports, setReports] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  const fetchDataForAdmin = async () => {
    try {
      const res = await fetch(
        `/api/dataForAdmin?page=${page}&filterLocation=${filterLocation}&filterDate=${filterDate}`
      );
      const data = await res.json();
      setReports(data.result);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      toast.error("Failed to fetch reports.");
    }
  };

  useEffect(() => {
    fetchDataForAdmin();
  }, [page]);

  const updateStatus = async (reportId, newStatus) => {
    const toastId = toast.loading("Updating status...");
    try {
      const res = await fetch("/api/updateStatus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportId, status: newStatus }),
      });

      if (!res.ok) throw new Error();

      toast.success("Status updated!", { id: toastId });
      fetchDataForAdmin();
    } catch (error) {
      toast.error("Failed to update status", { id: toastId });
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <Toaster />
      <h1 className="text-4xl font-bold text-center text-gray-800">Admin Dashboard</h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-center">
        <input
          type="text"
          placeholder="Filter by location"
          value={filterLocation}
          onChange={(e) => setFilterLocation(e.target.value)}
          className="shadow-md p-3 text-sm border border-gray-300 rounded-xl w-full md:w-1/3 focus:outline-blue-500"
        />
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="shadow-md p-3 text-sm border border-gray-300 rounded-xl w-full md:w-1/3 focus:outline-blue-500"
        />
        <button
          onClick={() => {
            setPage(1);
            fetchDataForAdmin();
          }}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-500 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition duration-300"
        >
          Apply Filters
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl shadow-md bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-indigo-50 text-indigo-700">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Location</th>
              <th className="p-3 text-left">Description</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {reports.map((report) => (
              <tr key={report.id} className="hover:bg-gray-50 transition">
                <td className="p-3">{report.reportUid}</td>
                <td className="p-3">{report.createdAt}</td>
                <td className="p-3">{report.location}</td>
                <td className="p-3">
                  {report.report.split(" ").slice(0, 30).join(" ")}
                  {report.report.split(" ").length > 30 ? "..." : ""}
                </td>
                <td className="p-3 capitalize">
                  <span
                    className={`px-2 py-1 p-5 rounded-full text-xs font-semibold ${
                      report.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : report.status === "in progress"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {report.status}
                  </span>
                </td>
                <td className="p-3">
                  <select
                    value={report.status}
                    onChange={(e) =>
                      updateStatus(report.reportUid, e.target.value)
                    }
                    className="px-2 py-1 border rounded-md text-sm bg-white shadow-sm focus:outline-blue-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="in progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 transition disabled:opacity-50"
        >
          Prev
        </button>
        <span className="font-semibold text-gray-600">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={page >= totalPages}
          className="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 transition disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Page;

