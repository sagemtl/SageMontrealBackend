import Model from '../../model';
import { Sku } from './entities';

class SkuDAO extends Model {
  readonly table: string = 'skus';

  async getSkus(productId: string): Promise<Sku[]> {
    const results = await this.pool.query(`SELECT * FROM ${this.table} WHERE product_id='${productId}';`);
    return results.rows;
  }

  async createSkus(productId: string, skus: Sku[]): Promise<void> {
    const queryValues = skus.map(sku => `('${productId}', '${sku.sku_size}', ${sku.inventory})`);
    const query = `INSERT INTO ${this.table} (product_id, sku_size, inventory) values ${queryValues.join(', ')};`;
    await this.pool.query(query);

  }
}

export default SkuDAO;