import type { Document } from 'mongoose';
import { model, Schema } from 'mongoose';

export interface ITrainStop {
  stationCode: string;
  stationName: string;
  arrivalTime?: string; // HH:MM
  departureTime?: string; // HH:MM
  dayOffset: number; // 0 = same day as journey start
  distanceKm: number;
}

/**
 * `trainSchedules` collection (TRD 12.1). Cached train schedule data from
 * the IRCTC/RailAPI provider; embeds the stops array. TTL-expired after
 * 24 hours (see index below) to force a periodic refresh.
 */
export interface ITrainSchedule extends Document {
  trainNumber: string;
  trainName: string;
  date: string; // YYYY-MM-DD
  stops: ITrainStop[];
  isCancelled: boolean;
  delayMinutes: number;
  cachedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const trainStopSchema = new Schema<ITrainStop>(
  {
    stationCode: { type: String, required: true },
    stationName: { type: String, required: true },
    arrivalTime: { type: String },
    departureTime: { type: String },
    dayOffset: { type: Number, default: 0 },
    distanceKm: { type: Number, default: 0 },
  },
  { _id: false },
);

const trainScheduleSchema = new Schema<ITrainSchedule>(
  {
    trainNumber: { type: String, required: true, match: /^\d{5}$/ },
    trainName: { type: String, required: true },
    date: { type: String, required: true },
    stops: { type: [trainStopSchema], default: [] },
    isCancelled: { type: Boolean, default: false },
    delayMinutes: { type: Number, default: 0 },
    cachedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

trainScheduleSchema.index({ trainNumber: 1, date: 1 }, { unique: true });
// TRD 12.3: TTL index, 24-hour cache expiry.
trainScheduleSchema.index({ cachedAt: 1 }, { expireAfterSeconds: 86400 });

export const TrainScheduleModel = model<ITrainSchedule>('TrainSchedule', trainScheduleSchema);
