import { Component, signal } from '@angular/core';
import { TicketService } from '../../share/service/api/Ticket.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-asignacion-index',
  standalone: false,
  templateUrl: './asignacion-index.html',
  styleUrl: './asignacion-index.css'
})
export class AsignacionIndex {
  datos = signal<any>({
    usuario: null,
    totalTickets: 0,
    tickets: []
  });

  // Control de vista actual
  currentView = signal<'semana' | 'mes' | 'lista'>('semana');
  currentDate = signal<Date>(new Date());

  constructor(
    private ticketService: TicketService,
    private router: Router
  ) {
    this.listTickets();
  }

  listTickets() {
    const usuarioRol = 1;
    this.ticketService.getTicketsByRol(usuarioRol).subscribe({
      next: (respuesta: any) => {
        console.log('Respuesta completa:', respuesta);
        this.datos.set(respuesta);
      }
    });
  }

  detalle(id: number) {
    this.router.navigate(['/ticket', id]);
  }

  // Cambiar vista
  setView(view: 'semana' | 'mes' | 'lista') {
    this.currentView.set(view);
  }

  // Navegación de fechas
  previousPeriod() {
    const current = this.currentDate();
    if (this.currentView() === 'semana') {
      this.currentDate.set(new Date(current.setDate(current.getDate() - 7)));
    } else {
      this.currentDate.set(new Date(current.setMonth(current.getMonth() - 1)));
    }
  }

  nextPeriod() {
    const current = this.currentDate();
    if (this.currentView() === 'semana') {
      this.currentDate.set(new Date(current.setDate(current.getDate() + 7)));
    } else {
      this.currentDate.set(new Date(current.setMonth(current.getMonth() + 1)));
    }
  }

  // Obtener días de la semana actual
  getWeekDays(): any[] {
    const days = [];
    const current = this.currentDate();
    const startOfWeek = new Date(current);
    startOfWeek.setDate(current.getDate() - current.getDay() + 1); // Lunes 
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      
      days.push({
        key: i,
        name: date.toLocaleDateString('es-ES', { weekday: 'short' }),
        date: date.toISOString().split('T')[0],
        fullDate: date,
        dayNumber: date.getDate()
      });
    }
    
    return days;
  }

  // Obtener días del mes actual
  getMonthDays(): any[] {
    const days = [];
    const current = this.currentDate();
    const year = current.getFullYear();
    const month = current.getMonth();
    
    // Primer día del mes
    const firstDay = new Date(year, month, 1);
    // Último día del mes
    const lastDay = new Date(year, month + 1, 0);
    
    // Días del mes anterior para completar la primera semana
    const startDay = new Date(firstDay);
    startDay.setDate(firstDay.getDate() - firstDay.getDay() + 1);
    
    // Días del mes siguiente para completar la última semana
    const endDay = new Date(lastDay);
    endDay.setDate(lastDay.getDate() + (6 - lastDay.getDay()));
    
    const currentDate = new Date(startDay);
    
    while (currentDate <= endDay) {
      const isCurrentMonth = currentDate.getMonth() === month;
      const isToday = this.isToday(currentDate);
      
      days.push({
        key: currentDate.toISOString(),
        name: currentDate.toLocaleDateString('es-ES', { weekday: 'short' }),
        date: currentDate.toISOString().split('T')[0],
        fullDate: new Date(currentDate),
        dayNumber: currentDate.getDate(),
        isCurrentMonth: isCurrentMonth,
        isToday: isToday,
        isWeekend: currentDate.getDay() === 0 || currentDate.getDay() === 6
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return days;
  }

  // Verificar si es hoy
  isToday(date: Date): boolean {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }

  // Obtener nombre del mes y año
  getMonthYearString(): string {
    return this.currentDate().toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long' 
    });
  }

  // Obtener rango de la semana
  getWeekRangeString(): string {
    const days = this.getWeekDays();
    const firstDay = days[0].fullDate;
    const lastDay = days[6].fullDate;
    
    return `${firstDay.getDate()} ${firstDay.toLocaleDateString('es-ES', { month: 'short' })} - 
            ${lastDay.getDate()} ${lastDay.toLocaleDateString('es-ES', { month: 'short' })} ${lastDay.getFullYear()}`;
  }

  // Filtrar tickets por día
  getTicketsForDay(date: string): any[] {
    const tickets = this.datos().tickets || [];
    return tickets.filter((ticket: any) => {
      if (!ticket.fechaCreacion) return false;
      const ticketDate = ticket.fechaCreacion.split('T')[0];
      return ticketDate === date;
    });
  }

  getEstadoClass(estado: string | undefined): string {
    if (!estado) return 'default';

    const estadoLower = estado.toLowerCase().trim();

    if (estadoLower.includes('pendiente')) return 'pendiente';
    else if (estadoLower.includes('asignado')) return 'asignado';
    else if (estadoLower.includes('proceso')) return 'progreso';
    else if (estadoLower.includes('resuelto')) return 'resuelto';
    else if (estadoLower.includes('cerrado')) return 'cerrado';
    return 'default';
  }

  getUrgenciaClass(ticket: any): string {
    const progress = this.getSLAProgress(ticket);
    if (progress >= 80) return 'alta';
    else if (progress >= 50) return 'media';
    else return 'baja';
  }

  getSLAProgress(ticket: any): number {
    if (!ticket.fechaCreacion) return 0;
    
    const created = new Date(ticket.fechaCreacion);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const slaDays = 7; // SLA de 7 días
    return Math.min((diffDays / slaDays) * 100, 100);
  }

  getSLATimeRemaining(ticket: any): string {
    const progress = this.getSLAProgress(ticket);
    if (progress >= 100) return 'Vencido';
    else if (progress >= 80) return 'Crítico';
    else if (progress >= 50) return 'Medio';
    else return 'Normal';
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}