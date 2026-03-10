require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 7000;

// Connect to Database
connectDB();

// Seeding logic (moved from index.js)
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const seedAdmin = async () => {
    try {
        const adminEmail = 'shreenithya111@gmail.com';
        const adminPass = '4739Nith';
        const existingAdmin = await User.findOne({ email: adminEmail });
        if (!existingAdmin) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(adminPass, salt);
            const newAdmin = new User({
                name: 'Imperial Admin',
                email: adminEmail,
                phone: '0000000000',
                password: hashedPassword,
                isAdmin: true
            });
            await newAdmin.save();
            console.log('💎 Royal Admin Account Secured and Synced (Modular).');
        }
    } catch (err) {
        console.error('Admin Seeding Error:', err);
    }
};

seedAdmin();

app.listen(PORT, () => {
    console.log(`🚀 Production Ready Server spinning at http://localhost:${PORT}`);
});
