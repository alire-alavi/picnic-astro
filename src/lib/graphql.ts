import { GraphQLClient } from 'graphql-request';

export const createClient = (token?: string) => {
    return new GraphQLClient(import.meta.env.PUBLIC_GRAPHQL_URL, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
};
