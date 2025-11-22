// Tipos para el dominio de Menú y Filtros

export interface Categoria {
	id: number;
	nombre: string;
}

export interface Sucursal {
	id: number;
	nombre: string;
	direccion?: string;
}

export interface Comida {
	id: number;
	nombre: string;
	descripcion: string;
	categoria_id: number;
	imagen_url: string;
	precio: number;
	activo: boolean;
}

export interface ComidaSucursal {
	comida_id: number;
	sucursal_id: number;
	disponible: boolean;
	precio_sucursal?: number;
	observacion?: string;
}

export interface MenuFilters {
	categoria_id: number | null;
	sucursal_id: number | null;
	search: string;
}

export type ComidaConPrecio = Comida & {
	precio_final: number;
	observacion?: string;
	categoria_nombre?: string;
};

