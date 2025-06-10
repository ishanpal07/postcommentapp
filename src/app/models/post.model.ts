import { PostComment } from './comment.model';

export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
  expanded?: boolean;
  comments?: PostComment[];
  loadingComments?: boolean;
}
