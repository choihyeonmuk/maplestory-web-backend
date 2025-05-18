import { AuthenticatedUserPayload } from '../auth/strategies/gateway-jwt.strategy';

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUserPayload;
    }
  }
}
