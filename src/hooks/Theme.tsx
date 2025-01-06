import { useContext, createContext, useState, useEffect } from "react";
import { ReactNode } from "react";

interface ThemeContextProps {
    theme: any ;
    setTheme: React.Dispatch<React.SetStateAction<any>>;
  }

const ThemeContext = createContext<ThemeContextProps | any>(undefined);

interface Props {
    children: ReactNode;
  }

export default function ThemeContextProvider({children}: Props){
    const [theme, setTheme] = useState(localStorage.getItem("theme") !== "dark" ? "light" : "dark");

    useEffect(() => {
        const root = window.document.documentElement;
        const removeOldTheme = theme === "dark" ? "light" : "dark"

        root.classList.remove(removeOldTheme);
        root.classList.add(theme);
        localStorage.setItem("theme", theme)
    }, [theme])

    return (
        <ThemeContext.Provider value={{theme, setTheme}}>
            {children}
        </ThemeContext.Provider>
    )
}

export function Theme(){
    return useContext(ThemeContext)
}