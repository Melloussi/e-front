import { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';

export default function Transfers() {
  const [transfers, setTransfers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/transfers`)
      .then((response) => response.json())
      .then((data) => setTransfers(data))
      .catch((error) => console.error('Error fetching transfers:', error));
  }, []);

  const filteredTransfers = transfers.filter((transfer) =>
    transfer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full p-2 mb-4 border border-gray-300 rounded"
        />
        <ul className="space-y-2">
          {filteredTransfers.map((transfer) => (
            <li key={transfer._id} className="bg-white p-4 rounded shadow">
              <Link href={`/transfers/${transfer.name}`}>
                <a className="text-blue-600">{transfer.name}</a>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
