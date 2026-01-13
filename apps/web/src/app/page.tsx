import { Home, LogIn, LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Link } from "@/components/ui/link";
import { paths } from "@/config/paths";
import { checkLoggedIn } from "@/utils/auth";

export default async function HomePage() {
  const isLoggedIn = await checkLoggedIn();
  return (
    <div className="h-screen bg-white">
      <nav className="flex items-center justify-between bg-background border-b px-6 py-3">
        <h1 className="text-xl font-semibold text-foreground">Ograph-do</h1>
        <ul className="flex items-center gap-4">
          <li>
            <Link href={paths.app.dashboard.getHref()}>
              <Button variant="outline">
                Dashboard
                <Home className="" />
              </Button>
            </Link>
          </li>

          {isLoggedIn ? (
            <li>
              <Link href={paths.auth.logout.getHref()}>
                <Button>
                  Logout
                  <LogOut />
                </Button>
              </Link>
            </li>
          ) : (
            <li>
              <Link href={paths.auth.register.getHref()}>
                <Button variant="ghost">
                  Sign Up
                  <LogIn />
                </Button>
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
}
