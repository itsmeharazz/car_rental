import React, { useEffect, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import api from "../../api/axios";
import { FiCheckCircle, FiDelete, FiEye, FiRotateCcw } from "react-icons/fi";

const DriverList = () => {
  const [drivers, setDrivers] = useState([]);
  const [cars, setCars] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [viewDriver, setViewDriver] = useState(null);

  const fetchDrivers = async () => {
    try {
      const res = await api.get("/drivers");
      setDrivers(res.data.data || res.data);
    } catch (err) {
      console.error(err);
    }
  };
  const fetchCars = async () => {
    try {
      const res = await api.get("/cars");
      setCars(res.data.data || res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDrivers();
    fetchCars();
  }, []);

useEffect(() => {
if (viewDriver) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    const handleEsc = (e) => {
      if (e.key === "Escape") viewDriver(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
},[viewDriver]);



  const handleApprove = async (id, assigned_car_id = null) => {
    if (!confirm("Approve this driver?")) return;
    setLoading(true);
    try {
      await api.post(`/driver/${id}/approve`, { assigned_car_id });
      setMessage("Driver Approved!");
      fetchDrivers();
    } catch (err) {
      setMessage(
        err.response?.data?.message ||
          "There was an error approving the driver."
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle reject action
  const handleReject = async (id) => {
    if (!confirm("Reject this driver?")) return;
    setLoading(true);
    try {
      await api.post(`/driver/${id}/reject`);
      setMessage("Driver Rejected!");
      fetchDrivers();
    } catch (err) {
      setMessage(
        err.response?.data?.message ||
          "There was an error rejecting the driver."
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePending = async (id) => {
    if (!confirm("Set this driver back to pending ?")) return;
    setLoading(true);
    try {
      await api.post(`/driver/${id}/pending`);
      setMessage("Driver set back to pending !");
      fetchDrivers();
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to set pending.");
    } finally {
      setLoading(false);
    }
  };

  const handleAssignCar = async (id, carId) => {
    if (!carId) return alert("Please select a car first!");
    setLoading(true);
    try {
      await api.post(`/driver/${id}/assign-car`, { assigned_car_id: carId });
      setMessage("Car assigned successfully!");
      fetchDrivers();
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to assign car.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageMeta title='Drivers List' description='Become a driver' />
      <div className='max-w-full mx-auto p-6'>
        <h2 className='text-2xl font-semibold mb-4 text-center mt-4'>
          Drivers List
        </h2>

        {message && (
          <div className='mb-4 text-sm text-green-700'> {message} </div>
        )}
        <div className='overflow-x-auto'>
          <table className='w-full border border-gray-200 rounded-lg overflow-hidden'>
            <thead className='bg-gray-100 text-gray-700'>
              <tr>
                <th className='p-2 text-left'>Photo</th>
                <th className='p-2 text-left'>Name</th>
                <th className='p-2 text-left'>Email</th>
                <th className='p-2 text-left'>Phone</th>
                <th className='p-2 text-left'>License</th>
                <th className='p-2 text-left'>Assigned Car</th>
                <th className='p-2 text-left'>Status</th>
                <th className='p-2 text-left'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {drivers.length === 0 ? (
                <tr>
                  <td colSpan='8' className='text-center py-6 text-gray-500'>
                    No drivers found!
                  </td>
                </tr>
              ) : (
                drivers.map((d) => (
                  <tr key={d.id} className='border-t hover:bg-gray-50'>
                    <td className='p-2'>
                      <img
                        src='d.profile_photo || d.user?.driverProfile?.profile_photo'
                        alt={d.user?.name}
                        className='w-12 h-12 rounded-full object-cover'
                      />
                    </td>
                    <td className='p-2'>{d.user?.name}</td>
                    <td className='p-2'>{d.user?.email}</td>
                    <td className='p-2'> {d.phone} </td>
                    <td className='p-2'> {d.license_number} </td>
                    <td className='p-2'>
                      <select
                        value={d.assigned_car_id || ""}
                        onChange={(e) => handleAssignCar(d.id, e.target.value)}
                        className='border rounded px-2 py-1 text-sm'>
                        <option value=''> -- Select Car -- </option>
                        {cars.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name} ({c.brand})
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className='p-2'>
                      <span
                        className={`px-2 py-1 rounded text-white text-sm ${
                          d.status === "approved"
                            ? "bg-green-600"
                            : d.status === "pending"
                            ? "bg-yellow-600"
                            : "bg-red-500"
                        }`}>
                        {" "}
                        {d.status}{" "}
                      </span>
                    </td>
                    {/* Action */}
                    <td className='p-2 flex gap-2 justify-center'>
                      <button
                        title='View'
                        onClick={() => setViewDriver(d)}
                        className='p-1 text-blue-600 hover:text-blue-800'>
                        <FiEye size={18} />
                      </button>
                      <button
                        title='Set Pending'
                        onClick={() => handlePending(d.id)}
                        className='p-1 text-yellow-600 hover:text-yellow-800'>
                        <FiRotateCcw size={18} />
                      </button>
                      <button
                        title='Approve'
                        onClick={() => handleApprove(d.id, d.assigned_car_id)}
                        className='p-1 text-green-600 hover:text-green-800'>
                        <FiCheckCircle size={18} />
                      </button>
                      <button
                        title='Reject'
                        onClick={() => handleReject(d.id)}
                        className='p-1 text-red-600 hover:text-red-800'>
                        <FiDelete size={18} />
                      </button>
                    </td>
                    <td className='p-2'></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Show Driver Details */}
      {viewDriver && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] animate-fadeIn'>
          <div className='bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-y-auto max-h-[90vh] relative animate-scaleIn'>
            {/* Header */}
            <div className='flex justify-between items-center p-4 border-b border-gray-200'>
              <h2 className='text-xl font-semibold text-gray-800'>
                {viewDriver.user?.name}
              </h2>
              <button
                onClick={() => setViewDriver(null)}
                className='text-gray-500 hover:text-gray-700 rounded-full p-2 hover:bg-gray-100 transition'>
                ✕
              </button>
            </div>
            {/* body */}
            {/* Image */}
            <div className='w-full h-64 overflow-hidden rounded-t-2xl flex items-start justify-between gap-6 pt-3 pl-3'>
              <img
                src={
                  viewDriver.profile_photo ||
                  viewDriver.user?.driverProfile?.profile_photo
                }
                alt={viewDriver.user?.name || "Driver Image"}
                className='w-[220px] h-[220px] object-cover rounded-full text-center p-2'
              />
              {/* Driver info */}
              <div className='flex flex-wrap gap-4 text-gray-700 mt-4'>
                <p>
                  <strong>Name:</strong> {viewDriver.user?.name}
                </p>
                <p>
                  <strong>Email:</strong> {viewDriver.user?.email}
                </p>
                <p>
                  <strong>Phone number: </strong>
                  {viewDriver.phone}
                </p>
                <p>
                  <strong>NID Number:</strong> {viewDriver.nid}
                </p>
                <p>
                  <strong>license Number:</strong> {viewDriver.license_number}
                </p>
                <p>
                  <strong>Experience:</strong> {viewDriver.experience_years}
                </p>
              </div>
            </div>
              <hr className='border-gray-200' />
             <div className='flex justify-between items-start p-6 space-y-4'>

              <div className="w-[50%]">
                <p>License image</p>
                <img
                src={
                  viewDriver.license_image
                }/>
              </div>
              <div className="w-[50%]">
                <p>Nid image</p>
                <img
                src={
                  viewDriver.nid_image
                }/>
              </div>
              </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DriverList;
