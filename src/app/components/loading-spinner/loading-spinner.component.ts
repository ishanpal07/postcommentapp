import { Component } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  template: `
    <div class="flex justify-center items-center py-8">
      <div class="relative">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-gray-600 border-t-blue-500"></div>
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div class="animate-spin rounded-full h-6 w-6 border-2 border-gray-700 border-t-blue-400" style="animation-direction: reverse; animation-duration: 1.5s;"></div>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class LoadingSpinnerComponent {}
