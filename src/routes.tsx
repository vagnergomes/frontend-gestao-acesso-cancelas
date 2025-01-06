import { BrowserRouter, Route, Routes as ReactRoutes } from 'react-router-dom';
import { Home } from './pages/Home';
import Permissao from './pages/Permissao';
import Users  from './pages/Users';
import  {Dispositivos} from './pages/Dispositivos';
import  CadastroDispositivo from './pages/CadastroDispositivo';
import { Rasc } from './pages/Rasc';
import Login from './pages/Login';
import { Navigate } from 'react-router-dom';
import api from './services/api';
import { useEffect, useState } from 'react';

// Defina a interface para os props
//interface IconeProps {
//    setSidebarVisivel: (sidebarVisivel: boolean) => void;
//    sidebarVisivel: boolean;
//}
function ProtectedRoute({ children, roles }: { children: JSX.Element, roles : string }) {
    const token = localStorage.getItem("authToken");
    const [permissions, setPermissions] = useState(false);
    const [loading, setLoading] = useState(true);
    //const [userRoles, setUserRoles] = useState([]);

    useEffect(() => {
        async function loadRoles() {
            
            try{
            // CONTINUAR AQUI - CRIAR METODO PARA BUSCAR ROLES DO USUARIO LOGADO
            let id_logado = localStorage.getItem("userId");
            //console.log("---id logado: " + id_logado)
            //SE NÃO ESTIVER LOGADO, PARA
            if(!id_logado){
                setLoading(false);
                return;
            }
            
            const user_roles = await api.get(`/user/roles/`+id_logado);
            const user_roles_data = user_roles.data;
            //setUserRoles(user_roles_data);
            
            if (user_roles_data && user_roles_data.length > 0){
                let findRole;
                
                const rolesList = roles.split(',').map(role => role.trim());
                
                if(rolesList.length  > 0){
                    findRole = user_roles_data.find((r: any) => rolesList.includes(r.nome)); 
                }else{
                //ate aqui ele chegou
                    findRole = user_roles_data.find((r: any) => r.nome === roles);  
                }

                if (findRole) {
                    setPermissions(true)
                } else {
                    setPermissions(false);
                }
            }
            else{
                setPermissions( false );
                //return <div className='text-white' >Usuário sem permissão!</div>;
            }

        } catch (error) {
            setPermissions(false);
        } finally {
            setLoading(false); // Carregamento finalizado
        }
 
        }
        loadRoles();
    }, [roles])

    // Se ainda estiver carregando, exibe uma tela de espera ou algo similar
    if (loading) {
        return //<div className='dark:text-white' >Carregando...</div>;
    }

    if (!token){
        return <Navigate to="/login" />
    }
    if (token && !permissions ){
        return <Navigate to="/permissao" />;
    }
   

    //console.log("---permisao2? " + permissions)
    //return children
    return permissions ? children : <Navigate to="/login" />;
}

export const Routes = () => {
  
    return (
        <BrowserRouter>
            <ReactRoutes>
                <Route path="/login" element={ <Login /> } />
                
                <Route path="/" element={
                    <ProtectedRoute roles='ROLE_ADMIN,ROLE_MANAGER,ROLE_USER' >
                        <Home />
                    </ProtectedRoute> }
                />
                <Route path="/rasc" element={
                    <ProtectedRoute roles='ROLE_ADMIN,ROLE_MANAGER,ROLE_USER' >
                        <Rasc />
                    </ProtectedRoute> }
                />
                <Route path='/dispositivo' element={ 
                    <ProtectedRoute roles='ROLE_ADMIN,ROLE_MANAGER,ROLE_USER'>
                        <Dispositivos />
                    </ProtectedRoute>} 
                />
                <Route path='/cadastro-dispositivo' element={ 
                    <ProtectedRoute roles='ROLE_ADMIN,ROLE_MANAGER'>
                        <CadastroDispositivo />
                    </ProtectedRoute>} 
                />
                <Route path='/users' element={ 
                    <ProtectedRoute roles='ROLE_ADMIN'>
                        <Users />
                    </ProtectedRoute>
                }/>
                <Route path='/permissao' element={                
                        <Permissao />
                } />
            </ReactRoutes>
        </BrowserRouter>
    )
}



