import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const API_BASE = `${BACKEND_URL}/api`;

// GET - Listar todas las comidas
export async function GET() {
  try {
    const response = await fetch(`${API_BASE}/comidas`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error al obtener comidas:', errorText);
      return NextResponse.json(
        { ok: false, mensaje: 'Error al obtener comidas' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error inesperado al obtener comidas:', error);
    return NextResponse.json(
      { ok: false, mensaje: 'Error al conectar con el backend' },
      { status: 500 }
    );
  }
}

// POST - Crear una nueva comida
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(`${BACKEND_URL}/comidas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ mensaje: 'Error desconocido' }));
      console.error('Error al crear comida:', errorData);
      return NextResponse.json(
        { ok: false, mensaje: errorData.mensaje || 'Error al crear comida' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error inesperado al crear comida:', error);
    return NextResponse.json(
      { ok: false, mensaje: 'Error al conectar con el backend' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar una comida
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { ok: false, mensaje: 'ID de comida no proporcionado' },
        { status: 400 }
      );
    }

    const body = await request.json();

    const response = await fetch(`${BACKEND_URL}/comidas/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ mensaje: 'Error desconocido' }));
      console.error('Error al actualizar comida:', errorData);
      return NextResponse.json(
        { ok: false, mensaje: errorData.mensaje || 'Error al actualizar comida' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error inesperado al actualizar comida:', error);
    return NextResponse.json(
      { ok: false, mensaje: 'Error al conectar con el backend' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar una comida (mover a papelera)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { ok: false, mensaje: 'ID de comida no proporcionado' },
        { status: 400 }
      );
    }

    const response = await fetch(`${BACKEND_URL}/comidas/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ mensaje: 'Error desconocido' }));
      console.error('Error al eliminar comida:', errorData);
      return NextResponse.json(
        { ok: false, mensaje: errorData.mensaje || 'Error al eliminar comida' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error inesperado al eliminar comida:', error);
    return NextResponse.json(
      { ok: false, mensaje: 'Error al conectar con el backend' },
      { status: 500 }
    );
  }
}
