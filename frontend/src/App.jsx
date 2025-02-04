import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TherapistPrivateRoute from "./components/TherapistPrivateRoute";
const RegisterTherapist = React.lazy(() => import("./pages/RegisterTherapist"));
const SignInTherapist = React.lazy(() => import("./pages/SigninTherapist"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const TherapistSearch = React.lazy(() => import("./pages/TherapistSearch"));
const TherapistBookingPage = React.lazy(()=>import("./pages/TherapistBookingPage"));
const ReschedulePage = React.lazy(()=>import("./pages/ReschedulePage"));
function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* Normal Routes */}
          <Route path="/therapists/signup" element={<RegisterTherapist />} />
          <Route path="/therapists/signin" element={<SignInTherapist />} />
          <Route path="/therapists/search" element={<TherapistSearch />} />
          {/* ✅ Protected Route (PrivateRoute should wrap the Dashboard) */}
          <Route
            path="/therapists/dashboard"
            element={
              <TherapistPrivateRoute>
                <Dashboard />
              </TherapistPrivateRoute>
            }
          />
          <Route path = "/therapists/book-appointment/:therapistId" element = {<TherapistBookingPage/>}/>
          <Route path="/therapists/reschedule" element={<ReschedulePage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
