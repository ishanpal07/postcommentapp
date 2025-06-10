import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { User } from '../../models/user.model';
import { Post } from '../../models/post.model';
import { PostComment } from '../../models/comment.model';

@Component({
  selector: 'app-posts-comments',
  templateUrl: './posts-comments.component.html',
  styleUrls: ['./posts-comments.component.css'],
})
export class PostsCommentsComponent implements OnInit {
  users: User[] = [];
  posts: Post[] = [];
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
      next: (users) => {
        this.users = users;
        this.loadingUsers = false;
      },
      error: (error) => {
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
      next: (posts) => {
        this.posts = posts.map((post) => ({
          ...post,
          expanded: false,
          comments: [],
          loadingComments: false,
        }));
        this.loadingPosts = false;
      },
      error: (error) => {
        console.error('Error loading posts:', error);
        this.loadingPosts = false;
      },
    });
  }

  toggleShowAllPosts(): void {
    this.showAllPosts = !this.showAllPosts;
  }

  togglePostExpansion(post: Post): void {
    post.expanded = !post.expanded;
    if (post.expanded && (!post.comments || post.comments.length === 0)) {
      this.loadComments(post);
    }
  }

  loadComments(post: Post): void {
    post.loadingComments = true;
    this.apiService.getCommentsByPostId(post.id).subscribe({
      next: (comments) => {
        post.comments = comments;
        post.loadingComments = false;
      },
      error: (error) => {
        console.error('Error loading comments:', error);
        post.loadingComments = false;
      },
    });
  }

  get displayedPosts(): Post[] {
    return this.showAllPosts ? this.posts : this.posts.slice(0, 3);
  }

  get hasMorePosts(): boolean {
    return this.posts.length > 3;
  }

  getFirstName(fullName: string): string {
    return fullName.split(' ')[0];
  }
}
