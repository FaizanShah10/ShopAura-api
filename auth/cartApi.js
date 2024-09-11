import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getBaseUrl } from '../../Frontend/src/utils/BaseUrl';

export const cartApi = createApi({ 
  reducerPath: 'cartApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${getBaseUrl()}/api/user`,
    credentials: 'include',
  }),
  tagTypes: ['User', 'Profile'], // Define the tag types for users and profile updates
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (newUser) => ({
        url: '/register',
        method: 'POST',
        body: newUser,
      }),
      invalidatesTags: ['User'], // Invalidate users list after registration
    }),
    loginUser: builder.mutation({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    logoutUser: builder.mutation({
      query: () => ({
        url: '/logout',
        method: 'POST',
      }),
    }),
    getUsers: builder.query({ // This should be a query instead of a mutation
      query: () => ({
        url: '/all-users',
        method: 'GET',
      }),
      providesTags: ['User'], // Provide user data for caching
    }),
    getUserById: builder.query({ // This should be a query instead of a mutation
      query: (id) => ({
        url: `/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'User', id }], // Provide specific user data
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'], // Invalidate the user list after deletion
    }),
    updateUser: builder.mutation({
      query: ({ id, role }) => ({
        url: `/update/${id}`,
        method: 'PUT',
        body: { role },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'User', id }], // Invalidate the updated user
    }),
    editProfile: builder.mutation({
      query: (profileData) => ({
        url: '/update-profile/',
        method: 'PUT',
        body: profileData,
      }),
      invalidatesTags: ['Profile'], // Invalidate profile data after update
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
  useGetUsersQuery, // Changed to query hook
  useGetUserByIdQuery, // Changed to query hook
  useEditProfileMutation,
  useDeleteUserMutation,
  useUpdateUserMutation, // Add this hook for updateUser mutation
} = cartApi;
