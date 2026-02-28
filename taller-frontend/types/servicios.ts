export interface Servicio {
    id: number;
    descripcion: string;
    costo: number;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateServicioDto {
    descripcion: string;
    costo: number;
}
