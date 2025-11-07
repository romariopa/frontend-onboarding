import { http, HttpResponse } from 'msw';
import { API_CONFIG, API_ENDPOINTS, DEFAULTS } from '@/utils/constants';

const API_URL = API_CONFIG.BASE_URL;

// Generar un JWT mock simple (solo para desarrollo)
function generateMockToken(expirationMinutes: number): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(
    JSON.stringify({
      sub: 'guardian',
      exp: Math.floor(Date.now() / 1000) + expirationMinutes * 60,
      iat: Math.floor(Date.now() / 1000),
    })
  );
  return `${header}.${payload}.mock-signature`;
}

export const handlers = [
  // POST /auth/login
  http.post(`${API_URL}${API_ENDPOINTS.AUTH.LOGIN}`, async ({ request }) => {
    const body = await request.json() as { username: string; password: string };

    if (body.username === DEFAULTS.CREDENTIALS.USERNAME && body.password === DEFAULTS.CREDENTIALS.PASSWORD) {
      return HttpResponse.json({
        access_token: generateMockToken(DEFAULTS.TOKEN_EXPIRATION.ACCESS_TOKEN_MINUTES),
        refresh_token: generateMockToken(DEFAULTS.TOKEN_EXPIRATION.REFRESH_TOKEN_MINUTES), // Mismo tiempo que access token (5 minutos)
      });
    }

    return HttpResponse.json(
      { message: 'Credenciales inválidas' },
      { status: 401 }
    );
  }),

  // POST /auth/refresh
  http.post(`${API_URL}${API_ENDPOINTS.AUTH.REFRESH}`, async ({ request }) => {
    const body = await request.json() as { refresh_token: string };

    if (body.refresh_token) {
      return HttpResponse.json({
        access_token: generateMockToken(DEFAULTS.TOKEN_EXPIRATION.ACCESS_TOKEN_MINUTES),
        refresh_token: generateMockToken(DEFAULTS.TOKEN_EXPIRATION.REFRESH_TOKEN_MINUTES), // Mismo tiempo que refresh token (5 minutos)
      });
    }

    return HttpResponse.json(
      { message: 'Refresh token inválido' },
      { status: 401 }
    );
  }),

  // GET /products
  http.get(`${API_URL}${API_ENDPOINTS.PRODUCTS.BASE}`, () => {
    return HttpResponse.json([
      { id: 1, name: 'Cuenta de Ahorros', type: 'savings' },
      { id: 2, name: 'Cuenta Corriente', type: 'checking' },
      { id: 3, name: 'Tarjeta de Crédito', type: 'credit' },
      { id: 4, name: 'Cuenta de Inversión', type: 'investment' },
    ]);
  }),

  // GET /products/:id
  http.get(`${API_URL}${API_ENDPOINTS.PRODUCTS.BASE}/:id`, ({ params }) => {
    const { id } = params;
    const products = [
      { id: 1, name: 'Cuenta de Ahorros', type: 'savings' },
      { id: 2, name: 'Cuenta Corriente', type: 'checking' },
      { id: 3, name: 'Tarjeta de Crédito', type: 'credit' },
      { id: 4, name: 'Cuenta de Inversión', type: 'investment' },
    ];

    const product = products.find((p) => p.id === Number(id));

    if (!product) {
      return HttpResponse.json({ message: 'Producto no encontrado' }, { status: 404 });
    }

    return HttpResponse.json(product);
  }),

  // POST /onboarding
  http.post(`${API_URL}${API_ENDPOINTS.ONBOARDING}`, async ({ request }) => {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json(
        { message: 'No autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json() as {
      nombre: string;
      documento: string;
      email: string;
      montoInicial: number;
    };

    // Validación básica
    if (!body.nombre || body.nombre.length < 3) {
      return HttpResponse.json(
        { message: 'El nombre debe tener al menos 3 caracteres' },
        { status: 400 }
      );
    }

    if (!body.email || !body.email.includes('@')) {
      return HttpResponse.json(
        { message: 'Email inválido' },
        { status: 400 }
      );
    }

    if (!body.montoInicial || body.montoInicial <= 0) {
      return HttpResponse.json(
        { message: 'El monto inicial debe ser positivo' },
        { status: 400 }
      );
    }

    // Generar UUID mock
    const onboardingId = `mock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    return HttpResponse.json({
      onboardingId,
      status: 'REQUESTED',
    });
  }),

  // GET /health
  http.get(`${API_URL}${API_ENDPOINTS.HEALTH}`, () => {
    return HttpResponse.json({ ok: true });
  }),
];

