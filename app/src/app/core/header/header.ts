
import { Component, HostListener, computed, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthenticationService } from '../../share/service/app/authentication.service';
@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {

  private router = inject(Router);
  private authService = inject(AuthenticationService);
  //private cartService = inject(CartService);

  /** Signals */
  readonly isAuthenticated = this.authService.authenticated;
  readonly currentUser = this.authService.usuario;
  //readonly qtyItems = this.cartService.qtyItems;

  /** Control de roles */
  readonly role = computed(() => {
    const user = this.currentUser();
    if (!user || !user.rol) return null;

    // Si rol es un objeto con propiedad 
    if (user.rol && typeof user.rol === 'object' && 'nombre' in user.rol) {
      return user.rol.nombre;
    }

    return null;
  });
  readonly isAdmin = computed(() => this.role() === 'Administrador');
  readonly isUser = computed(() => this.role() === 'Cliente');

  /** Navegación */
  login = () => this.router.navigate(['/usuario/login']);
  logout = () => this.authService.logout();
  isMobile = false;

  /* constructor(private route: Router) {
     this.checkViewport();
   }*/

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

  /*isActive(route: string): boolean {
    return this.route.url === route;
  }*/
}
