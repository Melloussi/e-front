import { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';

//------ Updated

export default function Transfers() {
  const [transfers, setTransfers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    //http://localhost:3000/api
    //`${process.env.NEXT_PUBLIC_API_URL}/transfers`
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/transfers/`)
      .then((response) => response.json())
      .then((data) => setTransfers(data))
      .catch((error) => console.error('Error fetching transfers:', error));
  }, []);

  //const filteredTransfers = transfers.filter((transfer) =>
    //transfer.TransferName.toLowerCase().includes(searchTerm.toLowerCase())
//);
console.log(transfers)

  return (
    <div className="min-h-screen bg-lightbrown">
      <Head>
        <title>Transfers</title>
      </Head>
      <main className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center text-white mb-4">Transfers</h1>
        <input
          type="text"
          placeholder="Search transfers"
          value={searchTerm}
          
          className="block w-full p-2 mb-4 border border-gray-300 rounded"
        />
        

        <ul className="space-y-2">
      {transfers && transfers.length > 0 ? (
        transfers.map((transfer) => (
          <li key={transfer.TransferName} className="bg-white p-4 rounded shadow">
            <Link href={`/transfers/${transfer.TransferName}`} legacyBehavior>
              <a className="text-blue-600">{transfer.TransferName}</a>
            </Link>
          </li>
        ))
      ) : (
        <li className="bg-white p-4 rounded shadow">
          <p>No transfers available.</p>
        </li>
      )}
    </ul>

      </main>
    </div>
  );
}
