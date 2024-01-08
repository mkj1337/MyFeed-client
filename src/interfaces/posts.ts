export interface PostProps {
  id: number;
  userImg?: string;
  postImg?: string;
  postVideo?: string;
  postGif?: string;
  name: string;
  username: string;
  desc?: string;
  file?: File;
  userId: number | string;
  likes?: number | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreatePostProps {
  comment?: boolean;
  parentId?: any;
  border?: string;
}

export interface PostMediaProps {
  id: number;
  post_id: string;
  post_gif?: string;
  post_img?: string;
  post_video?: string;
}
