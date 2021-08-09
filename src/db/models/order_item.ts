export class OrderItem {
  constructor(
    public sku_id: string,
    public quantity: number,
    public adjusted_price: number,
    public order_id?: string,
  ) { }
}