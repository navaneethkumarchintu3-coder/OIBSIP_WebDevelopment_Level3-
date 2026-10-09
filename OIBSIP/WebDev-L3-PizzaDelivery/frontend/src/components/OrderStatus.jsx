import { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api';
const STAGES = ['Order Received', 'In Kitchen', 'Sent to Delivery'];

export default function OrderStatus({ token }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    let interval;
    async function fetchOrders() {
      const { data } = await axios.get(`${API}/orders/mine`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(data);
    }
    fetchOrders();
    // Polling every 5s stands in for a WebSocket connection. For true
    // real-time updates, swap this for a socket.io subscription instead.
    interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, [token]);

  return (
    <div style={{ maxWidth: 480, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h2>Your orders</h2>
      {orders.length === 0 && <p>No orders yet.</p>}
      {orders.map(order => (
        <div key={order._id} style={{ border: '1px solid #ddd', borderRadius: 8, padding: 14, marginBottom: 12 }}>
          <strong>{order.pizza.base}</strong> with {order.pizza.cheese} — ₹{order.price}
          <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
            {STAGES.map(stage => (
              <span key={stage} style={{
                flex: 1, textAlign: 'center', fontSize: 12, padding: '6px 4px', borderRadius: 4,
                background: STAGES.indexOf(order.status) >= STAGES.indexOf(stage) ? '#e2572b' : '#eee',
                color: STAGES.indexOf(order.status) >= STAGES.indexOf(stage) ? '#fff' : '#666'
              }}>
                {stage}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
