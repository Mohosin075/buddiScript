export interface MediaItem {
  url: string;
  type: 'image' | 'video';
  thumbnail?: string;
  duration?: number;
  size?: number;
  altText?: string;
}

export interface PostMetadata {
  likeCount: number;
  commentCount: number;
  viewCount: number;
  shareCount: number;
}

export interface Post {
  _id: string;
  userId: string | null;
  content: string;
  media_source: MediaItem[];
  privacy: 'public' | 'private';
  tags: string[];
  isEdited: boolean;
  editedAt?: string;
  sharedPostId?: string | null;
  isShared: boolean;
  shareCaption?: string;
  metadata: PostMetadata;
  createdAt: string;
  updatedAt: string;
  id: string; // Some posts have both _id and id
}

export interface CreatePostRequest {
  content: string;
  media_source?: MediaItem[];
  privacy?: 'public' | 'private';
  tags?: string[];
  sharedPostId?: string;
  shareCaption?: string;
}

export interface UpdatePostRequest {
  content?: string;
  media_source?: MediaItem[];
  privacy?: 'public' | 'private';
  tags?: string[];
}

// API Response types
export interface PostsResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
    data: Post[];
  };
}

export interface SinglePostResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: Post;
}