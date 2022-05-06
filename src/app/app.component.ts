import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  switchToFullscreen(): void {
    document.documentElement.requestFullscreen();
  }

  @HostListener('window:orientationchange', [])
  onOrientationChange(): void {
    location.reload();
  }
}
