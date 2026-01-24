import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import { initialPlans } from "./initialPlans";
import { useAuth } from "../context/AuthContext";
import { planService } from "../services/planService";

const usePlans = () => {

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return; 
    
    setLoading(true)
    const fetchPlans = async () => {
      try {
        const fetchedPlans = await planService.getAllPlans();
        
        if (fetchedPlans.length === 0) {
            // No plans found in DB, initialize with default plans
            console.log("No plans found. Initializing default plans...");
            
            const promises = initialPlans.map(async (plan) => {
                const newPlan = {
                    ...plan,
                    id: nanoid(12), // Generate new unique ID for the new user
                    createdAt: Date.now(),
                    updatedAt: Date.now()
                };
                
                await planService.createPlan(newPlan);
                return newPlan;
            });
            
            const results = await Promise.all(promises);
            setPlans(results);
        } else {
            // Format existing plans from DB
            const formattedPlans = fetchedPlans.map(p => {
                // Merge data content with top-level props
                return {
                    ...p.data,
                    id: p.id,
                    name: p.name,
                    createdAt: p.created_at, // DB uses created_at
                    updatedAt: p.updated_at
                };
            });
            setPlans(formattedPlans)
        }
      } catch (err) {
        console.error("Error fetching/initializing plans:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, [user]); 

  const updatePlanDetails = async (planId, updatedPlanData) => {
    try {
      // Optimistic update
      const updatedPlans = plans.map((plan) =>
            plan.id === planId ? {...plan, ...updatedPlanData, updatedAt: Date.now()} : plan
        )
      setPlans(updatedPlans)
      
      // Find the updated plan object to send to server
      const planToUpdate = updatedPlans.find(p => p.id === planId);
      await planService.updatePlan(planId, planToUpdate);
      
    } catch (err) {
      console.error("Error updating plan:", err);
      setError(err);
    } 
  }

  const createNewPlan = async () => {
    try {
      const newPlan = {
        id: nanoid(12),
        name: "My floor plan",
        favorite: false,
        trash: false,
        walls: [],
        items: [],
        createdAt: Date.now(),
        updatedAt: Date.now()
      }
      
      // Optimistic update
      setPlans([...plans, newPlan]);
      
      await planService.createPlan(newPlan);
      return newPlan
    } catch (err) {
      console.error("Error creating plan:", err);
      setError(err);
    } 
  }

  const removePlan = async (planId) => {
    try {
      // Optimistic update
      const updatedPlans = plans.filter(e => e.id !== planId)
      setPlans(updatedPlans)
      
      await planService.deletePlan(planId);
    } catch (err) {
      console.error("Error deleting plan:", err);
      setError(err);
    } 
  }

  return {plans, updatePlanDetails, createNewPlan, removePlan, loading, error}
}

export default usePlans;
