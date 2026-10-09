# Pizza Delivery Full-Stack App — Starter Scaffold

This is a **starting architecture**, not the finished Level 3 deliverable. The task
sheet itself flags Level 3 as requiring solid React + Node + MongoDB experience —
this scaffold gives you a working skeleton to build the rest on top of in an IDE
(VS Code / Claude Code), since a full MERN app with live payments isn't something
that can be finished end-to-end in a chat window.

## What's fully wired
- Express server with MongoDB (Mongoose) connection
- User registration/login with bcrypt password hashing + JWT auth
- Role-based middleware (`requireAuth`, `requireAdmin`)
- Order model + routes: create order, view own orders, admin view-all, admin status update
- Inventory model + routes: public read, admin manual stock update, auto-decrement on order
- node-cron job checking inventory every hour and emailing the admin on low stock
- React pizza-builder flow (4 steps: base → sauce → cheese → vegetables)
- Razorpay test-mode checkout wired into the builder (`checkout.js` + test key)
- User dashboard polling `/api/orders/mine` every 5s to show live status

## What's intentionally stubbed — you need to finish these
- **Email verification on register** — marked with a `TODO` in `routes/auth.js`; add nodemailer here similar to `jobs/stockAlert.js`
- **Forgot password flow** — not implemented; needs a reset-token model + email
- **Real-time via WebSockets** — currently uses polling (`setInterval`); swap for `socket.io` if you want push updates instead
- **Admin login/inventory dashboard UI** — only the API routes exist; build the React admin pages using `OrderStatus.jsx` as a pattern
- **Razorpay key** — replace `rzp_test_XXXXXXXXXXXX` in `PizzaBuilder.jsx` with your own test key from the Razorpay dashboard
- **`.env` file** — create one in `/backend` with `MONGO_URI`, `JWT_SECRET`, `ALERT_EMAIL_USER`, `ALERT_EMAIL_PASS`, `ADMIN_EMAIL`

## Running it locally
```bash
# backend
cd backend
npm install
npm run dev

# frontend
cd frontend
npm install
npm start
```

## Folder structure
```
WebDev-L3-PizzaDelivery/
├── backend/
│   ├── models/       (User, Order, Inventory)
│   ├── routes/       (auth, orders, inventory)
│   ├── middleware/   (JWT auth)
│   ├── jobs/         (stock alert cron)
│   └── server.js
└── frontend/
    └── src/components/  (PizzaBuilder, OrderStatus)
```
