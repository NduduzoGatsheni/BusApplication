export interface Bus {
    id?: string; // Optional if using Firestore document ID
    busNumber: string;
    residence: string;
    time: string;
    totalSeats: number;
    // Add other fields as per your data structure
  }
  