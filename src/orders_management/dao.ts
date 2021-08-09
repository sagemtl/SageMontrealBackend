import DAO, { Order, OrderItem } from '../db';
import { OrderState } from '../db/models/order';
import { OrderInfo, OrderItemInfo } from './utils';

class OrderManagementDAO extends DAO {

  readonly customersTable: string = 'customers';
  readonly orderItemsTable: string = 'order_items';
  readonly ordersTable: string = 'orders';

  async getOrders(): Promise<Order[]> {
    const results = await this.query(`SELECT * FROM ${this.ordersTable}`);
    return results.rows;
  }

  async getOrderById(orderId: string): Promise<OrderInfo> {
    const query = `SELECT o.*, c.* FROM ${this.ordersTable} o
      INNER JOIN ${this.customersTable} c ON c.id = o.customer_id WHERE o.id = $1;`;

    const results = await this.query(query, [orderId]);
    return results.rows[0];
  }

  async getOrderItems(orderId: string): Promise<OrderItemInfo[]> {
    const query = `SELECT oi.*, s.sku_size, p.product_name, p.path, p.color, pr.value AS price, pi.link FROM ${this.orderItemsTable} oi
      INNER JOIN skus s ON s.id = oi.sku_id 
      INNER JOIN products p ON p.id = s.product_id
      INNER JOIN prices pr ON pr.product_id = p.id
      INNER JOIN product_images pi ON pi.product_id = pr.product_id
      WHERE oi.order_id = $1 and pr.currency = (SELECT o.currency FROM ${this.ordersTable} o WHERE o.id = oi.order_id) AND pi.priority = 1;`;

    const results = await this.query(query, [orderId]);
    return results.rows;
  }

  async getOrInsertCustomer(orderInfo: OrderInfo): Promise<string> {
    const query = `INSERT INTO ${this.customersTable} (first_name, last_name, email, billing_postal_code) 
      values ($1, $2, $3, $4) ON CONFLICT (first_name, last_name, email, billing_postal_code) DO UPDATE SET id=EXCLUDED.id RETURNING id;`;
    const values = [orderInfo.first_name, orderInfo.last_name, orderInfo.email, orderInfo.billing_postal_code];

    const results = await this.query(query, values);
    return results.rows[0].id;
  }

  async createOrder(orderInfo: OrderInfo): Promise<string> {
    const query = `INSERT INTO ${this.ordersTable} (total, currency, order_state, order_notes, tracking_number,
      customer_id, address, address_2, city, state, country, postal_code, shipping_method, shipping_price, shipping_cost) 
      values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING id;`
      
      const values = [orderInfo.total, orderInfo.currency, orderInfo.order_state, orderInfo.order_notes, 
      orderInfo.tracking_number ?? null, orderInfo.customer_id, orderInfo.address, orderInfo.address_2 ?? null, orderInfo.city,
      orderInfo.state, orderInfo.country, orderInfo.postal_code, orderInfo.shipping_method, orderInfo.shipping_price, orderInfo.shipping_cost ?? null];
    
    const results = await this.query(query, values);
    return results.rows[0].id;
  }

  async createOrderItems(orderId:string, orderItems: OrderItem[]): Promise<void> {
    const orderItemsValues = orderItems.map(orderItem => `('${orderItem.sku_id}', '${orderId}', ${orderItem.quantity}, ${orderItem.adjusted_price ?? null})`);
    const query = `INSERT INTO ${this.orderItemsTable} (sku_id, order_id, quantity, adjusted_price) values ${orderItemsValues.join(', ')};`;
    await this.query(query);
  }

  async updateOrderState(orderId: string, orderState: OrderState): Promise<void> {
    const query = `UPDATE ${this.ordersTable} SET order_state = $1 WHERE id = $2;`;
    const values = [orderState, orderId];
    await this.query(query, values);
  }

  async updateTrackingNumber(orderId: string, trackingNumber: string): Promise<void> {
    const query = `UPDATE ${this.ordersTable} SET tracking_number = $1 WHERE id = $2;`;
    const values = [trackingNumber, orderId];
    await this.query(query, values);
  }
}

export default OrderManagementDAO;