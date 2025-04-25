"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ExclamationCircleIcon,
  MapPinIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import Loader from "../_components/Loader";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  completed: "bg-green-100 text-green-800",
  inprogress: "bg-blue-100 text-blue-800",
};

const ReportsPage = () => {
  const [page, setPage] = useState(1);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMoreContent, setHasMoreContent] = useState(true);

  const [locationInput, setLocationInput] = useState("");
  const [statusInput, setStatusInput] = useState("");

  const [filterLocation, setFilterLocation] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const fetchReports = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        page: page.toString(),
        location: filterLocation,
        status: filterStatus,
      });

      const res = await fetch(`/api/fetchData?${query.toString()}`);
      const data = await res.json();
      setReports(data.result || []);
      setHasMoreContent(data.result.length === 10);
    } catch (err) {
      console.error("Fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [page, filterLocation, filterStatus]);

  const handleSearch = () => {
    setPage(1);
    setFilterLocation(locationInput);
    setFilterStatus(statusInput);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl flex justify-center font-bold mb-6 text-slate-700">Incident Reports</h1>

      <div className="flex flex-col md:flex-row gap-4 md:gap-5 p-5 mb-6 items-center">
        <input
          type="text"
          placeholder="Filter by Location"
          value={locationInput}
          onChange={(e) => setLocationInput(e.target.value)}
          className="shadow-sm p-3 block w-full md:w-1/3 text-sm border border-gray-300 rounded-md"
        />
        <input
          type="text"
          placeholder="Filter by Status"
          value={statusInput}
          onChange={(e) => setStatusInput(e.target.value)}
          className="shadow-sm p-3 block w-full md:w-1/3 text-sm border border-gray-300 rounded-md"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
        >
          Search
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <Loader />
        </div>
      ) : reports.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">No reports found.</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report, index) => (
              <div key={index} className="bg-white rounded-md shadow-md overflow-hidden">
                <div className="relative w-full h-32 md:h-40">
                  <Image
                    alt="Incident Image"
                    src={report.imgUrl}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-t-md"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/placeholder.png";
                    }}
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                    {report.incidentType}
                  </h2>
                  <p className="text-gray-600 mb-2 flex items-center gap-2">
                    <DocumentTextIcon className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">{report.reportType}</span>
                  </p>
                  <p className="text-gray-600 mb-2 flex items-center gap-2">
                    <MapPinIcon className="h-4 w-4 text-green-500" />
                    {report.location}
                  </p>
                  <p className="text-gray-800 text-sm mb-3 line-clamp-2">{report.report}</p>
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        statusColors[report.status?.toLowerCase() || "pending"]
                      }`}
                    >
                      {report.status}
                    </span>
                    {report.status?.toLowerCase() === "pending" && (
                      <ClockIcon className="h-5 w-5 text-yellow-500" />
                    )}
                    {report.status?.toLowerCase() === "complete" && (
                      <CheckCircleIcon className="h-5 w-5 text-green-500" />
                    )}
                    {report.status?.toLowerCase() === "inprogress" && (
                      <ClockIcon className="h-5 w-5 text-blue-500 animate-spin-slow" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {!loading && (
        <div className="mt-6 flex justify-center items-center gap-4">
          {page > 1 && (
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center gap-2"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              Previous
            </button>
          )}
          <span className="text-gray-600">Page {page}</span>
          {hasMoreContent && (
            <button
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center gap-2"
            >
              Next
              <ArrowRightIcon className="h-5 w-5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
