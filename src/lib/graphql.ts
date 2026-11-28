import { GraphQLClient } from 'graphql-request';
import type { Product, ProductDetail, ProductsResponse, ProductsFilterInput } from '../types/product';
import type { Category } from '../types/category';

export const createClient = (token?: string) => {
    return new GraphQLClient(import.meta.env.PUBLIC_GRAPHQL_URL, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
};

export const fetchProducts = async (
    filter?: ProductsFilterInput,
    limit: number = 20,
    offset: number = 0,
    token?: string
): Promise<ProductsResponse> => {
    const client = createClient(token);

    const query = `
        query GetProducts($filter: ProductsFilterInput, $limit: Int, $offset: Int) {
            products(productFilter: $filter, limit: $limit, offset: $offset) {
                items {
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
                    categoryId
                    seo_title
                    seo_description
                    seo_keywords
                    createdAt
                    updatedAt
                }
                total
                limit
                offset
            }
        }
    `;

    const data = await client.request<{ products: ProductsResponse }>(query, {
        filter,
        limit,
        offset,
    });

    return data.products;
};

export const fetchProduct = async (id: string, token?: string): Promise<Product> => {
    const client = createClient(token);

    const query = `
        query GetProduct($id: String!) {
            product(id: $id) {
                id
                name
                slug
                price
                categoryId
                seo_title
                seo_description
                seo_keywords
                createdAt
                updatedAt
            }
        }
    `;

    const data = await client.request<{ product: Product }>(query, { id });

    return data.product;
};

export const fetchAllProducts = async (): Promise<Product[]> => {
    const pageSize = 100;
    const firstPage = await fetchProducts({}, pageSize);
    const products = [...firstPage.items];

    for (let offset = pageSize; offset < firstPage.total; offset += pageSize) {
        const page = await fetchProducts({}, pageSize, offset);
        products.push(...page.items);
    }

    return products;
};

export const fetchProductBySlug = async (slug: string, token?: string): Promise<ProductDetail> => {
    const client = createClient(token);

    const query = `
        query GetProduct($slug: String!) {
            product(slug: $slug) {
                id
                name
                slug
                price
                categoryId
                seo_title
                seo_description
                seo_keywords
                thumbnail {
                    id
                    url
                    altText
                }
                sliderImages {
                    id
                    url
                    altText
                }
                catalog {
                    sellingModes {
                        mode
                        purchasePolicy
                        minimumPacks
                        variants {
                            id
                            name
                            available
                            packContents {
                                name
                                quantity
                            }
                            prices {
                                currencyCode
                                currencySymbol
                                amount
                                amountPerItem
                            }
                        }
                    }
                    deliveryConditions {
                        shippingIncludedInPrice
                        destinationRequiredForQuote
                    }
                }
                createdAt
                updatedAt
            }
        }
    `;

    const data = await client.request<{ product: ProductDetail }>(query, { slug });

    return data.product;
};

export const fetchCategories = async (token?: string): Promise<Category[]> => {
    const client = createClient(token);

    const query = `
        query GetCategories {
            categories {
                id
                name
                slug
                image {
                    id
                    url
                    altText
                }
            }
        }
    `;

    const data = await client.request<{ categories: Category[] }>(query);

    return data.categories;
};
