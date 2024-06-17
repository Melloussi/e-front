import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import ScrollToTopButton from '../components/ScrollToTopButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCopy } from '@fortawesome/free-solid-svg-icons';
import Collapsible from 'react-collapsible';

export default function TransferDetails() {
  const router = useRouter();
  const { name } = router.query;
  const [transfer, setTransfer] = useState(null);
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [popupImage, setPopupImage] = useState(null);
  const [showMessage, setShowMessage] = useState(false);
  const [saveSwitch, setSaveSwitch] = useState(0);

  useEffect(() => {
    if (name) {
      fetch(`/api/transfers/${name}`)
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


  const filteredItems = items.filter((item) =>
    item.itemTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!transfer) {
    return <div>Loading...</div>;
  }
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  //---------------------

  const getRowStyle = (item) => {
    if (transfer.status !== 'completed') return '';

    if (item.damage > 0) {
      return 'bg-red-300 border-2 border-red-600';
    } else if (item.received > item.quantity) {
      return 'bg-orange-400 border-2 border-orange-600';
    } else if (item.received < item.quantity) {
      return 'bg-yellow-100 border-2 border-yellow-600';
    } else if (item.received === item.quantity && item.damage === 0) {
      return 'bg-green-100 border-2 border-green-600';
    }

    return '';
  };

  //------------------------

  const generateSummary = () => {
    let summary = '';

    const removedItems = items.filter(item => item.received === 0);
    const damagedItems = items.filter(item => item.damage > 0);
    const receivedItems = items.filter(item => item.received > 0 && item.received !== item.quantity);

    if (removedItems.length > 0) {
      summary += '- Removed -\n\n';
      removedItems.forEach(item => {
        summary += `- ${item.quantity}x ${item.itemTitle} - not received, removed from the transfer\n`;
      });
      summary += '\n';
    }

    if (damagedItems.length > 0) {
      summary += '- Damaged -\n\n';
      damagedItems.forEach(item => {
        summary += `- ${item.damage}x - ${item.itemTitle}\n`;
      });
      summary += '\n';
    }

    if (receivedItems.length > 0) {
      summary += '- Received -\n\n';
      receivedItems.forEach(item => {
        summary += `- ${item.itemTitle} - received ${item.received} instead of ${item.quantity}\n`;
      });
    }

    return summary;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const SummarySection = ({ title, content, onCopy }) => {
    return (
      <div className="border-2 border-[#4b4032] rounded-lg">
        <Collapsible
          trigger={
            <h2 className="text-lg font-bold text-gray-200 bg-[#71614b] p-4 cursor-pointer flex justify-between items-center">
              <span>{title}</span>
              <span>&#9660;</span>
            </h2>
          }
          transitionTime={250}
        >
          <div className="p-4 bg-[#937d62] text-white">
            <div className="whitespace-pre-line">{content}</div>
            <button
              onClick={onCopy}
              className="mt-2 px-4 py-2 bg-[#71614b] text-white rounded hover:bg-[#b1a698] focus:outline-none"
            >
              <FontAwesomeIcon icon={faCopy} /> Copy
            </button>
          </div>
        </Collapsible>
      </div>
    );
  };

  const removedItems = generateSummary().includes('- Removed -') ? generateSummary().split('- Removed -')[1].split('- Damaged -')[0].trim() : '';
const damagedItems = generateSummary().includes('- Damaged -') ? generateSummary().split('- Damaged -')[1].split('- Received -')[0].trim() : '';
const receivedItems = generateSummary().includes('- Received -') ? generateSummary().split('- Received -')[1].trim() : '';

  //----------------------
  return (
    <div className="min-h-screen bg-lightbrown p-4 sm:p-6 lg:p-8">
      <Head>
        <title>{transfer.name} - Transfer Details</title>
      </Head>
      <main className="container mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-white mb-4">{transfer.name}</h1>
        <p className="text-center text-white mb-4">Created Date: {new Date(transfer.createdDate).toLocaleDateString()}</p>

        <ScrollToTopButton />
       {/*
       
       -------- Edit Button Keep it hiding for now ----

       <Link href={`/transfers/${transfer.name}`}>
        <button className=" ml-8 w-20 sm:w-40 py-2 mb-4 bg-[#b39570] border-2 border-[#8a7357] text-white font-bold rounded">
          Edite
        </button>
        </Link>
        -----------------------------------------------
        */}

      <div className="relative w-full  mb-8" >
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Search items"
        className="block w-full p-2 pr-10 border border-gray-300 rounded p-4"
      />
      {searchTerm && (
        <button
        onClick={clearSearch}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 bg-red-500 text-white rounded-full focus:outline-none flex items-center justify-center w-6 h-6"
      >
        <FontAwesomeIcon icon={faTimes} />
      </button>
      )}
    
    </div>
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
              {
            
              filteredItems.map((item, index) => (
                <tr key={index} className={`border-t ${getRowStyle(item)}`}>
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
                        <strong className='text-black'>{item.itemTitle}</strong>
                      </a>
                    </div>
                  </td>
                  <td className="p-2 text-center">{item.quantity}</td>
                  <td className="p-2 text-center">{item.received}</td>
                  <td className="p-2 text-center">{item.damage}</td>
                </tr>
              ))
              
              }
            </tbody>
          </table>
          








          <div className="mt-8 space-y-4">
    {removedItems && (
      <SummarySection
        title="- Removed -"
        content={removedItems}
        onCopy={() => copyToClipboard(removedItems)}
      />
    )}
    {damagedItems && (
      <SummarySection
        title="- Damaged -"
        content={damagedItems}
        onCopy={() => copyToClipboard(damagedItems)}
      />
    )}
    {receivedItems && (
      <SummarySection
        title="- Received -"
        content={receivedItems}
        onCopy={() => copyToClipboard(receivedItems)}
      />
    )}
  </div>













        </div>
      </main>

      {popupImage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
          <div className="relative">
            <img src={popupImage} alt="Full Screen" className="w-[70vw] h-[70vh] object-contain mx-auto" />
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
