import { useState } from "react";
import Sidebar from './Sidebar';
import Navbar from "./Navbar";
import SmallHeader from "./SmallHeader";

export default function Header() {
    const [sidebarVisivel, setSidebarVisivel] = useState(true);

    function checkWidth() {
        if (window.innerWidth < 1550) {
          setSidebarVisivel(false);
        } else {
          setSidebarVisivel(true);
        }
      }
       // Verificar a largura da janela ao carregar a página
    window.addEventListener('load', checkWidth);

    // Verificar a largura da janela sempre que a janela for redimensionada
    window.addEventListener('resize', checkWidth);
    //const [sidebarToggle, setSideBarToggle] = useState(false);
    //<Icone sidebarVisivel={ sidebarVisivel } setSidebarVisivel={ setSidebarVisivel } />
    return(
        <nav className="absolute z-20 w-full ">
            <div className={`${sidebarVisivel ? "" : ""}`}>
                <Navbar sidebarVisivel={ sidebarVisivel } setSidebarVisivel={ setSidebarVisivel }/>
            </div> 
            <Sidebar sidebarVisivel={ sidebarVisivel } setSidebarVisivel={ setSidebarVisivel } />
            <SmallHeader sidebarVisivel={ sidebarVisivel } setSidebarVisivel={ setSidebarVisivel } />
              
        </nav>
    )
}