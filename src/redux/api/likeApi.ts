/* eslint-disable @typescript-eslint/no-explicit-any */
import { BASE_URL } from "@/lib/Base_URL";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";
import { asBearer, getAuthToken } from "@/lib/authToken";
import type {
  Like,
  ToggleLikeRequest,
  ToggleLikeResponse,
} from "@/types/likeApi.interface";

export const likeApi = createApi({
  reducerPath: "likeApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/like`,
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
  tagTypes: ["Like"],
  endpoints: (builder) => ({
    // Toggle like on post or comment
    toggleLike: builder.mutation<ToggleLikeResponse, ToggleLikeRequest>({
      query: (likeData) => ({
        url: "/toggle",
        method: "POST",
        body: likeData,
      }),
      transformResponse: (response: any): ToggleLikeResponse => {
        const data = response?.data ?? response;
        const liked = Boolean(
          data?.liked ?? data?.isLiked ?? (data?.like ? true : false)
        );
        const like = data?.like ?? null;
        return { liked, like };
      },
      invalidatesTags: ["Like"],
    }),

    // Get all likes for a specific target (post or comment)
    getLikes: builder.query<
      Like[],
      { targetId: string; targetType: "post" | "comment" }
    >({
      query: ({ targetId, targetType }) => `/${targetType}/${targetId}`,
      transformResponse: (response: any): Like[] => {
        const data = response?.data ?? response;
        if (Array.isArray(data)) return data as Like[];
        if (Array.isArray(data?.likes)) return data.likes as Like[];
        return [] as Like[];
      },
      providesTags: ["Like"],
    }),

    // Check if current user liked a specific target
    checkLikeStatus: builder.query<
      { liked: boolean; like: Like | null },
      { targetId: string; targetType: "post" | "comment" }
    >({
      query: ({ targetId, targetType }) => `/status/${targetType}/${targetId}`,
      transformResponse: (
        response: any
      ): { liked: boolean; like: Like | null } => {
        const data = response?.data ?? response;
        const liked = Boolean(
          data?.liked ?? data?.isLiked ?? (data?.like ? true : false)
        );
        const like = data?.isLiked ? data?.like : null;
        return { liked, like };
      },
      providesTags: ["Like"],
    }),

    // Get likes count for a specific target
    getLikesCount: builder.query<
      number,
      { targetId: string; targetType: "post" | "comment" }
    >({
      query: ({ targetId, targetType }) => `/${targetType}/${targetId}`,
      transformResponse: (response: any): number => {
        const data = response?.data ?? response;
        if (typeof data === "number") return data as number;
        if (Array.isArray(data)) return (data as unknown[]).length;
        if (typeof data?.count === "number") return data.count as number;
        if (Array.isArray(data?.likes)) return (data.likes as unknown[]).length;
        if (typeof data?.total === "number") return data.total as number;
        return 0;
      },
      providesTags: ["Like"],
    }),
  }),
});

export const {
  useToggleLikeMutation,
  useGetLikesQuery,
  useCheckLikeStatusQuery,
  useGetLikesCountQuery,
} = likeApi;
