import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';
import { User } from '../models/user.model';
import { Post } from '../models/post.model';
import { PostComment } from '../models/comment.model';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;
  const baseUrl = 'https://jsonplaceholder.typicode.com';

  const mockUsers: User[] = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      username: 'johndoe',
      address: {
        street: '123 Main St',
        suite: 'Apt 1',
        city: 'Anytown',
        zipcode: '12345',
        geo: { lat: '0', lng: '0' }
      },
      phone: '123-456-7890',
      website: 'john.com',
      company: {
        name: 'John Corp',
        catchPhrase: 'Test phrase',
        bs: 'test bs'
      }
    }
  ];

  const mockPosts: Post[] = [
    {
      id: 1,
      userId: 1,
      title: 'Test Post',
      body: 'Test post body'
    },
    {
      id: 2,
      userId: 1,
      title: 'Another Test Post',
      body: 'Another test post body'
    }
  ];

  const mockComments: PostComment[] = [
    {
      id: 1,
      postId: 1,
      name: 'Test Comment',
      email: 'commenter@example.com',
      body: 'This is a test comment'
    },
    {
      id: 2,
      postId: 1,
      name: 'Another Comment',
      email: 'another@example.com',
      body: 'This is another test comment'
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService]
    });
    
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Verify that no unmatched requests are outstanding
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getUsers', () => {
    it('should fetch users successfully', () => {
      service.getUsers().subscribe(users => {
        expect(users).toEqual(mockUsers);
        expect(users.length).toBe(1);
        expect(users[0].name).toBe('John Doe');
      });

      const req = httpMock.expectOne(`${baseUrl}/users`);
      expect(req.request.method).toBe('GET');
      req.flush(mockUsers);
    });

    it('should handle error when fetching users', () => {
      const errorMessage = 'Server error';

      service.getUsers().subscribe({
        next: () => fail('Expected an error, not users'),
        error: (error) => {
          expect(error.status).toBe(500);
          expect(error.statusText).toBe('Internal Server Error');
        }
      });

      const req = httpMock.expectOne(`${baseUrl}/users`);
      req.flush(errorMessage, { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('getPostsByUserId', () => {
    it('should fetch posts by user ID successfully', () => {
      const userId = 1;

      service.getPostsByUserId(userId).subscribe(posts => {
        expect(posts).toEqual(mockPosts);
        expect(posts.length).toBe(2);
        expect(posts[0].userId).toBe(userId);
      });

      const req = httpMock.expectOne(`${baseUrl}/posts?userId=${userId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockPosts);
    });

    it('should handle different user IDs', () => {
      const userId = 5;
      const userPosts = [{ ...mockPosts[0], userId: 5 }];

      service.getPostsByUserId(userId).subscribe(posts => {
        expect(posts).toEqual(userPosts);
        expect(posts[0].userId).toBe(userId);
      });

      const req = httpMock.expectOne(`${baseUrl}/posts?userId=${userId}`);
      expect(req.request.method).toBe('GET');
      req.flush(userPosts);
    });

    it('should handle error when fetching posts', () => {
      const userId = 1;
      const errorMessage = 'Posts not found';

      service.getPostsByUserId(userId).subscribe({
        next: () => fail('Expected an error, not posts'),
        error: (error) => {
          expect(error.status).toBe(404);
          expect(error.statusText).toBe('Not Found');
        }
      });

      const req = httpMock.expectOne(`${baseUrl}/posts?userId=${userId}`);
      req.flush(errorMessage, { status: 404, statusText: 'Not Found' });
    });
  });

  describe('getCommentsByPostId', () => {
    it('should fetch comments by post ID successfully', () => {
      const postId = 1;

      service.getCommentsByPostId(postId).subscribe(comments => {
        expect(comments).toEqual(mockComments);
        expect(comments.length).toBe(2);
        expect(comments[0].postId).toBe(postId);
      });

      const req = httpMock.expectOne(`${baseUrl}/comments?postId=${postId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockComments);
    });

    it('should handle different post IDs', () => {
      const postId = 3;
      const postComments = [{ ...mockComments[0], postId: 3 }];

      service.getCommentsByPostId(postId).subscribe(comments => {
        expect(comments).toEqual(postComments);
        expect(comments[0].postId).toBe(postId);
      });

      const req = httpMock.expectOne(`${baseUrl}/comments?postId=${postId}`);
      expect(req.request.method).toBe('GET');
      req.flush(postComments);
    });

    it('should handle error when fetching comments', () => {
      const postId = 1;
      const errorMessage = 'Comments not found';

      service.getCommentsByPostId(postId).subscribe({
        next: () => fail('Expected an error, not comments'),
        error: (error) => {
          expect(error.status).toBe(503);
          expect(error.statusText).toBe('Service Unavailable');
        }
      });

      const req = httpMock.expectOne(`${baseUrl}/comments?postId=${postId}`);
      req.flush(errorMessage, { status: 503, statusText: 'Service Unavailable' });
    });
  });

  describe('URL construction', () => {
    it('should construct correct URLs for all methods', () => {
      service.getUsers().subscribe();
      service.getPostsByUserId(1).subscribe();
      service.getCommentsByPostId(1).subscribe();

      const usersReq = httpMock.expectOne(`${baseUrl}/users`);
      const postsReq = httpMock.expectOne(`${baseUrl}/posts?userId=1`);
      const commentsReq = httpMock.expectOne(`${baseUrl}/comments?postId=1`);

      expect(usersReq.request.url).toBe(`${baseUrl}/users`);
      expect(postsReq.request.url).toBe(`${baseUrl}/posts?userId=1`);
      expect(commentsReq.request.url).toBe(`${baseUrl}/comments?postId=1`);

      usersReq.flush([]);
      postsReq.flush([]);
      commentsReq.flush([]);
    });
  });
});