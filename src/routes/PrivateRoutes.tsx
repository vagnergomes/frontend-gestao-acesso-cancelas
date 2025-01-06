
import React, { useState } from "react";
import { Navigate, Route } from "react-router-dom";

interface RoutesPropsData {
    role?: string; // Adicione propriedades específicas
    element: React.ReactElement; // Obrigatório no v6
}

const PrivateRoutes: React.FC<RoutesPropsData> = ({ role, element }) => {
    const userLogged  = true;
    const hasPermission = false; // Substitua pela lógica real

    if(!userLogged){
        return  <Navigate to="/" />
    }

    if(!role && userLogged) {
        return <Route { ...element} />
    }

    return hasPermission ? element : <Navigate to="/login" />;
};

export default PrivateRoutes;




