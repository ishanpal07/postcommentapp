import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { PostsCommentsComponent, ExtendedPost } from './posts-comments.component';
import { ApiService } from '../../services/api.service';
import { User } from '../../models/user.model';
import { Post } from '../../models/post.model';
import { PostComment } from '../../models/comment.model';

describe('PostsCommentsComponent', () => {
  let component: PostsCommentsComponent;
  let fixture: ComponentFixture<PostsCommentsComponent>;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  const mockUsers: User[] = [
    { 
      id: 1, 
      name: 'John Doe', 
      email: 'john@example.com', 
      username: 'johndoe',
      address: { street: '123 Main St', suite: 'Apt 1', city: 'Anytown', zipcode: '12345', geo: { lat: '0', lng: '0' } },
      phone: '123-456-7890',
      website: 'john.com',
      company: { name: 'John Corp', catchPhrase: 'Test phrase', bs: 'test bs' }
    },
    { 
      id: 2, 
      name: 'Jane Smith', 
      email: 'jane@example.com', 
      username: 'janesmith',
      address: { street: '456 Oak St', suite: 'Apt 2', city: 'Somewhere', zipcode: '67890', geo: { lat: '0', lng: '0' } },
      phone: '987-654-3210',
      website: 'jane.com',
      company: { name: 'Jane Inc', catchPhrase: 'Another phrase', bs: 'another bs' }
    }
  ];

  const mockPosts: Post[] = [
    { id: 1, userId: 1, title: 'Test Post 1', body: 'Test body 1' },
    { id: 2, userId: 1, title: 'Test Post 2', body: 'Test body 2' },
    { id: 3, userId: 1, title: 'Test Post 3', body: 'Test body 3' },
    { id: 4, userId: 1, title: 'Test Post 4', body: 'Test body 4' }
  ];

  const mockExtendedPosts: ExtendedPost[] = [
    { id: 1, userId: 1, title: 'Test Post 1', body: 'Test body 1', expanded: false, comments: [], loadingComments: false },
    { id: 2, userId: 1, title: 'Test Post 2', body: 'Test body 2', expanded: false, comments: [], loadingComments: false },
    { id: 3, userId: 1, title: 'Test Post 3', body: 'Test body 3', expanded: false, comments: [], loadingComments: false },
    { id: 4, userId: 1, title: 'Test Post 4', body: 'Test body 4', expanded: false, comments: [], loadingComments: false }
  ];

  const mockComments: PostComment[] = [
    { id: 1, postId: 1, name: 'Test Comment', email: 'test@example.com', body: 'Comment body' }
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ApiService', ['getUsers', 'getPostsByUserId', 'getCommentsByPostId']);

    await TestBed.configureTestingModule({
      declarations: [PostsCommentsComponent],
      providers: [
        { provide: ApiService, useValue: spy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PostsCommentsComponent);
    component = fixture.componentInstance;
    apiServiceSpy = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.users).toEqual([]);
    expect(component.posts).toEqual([]);
    expect(component.selectedUser).toBeNull();
    expect(component.loadingUsers).toBeFalse();
    expect(component.loadingPosts).toBeFalse();
    expect(component.showAllPosts).toBeFalse();
  });

  it('should load users on init', () => {
    apiServiceSpy.getUsers.and.returnValue(of(mockUsers));
    
    component.ngOnInit();
    
    expect(apiServiceSpy.getUsers).toHaveBeenCalled();
  });

  describe('loadUsers', () => {
    it('should load users successfully', () => {
      apiServiceSpy.getUsers.and.returnValue(of(mockUsers));
      
      component.loadUsers();
      
      expect(component.loadingUsers).toBeFalse();
      expect(component.users).toEqual(mockUsers);
    });

    it('should handle error when loading users', () => {
      const consoleSpy = spyOn(console, 'error');
      apiServiceSpy.getUsers.and.returnValue(throwError(() => new Error('API Error')));
      
      component.loadUsers();
      
      expect(component.loadingUsers).toBeFalse();
      expect(consoleSpy).toHaveBeenCalledWith('Error loading users:', jasmine.any(Error));
    });
  });

  describe('selectUser', () => {
    it('should select user and load posts', () => {
      const user = mockUsers[0];
      apiServiceSpy.getPostsByUserId.and.returnValue(of(mockPosts));
      spyOn(component, 'loadPosts');
      
      component.selectUser(user);
      
      expect(component.selectedUser).toEqual(user);
      expect(component.posts).toEqual([]);
      expect(component.showAllPosts).toBeFalse();
      expect(component.loadPosts).toHaveBeenCalledWith(user.id);
    });
  });

  describe('loadPosts', () => {
    it('should load posts successfully', () => {
      apiServiceSpy.getPostsByUserId.and.returnValue(of(mockPosts));
      
      component.loadPosts(1);
      
      expect(component.loadingPosts).toBeFalse();
      expect(component.posts.length).toBe(4);
      expect(component.posts[0].expanded).toBeFalse();
      expect(component.posts[0].comments).toEqual([]);
      expect(component.posts[0].loadingComments).toBeFalse();
    });

    it('should handle error when loading posts', () => {
      const consoleSpy = spyOn(console, 'error');
      apiServiceSpy.getPostsByUserId.and.returnValue(throwError(() => new Error('API Error')));
      
      component.loadPosts(1);
      
      expect(component.loadingPosts).toBeFalse();
      expect(consoleSpy).toHaveBeenCalledWith('Error loading posts:', jasmine.any(Error));
    });
  });

  describe('toggleShowAllPosts', () => {
    it('should toggle showAllPosts', () => {
      expect(component.showAllPosts).toBeFalse();
      
      component.toggleShowAllPosts();
      expect(component.showAllPosts).toBeTrue();
      
      component.toggleShowAllPosts();
      expect(component.showAllPosts).toBeFalse();
    });
  });

  describe('togglePostExpansion', () => {
    it('should expand post and load comments if no comments exist', () => {
      const post = { ...mockExtendedPosts[0] };
      spyOn(component, 'loadComments');
      
      component.togglePostExpansion(post);
      
      expect(post.expanded).toBeTrue();
      expect(component.loadComments).toHaveBeenCalledWith(post);
    });

    it('should collapse post without loading comments', () => {
      const post = { ...mockExtendedPosts[0], expanded: true };
      spyOn(component, 'loadComments');
      
      component.togglePostExpansion(post);
      
      expect(post.expanded).toBeFalse();
      expect(component.loadComments).not.toHaveBeenCalled();
    });

    it('should not load comments if post already has comments', () => {
      const post = { ...mockExtendedPosts[0], comments: mockComments };
      spyOn(component, 'loadComments');
      
      component.togglePostExpansion(post);
      
      expect(post.expanded).toBeTrue();
      expect(component.loadComments).not.toHaveBeenCalled();
    });
  });

  describe('loadComments', () => {
    it('should load comments successfully', () => {
      const post = { ...mockExtendedPosts[0] };
      apiServiceSpy.getCommentsByPostId.and.returnValue(of(mockComments));
      
      component.loadComments(post);
      
      expect(post.loadingComments).toBeFalse();
      expect(post.comments).toEqual(mockComments);
    });

    it('should handle error when loading comments', () => {
      const post = { ...mockExtendedPosts[0] };
      const consoleSpy = spyOn(console, 'error');
      apiServiceSpy.getCommentsByPostId.and.returnValue(throwError(() => new Error('API Error')));
      
      component.loadComments(post);
      
      expect(post.loadingComments).toBeFalse();
      expect(consoleSpy).toHaveBeenCalledWith('Error loading comments:', jasmine.any(Error));
    });
  });

  describe('displayedPosts getter', () => {
    beforeEach(() => {
      component.posts = mockExtendedPosts;
    });

    it('should return first 3 posts when showAllPosts is false', () => {
      component.showAllPosts = false;
      
      const displayed = component.displayedPosts;
      
      expect(displayed.length).toBe(3);
      expect(displayed).toEqual(mockExtendedPosts.slice(0, 3));
    });

    it('should return all posts when showAllPosts is true', () => {
      component.showAllPosts = true;
      
      const displayed = component.displayedPosts;
      
      expect(displayed.length).toBe(4);
      expect(displayed).toEqual(mockExtendedPosts);
    });
  });

  describe('hasMorePosts getter', () => {
    it('should return true when there are more than 3 posts', () => {
      component.posts = mockExtendedPosts; // 4 posts
      
      expect(component.hasMorePosts).toBeTrue();
    });

    it('should return false when there are 3 or fewer posts', () => {
      component.posts = mockExtendedPosts.slice(0, 3); // 3 posts
      
      expect(component.hasMorePosts).toBeFalse();
    });
  });

  describe('getFirstName', () => {
    it('should return first name from full name', () => {
      expect(component.getFirstName('John Doe')).toBe('John');
      expect(component.getFirstName('Jane Smith Johnson')).toBe('Jane');
    });

    it('should return the whole string if no space', () => {
      expect(component.getFirstName('John')).toBe('John');
    });
  });
});