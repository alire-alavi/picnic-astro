import { getCart, addToCart, removeFromCart, getCartItemCount, getCartTotal, formatPrice, type Cart, updateOrderShippingMethod } from '../lib/cart';

let currentCart: Cart | null = null;
let selectedAddressId: string | null = null;
let selectedShippingMethod: string | null = null;

async function loadAddresses() {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      window.location.href = '/auth/login';
      return;
    }

    const response = await fetch(import.meta.env.PUBLIC_GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        query: `
          query GetMyAddresses {
            myAddresses {
              id
              street
              type
              city
              state
              zipCode
              country
            }
          }
        `
      })
    });

    const { data, errors } = await response.json();
    
    if (errors) {
      console.error('Failed to load addresses:', errors);
      return;
    }

    if (data.myAddresses && data.myAddresses.length > 0) {
      const shippingAddresses = data.myAddresses.filter((addr: any) => addr.type === 'SHIPPING');
      if (shippingAddresses.length > 0) {
        selectedAddressId = shippingAddresses[0].id;
        displayAddress(shippingAddresses[0]);
      }
      
      renderAddressList(data.myAddresses);
    }
  } catch (error) {
    console.error('Error loading addresses:', error);
  }
}

function displayAddress(address: any) {
  const addressDisplay = document.querySelector('[data-address-display]');
  if (addressDisplay) {
    addressDisplay.innerHTML = `
      <div class="mb-4 flex justify-between gap-x-2 sm:mb-2">
        <div class="line-clamp-1 text-sm text-text/95 xs:text-base">
          <div class="flex gap-1">
            <div class="flex min-w-fit">
              <p>${address.state},</p>
              <p>${address.city}</p>
            </div>
            <p>${address.street}</p>
          </div>
          <div class="flex gap-1">
            <p>کد پستی ${address.zipCode}</p>
          </div>
        </div>
      </div>
    `;
  }
}

function renderAddressList(addresses: any[]) {
  const addressListContainer = document.querySelector('[data-address-list]');
  if (!addressListContainer) return;

  addressListContainer.innerHTML = addresses.map(addr => `
    <div class="relative block rounded-lg border p-4 shadow hover:border-border/50 cursor-pointer ${addr.id === selectedAddressId ? 'border-primary' : ''}" data-address-select="${addr.id}">
      <div class="mb-4 flex justify-between gap-x-2 sm:mb-2">
        <div class="line-clamp-1 text-sm text-text/95 xs:text-base">
          <div class="flex gap-1">
            <div class="flex min-w-fit">
              <p>${addr.state},</p>
              <p>${addr.city}</p>
            </div>
            <p>${addr.street}</p>
          </div>
          <div class="flex gap-1">
            <p>کد پستی ${addr.zipCode}</p>
          </div>
        </div>
      </div>
    </div>
  `).join('');

  attachAddressSelectionHandlers();
}

function attachAddressSelectionHandlers() {
  const addressElements = document.querySelectorAll('[data-address-select]');
  addressElements.forEach(el => {
    el.addEventListener('click', () => {
      const addressId = el.getAttribute('data-address-select');
      if (addressId) {
        selectedAddressId = addressId;
        
        addressElements.forEach(e => e.classList.remove('border-primary'));
        el.classList.add('border-primary');
      }
    });
  });
}

async function handleShippingMethodChange(orderId: string, method: string) {
  try {
    await updateOrderShippingMethod(orderId, method);
    selectedShippingMethod = method;
    console.log('Shipping method updated successfully');
  } catch (error) {
    console.error('Error updating shipping method:', error);
    showNotification('خطا در به‌روزرسانی روش ارسال', 'error');
  }
}

async function createAddress(formData: any) {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      window.location.href = '/auth/login';
      return null;
    }

    const response = await fetch(import.meta.env.PUBLIC_GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        query: `
          mutation CreateAddress($input: CreateAddressInput!) {
            createAddress(input: $input) {
              id
              street
              type
              city
              state
              zipCode
              country
            }
          }
        `,
        variables: {
          input: formData
        }
      })
    });

    const { data, errors } = await response.json();
    
    if (errors) {
      console.error('Failed to create address:', errors);
      return null;
    }

    return data.createAddress;
  } catch (error) {
    console.error('Error creating address:', error);
    return null;
  }
}

