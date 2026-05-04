import mongoose from 'mongoose';
// Direct import to avoid alias issues
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://admin:admin@cluster0.mongodb.net/jewellery?retryWrites=true&w=majority'; 

async function test() {
  try {
    console.log('Connecting to DB...');
    // Try to connect directly
    await mongoose.connect(MONGODB_URI);
    console.log('Connected!');
    
    // Check if models exist
    const collections = await mongoose.connection.db!.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
    
    process.exit(0);
  } catch (err) {
    console.error('Connection failed:', err);
    process.exit(1);
  }
}

test();
