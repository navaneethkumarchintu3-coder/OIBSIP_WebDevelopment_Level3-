import { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api';

// Static option lists — swap for inventory-driven lists once /api/inventory
// is wired to filter out out-of-stock items.
const BASES = ['Thin Crust', 'Deep Dish', 'Wheat', 'Cheese Burst', 'Gluten Free'];
const SAUCES = ['Tomato', 'BBQ', 'Pesto', 'Alfredo', 'Spicy Arrabbiata'];
const CHEESES = ['Mozzarella', 'Cheddar', 'Vegan Cheese'];
const VEGGIES = ['Onion', 'Capsicum', 'Mushroom', 'Olives', 'Corn', 'Jalapeno'];

export default function PizzaBuilder({ token }) {
  const [step, setStep] = useState(1);
  const [pizza, setPizza] = useState({ base: '', sauce: '', cheese: '', vegetables: [] });
  const [placing, setPlacing] = useState(false);

  const toggleVeggie = (v) => {
    setPizza(p => ({
      ...p,
      vegetables: p.vegetables.includes(v)
        ? p.vegetables.filter(x => x !== v)
        : [...p.vegetables, v]
    }));
  };

  const price = 199 + pizza.vegetables.length * 20; // placeholder pricing logic

  // Loads Razorpay's checkout script once
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  async function handleCheckout() {
    setPlacing(true);
    // Test-mode flow: in production this amount/order would come from a
    // server-created Razorpay order via /orders endpoint on their API.
    const options = {
      key: 'rzp_test_XXXXXXXXXXXX', // replace with your Razorpay test key
      amount: price * 100, // paise
      currency: 'INR',
      name: 'Pizza Delivery',
      description: 'Custom pizza order',
      handler: async function (response) {
        // response.razorpay_payment_id confirms test payment success
        await axios.post(`${API}/orders`, {
          pizza,
          price,
          paymentId: response.razorpay_payment_id
        }, { headers: { Authorization: `Bearer ${token}` } });
        alert('Order placed! Track it on your dashboard.');
        setPlacing(false);
      },
      modal: { ondismiss: () => setPlacing(false) }
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  }

  return (
    <div style={{ maxWidth: 480, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h2>Build your pizza — step {step} of 4</h2>

      {step === 1 && (
        <Options title="Choose a base" list={BASES} selected={pizza.base}
          onSelect={(v) => setPizza({ ...pizza, base: v })} />
      )}
      {step === 2 && (
        <Options title="Choose a sauce" list={SAUCES} selected={pizza.sauce}
          onSelect={(v) => setPizza({ ...pizza, sauce: v })} />
      )}
      {step === 3 && (
        <Options title="Choose a cheese" list={CHEESES} selected={pizza.cheese}
          onSelect={(v) => setPizza({ ...pizza, cheese: v })} />
      )}
      {step === 4 && (
        <div>
          <h3>Choose vegetables (multi-select)</h3>
          {VEGGIES.map(v => (
            <label key={v} style={{ display: 'block', margin: '6px 0' }}>
              <input type="checkbox" checked={pizza.vegetables.includes(v)}
                onChange={() => toggleVeggie(v)} /> {v}
            </label>
          ))}
        </div>
      )}

      <div style={{ marginTop: 20, display: 'flex', justifyContent: 'space-between' }}>
        <button disabled={step === 1} onClick={() => setStep(step - 1)}>Back</button>
        {step < 4
          ? <button onClick={() => setStep(step + 1)}>Next</button>
          : <button disabled={placing} onClick={handleCheckout}>
              {placing ? 'Processing...' : `Pay ₹${price} & Order`}
            </button>}
      </div>
    </div>
  );
}

function Options({ title, list, selected, onSelect }) {
  return (
    <div>
      <h3>{title}</h3>
      {list.map(item => (
        <button
          key={item}
          onClick={() => onSelect(item)}
          style={{
            display: 'block', width: '100%', margin: '6px 0', padding: 10,
            background: selected === item ? '#e2572b' : '#eee',
            color: selected === item ? '#fff' : '#000',
            border: 'none', borderRadius: 6, cursor: 'pointer'
          }}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
