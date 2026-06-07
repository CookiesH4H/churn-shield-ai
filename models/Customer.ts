import mongoose, { Schema, Document } from "mongoose";

export interface ICustomer extends Document {
  customerId: string;
  name?: string;
  email?: string;
  planTier?: string;
  signupDate?: string;
  avatar?: string;
  lastLogin?: string;
  daysInactive?: number;
  sessionsLast30d?: number;
  coreFeatureUsage?: number;
  timeSpentWeekly?: number;
  mrr?: number;
  billingCycle?: string;
  paymentFailures?: number;
  openTickets?: number;
  npsScore?: number;
  churnRiskScore?: number;
  riskLevel?: string;
  primaryRiskFactor?: string;
  accionComercial?: string;
  churnReason?: string;
}

const CustomerSchema: Schema = new Schema({
  customerId: { type: String, required: true, unique: true },
}, { strict: false }); // Allow dynamic fields from the ETL script

export default mongoose.models.Customer || mongoose.model<ICustomer>("Customer", CustomerSchema);
