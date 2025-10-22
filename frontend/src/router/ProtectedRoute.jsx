import { Route, Routes } from "react-router";
import Home from "../pages/Dashboard/Home";
import UserProfiles from "../pages/UserProfile";
import AddManager from '../pages/Manager/AddManager'

import AppLayout from "../layout/AppLayout";
import Protect from "./Protect";
import AddCar from "../pages/cars/AddCar";
import AllCar from "../pages/cars/AllCar";
import PendingDrivers from "../pages/Driver/PendingDrivers";
import DriverList from "../pages/Driver/DriverList";
import DriverProfile from "../pages/Driver/DriverProfile";
import EditCar from "../pages/cars/EditCar";

export default function ProtectedRoute() {
  return (
    <Routes>
      <Route element={<Protect />}>
        <Route element={<AppLayout />}>
          <Route path='/dashboard' element={<Home />} />
          <Route path='/dashboard/profile' element={<UserProfiles />} />
          <Route path='/dashboard/add-manager' element={<AddManager />} />
          <Route path='/dashboard/add-car' element={<AddCar />} />
          <Route path='/dashboard/cars' element={<AllCar />} />
          <Route path='/dashboard/edit-car/:id' element={<EditCar />} />
          <Route
            path='/dashboard/pending-drivers'
            element={<PendingDrivers />}
          />
          <Route path='/dashboard/drivers-list' element={<DriverList />} />
          <Route path='/dashboard/driver/profile' element={<DriverProfile />} />
        </Route>
      </Route>
    </Routes>
  );
}
