import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getBaseUrl } from '../../Frontend/src/utils/BaseUrl';

export const productApi = createApi({
    reducerPath: 'productApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${getBaseUrl()}/api/product`,
        credentials: 'include'
    }),
    tagTypes: ['Product'],
    endpoints: (builder) => ({
        createProduct: builder.mutation({
            query: (newProduct) => ({
              url: '/new-product',
              method: 'POST',
              body: newProduct,
            }),
        }),
        getAllProducts: builder.query({
            query: () => ({
                url: '/all-products',
                method: 'GET',
            }),
            providesTags: ['Product'],
        }),
        getProductById: builder.query({
            query: (id) => ({
                url: `/${id}`,
                method: 'GET',
            }),
            providesTags: (result, error, id) => [{type: "Products", id}],
        }),
        updateProduct: builder.mutation({
            query: ({id, ...rest}) => ({
                url: `/update-product/${id}`,
                method: 'PUT',
                body: rest,
                credentials: 'include'
            }),
            invalidatesTags: ['Product']
        }),
        deleteProduct: builder.mutation({
            query: (id) => ({
                url: `/delete-product/${id}`,
                method: 'DELETE', 
            }),
            invalidatesTags: ['Product']
        })
    })
})

export const {useCreateProductMutation, useGetAllProductsQuery, useDeleteProductMutation, useGetProductByIdQuery, useUpdateProductMutation} = productApi