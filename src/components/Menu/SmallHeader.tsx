import { Link } from "react-router-dom";

// Defina a interface para os props
interface IconeProps {
    setSidebarVisivel: (sidebarVisivel: boolean) => void;
    sidebarVisivel: boolean;
  }

const SmallHeader = (props: IconeProps) => {
    const {sidebarVisivel} = props;

    return (
        <div className={`${sidebarVisivel ? 'left-52 w-full' : 'w-full'} fixed  h-5 m-0 mt-16  bg-white dark:bg-dark  shadow items-center justify-center dark:border-b-2 dark:border-gray-700 dark:border-opacity-35 `}>
            
            <div className={`ml-6 flex-grow  mt-0 text-xs`}>  
                <span className='text-gray-800 dark:text-white font-semibold'> <Link to={location.pathname}> {location.pathname} {sidebarVisivel}</Link>  </span>
            </div>
            
        </div>
    )

}

export default SmallHeader