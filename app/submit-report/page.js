'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Navbar from '../_components/Navbar';
import { runWithImage } from '../configs/aiGenration';
import { ArrowRight } from 'lucide-react';
import axios from 'axios';
import { useUser } from '@clerk/nextjs';
import { v4 as uuidv4 } from 'uuid';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Page = () => {
  // Form state
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [incidentType, setIncidentType] = useState('');
  const [location, setLocation] = useState('');
  const [report, setReport] = useState('');
  const [reportType, setReportType] = useState('');
  const[imgUrl, setImgUrl] = useState('');
  const[reportStatus, setReportStatus] = useState('pending')
 
  
  // Status states
  const [processing, setProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isImageVerified, setIsImageVerified] = useState(false);
  const [imageVerifiedMessage, setImageVerifiedMessage] = useState('');
  
  // ID states
  const [reportId, setReportId] = useState(null);
  const [uid, setUid] = useState(null);
  
  // UI states
  const [showDialog, setShowDialog] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const { user } = useUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress || '';

  // Generate UUID on component mount
  useEffect(() => {
    if (!uid) {
      setUid(uuidv4());
    }
    setIsMounted(true);
  }, [uid]);

  // Fetch report ID based on user email
  const fetchReportId = useCallback(async (email) => {
    if (!email) {
      console.warn("No email provided to fetch report ID.");
      return null;
    }
    
    try {
      const response = await fetch(`/api/fetchId?email=${email}`);
      if (!response.ok) {
        console.error(`Failed to fetch report ID. Status: ${response.status}`);
        return null;
      }
      
      const data = await response.json();
      if (data?.result?.[0]?.id) {
        console.log("Fetched report ID:", data.result[0].id);
        return data.result[0].id;
      } else {
        console.warn("No user found with this email to fetch report ID.");
        return null;
      }
    } catch (error) {
      console.error("Error fetching report ID:", error);
      return null;
    }
  }, []);

  // Initialize report ID on mount
  useEffect(() => {
    const getReportIdOnMount = async () => {
      const id = await fetchReportId(userEmail);
      setReportId(id);
    };

    if (userEmail) {
      getReportIdOnMount();
    }
  }, [userEmail, fetchReportId]);

  // Handle image file selection
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file?.type.startsWith('image/')) {
      setSelectedImage(URL.createObjectURL(file));
      setImageFile(file);
      setErrorMessage('');
      setIsImageVerified(false);
      setImageVerifiedMessage('');
    } else {
      setSelectedImage(null);
      setImageFile(null);
      setErrorMessage('Please upload a valid image (PNG, JPG, JPEG, or GIF).');
      setIsImageVerified(false);
      setImageVerifiedMessage('');
    }
  };

  // Convert image to base64
  const convertToBase64 = useCallback((file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  }, []);

  // Process image with AI
  const sendDataToAi = async () => {
    if (!imageFile) {
      setErrorMessage('Please upload an image first!');
      return;
    }

    setProcessing(true);
    setErrorMessage('');
    setIsImageVerified(false);
    setImageVerifiedMessage('');

    try {
      // Process with AI
      const base64Data = await convertToBase64(imageFile);
      const aiResponse = await runWithImage(base64Data);

      if (aiResponse?.reason) {
        alert(`This image is inappropriate: ${aiResponse.reason}`);
        setImageFile(null);
        setSelectedImage(null);
        return;
      }

      // Upload to Cloudinary
      const formData = new FormData();
      formData.append('file', imageFile);
      formData.append('upload_preset', 'FirstCloud');
      formData.append('cloud_name', 'dg4upid0d');

      const cloudinaryRes = await fetch(
        `https://api.cloudinary.com/v1_1/dg4upid0d/image/upload`,
        { method: 'POST', body: formData }
      );

      if (!cloudinaryRes.ok) {
        const cloudinaryError = await cloudinaryRes.json();
        setErrorMessage(`Failed to upload image: ${cloudinaryError.error?.message || cloudinaryRes.statusText}`);
        return;
      }

      const cloudinaryData = await cloudinaryRes.json();
      const imageUrl = cloudinaryData.secure_url;

      setImgUrl(imageUrl);
      console.log('Image uploaded to Cloudinary:', imageUrl);

      // Update form with AI results
      setIncidentType(aiResponse.incidentType || '');
      setLocation(aiResponse.location || '');
      setReport(aiResponse.report || '');
      setReportType(aiResponse.reportType || '');

      setIsImageVerified(true);
      setImageVerifiedMessage('✅ Image verified successfully! Preparing your form...');
      setTimeout(() => setImageVerifiedMessage(''), 4000);
    } catch (error) {
      console.error('Error during AI processing or image upload:', error);
      setErrorMessage('Something went wrong during image processing. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  // Submit form data
  const submitForm = async (e) => {
    if (e) e.preventDefault();
    
    if (!userEmail) {
      setErrorMessage("User authentication is required to submit the form.");
      return;
    }
    
    if (!isImageVerified) {
      setErrorMessage("Please verify the image first.");
      return;
    }
    
    if (!reportId) {
      setErrorMessage("Failed to retrieve report ID. Please try again.");
      return;
    }

    try {
      const response = await axios.post("/api/saveForm", {
        reportId,
        imageUrl: selectedImage, // Using the Cloudinary URL if available, else the local preview
        incidentType,
        location,
        report,
        reportType,
        uid,
        imgUrl,
        reportStatus,
      });

      console.log("Form submitted successfully:", response.data);
      
      // Reset form
      setSelectedImage(null);
      setImageFile(null);
      setIncidentType('');
      setLocation('');
      setReport('');
      setReportType('');
      setIsImageVerified(false);
      setImageVerifiedMessage('');
      setErrorMessage('');
      
      // Show success dialog
      setShowDialog(true);
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrorMessage("Failed to submit the form. Please try again.");
    }
  };

  // Copy UID to clipboard
  const copyToClipboard = () => {
    if (isMounted) {
      navigator.clipboard.writeText(uid);
    }
  };

  // Form input fields configuration
  const formFields = [
    { label: 'Incident Type', value: incidentType, setter: setIncidentType },
    { label: 'Location (manually)', value: location, setter: setLocation },
    { label: 'Report Type', value: reportType, setter: setReportType },
  ];

  return (
    <div className="text-gray-100">
      <Navbar />

      <main className="flex flex-col items-center justify-center px-6 md:px-12 mt-24 max-w-7xl mx-auto">
        <header className="text-center space-y-3 mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-600">
            Report Incident
          </h1>
          <h2 className="text-3xl md:text-5xl font-semibold text-blue-400">
            Protect Identity
          </h2>
        </header>

        <section className="bg-gray-800 rounded-3xl shadow-xl w-full max-w-5xl p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border-2 border-red-600 rounded-xl bg-red-50 p-6 text-center">
              <h3 className="text-3xl font-semibold text-red-700">Emergency</h3>
              <p className="mt-2 text-red-600 font-medium">Immediate response required</p>
            </div>
            <div className="border-2 border-yellow-600 rounded-xl bg-yellow-50 p-6 text-center">
              <h3 className="text-3xl font-semibold text-yellow-700">Warning</h3>
              <p className="mt-2 text-yellow-600 font-medium">Caution advised</p>
            </div>
          </div>

          <label
            htmlFor="dropzone-file"
            className={`flex flex-col items-center justify-center h-64 border-4 border-dashed rounded-2xl cursor-pointer transition-colors duration-300 ${
              errorMessage ? 'border-red-500 bg-red-100' : 'border-gray-400 bg-gray-900 hover:bg-gray-700'
            }`}
          >
            <div className="flex flex-col items-center justify-center pt-6 pb-8 text-gray-400">
              <svg
                className="w-12 h-12 mb-6 animate-bounce text-gray-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
              </svg>
              <p className="text-lg font-semibold">Click to upload or drag and drop</p>
              <p className="text-sm text-gray-500 mt-1">PNG, JPG, JPEG, or GIF</p>
            </div>
            <input
              id="dropzone-file"
              type="file"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>

          {errorMessage && (
            <p className="text-red-400 text-center font-medium animate-fadeIn">{errorMessage}</p>
          )}

          {selectedImage && (
            <div className="flex justify-center mt-6">
              <img
                src={selectedImage}
                alt="Preview"
                className="max-h-72 rounded-2xl border-4 border-gray-700 shadow-lg"
              />
            </div>
          )}

          <button
            onClick={sendDataToAi}
            disabled={processing}
            className={`w-full py-3 rounded-xl font-semibold text-white transition-colors duration-300 ${
              processing ? 'bg-blue-400 cursor-wait' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {processing ? 'Generating Report...' : 'Generate Report with AI ✨'}
          </button>

          {imageVerifiedMessage && (
            <div className="flex items-center justify-center gap-3 bg-green-900 bg-opacity-80 border border-green-500 text-green-300 px-6 py-3 rounded-xl font-medium animate-fadeInOut">
              <svg
                className="w-6 h-6 animate-spin text-green-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                <path d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <span>{imageVerifiedMessage}</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={submitForm}>
            {formFields.map(({ label, value, setter }) => (
              <div key={label}>
                <label className="block mb-2 text-sm font-semibold text-gray-300">{label}</label>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  disabled={!isImageVerified}
                  required
                  className="w-full p-4 rounded-xl bg-gray-900 text-gray-100 border border-gray-700 focus:border-blue-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition"
                />
              </div>
            ))}

            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-300">Report</label>
              <textarea
                rows={5}
                value={report}
                onChange={(e) => setReport(e.target.value)}
                disabled={!isImageVerified}
                className="w-full p-4 rounded-xl bg-gray-900 text-gray-100 border border-gray-700 focus:border-blue-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition"
              />
            </div>

            <div className="flex items-center justify-center">
              <button
                type="submit"
                className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-semibold rounded-lg shadow-lg hover:from-blue-700 hover:to-blue-900 hover:scale-105 transition-all duration-300"
              >
                Submit Report
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>
          </form>
        </section>
      </main>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
  <DialogContent className="bg-gray-900 border border-gray-700 text-gray-200 max-w-md mx-auto rounded-2xl shadow-2xl p-6">
    <DialogHeader>
      <DialogTitle className="text-2xl font-bold text-blue-400">🎉 Your Report ID</DialogTitle>
      <DialogDescription asChild>
        <div className="mt-4">
          <div className="flex flex-col items-center gap-4">
            <div className="text-xl font-mono text-green-400">{uid}</div>
            {isMounted && (
              <button
                onClick={copyToClipboard}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-300 shadow-md"
              >
                📋 Copy to Clipboard
              </button>
            )}
          </div>
          <div className="mt-6 text-sm text-gray-400 text-center">
            Keep this ID safe. You'll need it for future reference.
          </div>
        </div>
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>
  
    </div>
  );
};

export default Page;




//Note:DialogDescription component default mein ek <p> tag render karta hai
//Lekin aapne uske andar <h1> tags daal rakhe hain
//HTML rules ke hisaab se, <h1> kabhi bhi <p> ke andar nahin ho sakta!

//Solution kya hai:

//DialogDescription mein asChild prop add karein. Isse woh apna default <p> tag render nahin karega
//Ek pure <div> container ko child ki tarah pass karein
//Saare <h1> tags ko <div> tags mein convert karein



//Note: handled asynchronus state update using useCallback