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
  userId: string;
  content: string;
  media_source: MediaItem[];
  privacy: 'public' | 'private';
  tags: string[];
  isEdited: boolean;
  editedAt?: string;
  sharedPostId?: string;
  isShared: boolean;
  shareCaption?: string;
  metadata: PostMetadata;
  createdAt: string;
  updatedAt: string;
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