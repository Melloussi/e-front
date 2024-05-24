import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';
import Head from 'next/head';

export default function TransferDetails() {
  const router = useRouter();
  const { name } = router.query;
  const [transfer, setTransfer] = useState(null);
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [popupImage, setPopupImage] = useState(null);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (name) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/transfers/${name}`)
        .then((response) => response.json())
        .then((data) => {
          setTransfer(data);
          setItems(data.items);
        })
        .catch((error) => console.error('Error fetching transfer:', error));
    }
  }, [name]);

  const updateItem = (index, key, value) => {
    const newItems = [...items];
    newItems[index][key] = value;
    setItems(newItems);
  };

  const handleSave = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/transfers/${name}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Save successful');
        setTransfer(data);
        setShowMessage(true); // Show the "data updated" message
        setTimeout(() => setShowMessage(false), 3000); // Hide the message after 3 seconds
      })
      .catch((error) => console.error('Error saving transfer:', error));
  };

  const filteredItems = items.filter((item) =>
    item.itemTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!transfer) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-lightbrown p-4 sm:p-6 lg:p-8">
      <Head>
        <title>{transfer.name} - Transfer Details</title>
      </Head>
      <main className="container mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-white mb-4">{transfer.name}</h1>
        <p className="text-center text-white mb-4">Created Date: {new Date(transfer.createdDate).toLocaleDateString()}</p>
        <input
          type="text"
          placeholder="Search items"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full p-2 mb-4 border border-gray-300 rounded"
        />
        <button onClick={handleSave} className="block ml-auto w-20 sm:w-40 py-2 mb-4 bg-[#b39570] border-2 border-[#8a7357] text-white font-bold rounded">
          Save
        </button>
        {showMessage && <div className="text-center text-green-600">Data updated</div>}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow text-xs sm:text-lg">
            <thead>
              <tr>
                <th className="py-2 text-left w-1/12"></th>
                <th className="py-2 text-left w-7/12">Product</th>
                <th className="py-2 text-center w-1/12">
                  <span className="block sm:hidden">S</span>
                  <span className="hidden sm:block">Sent</span>
                </th>
                <th className="py-2 text-center w-1/12">
                  <span className="block sm:hidden">R</span>
                  <span className="hidden sm:block">Received</span>
                </th>
                <th className="py-2 text-center w-1/12">
                  <span className="block sm:hidden">D</span>
                  <span className="hidden sm:block">Damaged</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item, index) => (
                <tr key={index} className="border-t">
                  <td className="p-2 text-center">{item.position}</td>
                  <td className="p-2 flex items-center">
                    <img
                      src={item.imageUrl}
                      alt={item.itemTitle}
                      className="w-12 h-12 inline-block cursor-pointer"
                      onClick={() => setPopupImage(item.imageUrl)}
                    />
                    <div className="ml-2">
                      <a
                        href={item.itemUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        <strong>{item.itemTitle}</strong>
                      </a>
                    </div>
                  </td>
                  <td className="p-2 text-center">{item.quantity}</td>
                  <td className="p-2 text-center">
                    <input
                      type="number"
                      value={item.received}
                      onChange={(e) => updateItem(index, 'received', parseInt(e.target.value, 10))}
                      min="0"
                      className="w-full p-1 border rounded bg-emerald-100"
                    />
                  </td>
                  <td className="p-2 text-center">
                    <input
                      type="number"
                      value={item.damage}
                      onChange={(e) => updateItem(index, 'damage', parseInt(e.target.value, 10))}
                      min="0"
                      className="w-full p-1 border rounded bg-red-100"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {popupImage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
          <div className="relative">
            <img src={popupImage} alt="Full Screen" className="max-w-full max-h-full" />
            <button
              onClick={() => setPopupImage(null)}
              className="absolute top-0 right-0 m-4 p-2 bg-white text-black rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
