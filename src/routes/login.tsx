import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { LoginView } from "@/components/login-view";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const { user, isPending } = useCurrentUserState();
  if (isPending) {
    return (
      <div className="grid min-h-dvh place-items-center bg-bg text-sm text-muted">
        Checking operator session…
      </div>
    );
  }
  if (user) return <Navigate to="/" />;
  return <LoginView />;
}
