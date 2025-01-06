import { FaBars, FaBell, FaUser } from 'react-icons/fa6'
import { MdDarkMode } from 'react-icons/md';
import { Theme } from '../../hooks/Theme';
import { BsFillLightbulbFill } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';


// Defina a interface para os props
    interface IconeProps {
        setSidebarVisivel: (sidebarVisivel: boolean) => void;
        sidebarVisivel: boolean;
    }
//${sidebarVisivel ? 'flex  -left-20' : 'flex -left-20'

    const Navbar = (props: IconeProps) => {
        const {setSidebarVisivel, sidebarVisivel} = props;
        const { theme, setTheme} = Theme();

        const navigate = useNavigate();
        function handleLogout() {
            localStorage.removeItem("authToken");
            localStorage.removeItem("userId");
            navigate('/login');
        }

        return (
        <div>
            
            <nav className='bg-light dark:bg-dark border-b-2 dark:border-b-2 dark:border-gray-700 dark:border-opacity-35 px-4 py-3 flex fixed w-full z-50 justify-between '>
                <img className={`${sidebarVisivel ? 'flex mt-1 m-1 w-29 h-7' : 'flex m-1 w-29 h-7'} text-white font-semibold `} src={sidebarVisivel ? './src/imgs/logo.png' : './src/imgs/logo_mini.png'}  alt="" />
                <div className='flex-grow ml-8 mt-2 text-xl'>
                    <FaBars className={`text-gray-800 dark:text-white me-4 cursor-pointer `}  onClick={ () => setSidebarVisivel(!sidebarVisivel) }/>
                    <span className='text-gray-800 dark:text-white font-semibold'></span>
                </div>
                <div className='flex items-center gap-x-5'>
                    {theme == "light" ? 
                        <MdDarkMode size={30} className='cursor-pointer w-8 h-8 text-gray-800 items-center' onClick={() => setTheme("dark")}></MdDarkMode>
                    :    
                        <BsFillLightbulbFill size={30} className='cursor-pointer text-white w-6 h-6 items-center' onClick={() => setTheme("light")}></BsFillLightbulbFill>
                    }
                
                    <div className='realtive md:w-65 hidden'>
                        <span className='relative md:absolute inset-y-0 left-0 flex items-center pl-2'>
                            <button className='p-1 focus:outline-none text-gray-800 dark:text-white'></button></span>
                        <input type="text" className='w-full px-4 py-1 pl-12 rounded shadow outline-none hidden md:block bg-gray-100 dark:bg-white' />
                    </div>

                    <div className='text-gray-800 dark:text-white'><FaBell className='w-6 h-6' /> </div>

                    <div className='relative'>
                        <button className='text-gray-800 dark:text-white group'>
                            <FaUser className='w-6 h-6 mt-1' />
                            <div className='z-10 hidden absolute bg-white rounded-lg shadow w-32 group-focus:block top-full right-0'>
                                
                                <p className='bg-gray-100 '>Vagner Gomes</p>
                                <ul className='py-2 text-sm text-gray-950'>
                                    <li><a className='hover:bg-gray-100'  href="">Profile</a></li>
                                    <li><a className='hover:bg-gray-100' href="">Setting</a></li>
                                    <li><a className='hover:bg-gray-100' onClick={handleLogout}>Log Out</a></li>
                                </ul>
                            </div>
                        </button>
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Navbar;