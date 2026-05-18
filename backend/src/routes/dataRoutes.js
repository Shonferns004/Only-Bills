import { Router } from 'express';
import {
  getBudgetPlans, saveBudgetPlan, deleteBudgetPlan,
  getPredictions, savePrediction, deletePrediction,
  getBillSplits, saveBillSplit, deleteBillSplit,
  getChatHistory, saveChatMessage, clearChatHistory,
  getTransactions, saveTransaction, deleteTransaction
} from '../controller/dataController.js';

const router = Router();

router.get('/plans', getBudgetPlans);
router.post('/plans', saveBudgetPlan);
router.delete('/plans/:id', deleteBudgetPlan);

router.get('/predictions', getPredictions);
router.post('/predictions', savePrediction);
router.delete('/predictions/:id', deletePrediction);

router.get('/splits', getBillSplits);
router.post('/splits', saveBillSplit);
router.delete('/splits/:id', deleteBillSplit);

router.get('/chat/history', getChatHistory);
router.post('/chat/history', saveChatMessage);
router.delete('/chat/history', clearChatHistory);

router.get('/transactions', getTransactions);
router.post('/transactions', saveTransaction);
router.delete('/transactions/:id', deleteTransaction);

export default router;
