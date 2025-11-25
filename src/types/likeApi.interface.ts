export interface Like {
  _id: string;
  userId: string;
  targetType: "post" | "comment";
  targetId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ToggleLikeRequest {
  targetId: string;
  targetType: "post" | "comment";
}

export interface ToggleLikeResponse {
  liked: boolean;
  like: Like | null;
}

export interface ToggleLikeResponseWrapper {
  statusCode: number;
  success: boolean;
  message: string;
  data: ToggleLikeResponse;
}

export interface LikesListResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: Like[];
}

export interface LikesListResponseForStatus {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    likes: Like[];
    total: number;
  };
}

export interface LikesCountResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    count: number;
  };
}
