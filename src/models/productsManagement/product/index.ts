import Model from '../../model';
import { Product } from './entities';

class ProductDAO extends Model {
  readonly table: string = 'products';

  async getProducts(): Promise<Product[]> {
    const results = await this.pool.query(`SELECT * FROM ${this.table}`);
    return results.rows;
  }

  async createProduct(product: Product): Promise<string> {
    const query = `INSERT INTO ${this.table} (path, product_type, product_name, description, color, model_info, active, featured)
      values ('${product.path}', '${product.product_type}', '${product.product_name}', '${product.description}', 
      '${product.color}', '${product.model_info}', ${product.active}, ${product.featured}) RETURNING id;`;

    const results = await this.pool.query(query);
    return results.rows[0].id;
  }
}

export default ProductDAO;