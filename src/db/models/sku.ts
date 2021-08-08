export class Sku {
  constructor(
    public sku_size: string,
    public inventory: number,
    public readonly product_id?: string,
    public readonly id?: string,
  ) { }
}