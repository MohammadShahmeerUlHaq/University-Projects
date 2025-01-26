import './styles/App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AboutPage from './pages/AboutPage';
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage";
import FlightPage from "./pages/FlightPage";  
import HotelPage from "./pages/HotelPage";
import PackagesPage from './pages/packagePage';
import ProfilePage from './pages/profilePage';
import Layout from "./layout/Layout";
import HotelReservationPage from './pages/hotelReservationPage';
import PaymentForm from './pages/PaymentForm';
import FlightReservationPage from './pages/flightReservation';
import ProtectedRoute from './components/ProtectedRoute'; 
import PageNotFound from './pages/NotFound/PageNotFound';
import PackageInputData from './pages/PackageInputData.js';
import PackageDetails from './pages/PackageDetails.js';
import ReservationModifications from "./pages/ReservationModification.js"
import AdminPortal from './pages/AdminPortal.js';
import AdminLayout from "./layout/AdminLayout.js"
import AdminHotels from './pages/AdminHotels.js';
import AdminFlights from './pages/AdminFlights.js';
import AdminLogin from "./pages/AdminLogin.js";
import AdminAirlines from './pages/AdminAirline.js';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Pages without layout */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
           path='/payment' 
           element={<ProtectedRoute><PaymentForm /></ProtectedRoute>} 
           />
        <Route element={<Layout />}> {/* Apply Layout to these routes */}
          {/* Pages with layout */}
          <Route path="/" element={<HomePage />} />
          <Route path="/flights" element={<FlightPage />} />
          <Route path="/hotels" element={<HotelPage />} />
          <Route path='/packages' element={<PackagesPage/>} />
          <Route path='/about' element={<AboutPage/>} />
          <Route path='/packages/inputdata' element={<PackageInputData />} />

          {/* Protected Routes */}
          <Route 
            path="/hotels/reservation" 
            element={<ProtectedRoute><HotelReservationPage /></ProtectedRoute>} 
          />
          <Route 
            path="/flights/reservation" 
            element={<ProtectedRoute><FlightReservationPage /></ProtectedRoute>} 
          />
          
           <Route
           path='/packages/details' 
           element={<ProtectedRoute><PackageDetails /></ProtectedRoute>} 
           />
           <Route
           path='/profile' 
           element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} 
           />
           <Route
           path='/reservation/modifications' 
           element={<ProtectedRoute><ReservationModifications /></ProtectedRoute>} 
           />

            
        </Route>
        <Route element={<AdminLayout />}>
        <Route path='/admin/login' element={<AdminLogin />} />
          <Route path='/adminportal' element={<AdminPortal />} />
          <Route path='/admin/hotels' element={<AdminHotels />} />
          <Route path='/admin/airlines' element={<AdminAirlines />} />
          
          <Route path='/admin/flights' element={<AdminFlights />} />
        </Route>
        <Route element={<Layout />}>
          <Route path='*' element={<PageNotFound/>} />
        </Route>
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
