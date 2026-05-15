const mongoose = require('mongoose');

async function run() {
  const conn = await mongoose.createConnection('mongodb+srv://zonirazjewelhouse_db_user:zyrCfjZ1wVDm2kdf@cluster0.dnlzvq8.mongodb.net/?appName=Cluster0').asPromise();
  const admin = conn.db.admin();
  const dbs = await admin.listDatabases();
  console.log(dbs);
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
