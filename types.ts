
export enum InitiationStatus {
  SHELTER = 'Shelter',
  ASPIRANT = 'Aspirant',
  FIRST_INITIATED = 'First Initiated',
  SECOND_INITIATED = 'Second Initiated',
  UNINITIATED = 'Uninitiated'
}

export interface Devotee {
  id: string;
  name: string;
  spiritualName?: string;
  email: string;
  phone: string;
  dob?: string;
  photo?: string;
  status: InitiationStatus;
  joinedAt: string;
  hobbies?: string;
  dailyMalas: number;
}

export interface Session {
  id: string;
  title: string;
  date: string;
  location: string;
  facilitator: string;
  attendeeIds: string[];
}

export interface GitaQuote {
  verse: string;
  translation: string;
  purport: string;
  chapter: number;
  text: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  type?: 'quote' | 'system';
}

export interface Donation {
  id: string;
  donorName: string;
  amount: number;
  date: string;
  purpose: 'General' | 'Building' | 'Feast' | 'Goshala';
  method: 'Cash' | 'Online' | 'Cheque';
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'Grains' | 'Vegetables' | 'Dairy' | 'Spices' | 'General';
  quantity: number;
  unit: string;
  minThreshold: number;
}
