import { BASE_URL } from "@/lib/Base_URL";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";
import { asBearer, getAuthToken } from "@/lib/authToken";
import type {
  Comment,
  CreateCommentRequest,
  UpdateCommentRequest,
  CommentsResponse,
  SingleCommentResponse,
  RepliesResponse,
} from "@/types/commentApi.types";

export const commentApi = createApi({
  reducerPath: "commentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/comment`,
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
  tagTypes: ["Comment"],
  endpoints: (builder) => ({
    // Get comments by post with pagination
    getCommentsByPost: builder.query<
      CommentsResponse["data"],
      { postId: string; page?: number; limit?: number }
    >({
      query: ({ postId, page = 1, limit = 10 }) => ({
        url: `/post/${postId}`,
        params: { page, limit },
      }),
      transformResponse: (response: CommentsResponse) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.comments.map(({ _id }) => ({
                type: "Comment" as const,
                id: _id,
              })),
              { type: "Comment", id: "LIST" },
            ]
          : [{ type: "Comment", id: "LIST" }],
    }),

    // Get replies for a comment
    getReplies: builder.query<Comment[], string>({
      query: (commentId) => `/replies/${commentId}`,
      transformResponse: (response: RepliesResponse) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({
                type: "Comment" as const,
                id: _id,
              })),
              { type: "Comment", id: "LIST" },
            ]
          : [{ type: "Comment", id: "LIST" }],
    }),

    // Create comment
    createComment: builder.mutation<Comment, CreateCommentRequest>({
      query: (commentData) => ({
        url: "/",
        method: "POST",
        body: commentData,
      }),
      transformResponse: (response: SingleCommentResponse) => response.data,
      invalidatesTags: ["Comment"],
    }),

    // Update comment
    updateComment: builder.mutation<
      Comment,
      { id: string; data: UpdateCommentRequest }
    >({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (response: SingleCommentResponse) => response.data,
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Comment", id },
        { type: "Comment", id: "LIST" },
      ],
    }),

    // Delete comment
    deleteComment: builder.mutation<void, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Comment"],
    }),
  }),
});

export const {
  useGetCommentsByPostQuery,
  useGetRepliesQuery,
  useCreateCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
} = commentApi;
