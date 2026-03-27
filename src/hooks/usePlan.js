import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { planService } from "../services/planService";

const usePlan = (planId) => {

  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    
    setLoading(true)
    const fetchPlan = async () => {
      try {
        const fetchedPlan = await planService.getPlan(planId);
        
        if (fetchedPlan) {
          // Flatten the structure: merge data content with top-level props
          const formattedPlan = {
            ...fetchedPlan.data,
            id: fetchedPlan.id,
            name: fetchedPlan.name,
            createdAt: fetchedPlan.created_at,
            updatedAt: fetchedPlan.updated_at
          };
          setPlan(formattedPlan);
        } else {
          // Plan not found or error
          setPlan(null);
        }
      } catch (err) {
        console.error(err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, [planId, user]);

  // Helper to save plan to backend
  const savePlan = async (updatedPlan) => {
    // Optimistic update
    setPlan(updatedPlan);
    
    try {
      await planService.updatePlan(planId, updatedPlan);
    } catch (err) {
      console.error("Error saving plan:", err);
      setError(err);
      // TODO: Revert state if needed
    }
  };

  const updatePlanDetails = async (updatedPlanData) => {
    const updatedPlan = {...plan, ...updatedPlanData, updatedAt: Date.now()};
    await savePlan(updatedPlan);
  }

  const addItem = async (newItem) => {
    const updatedPlan = {...plan, items: [...plan.items, newItem], updatedAt: Date.now()};
    await savePlan(updatedPlan);
  }

  const updateItem = async (id, props) => {
    const updatedItems = plan.items.map(e => e.id === id ? {...e, ...props} : e);
    const updatedPlan = {...plan, items: updatedItems, updatedAt: Date.now()};
    await savePlan(updatedPlan);
  }

  const removeItem = async (id) => {
    const updatedItems = plan.items.filter(e => e.id !== id);
    const updatedPlan = {...plan, items: updatedItems, updatedAt: Date.now()};
    await savePlan(updatedPlan);
  }

  const addWalls = async (newWalls) => {
    const updatedPlan = {...plan, walls: [...plan.walls, newWalls], updatedAt: Date.now()};
    await savePlan(updatedPlan);
  }

  const removeWalls = async (id) => {
    const updatedWalls = plan.walls.filter(e => e.id !== id);
    const updatedPlan = {...plan, walls: updatedWalls, updatedAt: Date.now()};
    await savePlan(updatedPlan);
  }

  const updateWalls = async (id, data) => {
    const updatedWalls = plan.walls.map(wallObject => {
      if(wallObject.id === id) {
        return {...wallObject, walls: data}
      } else {
        return wallObject
      }
    });
    const updatedPlan = {...plan, walls: updatedWalls, updatedAt: Date.now()};
    await savePlan(updatedPlan);
  }

  const updateWallProp = async (id, prop, value) => {
    const updatedWalls = plan.walls.map(wallObject => {
      if(wallObject.id === id) {
        return {...wallObject, [prop]: value}
      } else {
        return wallObject
      }
    });
    const updatedPlan = {...plan, walls: updatedWalls, updatedAt: Date.now()};
    await savePlan(updatedPlan);
  }


  return { plan, addWalls, addItem, updatePlanDetails, updateItem, removeItem, removeWalls, updateWalls, updateWallProp, loading, error };
}

export default usePlan;
