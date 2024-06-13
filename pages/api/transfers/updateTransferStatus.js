// utils/api.js

export async function updateTransferStatus(name, status) {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

    const response = await fetch(`${backendUrl}/api/transfers/${name}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
  
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
  
    const data = await response.json();
    return data;
  }
  