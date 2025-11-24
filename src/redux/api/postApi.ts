import { BASE_URL } from "@/lib/Base_URL";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";
import { asBearer, getAuthToken } from "@/lib/authToken";
import type { CreatePostRequest, Post, UpdatePostRequest } from "@/types/postApi.interface";

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
    // Get all posts - SIMPLIFIED
    getAllPosts: builder.query<Post, void>({
      query: () => "/",
      providesTags: ["Post"],
    }),

    // Get my posts - SIMPLIFIED
    getMyPosts: builder.query<Post[], void>({
      query: () => "/my-post",
      providesTags: ["Post"],
    }),

    // Get single post - SIMPLIFIED
    getSinglePost: builder.query<Post, string>({
      query: (id) => `/${id}`,
      providesTags: ["Post"],
    }),

    // Create post
    createPost: builder.mutation<Post, CreatePostRequest>({
      query: (postData) => ({
        url: "/",
        method: "POST",
        body: postData,
      }),
      invalidatesTags: ["Post"],
    }),

    // Update post
    updatePost: builder.mutation<Post, { id: string; data: UpdatePostRequest }>({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Post"],
    }),

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