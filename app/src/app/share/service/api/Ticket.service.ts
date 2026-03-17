
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseAPI } from './base-api';
import { TicketModel } from '../../models/TicketModel';
import { environment } from '../../../../environments/environment.development';
import { TicketDetailResponse } from '../../interfaces/ticket-detail.response';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TicketService extends BaseAPI<TicketModel> {

    // Agrega una propiedad para la URL base
    private apiUrl = environment.apiURL;
    private endpointUrl = environment.endPointTicket;

    constructor(httpClient: HttpClient) {
        super(httpClient, environment.endPointTicket);
    }

    getTicketDetail(id: number): Observable<TicketDetailResponse> {
        return this.getCustom<TicketDetailResponse>(id);
    }

    getTicketsByRol(rol: number): Observable<any> {
        return this.getSearch({ rol: rol });
    }

    // Obtener siguiente estado disponible
    getSiguienteEstado(ticketId: number): Observable<any> {
        return this.http.get<any>(
            `${environment.apiURL}/${environment.endPointTicket}/${ticketId}/siguiente-estado`
        );
    }

    // Cambiar estado de un ticket
    cambiarEstado(ticketId: number, data: {
        nuevoEstado: string;
        observaciones?: string;
        imagenes?: string[];
    }): Observable<any> {
        return this.http.put<any>(
            `${environment.apiURL}/${environment.endPointTicket}/${ticketId}/estado`,
            data
        );
    }
}