import { createClient } from "./graphql";
import { getAccessToken } from "./auth";

export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  item: {
    id: string;
    name: string;
    slug: string;
    price: string;
    thumbnail?: {
      id: string;
      url: string;
      altText?: string;
      sm?: string;
      md?: string;
    };
  };
}

export interface Order {
  id: string;
  orderStatus: string;
  shippingMethod?: string;
  createdAt: string;
  updatedAt: string;
  orderItems: OrderItem[];
}

const GET_ORDERS_QUERY = `
  query GetOrders($status: UpdateOrderStatus) {
    orders(status: $status) {
      id
      orderStatus
      shippingMethod
      createdAt
      updatedAt
      orderItems {
        id
        quantity
        price
        item {
          id
          name
          slug
          price
          thumbnail {
            id
            url
            altText
            sm
            md
          }
        }
      }
    }
  }
`;

/**
 * Fetch orders for the authenticated user. Pass an `UpdateOrderStatus` value to
 * filter server-side, or omit to get every order. Returns `[]` when unauthenticated.
 */
export const getOrders = async (status?: string): Promise<Order[]> => {
  const token = getAccessToken();
  if (!token) return [];

  try {
    const client = createClient(token);
    const data = await client.request<{ orders: Order[] }>(GET_ORDERS_QUERY, {
      status: status ?? null,
    });
    return data.orders || [];
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return [];
  }
};

export const getOrderTotal = (order: Order): number => {
  return order.orderItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
};

export const getOrderItemCount = (order: Order): number => {
  return order.orderItems.reduce((total, item) => total + item.quantity, 0);
};

/** Persian label for each order status. */
export const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING: "در انتظار تکمیل",
  SUBMITTED: "ثبت شده",
  PAYMENT_REQUIRED: "در انتظار پرداخت",
  PRODUCTION: "در حال آماده‌سازی",
  PRODUCTION_COMPLETE: "آماده‌سازی شده",
  PROCESSING: "در حال پردازش",
  SHIPPING: "در حال ارسال",
  CANCELLED: "لغو شده",
  COMPLETED: "تحویل شده",
};

export const getOrderStatusLabel = (status: string): string =>
  ORDER_STATUS_LABELS[status] || status;
