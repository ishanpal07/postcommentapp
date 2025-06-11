import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadingSpinnerComponent } from './loading-spinner.component';

describe('LoadingSpinnerComponent', () => {
  let component: LoadingSpinnerComponent;
  let fixture: ComponentFixture<LoadingSpinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoadingSpinnerComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(LoadingSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render spinner elements', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    
    // Check for main container
    const container = compiled.querySelector('.flex.justify-center.items-center.py-8');
    expect(container).toBeTruthy();

    // Check for outer spinner
    const outerSpinner = compiled.querySelector('.animate-spin.rounded-full.h-12.w-12');
    expect(outerSpinner).toBeTruthy();

    // Check for inner spinner
    const innerSpinner = compiled.querySelector('.animate-spin.rounded-full.h-6.w-6');
    expect(innerSpinner).toBeTruthy();
  });

  it('should have correct CSS classes for styling', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    
    const outerSpinner = compiled.querySelector('.h-12.w-12.border-4.border-gray-600.border-t-blue-500');
    expect(outerSpinner).toBeTruthy();

    const innerSpinner = compiled.querySelector('.h-6.w-6.border-2.border-gray-700.border-t-blue-400');
    expect(innerSpinner).toBeTruthy();
  });

  it('should have relative and absolute positioning', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    
    const relativeDiv = compiled.querySelector('.relative');
    expect(relativeDiv).toBeTruthy();

    const absoluteDiv = compiled.querySelector('.absolute.top-1\\/2.left-1\\/2');
    expect(absoluteDiv).toBeTruthy();
  });

  it('should apply reverse-spin class to inner spinner', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    
    const innerSpinner = compiled.querySelector('.reverse-spin');
    expect(innerSpinner).toBeTruthy();
  });
});