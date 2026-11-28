export enum ShippingMethod {
  STANDARD = 'STANDARD',
  EXPRESS = 'EXPRESS',
  OVERNIGHT = 'OVERNIGHT',
  PICKUP = 'PICKUP',
  INTERNATIONAL = 'INTERNATIONAL'
}

export interface UpdateOrderInput {
  orderId: string;
  orderStatus?: string;
  shippingMethod?: ShippingMethod;
  channelId?: string;
}
