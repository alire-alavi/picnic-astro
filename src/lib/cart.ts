import { createClient } from './graphql';
import { getAccessToken } from './auth';

export interface CartItem {
    id: string;
    quantity: number;
    price: string;
    item: {
        id: string;
        name: string;
        slug: string;
        price: string;
        seo_title?: string;
    };
}

export interface Cart {
    id: string;
    orderStatus: string;
    createdAt: string;
    updatedAt: string;
    orderItems: CartItem[];
}

const GET_CART_QUERY = `
  query GetCart {
    orders(status: PENDING) {
      id
      orderStatus
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
          seo_title
        }
      }
    }
  }
`;

const ADD_TO_CART_MUTATION = `
  mutation AddItemToCart($input: AddItemToCartInput!) {
    addItemToCart(input: $input) {
      id
      orderStatus
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
          seo_title
        }
      }
    }
  }
`;

export const getCart = async (): Promise<Cart | null> => {
    const token = getAccessToken();
    if (!token) return null;

    try {
        const client = createClient(token);
        const data = await client.request<{ orders: Cart[] }>(GET_CART_QUERY);
        return data.orders[0] || null;
    } catch (error) {
        console.error('Failed to fetch cart:', error);
        return null;
    }
};

export const addToCart = async (productId: string, quantity: number = 1): Promise<Cart | null> => {
    const token = getAccessToken();
    if (!token) {
        throw new Error('Authentication required');
    }

    try {
        const client = createClient(token);
        const data = await client.request<{ addItemToCart: Cart }>(ADD_TO_CART_MUTATION, {
            input: { productId, quantity }
        });
        return data.addItemToCart;
    } catch (error) {
        console.error('Failed to add item to cart:', error);
        throw error;
    }
};

export const getCartItemCount = (cart: Cart | null): number => {
    if (!cart) return 0;
    return cart.orderItems.reduce((total, item) => total + item.quantity, 0);
};

export const getCartTotal = (cart: Cart | null): number => {
    if (!cart) return 0;
    return cart.orderItems.reduce((total, item) => {
        return total + (parseFloat(item.price) * item.quantity);
    }, 0);
};

export const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('fa-IR').format(price);
};
