const express = require('express');
const cors = require('cors');
const connectToDB = require('./config/db');
const inventoryRoutes = require('./routes/inventoryRoutes');
const donorRoutes = require('./routes/DonorRoutes');
const logisticsRoutes = require('./routes/logisticsRoutes');
const OrganizationRouter = require('./routes/organization'); 
const NotificationRouter = require('./routes/NotificationRoutes');
const authRoutes = require('./routes/auth');



require('dotenv').config();

const app = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/auth', authRoutes);
app.use('/inventory',inventoryRoutes);
app.use('/donors',donorRoutes);
app.use('/logistics',logisticsRoutes);
app.use('/organizations',OrganizationRouter); 
app.use('/notifications',NotificationRouter);


app.get('/', (req, res) => {
  res.send('NGO Resource Tracker API is running');
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, async() => {
  await connectToDB();
  console.log(`Server running on port http://localhost:${PORT}`);
});