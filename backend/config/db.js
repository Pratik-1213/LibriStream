import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect("mongodb+srv://kumbharpratik1213_db_user:LKOtEDsQoTQuwsTU@cluster0.hjkmgz7.mongodb.net/libriStreamDB?retryWrites=true&w=majority");
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;