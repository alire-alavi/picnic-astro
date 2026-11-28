# Checkout Page - Address & Shipping Integration

## Summary of Changes

### 1. Type Definitions Created

#### `/src/types/address.d.ts`
- Defined `Address` interface
- Defined `AddressType` enum (BILLING, SHIPPING)
- Defined `CreateAddressInput` and `UpdateAddressInput` interfaces

#### `/src/types/shipping.d.ts`
- Defined `ShippingMethod` enum (STANDARD, EXPRESS, OVERNIGHT, PICKUP, INTERNATIONAL)
- Defined `UpdateOrderInput` interface

### 2. API Functions Created

#### `/src/lib/address.ts`
- `getAddresses()` - Fetch all addresses for authenticated user
- `getAddress(id)` - Fetch specific address by ID
- `createAddress(input)` - Create new address
- `updateAddress(id, input)` - Update existing address
- `deleteAddress(id)` - Delete address

### 3. Cart Library Enhanced

#### `/src/lib/cart.ts`
- Updated `Cart` interface to include `shippingMethod` field
- Updated `GET_CART_QUERY` to fetch shipping method
- Added `UPDATE_ORDER_MUTATION` GraphQL mutation
- Added `updateOrderShippingMethod(orderId, shippingMethod)` function

### 4. Checkout Script Enhanced

#### `/src/scripts/checkout.ts`
- Added `loadAddresses()` - Fetches and displays user addresses
- Added `displayAddress(address)` - Updates address display in UI
- Added `renderAddressList(addresses)` - Renders address list in modal
- Added `attachAddressSelectionHandlers()` - Handles address selection
- Added `handleShippingMethodChange(orderId, method)` - Updates shipping method
- Added `createAddress(formData)` - Creates new address via GraphQL
- Enhanced DOMContentLoaded event listener to:
  - Load addresses on page load
  - Handle shipping method radio button changes
  - Handle add address form submission

### 5. Checkout Page Updated

#### `/src/pages/cart/checkout.astro`
- Imports `getAddresses` from address library
- Fetches addresses on page load
- Filters shipping addresses
- Calculates subtotal, discount, shipping cost, and total
- Dynamic address display based on fetched data
- Added `data-order-id` attribute to main element for JS access
- Updated shipping method radio buttons with checked states
- Dynamic price display using `formatPrice` function
- Added address selection modal with dynamic address list
- Added new address form modal
- Added modal handling JavaScript

## API Integration

### Queries Used
- `myAddresses` - Fetches all addresses for the user
- `orders(status: PENDING)` - Fetches cart with shipping method

### Mutations Used
- `createAddress` - Creates new address
- `updateOrder` - Updates order shipping method

## Features Implemented

1. **Address Management**
   - Display default shipping address
   - View all shipping addresses in modal
   - Select different address
   - Add new address via form

2. **Shipping Method Selection**
   - Display available shipping methods
   - Update order with selected shipping method
   - Persist selection via GraphQL mutation

3. **Dynamic Pricing**
   - Calculate subtotal from cart items
   - Display shipping cost
   - Calculate total with discount and shipping

4. **User Experience**
   - Modal interactions for address selection
   - Form validation for new addresses
   - Real-time updates on selections
   - Notifications for success/error states

## Usage

The checkout page now automatically:
1. Loads the user's cart and addresses
2. Displays the default shipping address
3. Allows selecting shipping method
4. Persists selections to the backend
5. Calculates accurate totals including shipping

Users can:
- View and select from existing addresses
- Add new addresses
- Choose shipping method
- See real-time price calculations
- Proceed to payment with all selections saved
