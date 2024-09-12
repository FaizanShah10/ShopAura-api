import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getBaseUrl } from '../../Frontend/src/utils/BaseUrl';


export const reviewApi = createApi({
    reducerPath: 'reviewApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${getBaseUrl()}/api/review`,
        credentials: 'include'
    }),
    tagTypes: ['Review'],
    endpoints: (builder) => ({
        getReviews: builder.query({
            query: () => ({
                url: '/all-reviews',
                method: 'GET',
            })
        }),
        postReview: builder.mutation({
            query: (review) => ({
                url: '/post-review',
                method: 'POST',
                body: review
            }),
            invalidatesTags: (result, error, {productId}) => [{type: "Reviews", id: productId}]
        }),
        getReviewById: builder.query({
            query: (id) => ({
                url: `/reviews-for-product/${id}`,
                method: 'GET'
            }),
            providesTags: (result) => result 
                ? result.map(review => ({
                    type: 'Review',
                    id: review.userId?.email,
                    fullName: review.userId?.fullName 
                }))
                : []
        })
        
        
    })
})

export const {useGetReviewsQuery, useGetReviewByIdMutation, usePostReviewMutation} = reviewApi