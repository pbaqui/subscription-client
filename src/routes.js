import Dashboard from "@material-ui/icons/Dashboard";
import Person from "@material-ui/icons/Person";
import LibraryBooks from "@material-ui/icons/LibraryBooks";
import BubbleChart from "@material-ui/icons/BubbleChart";
import DashboardPage from "views/Dashboard/Dashboard.js";
import UsuarioList from "views/Usuario/UsuarioList";
import SocioList from "views/Socio/SocioList";
import CoachList from "views/Coach/CoachList";
import PlanList from "views/Plan/PlanList";
import PeriodoSocioList from "views/PeriodoSocio/PeriodoSocioList";
import ConfigurarClaseList from "views/ConfigurarClase/ConfigurarClaseList";
// import Icons from "views/Icons/Icons.js";

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Inicio",
    icon: Dashboard,
    component: DashboardPage,
    layout: "/admin",
    roles: ["socio","admin", "coach"]
  },
  {
    path: "/user",
    name: "Usuario",
    icon: Person,
    component: UsuarioList,
    layout: "/admin",
    roles: ["admin"]
  },
  {
    path: "/socio",
    name: "Socio",
    icon: Person,
    component: SocioList,
    layout: "/admin",
    roles: ["admin"]
  },
  {
    path: "/coach",
    name: "Coach",
    icon: Person,
    component: CoachList,
    layout: "/admin",
    roles: ["admin"]
  },
  {
    path: "/plan",
    name: "Plan",
    icon: LibraryBooks,
    component: PlanList,
    layout: "/admin",
    roles: ["admin"]
  },
  {
    path: "/periodoSocio",
    name: "Periodo Socio",
    icon: LibraryBooks,
    component: PeriodoSocioList,
    layout: "/admin",
    roles: ["admin"]
  },
  {
    path: "/configurarClase",
    name: "Configurar Clase",
    icon: BubbleChart,
    component: ConfigurarClaseList,
    layout: "/admin",
    roles: ["admin"]
  }
];

export default dashboardRoutes;
