export type Image = {
    url: string,
    alt?: string,
}

export type Product = {
    id: string,
    name: string,
    slug: string,
    price: string,
    categoryId: string,
    seo_title: string,
    seo_description: string,
    seo_keywords: string,
    createdAt: string,
    updatedAt: string,
    image?: Image,
    discountPrice?: string,
    discount?: string,
    startDate?: string,
    expireDate?: string,
}

export type ProductsResponse = {
    items: Product[],
    total: number,
    limit: number,
    offset: number,
}

export type ProductsFilterInput = {
    priceLte?: number,
    priceGte?: number,
    category?: string,
}