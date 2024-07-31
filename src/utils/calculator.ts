import type { CarRate } from "./rates";

export const fetchDrivingDistance = async (startLocation: string, endLocation: string) => {
  const url = `/api/directions/v2:computeRoutes`;

  const requestBody = {
    origin: {
      address: startLocation,
    },
    destination: {
      address: endLocation,
    },
    travelMode: 'DRIVE'
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': 'AIzaSyDWD7Q6Kh7d21CzdR_ZCY42otSgAovcRVU',
      'X-Goog-FieldMask': '*'
    },

    body: JSON.stringify(requestBody)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Error fetching distance: ${data.error.message}`);
  }

  const distanceInMeters = data.routes[0].legs[0].distanceMeters;
  const durationInSeconds = data.routes[0].duration.replace(/[^0-9]/g, '');

  const distance = distanceInMeters / 1000;
  const duration = durationInSeconds / 60 / 60;

  return { distance, duration };
}


export const calculateJourneyPrice = (
  distanceInKilometers: number,
  durationInHours: number,
  rate: CarRate
): { hourlyPrice: number; dailyPrice?: number } => {
  const { day, hour, kilometer, includedKilometers } = rate;

  // Calculate hourly price
  let hourlyCost = durationInHours * hour;
  hourlyCost += (Math.max(0, distanceInKilometers - (includedKilometers ?? 0))) * kilometer;

  // Calculate daily price if applicable
  let dailyCost = 0;
  if (day !== undefined) {
    const days = Math.ceil(durationInHours / 24); // round up to full days
    dailyCost = days * day;
    dailyCost += distanceInKilometers * kilometer;
  }

  return {
    hourlyPrice: hourlyCost,
    dailyPrice: dailyCost || undefined, // fallback to hourly cost if daily cost isn't applicable
  };
}

