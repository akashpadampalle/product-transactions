import React from 'react'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, ChartData } from 'chart.js/auto';
import { BarData, barLabels } from '../models/Stats'

interface Props {
    data: Array<BarData>
}

const BarChart: React.FC<Props> = ({ data }) => {

    ChartJS.register(CategoryScale);

    console.log(data);

    const chart: ChartData<"bar"> = {
        labels: barLabels,
        datasets: [{
            label: "Sales Graph",
            data: data.map((item) => item.count),
        }]
    }

    return (
        <Bar data={chart} />
    )
}

export default BarChart