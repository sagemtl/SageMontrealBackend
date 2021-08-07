import Model from '../../model';
import { ProductImage } from './entities';

class ProductImageDAO extends Model {
  readonly table:string = 'product_images';
  
  async getProductImages(productId: string): Promise<ProductImage[]> {
    const query = `SELECT * FROM ${this.table} WHERE product_id='${productId}' ORDER BY priority ASC;`;
    const results = await this.pool.query(query);
    return results.rows;
  }

  async createProductImages(productId: string, productImages: ProductImage[]): Promise<void> {
    const queryValues = productImages.map(productImage => `('${productId}', ${productImage.priority}, '${productImage.link}')`);
    const query = `INSERT INTO ${this.table} (product_id, priority, link) values ${queryValues.join(', ')};`;
    await this.pool.query(query);
  }
}

export default ProductImageDAO;