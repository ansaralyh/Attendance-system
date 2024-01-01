// models/counter.model.js

import mongoose from 'mongoose';

const counterSchema = new mongoose.Schema({
  onTimeCount: {
    type: Number,
    default: 0,
  },
  lateArrivalCount: {
    type: Number,
    default: 0,
  },
  absentCount: {
    type: Number,
    default: 0,
  },
});

const Counter = mongoose.model('Counter', counterSchema);

export default Counter;
