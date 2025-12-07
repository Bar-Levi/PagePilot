import mongoose from "mongoose";

/**
 * MongoDB Connection Client
 * 
 * Singleton pattern for connection reuse across requests.
 * Required environment variable: MONGODB_URI
 */

interface MongooseCache {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

declare global {
    // eslint-disable-next-line no-var
    var mongooseCache: MongooseCache | undefined;
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
const cached: MongooseCache = global.mongooseCache ?? { conn: null, promise: null };

if (!global.mongooseCache) {
    global.mongooseCache = cached;
}

/**
 * Connect to MongoDB
 * Returns cached connection if available, otherwise creates new connection
 */
export async function connectDB(): Promise<typeof mongoose> {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const mongoUri = process.env.MONGODB_URI;

        if (!mongoUri) {
            throw new Error(
                "Please define the MONGODB_URI environment variable inside .env.local"
            );
        }

        const opts = {
            bufferCommands: false,
        };

        cached.promise = mongoose.connect(mongoUri, opts).then((mongooseInstance) => {
            console.log("✅ MongoDB connected successfully");
            return mongooseInstance;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

/**
 * Disconnect from MongoDB
 * Useful for cleanup in tests
 */
export async function disconnectDB(): Promise<void> {
    if (cached.conn) {
        await mongoose.disconnect();
        cached.conn = null;
        cached.promise = null;
        console.log("MongoDB disconnected");
    }
}

export default connectDB;
