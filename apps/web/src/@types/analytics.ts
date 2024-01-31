export interface Analytics {
  averageRating: number;
  totalTickets: number;
  totalTransactions: number;
  orderDay: Order[];
  orderMonth: Order[];
  orderYear: Order[];
}

export interface Order {
  hour: string;
  count: number;
}
