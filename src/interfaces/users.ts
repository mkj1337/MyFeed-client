export interface CurrentUserProps {
  id: string;
  email: string;
  name: string;
  username: string;
  userImg?: string;
  profileImg?: string;
  location?: string;
  bio?: string;
  x_url?: string;
  instagram_url?: string;
  youtube_url?: string;
  createdAt: Date;
}

export interface User {
  id: number;
  name: string;
  username: string;
  userImg?: string;
}
