export type Tab = 'events' | 'progress' | 'library' | 'news' | 'alerts' | 'profile' | 'admin' | 'archive';

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  status: 'unread' | 'read';
  type: 'info' | 'success' | 'warning' | 'error';
  link?: string;
  details?: string;
}
