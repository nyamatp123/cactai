import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { listPlants, createPlant } from "../../api/plants";
import AddPlantModal from "../dashboard/plants/AddPlantModal";

// New users land here until they add their first plant; the dashboard needs one.
export default function WelcomePage() {
  const navigate = useNavigate();
  // null while loading, then the user's plant count
  const [plantCount, setPlantCount] = useState(null);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    listPlants()
      .then((list) => setPlantCount(list.length))
      .catch((err) => setLoadError(err.message));
  }, []);

  // Throws on failure so the modal stays open and shows the error
  async function handleAddPlant(data) {
    const plant = await createPlant(data);
    navigate(`/dashboard/${plant.id}`, { replace: true });
  }

  if (loadError) return <p style={{ padding: 24 }}>{loadError}</p>;
  if (plantCount === null) return null;
  if (plantCount > 0) return <Navigate to="/dashboard" replace />;

  return (
    <AddPlantModal
      onSubmit={handleAddPlant}
      title="Welcome to Cactai"
      subtitle="Add your first cactus to set up your dashboard."
    />
  );
}
