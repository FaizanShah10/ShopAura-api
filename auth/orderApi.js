import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getBaseUrl } from '../../Frontend/src/utils/BaseUrl';

export const orderApi = createApi({
    reducerPath: 'orderApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${getBaseUrl()}/api/order`,
        credentials: 'include'
    }),
    tagTypes: ['Order'],
    endpoints: (builder) => ({
        placeOrder: builder.mutation({
            query: (orderBody) => ({
                url: '/place-order',
                method: 'POST',
                body: orderBody
            })
        }),
        fetchAllOrders: builder.query({
            query: () => ({
                url: '/all-orders',
                method: 'GET',
            })
        })
    })
})

export const {useFetchAllOrdersQuery, usePlaceOrderMutation} = orderApi