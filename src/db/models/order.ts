export enum OrderState {
  New = 'new',
  Processed = 'processed',
  Shipped = 'shipped',
  Delivered = 'delivered',
  Cancelled = 'cancelled',
}

export class Order {
  constructor(
    public total: number,
    public currency: string,
    public order_state: OrderState,
    public order_notes: string,
    public tracking_number: string,
    public customer_id: string,
    public address: string,
    public address_2: string,
    public city: string,
    public state: string,
    public country: string,
    public postal_code: string,
    public shipping_method: string,
    public shipping_price: number,
    public shipping_cost: string,
    public created_date?: string,
  ) { }
}