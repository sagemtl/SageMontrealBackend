import { Product, ProductImage } from "../db";

export const processProductImages = (productImages: string[]): ProductImage[] => {
  return productImages.map((image: string, index: number) => {
    return {
      priority: index + 1,
      link: image
    };
  });
};

export const processProductPageInfo = (productPageDbRows: ProductPageDbRow[]): ProductPageInfo => {
  const sku_availability = Array.from(new Set(productPageDbRows.map((productPageDbRow: ProductPageDbRow) => {
    if (productPageDbRow.inventory > 0) {
      return productPageDbRow.sku_size
    }
    return '';
  })));

  const product_images = Array.from(new Set(productPageDbRows.map((productPageDbRow: ProductPageDbRow) => {
    return productPageDbRow.link
  })));

  const productPageDbRow = productPageDbRows[0];

  return {
    ...productPageDbRow,
    sku_availability: sku_availability.filter(el => el !== ''),
    product_images,
  }
};


export interface ProductPageDbRow extends Product {  
  link: string,
  sku_size: string,
  inventory: number,
  product_id: string,
}

export interface ProductPageInfo extends Product {  
  product_images: string[],
  sku_availability: string[],
}