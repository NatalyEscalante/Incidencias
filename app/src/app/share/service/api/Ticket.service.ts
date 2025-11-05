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

    constructor(httpClient: HttpClient) {
        super(httpClient, environment.endPointTicket);
    }

    getTicketDetail(id: number): Observable<TicketDetailResponse> {
        return this.getCustom<TicketDetailResponse>(id);
    }
    // Método específico para buscar tickets por rol usando el endpoint /search
    getTicketsByRol(rol: number): Observable<any> {
        return this.getSearch({ rol: rol });
    }
}