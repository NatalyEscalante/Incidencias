import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseAPI } from './base-api';
import { environment } from '../../../../environments/environment.development';
import { ValoracionModel } from '../../models/ValoracionModel';
import { UsuarioModel } from '../../models/UsuarioModel';

@Injectable({
    providedIn: 'root'
})
export class UsuarioService extends BaseAPI<UsuarioModel> {

    constructor(httpClient: HttpClient) {
        super(
            httpClient,
            environment.endPointUser);
    }
}