export interface Bus {
    id?: string; // Optional if using Firestore document ID
    busNumber: string;
    residence: string;
    time: string;
    totalSeats: number;
    fullName?:string,
    studentNumber?: number;
    email?: string; 
    message?:string;
  }
  