interface Transaction {
    _id: string;
    id: number;
    title: string;
    description: string;
    price: number;
    sold: boolean;
    dateOfSale: string;
    category: string,
    image: string
}

export default Transaction;