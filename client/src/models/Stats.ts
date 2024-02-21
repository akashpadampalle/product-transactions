export const barLabels = ["0-100", "101-200", "201-300", "301-400", "401-500", "501-600", "601-700", "701-800", "801-900", "901-above"]

export interface SalesData {
    totalSales: number,
    soldItems: number,
    notSoldItems: number
}

export interface BarData {
    _id: string,
    count: number
}

export interface PieData {
    _id: string, count: number
}

interface Stats {
    sales: SalesData;
    barData: Array<BarData>;
    pieData: Array<PieData>
}

export default Stats;