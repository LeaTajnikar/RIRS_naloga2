const express = require('express');
const cors = require('cors');
const {initializeFirestore} = require('./src/config/firebase.js');
const authRoutes = require('./src/routes/authenticationRoutes.js');
const workHoursRoutes = require('./src/routes/workingHoursRoutes.js');
const sickAbsenceRoutes = require('./src/routes/sickAbsenceRoutes.js');
const vacationAbsenceRoutes = require('./src/routes/vacationAbsenceRoutes.js');
const adminDashboardRoutes = require('./src/routes/adminDashboardRoutes.js');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

initializeFirestore();

app.use('/api/auth', authRoutes);
app.use('/api/workHours', workHoursRoutes);
app.use('/api/sickAbsence', sickAbsenceRoutes);
app.use('/api/vacationAbsence', vacationAbsenceRoutes);
app.use('/api/adminDashboard', adminDashboardRoutes);


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get('/api/hello', (req, res) => {
  res.status(200).json({ message: 'Hello, world!' });
});

module.exports = app;