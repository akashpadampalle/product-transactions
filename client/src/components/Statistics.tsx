import { useQuery } from "@tanstack/react-query"
import React from "react"
import Stats from "../models/Stats"
import SaleStats from "./SaleStats"
import BarChart from "./BarChart"
import PieChart from "./PieChart"

interface Props {
    month: string
}

const Statistics: React.FC<Props> = ({ month }) => {

    const { data } = useQuery<Stats>({
        queryFn: () => fetchStats(),
        queryKey: ["stats", { month }]
    });

    const fetchStats = async () => {
        const response = await fetch(`http://localhost:4000/transactions/${month}/stats`);
        const data = await response.json();
        return data;
    };

    if (!data) {
        return <div>Loading...</div>
    }

    return (
        <div>
            <div>
                <h1 className="text-2xl mb-4">Statastics {month}</h1>
                <SaleStats data={data.sales} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 mt-16 gap-8">
                <div>
                    <h1 className="text-2xl mb-4">Bar Chart Stats {month}</h1>
                    <BarChart data={data.barData} />
                </div>
                <div>
                    <h1 className="text-2xl mb-4">Pie Chart Category Stats {month}</h1>
                    <PieChart data={data.pieData} />
                </div>
            </div>

        </div>
    )
}

export default Statistics