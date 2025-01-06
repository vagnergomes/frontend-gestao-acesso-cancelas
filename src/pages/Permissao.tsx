import Header from "../components/Menu/Header"
import { useEffect } from 'react';

export const Permissao = () => {
  

    useEffect(() => {
        // Configura a chamada periódica a cada 5 segundos, por exemplo
        const interval = setInterval(() => {
         
        }, 5000);

        // Limpa o intervalo ao desmontar o componente
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="Flex min-h-screen bg-slate-100 dark:bg-slate-900 flex justify-around px-4">
            <Header />
            
            <main className='mt-32 w-full bg-slate-100 dark:bg-slate-900 '>
                <section className="pl-16 lg:pl-64">
                <div className="flex flex-wrap gap-4 w-full ">
                    <div className='flex justify-around items-center  '>
                            <span className='flex items-center dark:text-white '>Sem permissão!</span>
                    </div>
                </div>
                </section>
            </main>
        </div>
    );
};

export default Permissao;
