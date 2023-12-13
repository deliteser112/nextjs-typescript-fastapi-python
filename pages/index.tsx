import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// redux
import { selectIsAuthenticated } from '@/redux/authSlice';
import { getIncidentsAsync, selectIncidents, deleteIncidentAsync } from '@/redux/incidentSlice';

// components
import Navbar from "@/components/Navbar";
import ReportCard from "@/components/ReportCard";
import IncidentModal from "@/components/Modal";

export default function Home() {
  const dispatch = useDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const incidents = useSelector(selectIncidents);

  useEffect(() => {
    dispatch(getIncidentsAsync());
  }, [dispatch])

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleDeleteItem = async (incidentId: string) => {
    try {
      await dispatch(deleteIncidentAsync(incidentId));
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto mt-10">
        {isAuthenticated && (
          <button onClick={openModal} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-10">
            + Add Incident
          </button>
        )}
        <IncidentModal isOpen={isModalOpen} onRequestClose={closeModal} />
        {incidents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 justify-items-center lg:grid-cols-4 gap-4">
            {incidents.map((incident) => (
              <ReportCard key={incident.id} incidentId={incident.id} dateTime={incident.dateTime} description={incident.description} reporter={incident.reporter?.name} severity={incident.severity} onDeleteItem={handleDeleteItem} />
            ))}
          </div>
        ) : (
          <h2 className="text-center">No Data available</h2>
        )}

      </div>
    </>
  );
}
