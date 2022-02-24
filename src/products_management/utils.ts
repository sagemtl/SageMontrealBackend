import { ProductImage } from '../db/models/product_image';

export const processProductImages = (
  productImages: string[]
): ProductImage[] => {
  return productImages.map((image: string, index: number) => {
    return {
      priority: index + 1,
      link: image,
    };
  });
};
