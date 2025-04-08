import Header from '../components/Menu/Header';
import api from "../services/api";
import Alert from '../components/Alert';
import { useEffect, useState} from 'react';
import { Dispositivo }  from '../types/Dispositivo'

export const Dispositivos = () => {
    
    const [alertVisible, setAlertVisible] = useState<boolean>(false);
    const [alertMensage, setAlertMensage] = useState<string>('');
    const [alertType, setAlertType] = useState<string>('');

    const [respostas, setRespostas] = useState<{ messag: string; nome:string, local: string, ip: string, porta_udp: string, porta_tcp: string, protocolo: string, tipo: string }[]>([]);

    const [dispositivos, setDispositivos] = useState<Dispositivo[]>([]); //listar

    // Pegando os dois últimos caracteres  75 = aberto / 76 = fechado
    //const status_cancela = resposta.slice(-2);

    // Usando os dois últimos caracteres na condição
    //const isVisible = status_cancela === '75' ? '' : 'hidden';

    async function handlerEnviaUDP(comando: string, nome: string , local: string, ip: string, porta_udp: string, porta_tcp: string, protocolo: string, tipo: string): 
                                                Promise<{messag: string, nome:string, local: string, ip:string, porta_udp:string, porta_tcp: string, protocolo: string, tipo: string}> {
        try {
            // Faz a requisição POST para a API e aguarda a resposta
            const response = await api.post(`/udp/envia`, {
                comandoHex: comando,
                nome: nome,
                local: local,
                ip: ip,
                porta_udp: porta_udp,
                porta_tcp: porta_tcp,
                protocolo: protocolo,
                tipo: tipo 
            });
            

            // Se a resposta for sucesso (status 200)
            if (response.status === 200) {
                const mensagem = response.data.message; // Mensagem da resposta UDP
                return {messag: mensagem, nome: response.data.nome, local: response.data.local, ip: response.data.ip, porta_udp: response.data.porta_udp, porta_tcp: response.data.porta_tcp, protocolo: response.data.protocolo, tipo: response.data.tipo};
            }
            if(response.status === 408){
                const mensagem = response.data.message; // Mensagem da resposta UDP
                return {messag: mensagem, nome: response.data.nome, local: response.data.local, ip: response.data.ip, porta_udp: response.data.porta_udp, porta_tcp: response.data.porta_tcp, protocolo: response.data.protocolo, tipo: response.data.tipo};
            }else{
                return {messag: response.data.erro, nome: response.data.nome, local: response.data.local, ip: response.data.ip, porta_udp: response.data.porta_udp, porta_tcp: response.data.porta_tcp, protocolo: response.data.protocolo, tipo: response.data.tipo};
            }
            
        } catch (error: any) {
            // Trata o erro se não houver resposta ou ocorrer erro
            if (error.response && error.response.data && error.response.data.message) {
                const apiMessage = error.response.data.message;

                // Verifica se a mensagem é de timeout
                if (apiMessage.includes('Nenhuma resposta recebida dentro do tempo limite')) {
                    setAlertVisible(true);
                    setAlertType('error');
                    setAlertMensage(apiMessage);
                    return {messag: apiMessage, nome: nome, local: local, ip: ip, porta_udp: porta_udp, porta_tcp: porta_tcp, protocolo: protocolo, tipo: tipo};
                } else {
                    // Exibe outras mensagens de erro da API
                    setAlertVisible(true);
                    setAlertType('error');
                    setAlertMensage(`Erro: ${apiMessage}`);
                    return {messag: apiMessage, nome: nome, local: local, ip: ip, porta_udp: porta_udp, porta_tcp: porta_tcp, protocolo: protocolo, tipo: tipo};
                }
            } else {
                // Se o erro não veio da API (problema de rede, por exemplo)
                setAlertVisible(true);
                setAlertType('error');
                setAlertMensage('Erro ao enviar o comando - Tente mais tarde ou entre em contato com o Administrador.');
                return {messag: "Erro ao enviar o comando - Tente mais tarde ou entre em contato com o Administrador.", nome: nome, local: local, ip: ip, porta_udp: porta_udp, porta_tcp: porta_tcp, protocolo: protocolo, tipo: tipo}
            }
        }
    }
    
     // Função para consultar o status da cancela automaticamente
     const consultaStatusCancela = async () => {
        //55AA0200
        /*
        const resultados = await Promise.all([
        await handlerEnviaUDP('55AA0200', 'Cancela 01', 'Portaria', '10.2.1.107', '2002'),
        await handlerEnviaUDP('55AA0200', 'Cancela 02', 'Portaria', '10.2.1.108', '2002'),
        await handlerEnviaUDP('55AA0200', 'Cancela 03', 'Balanças', '10.2.1.100', '2002'),
        await handlerEnviaUDP('55AA0200', 'Cancela 04', 'Balanças', '10.2.1.101', '2002')
        ]);
        */
        try{
            // CONSTINUAR AQUI - ESSE METODO CHAMADA OS DOSPOSITIVOS NO BANCO. POREM FICA MEXENDO NA TELA.
            const resultados = await Promise.all(
                dispositivos.map(async (cancela) => {
                    const strNome = String(cancela.nome);
                    const strLocal = String(cancela.local);
                    const strIp = String(cancela.ip).trim();
                    const strUDPport = String(cancela.UDPport).trim();
                    const strTCPport = String(cancela.TCPport).trim();
                    const strProtocolo = String(cancela.protocolo).trim();
                    const strTipo = String(cancela.tipo).trim();
                    return await handlerEnviaUDP('55AA0200', strNome, strLocal, strIp, strUDPport, strTCPport, strProtocolo, strTipo);
                })
            ); 


            setRespostas([...resultados]);
           // console.log("resultados: " + resultados);
        }catch(error){
            setAlertVisible(true);
            setAlertType('error');
            setAlertMensage('Erro receber resposta do dispositivo: ' + error);
        } 
    };

    // useEffect para configurar a consulta automática a cada 5 segundos
    useEffect(() => {
        const iniciar = async () => {
            try{
                if( dispositivos.length === 0){
                const response = await api.get("/dispositivo");
                //const dispositivosAtivos = response.data.filter((dispositivo: any) => dispositivo.ativo === 1);
                setDispositivos(response.data[0].filter((dispAtivos: any) =>   dispAtivos.ativo === 1)); // Atualiza o estado com o primeiro dispositivo  
                }

                // Configura o intervalo somente se houver dispositivos
                if (dispositivos.length > 0) {
                    const interval = setInterval(consultaStatusCancela, 1000);
                    return () => clearInterval(interval); // Limpa o intervalo ao desmontar
                    
                }
            } catch (error){
                setAlertVisible(true);
                setAlertType('error');
                setAlertMensage('Erro ao carregar dispositivos: ' + error);
            } 
        };
        iniciar(); // Chama a função assíncrona
    }, [dispositivos]); // Apenas uma vez na montagem
    
    
    const handleCloseAlert = () => {
        setAlertVisible(false);
    };
    
  
    return (
        <div className="Flex min-h-screen bg-slate-100 dark:bg-slate-900 flex justify-around px-4">
            <Header />
            {
            alertVisible  && (
                <Alert
                    message={alertMensage}
                    type={alertType}
                    onClose={handleCloseAlert}
                />
                )
            }
            
            <main className='mt-32 w-full bg-slate-100 dark:bg-slate-900 '>
                <section className="pl-16 lg:pl-64">

                    {respostas.length > 0 && dispositivos && dispositivos.length > 0 ? (
                    
                    <div className="flex flex-wrap gap-4 w-full ">
                        {/* inicio do card cancela */}
                        {respostas.map((resposta, index) => (
                        
                        <div key={index} className="flex flex-col items-start w-60 h-68 p-4 rounded-lg bg-light dark:bg-dark shadow-md border dark:border-gray-700 ">
                            <div className={`w-3 h-3 bg-green-400 rounded-full ml-48 ${resposta.messag.substring(0,4) == '55aa' ? 'bg-green-400':'bg-red-400 animate-pulse'}`}></div>
                            <div className="mt-4 text-gray-800 dark:text-white">{ resposta.tipo }</div>
                            <div className="w-full  text-gray-800 text-xl font-semibold dark:text-white">{ resposta.local } </div>
                            <div className="mt-4 text-gray-800 dark:text-white" >{ resposta.nome }</div>

                            {/* Representação da cancela */}
                            {resposta.tipo === 'CANCELA' &&(
                            <div >
                                
                                <div className="flex items-center mt-10 ml-4">
                                    <div className="relative w-8 h-20 bg-gray-400 rounded-sm rounded-tr-2xl">
                                        <div className={`absolute left-4 -top-8 w-2 h-16 bg-orange-500 -rotate-0 rounded-r ${resposta.messag.slice(-2) == '75' || resposta.messag.slice(-2) == '7f' || resposta.messag.slice(-2) == '7d' ? '' : 'hidden'}`}></div>
                                        <div className={`absolute left-11 top-0 w-2 h-16 bg-orange-500 -rotate-90 rounded-l ${resposta.messag.slice(-2) == '76' || resposta.messag.slice(-2) == '7e' ? '' : 'hidden'}`}></div>
                                    </div>
                                    <div className="w-36 h-1/3 mt-14 ml-2  flex items-center justify-center">
                                    {/*<div className={`w-36 h-1/3 bg-green-500 ${resposta.messag.slice(-2) == '7e' || resposta.messag.slice(-2) == '7f' || resposta.messag.slice(-2) == '7d' ? 'bg-red-500' : 'bg-green-500'}`}></div>*/}
                                        <span className={`w-36 h-[3px]  absolute text-black text-xs font-bold dark:text-gray-300 
                                        flex items-center justify-center ${resposta.messag.slice(-2) == '7e' || resposta.messag.slice(-2) == '7f' || resposta.messag.slice(-2) == '7d' ? 'bg-red-500' : 'bg-green-500'}`}>X</span>
                                    </div>
                                </div>
                                {/* botao cancela */} 
                                <div className="flex items-center justify-between w-full mt-4">
                                    <input type="submit" 
                                                value={`${resposta.messag.slice(-2) == '75' || resposta.messag.slice(-2) == '7f' || resposta.messag.slice(-2) == '7d' ? 'Fechar' : 'Abrir'}`}
                                                onClick={() => handlerEnviaUDP('55AA0306060000000101', resposta.nome, resposta.local ,resposta.ip,resposta.porta_udp,resposta.porta_tcp,resposta.protocolo,resposta.tipo)}
                                                className="cursor-pointer w-full p-2 bg-green-500 text-gray-700 rounded font-bold" />
                                </div>
                                {/*
                                <div className="mt-4">
                                    <h2 className="text-lg font-semibold text-black dark:text-white">Status</h2>
                                    <p className="text-black dark:text-white">{resposta.messag.substring(0,4) == '55aa' ? 'OK':'ERRO'}</p>
                                </div>
                                */}
                                                                
                            </div>
                            )}
                     
                        {/* fim do card cancela */}

                        {/* Representação da catracva */}
                        {resposta.tipo === 'CATRACA' &&(
                        <div >
                            <div className="flex items-center mt-10 ml-16">
                                <div className={`relative w-8 h-20 bg-gray-400 rounded-sm rounded-tr-2xl }`}>
                                    {/*aqui tenho que ficar consultando a api para atuliazar em tela o status da cancela*/}
                                    <div className="absolute left-8 top-2 w-2 h-10 bg-gray-500 -rotate-45 rounded-r"></div>
                                    <div className="absolute left-8 -top-2 w-2 h-10 bg-gray-500 -rotate-90 rounded-l"></div>
                                    
                                </div>

                            </div>
                             {/* botao cancela */}
                             <div className="flex items-center justify-between w-48 mt-4  ">
                                <input type="submit" 
                                            value="Liberar"
                                            onClick={() => handlerEnviaUDP('55AA0306060000000101', resposta.nome, resposta.local ,resposta.ip,resposta.porta_udp,resposta.porta_tcp,resposta.protocolo,resposta.tipo)}
                                            className="cursor-pointer w-full p-2 bg-green-500 text-gray-700 rounded font-bold" />
                            </div>
                        </div>
                        )}

                        {/* Representação da catracva */}
                        {resposta.tipo === 'BALANCA' &&(
                        <div >
                            <div className="flex items-center mt-10 ml-0">
                                {/*aqui tenho que ficar consultando a api para atuliazar em tela o status da cancela*/}
                                <div className="w-52 h-12 bg-gray-900 dark:bg-gray-700 rounded p-2  shadow-inner">
                                    <div className="text-right text-2xl text-green-200 tracking-widest "> {resposta.messag} </div>
                                </div>
                            </div>
                        
                        </div>
                        )}

                        {/* Representação do Leitor RFID */}
                        {resposta.tipo === 'LEITORRFID' &&(
                        <div>
                            <div className="flex items-center mt-10 ml-0">
                                {/*aqui tenho que ficar consultando a api para atuliazar em tela o status da cancela*/}
                                <div className="w-48 h-28 bg-gray-900 rounded-2xl shadow-lg p-4 flex flex-col items-center justify-between text-white relative">
                                    <div className="w-44 h-20 bg-neutral-800 rounded-xl shadow-md flex flex-col items-center justify-center text-white relative">
                                        <div className="w-16 h-16 border-2 border-gray-500 rounded-full flex items-center justify-center">
                                            <div className="w-10 h-10 border-2 border-gray-500 rounded-full flex items-center justify-center">
                                                    <div className="w-4 h-4 border-2 border-gray-500 rounded-full"></div>
                                            </div>
                                        </div>              
                                    </div>
                                </div>
                            </div>
                        </div>
                        )}
                        
                        </div>


                        ))}
                    </div>
                     ) : (
                        <p className="text-gray-800 dark:text-white">Nenhum dispositivo encontrado.</p>
                        )
                    }
   
                </section>
            </main>
        </div>
    )
}