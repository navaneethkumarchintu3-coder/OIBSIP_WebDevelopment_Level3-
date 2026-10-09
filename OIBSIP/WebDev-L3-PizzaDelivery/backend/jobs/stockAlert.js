const cron = require('node-cron');
const nodemailer = require('nodemailer');
const Inventory = require('../models/Inventory');

// Runs every hour. In production, tune the schedule to your order volume.
function startStockAlertJob() {
  cron.schedule('0 * * * *', async () => {
    try {
      const lowStockItems = await Inventory.find({
        $expr: { $lt: ['$stock', '$lowStockThreshold'] }
      });

      if (lowStockItems.length === 0) return;

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.ALERT_EMAIL_USER,
          pass: process.env.ALERT_EMAIL_PASS // use an app password, not your real password
        }
      });

      const list = lowStockItems.map(i => `${i.name} (${i.stock} left)`).join(', ');

      await transporter.sendMail({
        from: process.env.ALERT_EMAIL_USER,
        to: process.env.ADMIN_EMAIL,
        subject: 'Low stock alert — Pizza Delivery',
        text: `The following items are running low: ${list}`
      });

      console.log('Low stock alert sent:', list);
    } catch (err) {
      console.error('Stock alert job failed:', err.message);
    }
  });
}

module.exports = { startStockAlertJob };
