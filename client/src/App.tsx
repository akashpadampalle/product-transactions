import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Transaction from "./models/Transaction";
import TransactionTable from "./components/TransactionTable";
import Statistics from "./components/Statistics";


const App = () => {

  const [month, setMonth] = useState("march");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  const { data } = useQuery<{ totalCount: number, transactions: Array<Transaction> }>({
    queryFn: () => fetchTransactions(month, search, page),
    queryKey: ["transactions", { month, search, page }],
    staleTime: Infinity
  });

  useEffect(() => {
    setSearch("");
    setPage(0);
  }, [month])

  const fetchTransactions = async (month: string, search: string, page: number) => {
    let url = `http://localhost:4000/transactions/${month}?`;

    if (search) {
      url = url + `search=${search}&`
    }

    if (page) {
      url = url + `offset=${page * 10}&limit=${10}`
    }

    const response = await fetch(url);
    const transactions = await response.json();
    return transactions;
  }

  return (
    <div className="px-8 mt-8">
      <h1 className="text-3xl text-center mb-16">Transaction Dashboard</h1>
      <div className="flex flex-col gap-4 justify-between mb-8 md:flex-row">
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search..."
          className="border-b border-black outline-none focus:border-blue-400 p-2 text-lg"
        />
        <select
          value={month}
          onChange={(event) => setMonth(event.target.value)}
          className="p-4 rounded-lg"
        >
          <option value="january">January</option>
          <option value="february">February</option>
          <option value="march">March</option>
          <option value="april">April</option>
          <option value="may">May</option>
          <option value="june">June</option>
          <option value="july">July</option>
          <option value="august">August</option>
          <option value="september">September</option>
          <option value="october">October</option>
          <option value="november">November</option>
          <option value="december">December</option>
        </select>
      </div>

      {(data?.transactions) && <TransactionTable transactions={data.transactions} />}

      <div className="flex justify-between mt-8">
        <button
          onClick={() => setPage(pre => pre - 1)}
          disabled={(page <= 0) ? true : false}
          className="bg-green-400 p-4 rounded-lg disabled:bg-gray-400">
          Pervious
        </button>
        <div className="text-lg text-gray-400">{page + 1}</div>
        <button
          onClick={() => setPage(pre => pre + 1)}
          disabled={(data?.totalCount && data.totalCount <= page * 10 + 10) ? true : false}
          className="bg-green-400 p-4 rounded-lg disabled:bg-gray-400">
          Next
        </button>
      </div>

      <div className="mt-24">
        <Statistics month={month} />
      </div>
    </div>
  )
}

export default App