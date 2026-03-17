import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseAPI } from './base-api';
import { environment } from '../../../../environments/environment.development';
import { TicketDetailResponse } from '../../interfaces/ticket-detail.response';
import { Observable } from 'rxjs';
import { AsignacionAutomaticaResponse } from '../../interfaces/asignacion.response';
import { AsignacionModel } from '../../models/AsignacionModel';
import { AsignacionEjecutadaResponse } from '../../interfaces/asignacion-ejecutada.response';
@Injectable({
    providedIn: 'root'
})
export class AsignacionService extends BaseAPI<AsignacionModel> {

    constructor(httpClient: HttpClient) {
        super(httpClient, environment.endPointAsignacion);
    }

    getPropuestasAsignacion(): Observable<AsignacionAutomaticaResponse> {
        return this.getGeneric<AsignacionAutomaticaResponse>();
    }

     //Para ejecutar asignación automática 
    ejecutarAsignacionAutomatica(): Observable<AsignacionEjecutadaResponse> {
    return this.postMethod<AsignacionEjecutadaResponse>({});
}
    // NUEVO MÉTODO para asignación manual (POST /asignacion/manual)
    crearAsignacionManual(data: any): Observable<any> {
        return this.postMethod<any>(data, 'manual');
        // Esto llama a POST /asignacion/manual
    }
}
