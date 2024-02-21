import Transaction from "../models/Transaction.model.js";

/**
 * get month number by month name
 * @param {string} month full month name
 * @returns {number | null} number of month
 */
function getMonth(month) {

    if (!month || typeof month != 'string') {
        return null;
    }

    const lowerCaseMonth = month.trim().toLowerCase();

    switch (lowerCaseMonth) {
        case 'january': return 1;
        case 'february': return 2;
        case 'march': return 3;
        case 'april': return 4;
        case 'may': return 5;
        case 'june': return 6;
        case 'july': return 7;
        case 'august': return 8;
        case 'september': return 9;
        case 'october': return 10;
        case 'november': return 11;
        case 'december': return 12;
        default: return null;
    }
}


/**
 * get all records of transaction in perticular month 
 * @param {import("express").Request} req express request object
 * @param {import("express").Response} res express response object
 */
export const get = async (req, res) => {
    try {
        const month = getMonth(req.params.month);
        const searchQuery = req.query.search;
        const offset = parseInt(req.query.offset) || 0;
        const limit = parseInt(req.query.limit) || 10;

        const criteria = [];

        if (!month) {
            return res.status(400).json({ error: "Month is not valid" });
        }

        // Add month filter if month is valid
        const parsedMonth = new Date(month + '-01');
        criteria.push({
            $expr: {
                $eq: [
                    { $month: "$dateOfSale" },
                    parsedMonth.getMonth() + 1
                ],
            },
        });

        // Add search criteria if searchQuery exists
        if (searchQuery) {
            const searchCriteria = {
                $or: [
                    { title: { $regex: searchQuery, $options: 'i' } },
                    { description: { $regex: searchQuery, $options: 'i' } },
                ],
            };

            // Check for valid number search
            if (!isNaN(parseFloat(searchQuery))) {
                searchCriteria.$or.push({ price: parseFloat(searchQuery) });
            }

            criteria.push(searchCriteria);
        }

        const totalCountPipeline = [
            { $match: { $and: criteria } },  // Combine month and search criteria
            { $count: 'totalCount' },
        ];

        const transactionsPipeline = [
            { $match: { $and: criteria } },  // Combine month and search criteria
            { $skip: offset },
            { $limit: limit },
        ];

        const [[{ totalCount }], transactions] = await Promise.all([
            Transaction.aggregate(totalCountPipeline),
            Transaction.aggregate(transactionsPipeline)
        ]);


        res.status(200).json({
            transactions,
            totalCount,
        });
    } catch (error) {
        console.error('Error while fetching transactions:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


/**
 * get sales statistics
 * @param {import("express").Request} req Express Request object
 * @param {import("express").Response} res Express Response object
 */
export const getSalesStat = async (req, res) => {
    const month = getMonth(req.params.month);

    if (!month) {
        return res.status(400).json({ error: "Month is not valid" });
    }

    const parsedMonth = new Date(month + '-01');

    const pipeline = [
        {
            $match: {
                $expr: {
                    $eq: [
                        { $month: "$dateOfSale" },
                        parsedMonth.getMonth() + 1
                    ],
                },
            },
        },
        {
            $group: {
                _id: null,
                totalSales: { $sum: "$price" },
                soldItems: { $sum: { $cond: [{ $eq: ["$sold", true] }, 1, 0] } },
                notSoldItems: { $sum: { $cond: [{ $eq: ["$sold", false] }, 1, 0] } },
            },
        },
    ];

    const result = await Transaction.aggregate(pipeline);

    if (result.length === 0) {
        return res.status(404).json({ message: "No data found for the selected month" });
    }

    return res.status(200).json(result[0]); // Return the first element (group document)
};


/**
 * get bar chart data for sales statistics
 * @param {import("express").Request} req Express Request object
 * @param {import("express").Response} res Express Response object
 */
export const getBarChart = async (req, res) => {
    const month = getMonth(req.params.month);

    if (!month) {
        return res.status(400).json({ error: "Month is not valid" });
    }

    const parsedMonth = new Date(month + '-01');

    const pipeline = [
        {
            $match: {
                $expr: {
                    $eq: [
                        { $month: "$dateOfSale" },
                        parsedMonth.getMonth() + 1,
                    ],
                },
            },
        },
        {
            $addFields: {
                priceRange: {
                    $switch: {
                        branches: [
                            { case: { $lte: ["$price", 100.00] }, then: "0-100" },
                            { case: { $lte: ["$price", 200.00] }, then: "101-200" },
                            { case: { $lte: ["$price", 300.00] }, then: "201-300" },
                            { case: { $lte: ["$price", 400.00] }, then: "301-400" },
                            { case: { $lte: ["$price", 500.00] }, then: "401-500" },
                            { case: { $lte: ["$price", 600.00] }, then: "501-600" },
                            { case: { $lte: ["$price", 700.00] }, then: "601-700" },
                            { case: { $lte: ["$price", 800.00] }, then: "701-800" },
                            { case: { $lte: ["$price", 900.00] }, then: "801-900" },
                        ],
                        default: "901-above"
                    },
                },
            },
        },
        {
            $group: {
                _id: "$priceRange",
                count: { $sum: 1 },
            },
        },
    ];

    const result = await Transaction.aggregate(pipeline);

    if (result.length === 0) {
        return res.status(200).json({ message: "No data found for the selected month" });
    }

    res.status(200).json(result);
};


/**
 * get pie chart data for category.
 * @param {import("express").Request} req Express Request object
 * @param {import("express").Response} res Express Response object
 */
export const getPieChart = async (req, res) => {
    const month = getMonth(req.params.month);

    if (!month) {
        return res.status(400).json({ error: "Month is not valid" });
    }

    const parsedMonth = new Date(month + '-01');

    const pipeline = [
        {
            $match: {
                $expr: {
                    $eq: [
                        { $month: "$dateOfSale" },
                        parsedMonth.getMonth() + 1,
                    ],
                },
            },
        },
        {
            $group: {
                _id: '$category', // Group by category
                count: { $sum: 1 }, // Count documents in each group
            },
        }
    ]

    const result = await Transaction.aggregate(pipeline);

    return res.status(200).json(result);

}


/**
 * combine sale-stats, bar-chart and pie chart into one json.
 * @param {import("express").Request} req Express Request object
 * @param {import("express").Response} res Express Response object
 */
export const getAllStats = async (req, res) => {
    const month = req.params.month;
    const baseurl = `http://localhost:4000/transactions/${month}`
    const [sales, barData, pieData] = await Promise.all([
        (async () => {
            const response = await fetch(baseurl + '/sale-stats');
            const data = await response.json();
            return data;
        })(),
        (async () => {
            const response = await fetch(baseurl + '/bar-chart');
            const data = await response.json();
            return data;
        })(),
        (async () => {
            const response = await fetch(baseurl + '/pie-chart');
            const data = await response.json();
            return data;
        })()
    ]);

    return res.status(200).json({ sales, barData, pieData })
}


export default { get, getSalesStat, getBarChart, getPieChart, getAllStats }