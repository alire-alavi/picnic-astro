import { createClient } from './graphql';

export interface User {
    id: string;
    email: string | null;
    phoneNumber: string | null;
    name: string | null;
    createdAt: string;
    updatedAt: string;
    profile?: {
        id: string;
        company: string | null;
        companyVat: string | null;
        companyPhone: string | null;
        bio: string | null;
    } | null;
    addresses?: Array<{
        id: string;
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
        type: string;
    }>;
    orders?: Array<{
        id: string;
        orderStatus: string;
        createdAt: string;
    }>;
}

const ME_QUERY = `
  query GetCurrentUser {
    me {
      id
      email
      phoneNumber
      name
      createdAt
      updatedAt
      profile {
        id
        company
        companyVat
        companyPhone
        bio
      }
      addresses {
        id
        street
        city
        state
        zipCode
        country
        type
      }
      orders {
        id
        orderStatus
        createdAt
      }
    }
  }
`;

export const getAccessToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('accessToken');
};

export const setAccessToken = (token: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('accessToken', token);
};

export const removeAccessToken = (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('accessToken');
};

export const getCurrentUser = async (): Promise<User | null> => {
    const token = getAccessToken();
    if (!token) return null;

    try {
        const client = createClient(token);
        const data = await client.request<{ me: User }>(ME_QUERY);
        return data.me;
    } catch (error) {
        console.error('Failed to fetch user:', error);
        removeAccessToken();
        return null;
    }
};

export const logout = (): void => {
    removeAccessToken();
    window.location.href = '/auth';
};
