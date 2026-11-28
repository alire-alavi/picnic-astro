export type Image = {
    id?: string,
    url: string,
    sm?: string,
    md?: string,
    alt?: string,
    altText?: string,
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
    thumbnail?: Image,
    sliderImages?: Image[],
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

export type CatalogPrice = {
    currencyCode: string;
    currencySymbol: string;
    amount: `${number}`;
    amountPerItem: `${number}`;
};

type CatalogSellingMode = {
    mode: "RETAIL" | "WHOLESALE";
    purchasePolicy: "INSTANT" | "TEAM_VERIFICATION";
    minimumPacks: number | null;
    variants: {
        id: string;
        name: string;
        available: boolean;
        packContents: { name: string; quantity: number }[];
        prices: CatalogPrice[];
    }[];
};

export type ProductDetail = Product & {
    catalog: {
        sellingModes: CatalogSellingMode[];
        deliveryConditions: {
            shippingIncludedInPrice: boolean;
            destinationRequiredForQuote: boolean;
        };
    };
};

export type ProductsFilterInput = {
    priceLte?: number,
    priceGte?: number,
    category?: string,
}
