export class Price {
  constructor(
    public currency: string,
    public value: number,
    public readonly product_id?: string
  ) {}
}
