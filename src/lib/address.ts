import { createClient } from './graphql';
import { getAccessToken } from './auth';
import type { Address, CreateAddressInput, UpdateAddressInput } from '../types/address.d';

const GET_ADDRESSES_QUERY = `
  query GetMyAddresses {
    myAddresses {
      id
      userId
      street
      type
      city
      state
      zipCode
      country
      createdAt
      updatedAt
    }
  }
`;

const GET_ADDRESS_QUERY = `
  query GetAddress($id: String!) {
    address(id: $id) {
      id
      userId
      street
      type
      city
      state
      zipCode
      country
      createdAt
      updatedAt
    }
  }
`;

const CREATE_ADDRESS_MUTATION = `
  mutation CreateAddress($input: CreateAddressInput!) {
    createAddress(input: $input) {
      id
      userId
      street
      type
      city
      state
      zipCode
      country
      createdAt
      updatedAt
    }
  }
`;

const UPDATE_ADDRESS_MUTATION = `
  mutation UpdateAddress($id: String!, $input: UpdateAddressInput!) {
    updateAddress(id: $id, input: $input) {
      id
      userId
      street
      type
      city
      state
      zipCode
      country
      createdAt
      updatedAt
    }
  }
`;

const DELETE_ADDRESS_MUTATION = `
  mutation DeleteAddress($id: String!) {
    deleteAddress(id: $id) {
      id
    }
  }
`;

export const getAddresses = async (): Promise<Address[]> => {
  const token = getAccessToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  try {
    const client = createClient(token);
    const data = await client.request<{ myAddresses: Address[] }>(GET_ADDRESSES_QUERY);
    return data.myAddresses;
  } catch (error) {
    console.error('Failed to fetch addresses:', error);
    throw error;
  }
};

export const getAddress = async (id: string): Promise<Address> => {
  const token = getAccessToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  try {
    const client = createClient(token);
    const data = await client.request<{ address: Address }>(GET_ADDRESS_QUERY, { id });
    return data.address;
  } catch (error) {
    console.error('Failed to fetch address:', error);
    throw error;
  }
};

export const createAddress = async (input: CreateAddressInput): Promise<Address> => {
  const token = getAccessToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  try {
    const client = createClient(token);
    const data = await client.request<{ createAddress: Address }>(CREATE_ADDRESS_MUTATION, { input });
    return data.createAddress;
  } catch (error) {
    console.error('Failed to create address:', error);
    throw error;
  }
};

export const updateAddress = async (id: string, input: UpdateAddressInput): Promise<Address> => {
  const token = getAccessToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  try {
    const client = createClient(token);
    const data = await client.request<{ updateAddress: Address }>(UPDATE_ADDRESS_MUTATION, { id, input });
    return data.updateAddress;
  } catch (error) {
    console.error('Failed to update address:', error);
    throw error;
  }
};

export const deleteAddress = async (id: string): Promise<{ id: string }> => {
  const token = getAccessToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  try {
    const client = createClient(token);
    const data = await client.request<{ deleteAddress: { id: string } }>(DELETE_ADDRESS_MUTATION, { id });
    return data.deleteAddress;
  } catch (error) {
    console.error('Failed to delete address:', error);
    throw error;
  }
};
