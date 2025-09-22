export type Post = {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

export type PostInput = {
  title: string;
  description: string;
  image: File;
  userId: string;
};
