import { Order, OrderItem } from '../db';
import { OrderState } from '../db/models/order';
import OrderManagementDAO from './dao';
import { OrderInfo, OrderItemInfo, OrderDetails } from './utils';

const orderManagementDAO = new OrderManagementDAO();

class OrderManagementService {
  static async getOrders(): Promise<Order[]> {
    return orderManagementDAO.getOrders();
  }

  static async getOrderDetailsById(orderId: string): Promise<OrderDetails> {
    const orderInfo = await orderManagementDAO.getOrderById(orderId);
    const orderItems = await orderManagementDAO.getOrderItems(orderId);
    return { orderInfo, orderItems };
  }

  static async createOrder(
    orderInfo: OrderInfo,
    orderItems: OrderItem[]
  ): Promise<string> {
    const customerId = await orderManagementDAO.getOrInsertCustomer(orderInfo);
    orderInfo.customer_id = customerId;
    const orderId = await orderManagementDAO.createOrder(orderInfo);
    await orderManagementDAO.createOrderItems(orderId, orderItems);
    return orderId;
  }

  static async updateOrderState(
    orderId: string,
    orderState: OrderState
  ): Promise<void> {
    await orderManagementDAO.updateOrderState(orderId, orderState);
  }

  static async updateTrackingNumber(
    orderId: string,
    trackingNumber: string
  ): Promise<void> {
    await orderManagementDAO.updateTrackingNumber(orderId, trackingNumber);
  }
}

export default OrderManagementService;
