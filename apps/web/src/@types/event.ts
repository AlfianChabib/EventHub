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

export interface PaginationDataResult {
  events: EventData[];
  count: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
  nextPage: number | null;
  offset: number;
  pages: number;
  prevPage: number | null;
  totalEvents: number;
  totalPages: number;
  categorys: Category[];
}

export type Category = {
  category: string;
  _count: {
    category: number;
  };
};

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
