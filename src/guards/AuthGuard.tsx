import { useAuth } from '@/api/auth';

export default function AuthGuard({ children }) {
  useAuth();

  return <>{children}</>;
}