const updateCheckoutUI = (cart: Cart | null) => {
    currentCart = cart;

    const itemCount = getCartItemCount(cart);
    const total = getCartTotal(cart);

    const cartCountElements = document.querySelectorAll('[data-checkout-count]');
    cartCountElements.forEach(el => {
        el.textContent = itemCount.toString();
    });

    const cartListContainer = document.querySelector('[data-checkout-items]');
    const emptyCartContainer = document.querySelector('[data-empty-cart]');

    if (!cart || cart.orderItems.length === 0) {
        if (cartListContainer) cartListContainer.classList.add('hidden');
        if (emptyCartContainer) emptyCartContainer.classList.remove('hidden');
        updateTotals(0, 0, 0);
        return;
    }

    if (cartListContainer) cartListContainer.classList.remove('hidden');
    if (emptyCartContainer) emptyCartContainer.classList.add('hidden');

    if (cartListContainer) {
        cartListContainer.innerHTML = cart.orderItems.map(item => {
            const thumbnailUrl = item.item.thumbnail?.md || item.item.thumbnail?.sm || item.item.thumbnail?.url || '/src/assets/images/product-1.webp';
            const altText = item.item.thumbnail?.altText || item.item.name;
            const itemPrice = parseFloat(item.price);
            const itemTotal = itemPrice * item.quantity;

            return `
                <li>
                    <div class="px-4 py-4 sm:py-6">
                        <div class="grid grid-cols-2 items-center justify-start gap-2 xs:grid-cols-3 xs:gap-6 sm:grid-cols-4 xl:grid-cols-6">
                            <div class="relative row-span-2 min-w-fit xs:mx-auto">
                                <a href="/products/${item.item.slug}">
                                    <img
                                        src="${thumbnailUrl}"
                                        alt="${altText}"
                                        class="h-25 w-25 rounded-lg object-cover sm:h-28 sm:w-28"
                                    />
                                </a>
                                <button
                                    data-remove-item="${item.item.id}"
                                    class="absolute -top-2 right-0 rounded-lg border bg-muted duration-200 hover:bg-background"
                                >
                                    <div class="i-lucide-trash m-2 h-5 w-5 text-warning"></div>
                                </button>
                            </div>
                            <div class="row-span-2 space-y-4 xs:col-span-2 sm:col-span-3 xl:col-span-5">
                                <a
                                    href="/products/${item.item.slug}"
                                    class="line-clamp-2 text-sm xs:text-base"
                                >${item.item.name}</a>
                            </div>
                            <div class="flex items-center gap-x-2 xs:justify-center">
                                <div class="flex h-10 w-24 items-center justify-between rounded-lg border px-2 py-1">
                                    <button
                                        type="button"
                                        data-increase-quantity="${item.item.id}"
                                        class="text-success disabled:text-text/60"
                                    >
                                        <div class="i-lucide-plus size-6"></div>
                                    </button>
                                    <div class="flex h-5 w-full grow select-none items-center justify-center bg-transparent text-center text-sm text-text outline-none">
                                        ${item.quantity}
                                    </div>
                                    <button
                                        type="button"
                                        data-decrease-quantity="${item.item.id}"
                                        class="text-warning disabled:text-text/60"
                                    >
                                        <div class="${item.quantity === 1 ? 'i-lucide-trash' : 'i-lucide-minus'} size-6"></div>
                                    </button>
                                </div>
                            </div>
                            <div class="flex items-center gap-2 text-primary xs:col-span-2 sm:col-span-3 lg:text-lg xl:col-span-5">
                                <span class="font-bold">${formatPrice(itemTotal)}</span>
                                <span class="text-sm lg:text-base">تومان</span>
                            </div>
                        </div>
                    </div>
                </li>
            `;
        }).join('');

        attachEventHandlers();
    }

    const subtotal = cart.orderItems.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
    const discount = 0;
    const totalAmount = subtotal - discount;

    updateTotals(subtotal, discount, totalAmount);
};

const updateTotals = (subtotal: number, discount: number, total: number) => {
    const subtotalElements = document.querySelectorAll('[data-cart-subtotal]');
    subtotalElements.forEach(el => {
        el.textContent = formatPrice(subtotal);
    });

    const discountElements = document.querySelectorAll('[data-cart-discount]');
    discountElements.forEach(el => {
        el.textContent = formatPrice(discount);
    });

    const totalElements = document.querySelectorAll('[data-cart-total]');
    totalElements.forEach(el => {
        el.textContent = formatPrice(total);
    });

    const checkoutButtons = document.querySelectorAll('[data-checkout-button]');
    checkoutButtons.forEach(btn => {
        if (total === 0) {
            btn.setAttribute('disabled', 'true');
            btn.classList.add('opacity-50', 'cursor-not-allowed');
        } else {
            btn.removeAttribute('disabled');
            btn.classList.remove('opacity-50', 'cursor-not-allowed');
        }
    });
};

