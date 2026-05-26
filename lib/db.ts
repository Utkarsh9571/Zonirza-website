import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || '';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached!.conn) {
    return cached!.conn;
  }

  if (!cached!.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached!.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      mongooseInstance.connection.once('open', async () => {
        try {
          const userCol = mongooseInstance.connection.collection('users');
          const indexes = await userCol.indexes();
          const emailIdx = indexes.find(idx => idx.name === 'email_1');
          if (emailIdx && !emailIdx.sparse) {
            console.log('[DB MIGRATION] Dropping non-sparse email_1 index...');
            await userCol.dropIndex('email_1');
            console.log('[DB MIGRATION] Dropped non-sparse email_1 index successfully.');
          }
        } catch (err) {
          console.log('[DB MIGRATION] Index check skipped/not required:', (err as any).message);
        }
      });
      return mongooseInstance;
    });
  }

  try {
    cached!.conn = await cached!.promise;
  } catch (e) {
    cached!.promise = null;
    throw e;
  }

  return cached!.conn;
}

export default dbConnect;
