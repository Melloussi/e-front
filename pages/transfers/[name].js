import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { updateTransferStatus } from '../api/transfers/updateTransferStatus';
import ScrollToTopButton from '../components/ScrollToTopButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

export default function TransferDetails() {
  const router = useRouter();
  const { name } = router.query;
  const [transfer, setTransfer] = useState(null);
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [popupImage, setPopupImage] = useState(null);
  const [showMessage, setShowMessage] = useState(false);
  const [saveSwitch, setSaveSwitch] = useState(0);
  const IP = "in progress";
  const CD = "completed";
  //-------------- update statue ----
  
  const [status, setStatus] = useState('in progress');
  const [message, setMessage] = useState('');
  
  //-------------------

  const handleSubmit = async (name, status) => {
    //e.preventDefault();

    try {
      const result = await updateTransferStatus(name, status);
      setMessage(`Status updated successfully: ${JSON.stringify(result)}`);
    } catch (error) {
      setMessage(`Error updating status: ${error.message}`);
    }

   /* switch (name) {
      case 'in progress':
        updatedStatus = 'in progress';
        break;
      case 'completed':
        updatedStatus = 'completed';
        break;
      default:
        updatedStatus = status; // Use the status from the input if no case matches
    }*/

  };

  const markAsCompleted = () => {
    if (status !== CD) {
      handleSubmit(name, CD);
      setStatus(CD);
      console.log("Transfer Status Changed TO: "+status);
    } else {
      console.log("[-] Transfer Status doesn't Changed: " + status + " [-]");
    }
  };

  useEffect(() => {
    if (name) {
      fetch(`/api/transfers/${name}`)
        .then((response) => response.json())
        .then((data) => {
          setTransfer(data);
          setItems(data.items);
          setStatus(data.status)
        })
        .catch((error) => console.error('Error fetching transfer:', error));
    }
  }, [name]);
  //Reload & Exit confirmation
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      const message = 'Are you sure you want to leave? Changes you made may not be saved.';
      event.returnValue = message;
      return message;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  let saveTimer;

  //Auto Save after 3 second
  useEffect(() => {
    if(saveSwitch == 2){
      if (saveTimer) {
        clearTimeout(saveTimer);
      }
  
      saveTimer = setTimeout(() => {
        handleSave()
      }, 3000);
  
      return () => clearTimeout(saveTimer);
    }else{
      setSaveSwitch(saveSwitch+1);
      console.log("Avoid Saving...")
    }
  }, [items]);

  const updateItem = (index, key, value) => {
    const newItems = [...items];
    newItems[index][key] = value;
    setItems(newItems);
  };

  const handleSave = () => {
    fetch(`/api/transfers/${name}`, {
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

        
        if(status !== IP){
          handleSubmit(name, IP)
          setStatus(IP)
          console.log("Transfer Statu Changed TO: "+status)
        }else{
          console.log("[-]Transfer Statu doesn't Changed: "+status+" [-]")
        }
      })
      .catch((error) => console.error('Error saving transfer:', error));
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
  return (
    <div className="min-h-screen bg-lightbrown p-4 sm:p-6 lg:p-8">
      <Head>
        <title>{transfer.name} - Transfer Details</title>
      </Head>
      <main className="container mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-white mb-4">{transfer.name}</h1>
        <p className="text-center text-white mb-4">Created Date: {new Date(transfer.createdDate).toLocaleDateString()}</p>
        <p className="text-center text-white mb-4">status: {status}</p>

        <ScrollToTopButton />

        <div className='flex flex-row-reverse'>

        <button onClick={handleSave} className="ml-8 w-20 sm:w-40 py-2 mb-4 bg-[#b39570] border-2 border-[#8a7357] text-white font-bold rounded">
          Save
        </button>
        
        <Link href={`/preview/${transfer.name}`}>
        <button className=" ml-8 w-20 sm:w-40 py-2 mb-4 bg-[#b39570] border-2 border-[#8a7357] text-white font-bold rounded">
          preview
        </button>
        </Link>
        <button onClick={markAsCompleted} className=" w-20 sm:w-40 py-2 mb-4 bg-[#b39570] border-2 border-[#8a7357] text-white font-bold rounded">
          mark as complet
        </button>
        
       
        </div>

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
                  <td className="p-2 text-center w-1/12">
                    <input
                      type="number"
                      value={item.received}
                      onChange={(e) => updateItem(index, 'received', parseInt(e.target.value, 10))}
                      min="0"
                      //className="w-full pl-1 border rounded bg-emerald-100"
                     //className="w-6 p-1 border rounded bg-emerald-100 text-center"
                     className="w-8 sm:w-20 p-1 border rounded bg-emerald-100 text-center"

                    />
                  </td>
                  <td className="p-2 text-center w-1/12">
                    <input
                      type="number"
                      value={item.damage}
                      onChange={(e) => updateItem(index, 'damage', parseInt(e.target.value, 10))}
                      min="0"
                      //className="w-full p-1 border rounded bg-red-100"
                      //className="w-6 p-1 border rounded bg-red-100 text-center"
                      className="w-8 sm:w-20 p-1 border rounded bg-red-100 text-center"
                    />
                  </td>
                </tr>
              )
              
              )
              
              }
            </tbody>
          </table>
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
