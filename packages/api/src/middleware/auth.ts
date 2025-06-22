import { AuthService } from '../services/auth';
import { AuthContext } from '@diet/shared';

export interface AuthenticatedRequest extends Request {
  auth?: AuthContext;
}

export async function authMiddleware(
  request: Request,
  authService: AuthService
): Promise<AuthenticatedRequest> {
  const authHeader = request.headers.get('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Response('Unauthorized', { status: 401 });
  }

  const sessionToken = authHeader.substring(7);
  const authContext = await authService.validateSession(sessionToken);

  if (!authContext) {
    throw new Response('Unauthorized', { status: 401 });
  }

  return Object.assign(request, { auth: authContext });
} 