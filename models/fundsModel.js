import mongoose from 'mongoose';

const fundSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: 'INR',
  },
  transactionId: {
    type: String,  
    required: true,
  },
  orderId: {
    type: String,
    required: true,
  },
  receipt: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['created', 'failed', 'successful'],
    default: 'created',
  },
  signature: String,
}, {
  timestamps: true,
});

const Fund = mongoose.model('Fund', fundSchema);

export default Fund;
