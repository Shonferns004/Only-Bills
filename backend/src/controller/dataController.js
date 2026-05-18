import { supabase } from '../config/supabase.js';

export const getBudgetPlans = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId required' });
    const { data, error } = await supabase
      .from('budget_plans')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching budget plans:', error);
    res.status(500).json({ error: 'Failed to fetch budget plans' });
  }
};

export const saveBudgetPlan = async (req, res) => {
  try {
    const {
      userId, income, numFamilyMembers, maritalStatus,
      numChildren, hasRent, rentAmount, hasVehicle,
      petrolExpense, budgetJson, advice
    } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId required' });
    const { data, error } = await supabase
      .from('budget_plans')
      .insert({
        user_id: userId, income, num_family_members: numFamilyMembers,
        marital_status: maritalStatus, num_children: numChildren || 0,
        has_rent: hasRent || 'no', rent_amount: rentAmount || 0,
        has_vehicle: hasVehicle || 'no', petrol_expense: petrolExpense || 0,
        budget_json: budgetJson, advice,
      })
      .select('id')
      .single();
    if (error) throw error;
    res.status(201).json({ id: data.id });
  } catch (error) {
    console.error('Error saving budget plan:', error);
    res.status(500).json({ error: 'Failed to save budget plan' });
  }
};

export const deleteBudgetPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('budget_plans').delete().eq('id', id);
    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete budget plan' });
  }
};

export const getPredictions = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId required' });
    const { data, error } = await supabase
      .from('predictions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching predictions:', error);
    res.status(500).json({ error: 'Failed to fetch predictions' });
  }
};

export const savePrediction = async (req, res) => {
  try {
    const { userId, rooms, people, appliances, systems, predictedAmount, perRoom } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId required' });
    const { data, error } = await supabase
      .from('predictions')
      .insert({
        user_id: userId, rooms, people, appliances,
        systems, predicted_amount: predictedAmount, per_room: perRoom,
      })
      .select('id')
      .single();
    if (error) throw error;
    res.status(201).json({ id: data.id });
  } catch (error) {
    console.error('Error saving prediction:', error);
    res.status(500).json({ error: 'Failed to save prediction' });
  }
};

export const deletePrediction = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('predictions').delete().eq('id', id);
    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete prediction' });
  }
};

export const getBillSplits = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId required' });
    const { data, error } = await supabase
      .from('bill_splits')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching bill splits:', error);
    res.status(500).json({ error: 'Failed to fetch bill splits' });
  }
};

export const saveBillSplit = async (req, res) => {
  try {
    const { userId, amount, people, tipPercent, tipAmount, totalWithTip, perPerson, currency } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId required' });
    const { data, error } = await supabase
      .from('bill_splits')
      .insert({
        user_id: userId, amount, people, tip_percent: tipPercent,
        tip_amount: tipAmount, total_with_tip: totalWithTip,
        per_person: perPerson, currency: currency || 'USD',
      })
      .select('id')
      .single();
    if (error) throw error;
    res.status(201).json({ id: data.id });
  } catch (error) {
    console.error('Error saving bill split:', error);
    res.status(500).json({ error: 'Failed to save bill split' });
  }
};

export const deleteBillSplit = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('bill_splits').delete().eq('id', id);
    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete bill split' });
  }
};

export const getChatHistory = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId required' });
    const { data, error } = await supabase
      .from('chat_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
};

export const saveChatMessage = async (req, res) => {
  try {
    const { userId, role, content } = req.body;
    if (!userId || !role || !content) {
      return res.status(400).json({ error: 'userId, role, and content required' });
    }
    const { data, error } = await supabase
      .from('chat_history')
      .insert({ user_id: userId, role, content })
      .select('id')
      .single();
    if (error) throw error;
    res.status(201).json({ id: data.id });
  } catch (error) {
    console.error('Error saving chat message:', error);
    res.status(500).json({ error: 'Failed to save chat message' });
  }
};

export const clearChatHistory = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId required' });
    const { error } = await supabase.from('chat_history').delete().eq('user_id', userId);
    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to clear chat history' });
  }
};

export const getTransactions = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId required' });
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20);
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};

export const saveTransaction = async (req, res) => {
  try {
    const { userId, type, amount, description, category, date } = req.body;
    if (!userId || !type || !amount || !description) {
      return res.status(400).json({ error: 'userId, type, amount, description required' });
    }
    const { data, error } = await supabase
      .from('transactions')
      .insert({
        user_id: userId, type, amount, description,
        category: category || 'other', date: date || new Date().toISOString().split('T')[0],
      })
      .select('id')
      .single();
    if (error) throw error;
    res.status(201).json({ id: data.id });
  } catch (error) {
    console.error('Error saving transaction:', error);
    res.status(500).json({ error: 'Failed to save transaction' });
    }
  };

export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('transactions').delete().eq('id', id);
    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
};
