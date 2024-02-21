import { Router } from "express";
import transactionRouter from "./transaction.router.js";

const router = Router();

router.all('/', (req, res) => {
    res.send('<h1>Transactions API</h1>');
});

router.use('/transactions', transactionRouter);

export default router;