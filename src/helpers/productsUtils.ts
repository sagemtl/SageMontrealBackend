import { ProductImage } from "../models/productsManagement/productImage/entities";

export const processProductImages = (productImages: string[]): ProductImage[] => {
  return productImages.map((image: string, index: number) => {
    return {
      priority: index + 1,
      link: image
    };
  });
};
