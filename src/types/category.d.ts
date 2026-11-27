export type Category = {
    id: string;
    name: string;
    slug: string;
    image?: {
        id: string;
        url: string;
        altText?: string;
    };
    createdAt: string;
    updatedAt: string;
};
