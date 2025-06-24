import { AuthService } from '../services/auth';
import { AuthContext } from '@diet/shared';

export interface AuthenticatedRequest extends Request {
  auth?: AuthContext;
}

export interface GuestRequest extends Request {
  auth?: AuthContext;
  isGuest?: boolean;
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

// 可选认证中间件 - 允许游客访问但会标记用户状态
export async function optionalAuthMiddleware(
  request: Request,
  authService: AuthService
): Promise<GuestRequest> {
  const authHeader = request.headers.get('Authorization');
  
  // 如果没有认证头，标记为游客用户
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return Object.assign(request, { isGuest: true });
  }

  const sessionToken = authHeader.substring(7);
  try {
    const authContext = await authService.validateSession(sessionToken);
    
    if (authContext) {
      // 认证成功，返回认证用户
      return Object.assign(request, { auth: authContext, isGuest: false });
    } else {
      // 认证失败，标记为游客用户
      return Object.assign(request, { isGuest: true });
    }
  } catch {
    // 认证过程出错，标记为游客用户
    return Object.assign(request, { isGuest: true });
  }
} 