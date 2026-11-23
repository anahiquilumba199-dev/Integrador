import {
  LayoutDashboard,
  Monitor,
  Building2,
  Package,
  ClipboardCheck,
  Users,
  PackageCheck,
  ArrowDownToLine,
  ArrowUpFromLine,
  ArrowLeftRight,
  Paperclip,
  History,
  Truck,
  FlaskConical,
  FileBarChart,
  ShieldCheck
} from "lucide-react";

export const ROLE_LABELS = {
  ADMINISTRADOR: "Administrador",
  TECNICO: "Técnico",
  OPERADOR: "Operador"
};

export const ROLE_HOME = {
  ADMINISTRADOR: "/dashboard",
  TECNICO: "/dashboard",
  OPERADOR: "/dashboard"
};

const MENU_ADMINISTRADOR = [
  { name: "Panel principal", path: "/dashboard", icon: LayoutDashboard },
  { name: "Dispositivos", path: "/dispositivos", icon: Monitor },
  { name: "Centros de acopio", path: "/centros", icon: Building2 },
  { name: "Recolecciones", path: "/recolecciones", icon: Truck },
  { name: "Inventario", path: "/inventario", icon: Package },
  { name: "Evaluaciones", path: "/evaluaciones", icon: ClipboardCheck },
  { name: "Tratamientos", path: "/tratamientos", icon: FlaskConical },
  { name: "Transferencias", path: "/transferencias", icon: ArrowLeftRight },
  { name: "Reportes", path: "/reportes", icon: FileBarChart },
  { name: "Auditoría", path: "/auditoria", icon: ShieldCheck },
  { name: "Usuarios", path: "/usuarios", icon: Users }
];

const MENU_TECNICO = [
  { name: "Panel principal", path: "/dashboard", icon: LayoutDashboard },
  { name: "Mi bandeja de trabajo", path: "/bandeja-trabajo", icon: ClipboardCheck },
  { name: "Solicitudes recibidas", path: "/solicitudes-recibidas", icon: PackageCheck },
  { name: "Dispositivos", path: "/dispositivos", icon: Monitor },
  { name: "Recolecciones", path: "/recolecciones", icon: Truck },
  { name: "Inventario", path: "/inventario", icon: Package },
  { name: "Evaluaciones", path: "/evaluaciones", icon: ClipboardCheck },
  { name: "Tratamientos", path: "/tratamientos", icon: FlaskConical },
  { name: "Historial", path: "/historial-movimientos", icon: History }
];

const MENU_OPERADOR = [
  { name: "Panel principal", path: "/dashboard", icon: LayoutDashboard },
  { name: "Recepciones", path: "/recepciones", icon: PackageCheck },
  { name: "Dispositivos", path: "/dispositivos", icon: Monitor },
  { name: "Centros de acopio", path: "/centros", icon: Building2 },
  { name: "Inventario", path: "/inventario", icon: Package },
  { name: "Ingresos", path: "/ingresos", icon: ArrowDownToLine },
  { name: "Salidas", path: "/salidas", icon: ArrowUpFromLine },
  { name: "Transferencias", path: "/transferencias", icon: ArrowLeftRight },
  { name: "Evidencias", path: "/evidencias", icon: Paperclip },
  { name: "Historial de movimientos", path: "/historial-movimientos", icon: History }
];

export const MENU_BY_ROLE = {
  ADMINISTRADOR: MENU_ADMINISTRADOR,
  TECNICO: MENU_TECNICO,
  OPERADOR: MENU_OPERADOR
};

export const ROUTE_PERMISSIONS = {
  "/dashboard": ["ADMINISTRADOR", "TECNICO", "OPERADOR"],

  "/dispositivos": ["ADMINISTRADOR", "TECNICO", "OPERADOR"],
  "/centros": ["ADMINISTRADOR", "OPERADOR"],
  "/inventario": ["ADMINISTRADOR", "TECNICO", "OPERADOR"],

  "/recolecciones": ["ADMINISTRADOR", "TECNICO"],

  "/evaluaciones": ["ADMINISTRADOR", "TECNICO"],
  "/bandeja-trabajo": ["TECNICO"],
  "/solicitudes-recibidas": ["TECNICO"],
  "/tratamientos": ["ADMINISTRADOR", "TECNICO"],

  "/recepciones": ["ADMINISTRADOR", "OPERADOR"],
  "/ingresos": ["ADMINISTRADOR", "OPERADOR"],
  "/salidas": ["ADMINISTRADOR", "OPERADOR"],
  "/transferencias": ["ADMINISTRADOR", "OPERADOR"],
  "/evidencias": ["ADMINISTRADOR", "OPERADOR"],
  "/historial-movimientos": ["ADMINISTRADOR", "TECNICO", "OPERADOR"],

  "/reportes": ["ADMINISTRADOR"],
  "/auditoria": ["ADMINISTRADOR"],
  "/usuarios": ["ADMINISTRADOR"]
};