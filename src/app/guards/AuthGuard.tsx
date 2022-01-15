import { useAuth } from '@/app/api/auth';

export default function AuthGuard({ children }) {
  useAuth();

  return <>{children}</>;
}
