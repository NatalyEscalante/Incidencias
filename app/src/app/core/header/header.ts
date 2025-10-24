
import { Component, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  isMobile = false;
  
  constructor(private router: Router) {
    this.checkViewport();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkViewport();
  }

  checkViewport() {
    this.isMobile = window.innerWidth <= 900;
  }

  isMobileView(): boolean {
    return this.isMobile;
  }

  isActive(route: string): boolean {
    return this.router.url === route;
  }
}
