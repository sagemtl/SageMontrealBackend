import DAO, { Product, Price, ProductImage, Sku } from '../db';

class ProductManagementDAO extends DAO {
  readonly productsTable: string = 'products';
  readonly pricesTable: string = 'prices';
  readonly skusTable: string = 'skus';
  readonly productImagesTable: string = 'product_images';

  async getProducts(): Promise<Product[]> {
    const query = `SELECT p.*, pi2.link, 
      (SELECT p1.value FROM ${this.pricesTable} p1 WHERE p1.product_id = p.id AND p1.currency = 'USD') AS usd,
      (SELECT p1.value FROM ${this.pricesTable} p1 WHERE p1.product_id = p.id AND p1.currency = 'CAD') AS cad
      from ${this.productsTable} p
      inner join ${this.productImagesTable} pi2 on pi2.product_id = p.id
      where pi2.priority = 1;`;

    const results = await this.query(query);
    return results.rows;
  }

  async createProduct(product: Product): Promise<string> {
    const query = `INSERT INTO ${this.productsTable} (path, product_type, product_name, description, color, model_info, active, featured)
      values ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id;`;

    const values = [
      product.path,
      product.product_type,
      product.product_name,
      product.description,
      product.color,
      product.model_info,
      product.active,
      product.featured,
    ];

    const results = await this.query(query, values);
    return results.rows[0].id;
  }

  async createProductDetails(
    productId: string,
    skus: Sku[],
    productImages: ProductImage[],
    prices: Price[]
  ): Promise<void> {
    const skusValues = skus.map(
      (sku) => `('${productId}', '${sku.sku_size}', ${sku.inventory})`
    );
    const productImagesValues = productImages.map(
      (productImage) =>
        `('${productId}', ${productImage.priority}, '${productImage.link}')`
    );
    const pricesValues = prices.map(
      (price) => `('${productId}', '${price.currency}', ${price.value})`
    );

    let query = `INSERT INTO ${
      this.skusTable
    } (product_id, sku_size, inventory) values ${skusValues.join(', ')};\n`;
    query += `INSERT INTO ${
      this.productImagesTable
    } (product_id, priority, link) values ${productImagesValues.join(', ')};\n`;
    query += `INSERT INTO ${
      this.pricesTable
    } (product_id, currency, value) values ${pricesValues.join(', ')};`;

    await this.query(query);
  }
}

export default ProductManagementDAO;
