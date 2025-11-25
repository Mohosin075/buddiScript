export interface CommentMedia {
  url: string;
  type: "image" | "video";
  thumbnail?: string;
  altText?: string;
}

export interface CommentMetadata {
  likeCount: number;
  replyCount: number;
}

export interface CommentUser {
  _id: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
}

export interface Comment {
  _id: string;
  userId: CommentUser;
  postId: string;
  parentCommentId: string | null;
  content: string;
  media: CommentMedia[];
  isEdited: boolean;
  isActive: boolean;
  metadata: CommentMetadata;
  createdAt: string;
  updatedAt: string;
  hasLiked?: boolean;
}

export interface CreateCommentRequest {
  postId: string;
  content: string;
  parentCommentId?: string;
  media?: CommentMedia[];
}

export interface UpdateCommentRequest {
  content: string;
}

// API Response types
export interface CommentsResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    comments: Comment[];
    total: number;
    page: number;
    totalPages: number;
  };
}

export interface SingleCommentResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: Comment;
}

export interface RepliesResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: Comment[];
}
