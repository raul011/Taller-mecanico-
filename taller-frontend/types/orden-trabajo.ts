export enum OrderStatus {
    PENDING = 'pending',
    IN_PROGRESS = 'in_progress',
    FINISHED = 'finished',
    PAID = 'paid',
    CANCELLED = 'cancelled',
}

export interface OrdenItem {
    id: number;
    type: 'service' | 'part';
    itemId: number;
    itemName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}

export interface OrdenTrabajo {
    id: number;
    status: OrderStatus;
    dateIn: string;
    dateOut: string;
    total: number;
    observaciones: string;
    auto: {
        id: number;
        marca: string;
        modelo: string;
        placa: string;
    };
    mechanic?: {
        id: string;
        fullName: string;
    };
    items: OrdenItem[];
    createdAt: string;
    updatedAt: string;
}

export interface CreateOrdenTrabajoDto {
    autoId: number;
    mechanicId?: string;
    observaciones?: string;
}

export interface AddItemDto {
    type: 'service' | 'part';
    itemId: number;
    quantity: number;
}
