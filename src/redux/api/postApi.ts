import { BASE_URL } from "@/lib/Base_URL";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";
import { asBearer, getAuthToken } from "@/lib/authToken";
import type {
  Post,
  UpdatePostRequest,
  PostsResponse,
  SinglePostResponse,
} from "@/types/postApi.interface";

export const postApi = createApi({
  reducerPath: "postApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/post`,
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      const token = getAuthToken(state);
      const bearer = asBearer(token);

      if (bearer) {
        headers.set("authorization", bearer);
      } else {
        headers.delete("authorization");
      }

      return headers;
    },
  }),
  tagTypes: ["Post"],
  endpoints: (builder) => ({
    // Get all posts - Updated to handle the response structure
    getAllPosts: builder.query<Post[], void>({
      query: () => "/",
      transformResponse: (response: PostsResponse) => response.data.data,
      providesTags: ["Post"],
    }),

    // Get my posts - Updated to handle the response structure
    getMyPosts: builder.query<Post[], void>({
      query: () => "/my-post",
      transformResponse: (response: PostsResponse) => response.data.data,
      providesTags: ["Post"],
    }),

    // Get single post - Updated to handle the response structure
    getSinglePost: builder.query<Post, string>({
      query: (id) => `/${id}`,
      transformResponse: (response: SinglePostResponse) => response.data,
      providesTags: ["Post"],
    }),

    // Create post
    // In postApi.ts
    createPost: builder.mutation<Post, FormData>({
      query: (formData) => ({
        url: "/",
        method: "POST",
        body: formData,
      }),
      transformResponse: (response: SinglePostResponse) => response.data,
      invalidatesTags: ["Post"],
    }),

    // Update post
    updatePost: builder.mutation<Post, { id: string; data: UpdatePostRequest }>(
      {
        query: ({ id, data }) => ({
          url: `/${id}`,
          method: "PATCH",
          body: data,
        }),
        transformResponse: (response: SinglePostResponse) => response.data,
        invalidatesTags: ["Post"],
      }
    ),

    // Delete post
    deletePost: builder.mutation<void, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Post"],
    }),
  }),
});

export const {
  useGetAllPostsQuery,
  useGetMyPostsQuery,
  useGetSinglePostQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
} = postApi;
