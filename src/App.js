/* global __app_id, __firebase_config, __initial_auth_token */ // These are no longer used but kept as a comment for context
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js'; // Import Supabase client

// --- SUPABASE CONFIGURATION ---
// IMPORTANT: These are your actual Supabase project URL and Public Anon Key.
// They have been updated based on your last input.
const SUPABASE_URL = 'https://gsvwaketebaysumqbwmx.supabase.co'; // Example: 'https://abcdefg.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdzdndha2V0ZWJheXN1bXFid214Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxNTY5NTAsImV4cCI6MjA2NTczMjk1MH0.31aG_BNCcE8vn_nwZ_XXNohsF_CuXXMYNWsTvVNWAAY'; // Example: 'eyJhbGciOiJIUzI1NiI...[your public anon key]'
// --- END SUPABASE CONFIGURATION ---

// Initialize Supabase client
// This client will be used to interact with your Supabase database.
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Define BookingForm component
function BookingForm({ userId, isReady, setMessage }) {
  // Form state variables
  const [fromStation, setFromStation] = useState('');
  const [toStation, setToToStation] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [whatsAppNumber, setWhatsAppNumber] = useState('');
  const [paymentScreenshot, setPaymentScreenshot] = useState(null); // Stores the File object

  // Handle file input change
  const handleScreenshotChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPaymentScreenshot(e.target.files[0]);
    } else {
      setPaymentScreenshot(null);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); // Clear previous messages

    if (!isReady) {
      setMessage("Application not ready. Please wait or refresh.");
      return;
    }

    if (!fromStation || !toStation || !mobileNumber || !email) {
      setMessage('Please fill in all required fields (From, To, Mobile, Email).');
      return;
    }

    // In a real application, you would upload the paymentScreenshot file
    // to Supabase Storage here and get its URL. For this example,
    // we'll just store its name if selected.
    const screenshotFileName = paymentScreenshot ? paymentScreenshot.name : 'No screenshot attached';

    try {
      // Insert data into the 'trainBookings' table in Supabase
      // Make sure you create a 'trainBookings' table in your Supabase dashboard
      const { data, error } = await supabase
        .from('trainBookings') // Replace with your actual table name if different
        .insert([
          {
            fromStation: fromStation,
            toStation: toStation,
            mobileNumber: mobileNumber,
            email: email,
            whatsAppNumber: whatsAppNumber,
            paymentScreenshotInfo: screenshotFileName, // Storing filename, in real app would be URL
            // Supabase automatically adds 'created_at' timestamp
            user_id: userId, // Store the generated userId
          },
        ]);

      if (error) {
        throw error;
      }

      setMessage('Your booking request has been submitted successfully! We will process it shortly.');
      // Clear form fields after successful submission
      setFromStation('');
      setToToStation('');
      setMobileNumber('');
      setEmail('');
      setWhatsAppNumber('');
      setPaymentScreenshot(null);
      // Reset file input display
      if (e.target.elements.paymentScreenshot) {
        e.target.elements.paymentScreenshot.value = '';
      }

    } catch (error) {
      console.error("Error submitting booking:", error.message);
      setMessage(`Failed to submit booking: ${error.message}`);
    }
  };

  // Placeholder QR Code URL (replace with actual payment QR code image)
  const qrCodeUrl = "https://placehold.co/200x200/A0A0A0/FFFFFF?text=Scan+to+Pay";

  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-md border border-indigo-200">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-center text-indigo-800 mb-6">
        Get the Most Confirmed Ticket at Minimal Charges
      </h1>
      <p className="text-center text-gray-600 mb-8">
        Charges like ₹100-₹200 depending on ticket difficulty. We also provide better suggestions on which waitlisted ticket to book. Fill out the form below, pay via QR code, and attach your payment screenshot!
      </p>

      {userId && (
        <p className="text-sm text-gray-500 text-center mb-4">
          Your User ID: <span className="font-semibold text-indigo-600 break-words">{userId}</span>
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="fromStation" className="block text-sm font-medium text-gray-700 mb-1">
            From Station <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="fromStation"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
            placeholder="e.g., Mumbai CST"
            value={fromStation}
            onChange={(e) => setFromStation(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="toStation" className="block text-sm font-medium text-gray-700 mb-1">
            To Station <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="toStation"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
            placeholder="e.g., Delhi NDLS"
            value={toStation}
            onChange={(e) => setToToStation(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 mb-1">
            Mobile Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="mobileNumber"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
            placeholder="e.g., 9876543210"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
            placeholder="e.g., your.email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="whatsAppNumber" className="block text-sm font-medium text-gray-700 mb-1">
            WhatsApp Number (Optional)
          </label>
          <input
            type="tel"
            id="whatsAppNumber"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
            placeholder="e.g., 9876543210 (if different from Mobile)"
            value={whatsAppNumber}
            onChange={(e) => setWhatsAppNumber(e.target.value)}
          />
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <h2 className="text-xl font-semibold text-indigo-700 mb-3">Payment Details</h2>
          <p className="text-gray-600 text-sm mb-4">
            Please make a payment of <span className="font-bold text-green-600">₹[Small Charge Amount]</span> to the QR code below.
            This is a placeholder for your actual payment QR code.
          </p>
          <div className="flex justify-center mb-6">
            <img src={qrCodeUrl} alt="Payment QR Code" className="w-48 h-48 rounded-lg shadow-md border border-gray-200 object-cover" />
          </div>

          <label htmlFor="paymentScreenshot" className="block text-sm font-medium text-gray-700 mb-1">
            Attach Payment Screenshot
          </label>
          <input
            type="file"
            id="paymentScreenshot"
            accept="image/*"
            className="mt-1 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-indigo-50 file:text-indigo-700
              hover:file:bg-indigo-100 transition duration-150 ease-in-out"
            onChange={handleScreenshotChange}
          />
          {paymentScreenshot && (
            <p className="text-xs text-gray-500 mt-2">Selected file: {paymentScreenshot.name}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md font-semibold text-lg
            hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
            transition duration-200 ease-in-out shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          disabled={!isReady}
        >
          Submit Booking Request
        </button>
      </form>

      {/* Disclaimer Section */}
      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg text-sm">
        <h3 className="font-bold text-base mb-2">Important Disclaimer:</h3>
        <p className="mb-2">
          We are **NOT** directly connected to IRCTC or act as an authorized agent. This service is designed to help you with train ticket information and predictions.
        </p>
        <p className="mb-2">
          All risks associated with booking and confirmation are entirely yours. We only try to provide helpful suggestions and predictions based on available data.
        </p>
        <p className="font-semibold">
          There is **NO 100% GUARANTEE** for any confirmation, even with our predictions. Waitlist and ticketing depend on various factors such as railway quotas, addition of extra coaches, last-minute cancellations, and dynamic policies. Please continue at your own risk.
        </p>
      </div>
    </div>
  );
}

// Define PNRPredictionForm component
function PNRPredictionForm({ userId, isReady, setMessage }) {
  const [pnrNumber, setPnrNumber] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [paymentScreenshot, setPaymentScreenshot] = useState(null); // Stores the File object

  // Handle file input change
  const handleScreenshotChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPaymentScreenshot(e.target.files[0]);
    } else {
      setPaymentScreenshot(null);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); // Clear previous messages

    if (!isReady) {
      setMessage("Application not ready. Please wait or refresh.");
      return;
    }

    if (!pnrNumber || !mobileNumber) {
      setMessage('Please fill in both PNR Number and Mobile Number.');
      return;
    }

    const screenshotFileName = paymentScreenshot ? paymentScreenshot.name : 'No screenshot attached';

    try {
      // Insert data into the 'pnrPredictions' table in Supabase
      // Make sure you create a 'pnrPredictions' table in your Supabase dashboard
      const { data, error } = await supabase
        .from('pnrPredictions') // Replace with your actual table name if different
        .insert([
          {
            pnrNumber: pnrNumber,
            mobileNumber: mobileNumber,
            paymentScreenshotInfo: screenshotFileName,
            // Supabase automatically adds 'created_at' timestamp
            user_id: userId, // Store the generated userId
          },
        ]);

      if (error) {
        throw error;
      }

      setMessage('Your PNR prediction request has been submitted successfully! We will get back to you shortly.');
      // Clear form fields after successful submission
      setPnrNumber('');
      setMobileNumber('');
      setPaymentScreenshot(null);
      // Reset file input display
      if (e.target.elements.paymentScreenshot) {
        e.target.elements.paymentScreenshot.value = '';
      }

    } catch (error) {
      console.error("Error submitting PNR prediction request:", error.message);
      setMessage(`Failed to submit PNR prediction request: ${error.message}`);
    }
  };

  // Placeholder QR Code URL (replace with actual payment QR code image)
  const qrCodeUrl = "https://placehold.co/200x200/A0A0A0/FFFFFF?text=Scan+to+Pay";

  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-md border border-indigo-200">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-center text-indigo-800 mb-6">
        PNR Confirmation Prediction
      </h1>
      <p className="text-center text-gray-600 mb-8">
        Get a prediction on your waitlisted ticket's confirmation chances. A minimal service fee applies.
      </p>

      {userId && (
        <p className="text-sm text-gray-500 text-center mb-4">
          Your User ID: <span className="font-semibold text-indigo-600 break-words">{userId}</span>
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="pnrNumber" className="block text-sm font-medium text-gray-700 mb-1">
            PNR Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="pnrNumber"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
            placeholder="e.g., 1234567890"
            value={pnrNumber}
            onChange={(e) => setPnrNumber(e.target.value)}
            required
            maxLength="10"
            minLength="10"
          />
        </div>

        <div>
          <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 mb-1">
            Mobile Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="mobileNumber"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
            placeholder="e.g., 9876543210"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            required
          />
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <h2 className="text-xl font-semibold text-indigo-700 mb-3">Service Fee Payment</h2>
          <p className="text-gray-600 text-sm mb-4">
            A small service fee of <span className="font-bold text-green-600">₹[Service Fee Amount]</span> applies for this prediction service.
          </p>
          <div className="flex justify-center mb-6">
            <img src={qrCodeUrl} alt="Payment QR Code" className="w-48 h-48 rounded-lg shadow-md border border-gray-200 object-cover" />
          </div>

          <label htmlFor="paymentScreenshot" className="block text-sm font-medium text-gray-700 mb-1">
            Attach Payment Screenshot
          </label>
          <input
            type="file"
            id="paymentScreenshot"
            accept="image/*"
            className="mt-1 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-indigo-50 file:text-indigo-700
              hover:file:bg-indigo-100 transition duration-150 ease-in-out"
            onChange={handleScreenshotChange}
          />
          {paymentScreenshot && (
            <p className="text-xs text-gray-500 mt-2">Selected file: {paymentScreenshot.name}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md font-semibold text-lg
            hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
            transition duration-200 ease-in-out shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          disabled={!isReady}
        >
          Submit PNR Prediction Request
        </button>
      </form>

      {/* Disclaimer Section */}
      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg text-sm">
        <h3 className="font-bold text-base mb-2">Important Disclaimer:</h3>
        <p className="mb-2">
          We are **NOT** directly connected to IRCTC or act as an authorized agent. This service is designed to help you with train ticket information and predictions.
        </p>
        <p className="mb-2">
          All risks associated with booking and confirmation are entirely yours. We only try to provide helpful suggestions and predictions based on available data.
        </p>
        <p className="font-semibold">
          There is **NO 100% GUARANTEE** for any confirmation, even with our predictions. Waitlist and ticketing depend on various factors such as railway quotas, addition of extra coaches, last-minute cancellations, and dynamic policies. Please continue at your own risk.
        </p>
      </div>
    </div>
  );
}

function App() {
  const [userId, setUserId] = useState(null);
  const [isReady, setIsReady] = useState(false); // Renamed from isAuthReady for general readiness
  const [message, setMessage] = useState(''); // For global user feedback
  const [currentPage, setCurrentPage] = useState('booking'); // 'booking' or 'pnrPrediction'

  // Initialize Supabase and generate a unique user ID
  useEffect(() => {
    // Generate a new unique user ID if not already set (e.g., on first load)
    if (!userId) {
      setUserId(crypto.randomUUID());
    }
    setIsReady(true); // Supabase client is initialized globally, so app is ready
  }, [userId]); // Dependency on userId to only run if userId is null

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-200 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => { setCurrentPage('booking'); setMessage(''); }}
          className={`px-6 py-3 rounded-full text-lg font-semibold transition duration-300 ease-in-out
            ${currentPage === 'booking' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-indigo-700 border border-indigo-300 hover:bg-indigo-50'}`}
        >
          Book Ticket
        </button>
        <button
          onClick={() => { setCurrentPage('pnrPrediction'); setMessage(''); }}
          className={`px-6 py-3 rounded-full text-lg font-semibold transition duration-300 ease-in-out
            ${currentPage === 'pnrPrediction' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-indigo-700 border border-indigo-300 hover:bg-indigo-50'}`}
        >
          PNR Prediction
        </button>
      </div>

      {message && (
        <div className={`mt-4 p-3 rounded-md text-sm mb-4 w-full max-w-md ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}

      {isReady ? (
        currentPage === 'booking' ? (
          <BookingForm userId={userId} isReady={isReady} setMessage={setMessage} />
        ) : (
          <PNRPredictionForm userId={userId} isReady={isReady} setMessage={setMessage} />
        )
      ) : (
        <p className="text-center text-gray-500 text-sm">Initializing application, please wait...</p>
      )}
    </div>
  );
}

export default App;

