import { MdAttachMoney } from "react-icons/md";
import Header from '../components/Menu/Header';
import  api from "../services/api";
import { useState} from 'react'

export const Home = () => {
    //const [alertVisible, setAlertVisible] = useState<boolean>(false);
    //const [alertMensage, setAlertMensage] = useState<string>('');
    //const [alertType, setAlertType] = useState<string>('');

    //const comandoHex = useRef<HTMLInputElement | null>(null); //cadastrar
    //const ip = useRef<HTMLInputElement | null>(null); //cadastrar
    //const porta = useRef<HTMLInputElement | null>(null); //cadastrar
    const [resposta, setResposta] = useState('');

      async function envia(comando: string, ip: string, porta_udp: string) {
        try {
            // Faz a requisição POST para a API e aguarda a resposta
            const response = await api.post(`/udp/envia`, {
                comandoHex: comando,
                nome: "teste",
                local: "teste",
                ip: ip,
                porta_udp: porta_udp 
            });
            

            // Se a resposta for sucesso (status 200)
            if (response.status === 200) {
                //const mensagem = response.data.message; // Mensagem da resposta UDP
                setResposta(response.data.message)
                //setAlertVisible(true);
                //setAlertType('success');
                //setAlertMensage(`Resposta da placa: ${mensagem}`);
            }else{
                const mensagem = response.data.message; // Mensagem da resposta UDP
                setResposta(response.data.erro)
                console.log(response.status);
                console.log(mensagem)
                //setAlertVisible(true);
                //setAlertType('success');
                //setAlertMensage(`Resposta da placa: ${mensagem}`);
            }
            
        } catch (error: any) {
            // Trata o erro se não houver resposta ou ocorrer erro
            if (error.response && error.response.data && error.response.data.message) {
                const apiMessage = error.response.data.message;
    
                // Verifica se a mensagem é de timeout
                if (apiMessage.includes('Nenhuma resposta recebida dentro do tempo limite')) {
                    //setAlertVisible(true);
                    //setAlertType('warning');
                    //setAlertMensage('Nenhuma resposta recebida da placa dentro do tempo limite.');
                } else {
                    // Exibe outras mensagens de erro da API
                    //setAlertVisible(true);
                    //setAlertType('error');
                    //setAlertMensage(`Erro: ${apiMessage}`);
                }
            } else {
                // Se o erro não veio da API (problema de rede, por exemplo)
                //setAlertVisible(true);
                //setAlertType('error');
                //setAlertMensage('Erro ao enviar o comando - Tente mais tarde ou entre em contato com o Administrador.');
            }
        }
    }
    
    

    return (
        <div className="Flex min-h-screen bg-slate-100 dark:bg-slate-900 flex justify-around px-4">
            <Header />
            
            <p>teste</p>
            
            <main className='mt-32 w-full bg-slate-100 dark:bg-slate-900 '>
                <section className="pl-16 lg:pl-64">
                <div className="flex flex-wrap gap-4 w-full ">
                    <div className='flex gap-2 w-2/3 md:w-1/3 lg:w-1/5 rounded-lg justify-around items-center bg-light dark:bg-dark shadow'>
                        <div className='rounded-full m-1 md:h-12 md:w-12 h-6 w-6 flex items-center justify-center bg-sky-500 text-white '>
                        <MdAttachMoney className='md:h-8 md:w-8'></MdAttachMoney>
                        </div>
                        <div className='pl-1 m-1 ' >
                            <span className='flex items-center dark:text-white '>Total Sales</span>
                            <div className='flex items-center'>
                                <strong className='text-xl text-gray-700 font-semibold dark:text-white'>$3425.60</strong>
                                <span className='text-sm text-green-500 pl-2'>+234</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className='flex gap-2 w-2/3 md:w-1/3 lg:w-1/5 rounded-lg justify-around items-center bg-light dark:bg-dark shadow'>
                        <div className='rounded-full m-1 md:h-12 md:w-12 h-6 w-6 flex items-center justify-center bg-sky-500 text-white'>
                        <MdAttachMoney className='md:h-8 md:w-8'></MdAttachMoney>
                        </div>
                        <div className='pl-1 m-1'>
                            <span className='flex items-center dark:text-white'>Total Sales</span>
                            <div className='flex items-center'>
                                <strong className='text-xl text-gray-700 font-semibold dark:text-white'>$3425.60</strong>
                                <span className='text-sm text-green-500 pl-2'>+234</span>
                            </div>
                        </div>
                    </div>

                    <div className='flex gap-2 w-2/3 md:w-1/3 lg:w-1/5 rounded-lg justify-around items-center bg-light dark:bg-dark shadow'>
                        <div className='rounded-full m-1 md:h-12 md:w-12 h-6 w-6 flex items-center justify-center bg-sky-500 text-white'>
                        <MdAttachMoney className='md:h-8 md:w-8'></MdAttachMoney>
                        </div>
                        <div className='pl-1 m-1'>
                            <span className='flex items-center dark:text-white'>Total Sales</span>
                            <div className='flex items-center'>
                                <strong className='text-xl text-gray-700 font-semibold dark:text-white'>$3425.60</strong>
                                <span className='text-sm text-green-500 pl-2'>+234</span>
                            </div>
                        </div>
                    </div>
                </div>
         

              
                </section>
            </main>
        </div>
    )
}