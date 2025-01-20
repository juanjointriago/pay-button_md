import { Fragment, useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import SidebarLinkGroup from "./SidebarLinkGroup";
import Logo from "../../images/logo/logo-m-duran.jpg";
import {
  FaCashRegister,
  FaArrowCircleDown,
  FaArrowAltCircleRight,
  FaChartBar,
  FaWrench,
  FaUserFriends,
  FaCalculator,
} from "react-icons/fa";
import { useAuthStore } from "../../stores/auth/auth.store";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  const storedSidebarExpanded = localStorage.getItem("sidebar-expanded");
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === "true"
  );

  const auth = useAuthStore((state) => state.user);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector("body")?.classList.add("sidebar-expanded");
    } else {
      document.querySelector("body")?.classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded]);

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
        <NavLink to="/">
          <img src={Logo} alt="Logo" />
        </NavLink>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden"
        >
          <svg
            className="fill-current"
            width="20"
            height="18"
            viewBox="0 0 20 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
              fill=""
            />
          </svg>
        </button>
      </div>
      {/* <!-- SIDEBAR HEADER --> */}

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        {/* <!-- Sidebar Menu --> */}
        <nav className="mt-5 px-4 py-4 lg:mt-9 lg:px-6">
          {/* <!-- Menu Group --> */}
          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
              {auth?.profileId === 2 ? "Opciones" : "MENU"}
            </h3>

            <ul className="mb-6 flex flex-col gap-1.5">
              {/* <!-- Menu Item Dashboard --> */}
              {auth?.profileId !== 2 && (
                <SidebarLinkGroup
                  activeCondition={
                    pathname === "/" || pathname.includes("home")
                  }
                >
                  {(handleClick, open) => {
                    return (
                      <Fragment>
                        <NavLink
                          to="#"
                          className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                            (pathname === "/" || pathname.includes("home")) &&
                            "bg-graydark dark:bg-meta-4"
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            sidebarExpanded
                              ? handleClick()
                              : setSidebarExpanded(true);
                          }}
                        >
                          <FaChartBar />
                          Estadísticas
                          {open ? (
                            <FaArrowAltCircleRight className="absolute right-4" />
                          ) : (
                            <FaArrowCircleDown className="absolute right-4" />
                          )}
                        </NavLink>
                        {/* <!-- Dropdown Menu Start --> */}
                        <div
                          className={`translate transform overflow-hidden ${
                            !open && "hidden"
                          }`}
                        >
                          <ul className="mb-5.5 mt-4 flex flex-col gap-2.5 pl-6">
                            <li>
                              <NavLink
                                to="/"
                                className={({ isActive }) =>
                                  "group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white " +
                                  (isActive && "!text-white")
                                }
                              >
                                Tablero
                              </NavLink>
                            </li>
                          </ul>
                        </div>
                        {/* <!-- Dropdown Menu End --> */}
                      </Fragment>
                    );
                  }}
                </SidebarLinkGroup>
              )}
              {/* <!-- Menu Item Dashboard --> */}
              {/* <!-- Menu Item Tables --> */}
              <SidebarLinkGroup
                activeCondition={
                  pathname === "#" || pathname.includes("tables")
                }
              >
                {(handleClick, open) => {
                  return (
                    <Fragment>
                      <NavLink
                        to="#"
                        className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                          (pathname === "/" || pathname.includes("tables")) &&
                          "bg-graydark dark:bg-meta-4"
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          sidebarExpanded
                            ? handleClick()
                            : setSidebarExpanded(true);
                        }}
                      >
                        <FaCashRegister />
                        {auth?.profileId === 2
                          ? "Consulta de impuestos"
                          : "Impuestos"}
                        {open ? (
                          <FaArrowAltCircleRight className="absolute right-4" />
                        ) : (
                          <FaArrowCircleDown className="absolute right-4" />
                        )}
                      </NavLink>
                      {/* <!-- Dropdown Menu Start --> */}
                      <div
                        className={`translate transform overflow-hidden ${
                          !open && "hidden"
                        }`}
                      >
                        <ul className="mb-5.5 mt-4 flex flex-col gap-2.5 pl-6">
                          <li>
                            <NavLink
                              to="/home/debt"
                              className={({ isActive }) =>
                                "group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white " +
                                (isActive && "!text-white")
                              }
                            >
                              {auth?.profileId === 2
                                ? "Por pagar"
                                : "Por cobrar"}
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to="/home/transactions"
                              className={({ isActive }) =>
                                "group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white " +
                                (isActive && "!text-white")
                              }
                            >
                              Pagos Realizados
                            </NavLink>
                          </li>
                          {auth?.profileId !== 2 && (
                            <li>
                              <NavLink
                                to="/home/t-dtafast"
                                className={({ isActive }) =>
                                  "group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white " +
                                  (isActive && "!text-white")
                                }
                              >
                                Transac. DATAFAST
                              </NavLink>
                            </li>
                          )}
                        </ul>
                      </div>
                      {/* <!-- Dropdown Menu End --> */}
                    </Fragment>
                  );
                }}
              </SidebarLinkGroup>
              {/* <!-- Menu Item Tables --> */}
            </ul>

            <ul className="mb-6 flex flex-col gap-1.5">
              {/* <!-- Menu Item Ui Elements --> */}
              {auth?.profileId !== 2 && (
                <SidebarLinkGroup
                  activeCondition={
                    pathname === "/ui" || pathname.includes("ui")
                  }
                >
                  {(handleClick, open) => {
                    return (
                      <Fragment>
                        <NavLink
                          to="#"
                          className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                            (pathname === "/ui" || pathname.includes("ui")) &&
                            "bg-graydark dark:bg-meta-4"
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            sidebarExpanded
                              ? handleClick()
                              : setSidebarExpanded(true);
                          }}
                        >
                          <FaWrench />
                          Configuraciones
                          {open ? (
                            <FaArrowAltCircleRight className="absolute right-4" />
                          ) : (
                            <FaArrowCircleDown className="absolute right-4" />
                          )}
                        </NavLink>
                        {/* <!-- Dropdown Menu Start --> */}
                        <div
                          className={`translate transform overflow-hidden ${
                            !open && "hidden"
                          }`}
                        >
                          <ul className="mb-5.5 mt-4 flex flex-col gap-2.5 pl-6">
                            <li>
                              <NavLink
                                to="/home/params"
                                className={({ isActive }) =>
                                  "group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white " +
                                  (isActive && "!text-white")
                                }
                              >
                                Parámetros
                              </NavLink>
                            </li>
                          </ul>
                        </div>
                        {/* <!-- Dropdown Menu End --> */}
                      </Fragment>
                    );
                  }}
                </SidebarLinkGroup>
              )}
              {/* <!-- Menu Item Ui Elements --> */}

              {/* Menu Item de DataFast */}
              {auth?.profileId !== 2 && (
                <SidebarLinkGroup
                  activeCondition={
                    pathname === "/ui" || pathname.includes("ui")
                  }
                >
                  {(handleClick, open) => {
                    return (
                      <Fragment>
                        <NavLink
                          to="#"
                          className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                            (pathname === "/ui" || pathname.includes("ui")) &&
                            "bg-graydark dark:bg-meta-4"
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            sidebarExpanded
                              ? handleClick()
                              : setSidebarExpanded(true);
                          }}
                        >
                          <FaCalculator />
                          DataFast
                          {open ? (
                            <FaArrowAltCircleRight className="absolute right-4" />
                          ) : (
                            <FaArrowCircleDown className="absolute right-4" />
                          )}
                        </NavLink>
                        {/* <!-- Dropdown Menu Start --> */}
                        <div
                          className={`translate transform overflow-hidden ${
                            !open && "hidden"
                          }`}
                        >
                          <ul className="mb-5.5 mt-4 flex flex-col gap-2.5 pl-6">
                            <li>
                              <NavLink
                                to="/home/setup-dtf"
                                className={({ isActive }) =>
                                  "group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white " +
                                  (isActive && "!text-white")
                                }
                              >
                                Configurar Dispositivo
                              </NavLink>
                            </li>
                          </ul>
                        </div>
                        {/* <!-- Dropdown Menu End --> */}
                      </Fragment>
                    );
                  }}
                </SidebarLinkGroup>
              )}
              {/* <!-- Menu Item Auth Pages --> */}
              <SidebarLinkGroup
                activeCondition={
                  pathname === "/auth" || pathname.includes("auth")
                }
              >
                {(handleClick, open) => {
                  return (
                    <Fragment>
                      <NavLink
                        to="#"
                        className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                          (pathname === "/auth" || pathname.includes("auth")) &&
                          "bg-graydark dark:bg-meta-4"
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          sidebarExpanded
                            ? handleClick()
                            : setSidebarExpanded(true);
                        }}
                      >
                        <FaUserFriends />
                        {auth?.profileId === 2
                          ? "Mis Datos"
                          : "Gestion de Usuarios"}
                        {open ? (
                          <FaArrowAltCircleRight className="absolute right-4" />
                        ) : (
                          <FaArrowCircleDown className="absolute right-4" />
                        )}
                      </NavLink>
                      {/* <!-- Dropdown Menu Start --> */}
                      <div
                        className={`translate transform overflow-hidden ${
                          !open && "hidden"
                        }`}
                      >
                        <ul className="mb-5.5 mt-4 flex flex-col gap-2.5 pl-6">
                          {auth?.profileId !== 2 && (
                            <li>
                              <NavLink
                                to="/home/users"
                                className={({ isActive }) =>
                                  "group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white " +
                                  (isActive && "!text-white")
                                }
                              >
                                Usuarios
                              </NavLink>
                            </li>
                          )}
                          {auth?.profileId !== 2 && (
                            <li>
                              <NavLink
                                to="/home/profiles"
                                className={({ isActive }) =>
                                  "group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white " +
                                  (isActive && "!text-white")
                                }
                              >
                                Perfiles
                              </NavLink>
                            </li>
                          )}
                          {auth?.profileId !== 2 && <li>
                            <NavLink
                              to="/home/roles"
                              className={({ isActive }) =>
                                "group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white " +
                                (isActive && "!text-white")
                              }
                            >
                              Roles
                            </NavLink>
                          </li>}
                          {auth?.profileId === 2 &&<li>
                            <NavLink
                              to="/home/my-profile"
                              className={({ isActive }) =>
                                "group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white " +
                                (isActive && "!text-white")
                              }
                            >
                              Actualizar Mis datos
                            </NavLink>
                          </li>}
                        </ul>
                      </div>
                      {/* <!-- Dropdown Menu End --> */}
                    </Fragment>
                  );
                }}
              </SidebarLinkGroup>
              {/* <!-- Menu Item Auth Pages --> */}
            </ul>
          </div>
        </nav>
        {/* <!-- Sidebar Menu --> */}
      </div>
    </aside>
  );
};

export default Sidebar;
