import React from 'react'
import { PieData } from '../models/Stats'
import { ChartData } from 'chart.js'
import { Pie } from 'react-chartjs-2'

interface Props {
    data: Array<PieData>
}

const PieChart: React.FC<Props> = ({ data }) => {

    const chart: ChartData<"pie"> = {
        labels: data.map((item) => item._id),
        datasets: [{
            label: "Category",
            data: data.map((item) => item.count)
        }]
    }

    return (
        <Pie data={chart} />
    )
}

export default PieChart