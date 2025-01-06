

// Defina a interface para os props
interface IconeProps {
    setSidebarVisivel: (sidebarVisivel: boolean) => void;
    sidebarVisivel: boolean;
  }

export default function Icone(props: IconeProps) {
    const { setSidebarVisivel, sidebarVisivel } = props;
    return (
        <div className={"flex flex-col fixed top-0 left-0 z-40 p-5"}
        onClick={ () => setSidebarVisivel(!sidebarVisivel)} 
        >
            <div className={`${ sidebarVisivel  && "rotate-45 tranlate-y-2 "} h-1 w-8 mb-1 bg-gray-700
            transition duration-500`} />
            <div className={`${ sidebarVisivel && "rotate-_45 -mt-2"} h-1 w-8 mb-1 bg-gray-700 transition
            duration-500`} />
            <div className={`${ sidebarVisivel ? "hidden" : "flex"} h-1 w-8 mb-1 bg-gray-700 transition
            duration-500`} />
        </div>
    )
}