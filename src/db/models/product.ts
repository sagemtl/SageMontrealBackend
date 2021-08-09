export class Product {
  constructor(
    public path: string,
    public product_type: string,
    public product_name: string,
    public description: string,
    public color: string,
    public model_info: string,
    public active: boolean,
    public featured: boolean,
    public readonly id?: string,
    public readonly created_date?: string,
  ) { }
}