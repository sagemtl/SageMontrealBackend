import { Product, Sku, ProductImage, Price } from '../db';
import ProductManagementDAO from './dao';
import { processProductImages } from './utils';

const productManagementDAO = new ProductManagementDAO();

class ProductManagementService {
  static async getProducts(): Promise<Product[]> {
    return productManagementDAO.getProducts();
  }

  static async getProductsFeatured(): Promise<Product[]> {
    return productManagementDAO.getProductsFeatured();
  }

  static async getInventoryBySku(skus: Sku): Promise<number> {
    console.log(skus);
    return productManagementDAO.getInventoryBySku(skus);
  }

  static async createFullProduct(
    product: Product,
    skus: Sku[],
    productImages: string[],
    prices: Price[]
  ): Promise<string> {
    const productImagesWithPriority = processProductImages(productImages);
    const productId = await productManagementDAO.createProduct(product);
    await productManagementDAO.createProductDetails(
      productId,
      skus,
      productImagesWithPriority,
      prices
    );
    return productId;
  }

  static async updateProductInfo(
    id: string,
    product_type: string,
    product_name: string,
    description: string,
    color: string,
    model_info: string,
    active: boolean,
    featured: boolean
  ): Promise<String> {
    return productManagementDAO.updateProductInfo(
      id,
      product_type,
      product_name,
      description,
      color,
      model_info,
      active,
      featured
    );
  }

  static async updateProductInventory(
    sku: Sku,
    quantity: number
  ): Promise<String> {
    return productManagementDAO.updateProductInventory(sku, quantity);
  }
}

export default ProductManagementService;
