import Link from "next/link";
import { logout } from "@/app/admin/login/actions";

type AdminHeaderProps = {
  active: "dashboard" | "gifts" | "reservations";
};

const links = [
  { id: "dashboard", href: "/admin", label: "Dashboard" },
  { id: "gifts", href: "/admin/gifts", label: "Regalos" },
  { id: "reservations", href: "/admin/reservations", label: "Reservas" },
] as const;

export default function AdminHeader({ active }: AdminHeaderProps) {
  return (
    <header className="admin-header">
      <Link className="admin-brand" href="/admin">Giovanni</Link>
      <nav className="admin-navigation" aria-label="Navegación administrativa">
        {links.map((link) => (
          <Link
            className={active === link.id ? "admin-nav-link admin-nav-link-active" : "admin-nav-link"}
            href={link.href}
            key={link.id}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <form action={logout}>
        <button className="admin-secondary-button" type="submit">Cerrar sesión</button>
      </form>
    </header>
  );
}