export default async function handler(req, res) {
    const { method } = req;
    const { name } = req.query;
  
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';
  
    const response = await fetch(`${backendUrl}/api/transfers/${name}`, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: method === 'PUT' ? JSON.stringify(req.body) : null,
    });
  
    const data = await response.json();
    res.status(response.status).json(data);
  }
  