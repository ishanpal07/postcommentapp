import { TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should have correct title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.componentInstance;
    expect(component.title).toEqual('posts-comments-app');
  });

  it('should render title in template', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    
    // Test for the actual displayed text in your template
    expect(compiled.querySelector('h1')?.textContent).toContain('Posts & Comments');
  });

  it('should initialize with default values', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.componentInstance;
    
    expect(component.title).toBeDefined();
    expect(typeof component.title).toBe('string');
  });
});