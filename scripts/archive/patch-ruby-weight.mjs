import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/jewelry-starter';

async function main() {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();

  let db = client.db('test');
  let count = await db.collection('products').countDocuments();
  if (count === 0) {
    db = client.db('luxury-jewelryjewelhouse');
  }

  const res = await db.collection('products').updateOne(
    { slug: 'ruby-floral-accent-bangle-demo' },
    { 
      $set: { 
        'specs.stoneWeight': '1.50',
        'diamondWeightCarats': 1.50
      } 
    }
  );

  console.log('Update result:', res);
  await client.close();
}

main().catch(console.error);
