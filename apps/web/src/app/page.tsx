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
              <Button variant="outline" icon={<Home className="" />}>
                Dashboard
              </Button>
            </Link>
          </li>

          {isLoggedIn ? (
            <li>
              <Link href={paths.auth.logout.getHref()}>
                <Button icon={<LogOut />}>Logout</Button>
              </Link>
            </li>
          ) : (
            <li>
              <Link href={paths.auth.register.getHref()}>
                <Button variant="ghost" icon={<LogIn />}>
                  Sign Up
                </Button>
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
}
