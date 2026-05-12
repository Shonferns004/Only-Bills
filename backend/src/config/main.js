import Groq from 'groq-sdk';

function getGroq() {
  return new Groq({ apiKey: process.env.GROQ_API_KEY });
}

export function calculateBudget(data) {
    const income = parseFloat(data.income);
    const numFamilyMembers = parseInt(data.num_family_members);
    const maritalStatus = data.marital_status;
    const numChildren = parseInt(data.num_children || 0);
    const hasRent = data.has_rent?.toLowerCase() === 'yes';
    const rentAmount = parseFloat(data.rent_amount || 0);
    const hasVehicle = data.has_vehicle?.toLowerCase() === 'yes';
    const petrolExpense = parseFloat(data.petrol_expense || 0);
  
    const budgetPercentages = {
      "Housing (Rent)": hasRent ? 0.25 : 0,
      "Food": 0.15,
      "Children": numChildren > 0 ? 0.10 : 0,
      "Transportation (Petrol)": hasVehicle ? 0.05 : 0,
      "Utilities (Electricity, Water, Gas)": 0.10,
      "Savings & Investments": 0.15,
      "Entertainment & Leisure": 0.05,
      "Miscellaneous": 0.10,
    };
  
    const budget = {};
    for (const [category, percent] of Object.entries(budgetPercentages)) {
      budget[category] = income * percent;
    }
  
    if (hasRent) budget["Housing (Rent)"] = rentAmount;
    if (hasVehicle) budget["Transportation (Petrol)"] = petrolExpense;
  
    return { income, numFamilyMembers, maritalStatus, numChildren, budget };
  }


export async function getGroqAdvice(income, numFamilyMembers, numChildren, maritalStatus, budget) {
    const budgetLines = Object.entries(budget)
      .map(([category, amount]) => `${category}: $${amount.toFixed(2)}`)
      .join('\n');
  
    const prompt = `
  I'm planning a monthly budget. Here are my details:
  
  - Monthly Income: $${income.toFixed(2)}
  - Family Members: ${numFamilyMembers}
  - Marital Status: ${maritalStatus}
  - Number of Children: ${numChildren}
  - Budget Breakdown:
  ${budgetLines}
  
  Please analyze this and provide personalized financial advice:
  - Highlight if I'm overspending or under-allocating.
  - Give suggestions for improvement specific to being ${maritalStatus.toLowerCase()} with ${numChildren} children.
  - Be supportive, friendly, and practical.
  `;
  
    const completion = await getGroq().chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
    });
  
    return completion.choices[0].message.content;
  }
