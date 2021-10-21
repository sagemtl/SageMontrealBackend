export class Customer {
  constructor(
    public first_name: string,
    public last_name: string,
    public email: string,
    public billing_postal_code: string,
    public create_date?: number,
    public readonly id?: string,
  ) { }
}