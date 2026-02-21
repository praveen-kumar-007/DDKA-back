const mongoose = require('mongoose');
const dns = require('dns');

// Only override DNS for local / non-production environments.
// - Safe for development to work around corporate DNS that blocks SRV queries.
// - SKIPPED in production (e.g. Render) to avoid interfering with platform DNS/VPC.
// To force the override in other environments (not recommended) set DNS_OVERRIDE=true.


const shouldOverrideDns = (process.env.NODE_ENV || 'development') !== 'production' || process.env.DNS_OVERRIDE === 'true';
if (shouldOverrideDns) {
    try {
        dns.setServers(['8.8.8.8', '1.1.1.1']);
        console.log('DNS servers overridden for this process: ', dns.getServers());
    } catch (err) {
        console.warn('Failed to set DNS servers for process:', err.message);
    }
} else {
    console.log('DNS override skipped (production).');
}

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;