export enum AddressType {
  BILLING = 'BILLING',
  SHIPPING = 'SHIPPING'
}

export interface Address {
  id: string;
  userId: string;
  street: string;
  type: AddressType;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAddressInput {
  street: string;
  type: AddressType;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface UpdateAddressInput {
  street?: string;
  type?: AddressType;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}
