
import { Devotee, Session, Notification, Donation, InventoryItem } from '../types';

const STORAGE_KEYS = {
  DEVOTEES: 'iskcon_devotees',
  SESSIONS: 'iskcon_sessions',
  NOTIFICATIONS: 'iskcon_notifications',
  DONATIONS: 'iskcon_donations',
  INVENTORY: 'iskcon_inventory'
};

export const storageService = {
  getDevotees: (): Devotee[] => {
    const data = localStorage.getItem(STORAGE_KEYS.DEVOTEES);
    return data ? JSON.parse(data) : [];
  },
  saveDevotees: (devotees: Devotee[]) => {
    localStorage.setItem(STORAGE_KEYS.DEVOTEES, JSON.stringify(devotees));
  },
  getSessions: (): Session[] => {
    const data = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    return data ? JSON.parse(data) : [];
  },
  saveSessions: (sessions: Session[]) => {
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
  },
  getNotifications: (): Notification[] => {
    const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return data ? JSON.parse(data) : [];
  },
  saveNotifications: (notifications: Notification[]) => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  },
  getDonations: (): Donation[] => {
    const data = localStorage.getItem(STORAGE_KEYS.DONATIONS);
    return data ? JSON.parse(data) : [];
  },
  saveDonations: (donations: Donation[]) => {
    localStorage.setItem(STORAGE_KEYS.DONATIONS, JSON.stringify(donations));
  },
  getInventory: (): InventoryItem[] => {
    const data = localStorage.getItem(STORAGE_KEYS.INVENTORY);
    return data ? JSON.parse(data) : [
      { id: '1', name: 'Basmati Rice', category: 'Grains', quantity: 50, unit: 'kg', minThreshold: 20 },
      { id: '2', name: 'Desi Ghee', category: 'Dairy', quantity: 5, unit: 'liters', minThreshold: 10 },
      { id: '3', name: 'Toor Dal', category: 'Grains', quantity: 30, unit: 'kg', minThreshold: 15 }
    ];
  },
  saveInventory: (inventory: InventoryItem[]) => {
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(inventory));
  }
};
