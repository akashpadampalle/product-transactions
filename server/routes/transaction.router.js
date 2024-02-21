import { Router } from "express";
import transactionController from "../controllers/transaction.controller.js";
const router = Router();

router.get('/:month', transactionController.get);
router.get('/:month/sale-stats', transactionController.getSalesStat);
router.get('/:month/bar-chart', transactionController.getBarChart);
router.get('/:month/pie-chart', transactionController.getPieChart);
router.get('/:month/stats', transactionController.getAllStats);
export default router;