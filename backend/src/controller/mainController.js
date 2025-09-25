import { calculateBudget, getGeminiAdvice } from '../config/main.js';


const calBudget = async (req,res)=>{
    try {
        const { income, numFamilyMembers, maritalStatus, numChildren, budget } = calculateBudget(req.body);
        const advice = await getGeminiAdvice(income, numFamilyMembers, numChildren, maritalStatus, budget);
        res.json({ income, budget, gemini_advice: advice });
      } catch (error) {
        console.error("Error in /budget:", error);
        res.status(500).json({ error: "Something went wrong while generating the budget." });
    }
}

export default calBudget