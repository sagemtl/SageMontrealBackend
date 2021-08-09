import { Customer, Order } from '../db';

export type OrderInfo = Order & Customer;

export interface OrderItemInfo {
  sku_id: string;
  order_id: string;
  quantity: number;
  adjusted_price: number;
  sku_size: string;
  product_name: string;
  path: string;
  color: string;
  product_id: string;
  price: number;
  link: string;
}

export type OrderDetails = {
  orderInfo: OrderInfo;
  orderItems: OrderItemInfo[];
}