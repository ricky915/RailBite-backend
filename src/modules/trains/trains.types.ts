export interface TrainStopView {
  stationCode: string;
  stationName: string;
  arrivalTime?: string;
  departureTime?: string;
  dayOffset: number;
  distanceKm: number;
}

export interface TrainSearchResult {
  trainNumber: string;
  trainName: string;
  date: string;
  stops: TrainStopView[];
  isCancelled: boolean;
  delayMinutes: number;
}

export interface PnrLookupResult extends TrainSearchResult {
  pnr: string;
  passengerName: string;
  boardingStation: string;
  coach: string;
  seat: string;
  bookingStatus: 'CONFIRMED' | 'RAC' | 'WAITLISTED';
}
