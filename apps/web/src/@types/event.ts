export interface EventData {
  id: number;
  title: string;
  description: string;
  category: string;
  location: string;
  image: string | undefined;
  price: number;
  seats: number;
  startDate: Date;
  endDate: Date;
  duration: string;
  created_at: Date;
  updatet_at: Date;
  userId: number;
  discount: Discount;
  TicketTier: TicketTier[];
}

export interface TicketTier {
  id: number;
  nameTier: string;
  price: number;
  description: string;
  eventId: number;
  ticketId: null;
}

export interface Discount {
  id: number;
  discountStartDate: Date;
  discountEndDate: Date;
  discount: number;
  eventId: number;
}