const attachEventHandlers = () => {
    const removeButtons = document.querySelectorAll('[data-remove-item]');
    removeButtons.forEach(button => {
        button.addEventListener('click', async (e) => {
            e.preventDefault();
            const productId = (button as HTMLElement).getAttribute('data-remove-item');
            if (!productId) return;

            try {
                await removeFromCart(productId);
                await refreshCheckout();
                showNotification('محصول از سبد خرید حذف شد', 'success');
            } catch (error) {
                console.error('Failed to remove item:', error);
                showNotification('خطا در حذف محصول', 'error');
            }
        });
    });

    const increaseButtons = document.querySelectorAll('[data-increase-quantity]');
    increaseButtons.forEach(button => {
        button.addEventListener('click', async (e) => {
            e.preventDefault();
            const productId = (button as HTMLElement).getAttribute('data-increase-quantity');
            if (!productId) return;

            try {
                await addToCart(productId, 1);
                await refreshCheckout();
            } catch (error) {
                console.error('Failed to increase quantity:', error);
                showNotification('خطا در افزایش تعداد', 'error');
            }
        });
    });

    const decreaseButtons = document.querySelectorAll('[data-decrease-quantity]');
    decreaseButtons.forEach(button => {
        button.addEventListener('click', async (e) => {
            e.preventDefault();
            const productId = (button as HTMLElement).getAttribute('data-decrease-quantity');
            if (!productId) return;

            const item = currentCart?.orderItems.find(i => i.item.id === productId);
            if (!item) return;

            try {
                if (item.quantity === 1) {
                    await removeFromCart(productId);
                    showNotification('محصول از سبد خرید حذف شد', 'success');
                } else {
                    await addToCart(productId, -1);
                }
                await refreshCheckout();
            } catch (error) {
                console.error('Failed to decrease quantity:', error);
                showNotification('خطا در کاهش تعداد', 'error');
            }
        });
    });

    const clearCartButton = document.querySelector('[data-clear-cart]');
    if (clearCartButton) {
        clearCartButton.addEventListener('click', async (e) => {
            e.preventDefault();

            if (!currentCart || currentCart.orderItems.length === 0) return;

            if (!confirm('آیا مطمئن هستید که می‌خواهید همه محصولات را از سبد خرید حذف کنید؟')) {
                return;
            }

            try {
                for (const item of currentCart.orderItems) {
                    await removeFromCart(item.item.id);
                }
                await refreshCheckout();
                showNotification('سبد خرید خالی شد', 'success');
            } catch (error) {
                console.error('Failed to clear cart:', error);
                showNotification('خطا در خالی کردن سبد خرید', 'error');
            }
        });
    }
};

const showNotification = (message: string, type: 'success' | 'error') => {
    const notification = document.createElement('div');
    notification.className = `fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg ${type === 'success' ? 'bg-success text-white' : 'bg-warning text-white'
        } transition-all duration-300`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
};

export const refreshCheckout = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
        window.location.href = '/auth';
        return;
    }

    try {
        const cart = await getCart();
        updateCheckoutUI(cart);
    } catch (error) {
        console.error('Failed to refresh checkout:', error);
        updateCheckoutUI(null);
    }
};

if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        refreshCheckout();
        loadAddresses();

        const deliveryRadios = document.querySelectorAll('input[name="delivery"]');
        deliveryRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                const target = e.target as HTMLInputElement;
                if (currentCart && target.checked) {
                    const method = target.value === 'delivery-1' ? 'STANDARD' : 'EXPRESS';
                    handleShippingMethodChange(currentCart.id, method);
                }
            });
        });

        const addAddressForm = document.querySelector('[data-add-address-form]') as HTMLFormElement;
        if (addAddressForm) {
            addAddressForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const formData = {
                    street: (addAddressForm.elements.namedItem('street') as HTMLInputElement).value,
                    city: (addAddressForm.elements.namedItem('city') as HTMLInputElement).value,
                    state: (addAddressForm.elements.namedItem('state') as HTMLInputElement).value,
                    zipCode: (addAddressForm.elements.namedItem('zipCode') as HTMLInputElement).value,
                    country: (addAddressForm.elements.namedItem('country') as HTMLInputElement)?.value || 'ایران',
                    type: 'SHIPPING'
                };

                const newAddress = await createAddress(formData);
                if (newAddress) {
                    selectedAddressId = newAddress.id;
                    displayAddress(newAddress);
                    await loadAddresses();
                    addAddressForm.reset();
                    showNotification('آدرس با موفقیت اضافه شد', 'success');
                } else {
                    showNotification('خطا در افزودن آدرس', 'error');
                }
            });
        }
    });
}

export { loadAddresses, handleShippingMethodChange, createAddress, selectedAddressId, selectedShippingMethod };
