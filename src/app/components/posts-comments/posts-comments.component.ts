import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiService } from '../../services/api.service';
import { User } from '../../models/user.model';
import { Post } from '../../models/post.model';
import { PostComment } from '../../models/comment.model';


export interface ExtendedPost extends Post {
  expanded: boolean;
  comments: PostComment[];
  loadingComments: boolean;
}

@Component({
  selector: 'app-posts-comments',
  templateUrl: './posts-comments.component.html',
  styleUrls: ['./posts-comments.component.css'],
})
export class PostsCommentsComponent implements OnInit {
  users: User[] = [];
  posts: ExtendedPost[] = [];
  selectedUser: User | null = null;
  loadingUsers = false;
  loadingPosts = false;
  showAllPosts = false;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loadingUsers = true;
    this.apiService.getUsers().subscribe({
      next: (users: User[]) => {
        this.users = users;
        this.loadingUsers = false;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error loading users:', error);
        this.loadingUsers = false;
      },
    });
  }

  selectUser(user: User): void {
    this.selectedUser = user;
    this.posts = [];
    this.showAllPosts = false;
    this.loadPosts(user.id);
  }

  loadPosts(userId: number): void {
    this.loadingPosts = true;
    this.apiService.getPostsByUserId(userId).subscribe({
      next: (posts: Post[]) => {
        this.posts = posts.map((post: Post): ExtendedPost => ({
          ...post,
          expanded: false,
          comments: [],
          loadingComments: false,
        }));
        this.loadingPosts = false;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error loading posts:', error);
        this.loadingPosts = false;
      },
    });
  }

  toggleShowAllPosts(): void {
    this.showAllPosts = !this.showAllPosts;
  }

  togglePostExpansion(post: ExtendedPost): void {
    post.expanded = !post.expanded;
    if (post.expanded && (!post.comments || post.comments.length === 0)) {
      this.loadComments(post);
    }
  }

  loadComments(post: ExtendedPost): void {
    post.loadingComments = true;
    this.apiService.getCommentsByPostId(post.id).subscribe({
      next: (comments: PostComment[]) => {
        post.comments = comments;
        post.loadingComments = false;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error loading comments:', error);
        post.loadingComments = false;
      },
    });
  }

  get displayedPosts(): ExtendedPost[] {
    return this.showAllPosts ? this.posts : this.posts.slice(0, 3);
  }

  get hasMorePosts(): boolean {
    return this.posts.length > 3;
  }

  getFirstName(fullName: string): string {
    if (!fullName || typeof fullName !== 'string') {
      return '';
    }
    return fullName.trim().split(' ')[0] || '';
  }
}