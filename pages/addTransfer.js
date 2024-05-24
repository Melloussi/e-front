import { useState } from 'react';
import Head from 'next/head';

export default function AddTransfer() {
  const [name, setName] = useState('');
  const [items, setItems] = useState('');
  const [message, setMessage] = useState('');
  const [showExample, setShowExample] = useState(false);

  const validateItems = (items) => {
    try {
      const parsedItems = JSON.parse(items);
      if (!Array.isArray(parsedItems)) return false;
      for (const item of parsedItems) {
        if (
          typeof item.imageUrl !== 'string' ||
          typeof item.itemTitle !== 'string' ||
          typeof item.itemUrl !== 'string' ||
          typeof item.quantity !== 'string'
        ) {
          return false;
        }
      }
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setMessage('Transfer name is required');
      return;
    }

    if (!validateItems(items)) {
      setMessage('Invalid items format. Please ensure it is a valid JSON array.');
      return;
    }

    const requestData = {
      name,
      items: JSON.parse(items),
    };

    console.log('Submitting request data:', requestData);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/transfers`, { // Ensure the correct URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Response data:', data);
        setMessage('Transfer added successfully');
      } else {
        const errorData = await response.json();
        console.error('Error response data:', errorData);
        setMessage(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setMessage('Error adding transfer');
    }
  };

  return (
    <div className="min-h-screen bg-lightbrown p-4 sm:p-6 lg:p-8">
      <Head>
        <title>Add Transfer</title>
      </Head>
      <main className="container mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-white mb-4">Add Transfer</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-white mb-2" htmlFor="name">
              Transfer Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-white mb-2" htmlFor="items">
              Items (JSON Array)
            </label>
            <textarea
              id="items"
              value={items}
              onChange={(e) => setItems(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              rows="10"
              required
            />
            <button
              type="button"
              onClick={() => setShowExample(!showExample)}
              className="text-blue-500 hover:underline mt-2"
            >
              See Example
            </button>
            {showExample && (
              <pre className="bg-gray-100 p-2 mt-2 rounded">
                {JSON.stringify([
                  {
                    imageUrl: 'https://example.com/image1.jpg',
                    itemTitle: 'Item 1 Title',
                    itemUrl: 'https://example.com/item1',
                    quantity: '0 of 12',
                  },
                  {
                    imageUrl: 'https://example.com/image2.jpg',
                    itemTitle: 'Item 2 Title',
                    itemUrl: 'https://example.com/item2',
                    quantity: '0 of 12',
                  },
                ], null, 2)}
              </pre>
            )}
          </div>
          <button type="submit" className="block w-full py-2 mb-4 bg-blue-600 text-white font-bold rounded">
            Add Transfer
          </button>
          {message && <div className="text-center text-green-600">{message}</div>}
        </form>
      </main>
    </div>
  );
}
