
export interface Spot {
  id: string;
  name: string;
  feature: string;
  mapUrl: string;
}

export interface Transport {
  id: string;
  type: 'Train' | 'Flight' | 'Bus' | 'Walk' | 'Metro' | 'Car';
  details: string;
  duration: string;
  price?: string;
  mapUrl: string;
  bookingUrl?: string;
}

export interface Expense {
  id: string;
  amount: number; // EUR
  category: string;
  note: string;
  date: string;
}

export interface EssentialItem {
  id: string;
  text: string;
  checked: boolean;
}

export interface DayPlan {
  id: string;
  day: number;
  date: string;
  title: string;
  description: string;
  spots: Spot[];
  transports: Transport[];
  checklist: EssentialItem[];
  startTime: string;
  budget: string;
  precautions: string[];
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
