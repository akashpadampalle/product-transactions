import React from 'react'
import { SalesData } from '../models/Stats'

interface Props {
    data: SalesData
}

const SaleStats: React.FC<Props> = ({ data }) => {
    return (
        <div className='text-lg bg-blue-200 w-fit p-8 rounded-lg'>
            <table className='border-separate border-spacing-4'>
                <tbody>
                    <tr>
                        <td>Total Sales</td>
                        <td>{data.totalSales}</td>
                    </tr>
                    <tr>
                        <td>Total Sold Item</td>
                        <td>{data.soldItems}</td>
                    </tr>
                    <tr>
                        <td>Total Not Sold Item</td>
                        <td>{data.notSoldItems}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default SaleStats