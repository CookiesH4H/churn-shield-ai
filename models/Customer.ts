import mongoose, { Schema, Document } from "mongoose";

export interface IMonthlyHistory {
  calmonth: string;
  totalCoolers: number;
  totalDoors: number;
  totalTransactions: number;
  totalBoxesSold: number;
  target: number;
}

export interface ICustomer extends Document {
  customerId: string;
  territory: string;
  subchannel: string;
  size: string;
  history: IMonthlyHistory[];
  churnRiskScore: number;
}

const MonthlyHistorySchema: Schema = new Schema({
  calmonth: { type: String },
  totalCoolers: { type: Number, default: 0 },
  totalDoors: { type: Number, default: 0 },
  totalTransactions: { type: Number, default: 0 },
  totalBoxesSold: { type: Number, default: 0 },
  target: { type: Number, default: 0 },
});

const CustomerSchema: Schema = new Schema({
  customerId: { type: String, required: true, unique: true },
  territory: { type: String },
  subchannel: { type: String },
  size: { type: String },
  history: [MonthlyHistorySchema],
  churnRiskScore: { type: Number, default: 0 },
});

export default mongoose.models.Customer || mongoose.model<ICustomer>("Customer", CustomerSchema);
