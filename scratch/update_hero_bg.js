const mongoose = require('mongoose');
const Schema = mongoose.Schema;

async function run() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect('mongodb+srv://zonirazjewelhouse_db_user:zyrCfjZ1wVDm2kdf@cluster0.dnlzvq8.mongodb.net/test?appName=Cluster0');
  
  // List collections to be absolutely sure about the collection name
  const collections = await mongoose.connection.db.listCollections().toArray();
  console.log("Available collections:", collections.map(c => c.name));
  
  const HomepageContent = mongoose.model(
    'HomepageContent', 
    new Schema({}, { collection: 'homepagecontents', strict: false })
  );

  console.log("Searching for HomepageContent document...");
  const content = await HomepageContent.findOne({});
  if (content) {
    console.log("Current document:", JSON.stringify(content, null, 2));
    
    // Update the hero imageUrl to /images/hero-bg.avif
    const hero = content.get('hero') || {};
    hero.imageUrl = '/images/hero-bg.avif';
    content.set('hero', hero);
    content.markModified('hero');
    
    await content.save();
    console.log("Document updated successfully!");
    console.log("Updated document:", JSON.stringify(content, null, 2));
  } else {
    console.log("No HomepageContent document found in database.");
  }

  process.exit(0);
}

run().catch(err => {
  console.error("Error executing script:", err);
  process.exit(1);
});
