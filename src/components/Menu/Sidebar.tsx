import { FaUsers, FaChevronDown, FaChevronRight, FaHome, FaCog, FaBug } from "react-icons/fa";
import { TbDeviceSpeaker   } from "react-icons/tb"
import { Link, useLocation } from 'react-router-dom'
import { usePath } from "../../hooks/usePath";
import { useState, useEffect  } from "react";
import api from "../../services/api";

// Defina a interface para os props
interface IconeProps {
    setSidebarVisivel: (sidebarVisivel: boolean) => void;
    sidebarVisivel: boolean;
  }

export default function Sidebar(props: IconeProps) {
    const { sidebarVisivel } = props;
    const [submenuVisivel, setSubmenuVisivel] = useState(false);
    const location = useLocation();
    const [permissions, setPermissions] = useState<string[]>([]);

     // Checa se a rota atual é parte do submenu
    useEffect(() => {
        const submenuRoutes = ['/dispositivos', '/cadastro-dispositivo'];
        if (submenuRoutes.includes(location.pathname)) {
        setSubmenuVisivel(true);
        } else {
        setSubmenuVisivel(false);
        }
    }, [location.pathname]);

    useEffect(() => {
        async function loadRoles() {
            const id_logado = localStorage.getItem("userId");
            if (!id_logado) return;

            const user_roles = await api.get(`/user/roles/` + id_logado);
            const user_roles_data = user_roles.data;

            const roles = user_roles_data.map((r: any) => r.nome);
            setPermissions(roles);  // Atualiza as permissões do usuário
            localStorage.setItem("userRoles", roles);
        }

        loadRoles();
    }, []);
      
    const toggleSubmenu = () => {
        setSubmenuVisivel((prev) => !prev);
    };
      
    const general = ' '
    const current = 'font-extrabold bg-gray-100 dark:text-gray-500'
    const { isCurrentPage} = usePath(); //pega pagina atual usando o hoohks usePath

    <img className={`${sidebarVisivel ? 'flex' : 'hidden'} text-white font-semibold -mt-11 ml-10 w-29 h-7 `} src="/imgs/logo_mini.png" alt="" />

    return (
        <div className="flex relative">
            <ul className={`${sidebarVisivel ? "w-ful w-52 " : "w-0"}  transition-width duration-500 
            flex-col font-bold h-screen fixed pt-0 left-0 bg-light dark:bg-dark border-r-2 dark:border-s dark:border-gray-700 dark:border-opacity-35
            items-start`} >
                <div className="mt-20 text-gray-800 dark:text-white">

                    {(() => {
                    // Divide a string de roles em um array                    
                    const requiredRoles = 'ROLE_ADMIN,ROLE_MANAGER,ROLE_USER'.split(',');
                                
                    // Verifica se o usuário tem pelo menos uma das permissões requeridas
                    const hasPermission = requiredRoles.some((role) => permissions.includes(role.trim()));

                    // Renderiza o item apenas uma vez, se o usuário tiver permissão
                    return hasPermission && (
                        <li >
                            <Link to="/" className={`${sidebarVisivel ? 'flex' : 'hidden'} ${isCurrentPage('/') ? current : general} rounded hover:text-gray-500 hover:bg-gray-100 
                            w-48 m-2 p-3 justify-start`}>
                                <FaHome className="inline-block w-6 h-6 mr-2 "/>
                                Home
                            </Link>    
                        </li>   
                    );
                    })()}

                    {(() => {
                    // Divide a string de roles em um array                    
                    const requiredRoles = 'ROLE_ADMIN'.split(',');
                                
                    // Verifica se o usuário tem pelo menos uma das permissões requeridas
                    const hasPermission = requiredRoles.some((role) => permissions.includes(role.trim()));

                    // Renderiza o item apenas uma vez, se o usuário tiver permissão
                    return hasPermission && (
                        <li >
                            <Link to="/rasc" className={`${sidebarVisivel ? 'flex' : 'hidden'} ${isCurrentPage('/rasc') ? current : general} rounded hover:text-gray-500 hover:bg-gray-100 
                            w-48 m-2 p-3 justify-start`}>
                                <FaBug className="inline-block w-6 h-6 mr-2 "/>
                                Rasc
                            </Link>    
                        </li>   
                    );
                    })()}

                    {(() => {
                    // Divide a string de roles em um array                    
                    const requiredRoles = 'ROLE_ADMIN,ROLE_MANAGER,ROLE_USER'.split(',');
                                
                    // Verifica se o usuário tem pelo menos uma das permissões requeridas
                    const hasPermission = requiredRoles.some((role) => permissions.includes(role.trim()));

                    // Renderiza o item apenas uma vez, se o usuário tiver permissão
                    return hasPermission && (   

                        <li>
                            <button
                                onClick={toggleSubmenu}
                                className={`${
                                sidebarVisivel ? 'flex' : 'hidden'
                                } ${isCurrentPage('/dispositivos') || isCurrentPage('/cadastro-dispositivo') ? current : general} rounded hover:text-gray-500 hover:bg-gray-100 
                                w-48 m-2 p-3 justify-between items-center`}
                            >
                                <div className="flex items-center">
                                <TbDeviceSpeaker  className="inline-block w-6 h-6 mr-2" />
                                Dispositivos
                                </div>
                                {submenuVisivel ? (
                                <FaChevronDown className="w-4 h-4" />
                                ) : (
                                <FaChevronRight className="w-4 h-4" />
                                )}
                            </button>

                            {/* Submenu */}
                            <ul
                                className={`${
                                submenuVisivel ? 'block' : 'hidden'
                                } pl-8 text-sm text-gray-700 dark:text-gray-300`}
                            >
                                {(() => {
                                // Divide a string de roles em um array                    
                                const requiredRoles = 'ROLE_ADMIN,ROLE_MANAGER,ROLE_USER'.split(',');
                                
                                // Verifica se o usuário tem pelo menos uma das permissões requeridas
                                const hasPermission = requiredRoles.some((role) => permissions.includes(role.trim()));

                                // Renderiza o item apenas uma vez, se o usuário tiver permissão
                                return hasPermission && (
                                        <li>
                                            <Link to="/dispositivos"  className={`${sidebarVisivel ? 'flex' : 'hidden'} ${isCurrentPage('/dispositivos') ? current : general} rounded hover:text-gray-500 hover:bg-gray-100 
                                            w-40 m-2 p-3 justify-start`}>
                                                Dispositivos
                                            </Link>
                                        </li>
                                        
                                );
                                })()}

                                {(() => {
                                // Divide a string de roles em um array                    
                                const requiredRoles = 'ROLE_ADMIN,ROLE_MANAGER'.split(',');
                                
                                // Verifica se o usuário tem pelo menos uma das permissões requeridas
                                const hasPermission = requiredRoles.some((role) => permissions.includes(role.trim()));

                                // Renderiza o item apenas uma vez, se o usuário tiver permissão
                                return hasPermission && (
                                    <li>
                                        <Link 
                                            to="/cadastro-dispositivo" 
                                            className={`${sidebarVisivel ? 'flex' : 'hidden'} ${isCurrentPage('/cadastro-dispositivo') ? current : general} rounded hover:text-gray-500 hover:bg-gray-100 w-40 m-2 p-3 justify-start`}
                                        >
                                            Cadastro
                                        </Link>
                                    </li>
                                );
                                })()}

                                
                            </ul>
                        </li>
                    );
                    })()} 

                    {(() => {
                    // Divide a string de roles em um array                    
                    const requiredRoles = 'ROLE_ADMIN'.split(',');
                                
                    // Verifica se o usuário tem pelo menos uma das permissões requeridas
                    const hasPermission = requiredRoles.some((role) => permissions.includes(role.trim()));

                    // Renderiza o item apenas uma, se o usuário tiver permissão
                    return hasPermission && (
                        <li >
                            <Link to="/users" className={`${sidebarVisivel ? 'flex' : 'hidden'} ${isCurrentPage('/users') ? current : general} rounded hover:text-gray-500 hover:bg-gray-100 
                            w-48 m-2 p-3 justify-start`}>
                                <FaUsers className="inline-block w-6 h-6 mr-2 " />
                                Usuários
                            </Link>
                        </li>
                    );
                    })()}

                    {(() => {
                    // Divide a string de roles em um array                    
                    const requiredRoles = 'ROLE_ADMIN'.split(',');
                                
                    // Verifica se o usuário tem pelo menos uma das permissões requeridas
                    const hasPermission = requiredRoles.some((role) => permissions.includes(role.trim()));

                    // Renderiza o item apenas uma vez, se o usuário tiver permissão
                    return hasPermission && (
                        <li className={`${sidebarVisivel ? 'flex' : 'hidden'} ${isCurrentPage('/settings') ? current : general} rounded hover:text-gray-500 hover:bg-gray-100 
                        w-48 m-2 p-3 justify-start`}>
                            <FaCog className="inline-block w-6 h-6 mr-2 " />
                            <a className='w-60' href="#">Settings</a>
                        </li>
                    );
                    })()}


                    {(() => {
                    // Divide a string de roles em um array                    
                    const requiredRoles = 'ROLE_ADMIN'.split(',');
                                
                    // Verifica se o usuário tem pelo menos uma das permissões requeridas
                    const hasPermission = requiredRoles.some((role) => permissions.includes(role.trim()));

                    // Renderiza o item apenas uma, se o usuário tiver permissão
                    return hasPermission && (
                        <li >
                            <Link to="/contatos" className={`${sidebarVisivel ? 'flex' : 'hidden'} ${isCurrentPage('/contatos') ? current : general} rounded hover:text-gray-500 hover:bg-gray-100 
                            w-48 m-2 p-3 justify-start`}>
                                <FaUsers className="inline-block w-6 h-6 mr-2 " />
                                Contatos
                            </Link>
                        </li>
                    );
                    })()}

                </div>

            </ul>
        </div>
    );
}


 