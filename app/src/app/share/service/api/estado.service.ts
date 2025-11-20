import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseAPI } from './base-api';
import { environment } from '../../../../environments/environment.development';
import { EstadoDisponibilidadModel } from '../../models/EstadoDisponibilidadModel';

@Injectable({
    providedIn: 'root'
})
export class EstadoService extends BaseAPI<EstadoDisponibilidadModel> {
    constructor(httpClient: HttpClient) {
        super(httpClient, environment.endPointEstado);
    }
}