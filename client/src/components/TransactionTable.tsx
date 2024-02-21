import React from 'react'
import Transaction from '../models/Transaction'

interface Props {
    transactions: Array<Transaction>
}

const TransactionTable: React.FC<Props> = ({ transactions }) => {

    if (transactions.length <= 0) {
        return <div>No Data Available</div>
    }

    return (
        <table className='table border border-gray-300'>
            <thead className='table-header-group'>
                <tr className='table-row border-b border-gray-300'>
                    <th className='table-cell border-r border-gray-300 p-2'>ID</th>
                    <th className='table-cell border-r border-gray-300 p-2'>Title</th>
                    <th className='table-cell border-r border-gray-300 p-2'>Description</th>
                    <th className='table-cell border-r border-gray-300 p-2'>Price</th>
                    <th className='table-cell border-r border-gray-300 p-2'>Category</th>
                    <th className='table-cell border-r border-gray-300 p-2'>Sold</th>
                    <th className='table-cell p-2'>Image</th>
                </tr>
            </thead>
            <tbody>
                {
                    transactions.map((item) => {
                        return (
                            <tr className='table-row border-b border-gray-300' key={item._id}>
                                <td className='table-cell border-r border-gray-300 p-2'>{item.id}</td>
                                <td className='table-cell border-r border-gray-300 p-2'>{item.title}</td>
                                <td className='table-cell border-r border-gray-300 p-2'>{item.description}</td>
                                <td className='table-cell border-r border-gray-300 p-2'>${item.price.toFixed(2)}</td>
                                <td className='table-cell border-r border-gray-300 p-2'>{item.category}</td>
                                <td className='table-cell border-r border-gray-300 p-2'>{item.sold ? "true" : "false"}</td>
                                <td className='table-cell p-2'><a className='text-blue-400' href={item.image}>Link</a></td>
                            </tr>
                        )
                    })
                }
            </tbody>
        </table>
    )
}

export default TransactionTable