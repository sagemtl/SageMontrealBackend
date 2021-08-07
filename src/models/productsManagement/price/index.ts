import Model from '../../model';
import { Price } from './entities';

class PriceDAO extends Model {
  readonly table: string = 'prices';

  async getPrices(productId: string): Promise<Price[]> {
    const results = await this.pool.query(`SELECT * FROM ${this.table} WHERE product_id='${productId}';`);
    return results.rows;
  }

  async createPrices(productId: string, prices: Price[]): Promise<void> {
    const queryValues = prices.map(price => `('${productId}', '${price.currency}', ${price.value})`);
    const query = `INSERT INTO ${this.table} (product_id, currency, value) values ${queryValues.join(', ')};`;
    await this.pool.query(query);

  }
}

export default PriceDAO;