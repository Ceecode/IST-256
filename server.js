const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// In-memory "Simple Storage"
let billingSubmissions = [];
let returnSubmissions = [];

// --- BILLING ENDPOINTS ---
app.post('/api/billing', (req, res) => {
   const data = req.body;
   billingSubmissions.push(data);
   console.log("New Billing Received:", data);
   res.status(201).send({ message: "Billing details processed successfully!", data });
});

// --- RETURNS ENDPOINTS ---
app.post('/api/returns', (req, res) => {
   const data = req.body;
   returnSubmissions.push(data);
   console.log("New Return Request:", data);
   res.status(201).send({ message: "Return request submitted!", data });
});

app.get('/api/returns', (req, res) => {
   res.json(returnSubmissions);
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
