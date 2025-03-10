import Header from '../components/Menu/Header';
import api from "../services/api";
import Alert from '../components/Alert';
import { useEffect, useState} from 'react';
import { Dispositivo }  from '../types/Dispositivo'
import { Table } from 'react-bootstrap'

export const Dispositivos_old = () => {
    
    const [alertVisible, setAlertVisible] = useState<boolean>(false);
    const [alertMensage, setAlertMensage] = useState<string>('');
    const [alertType, setAlertType] = useState<string>('');

    const [respostas, setRespostas] = useState<{ messag: string; nome:string, local: string, ip: string, porta_udp: string, porta_tcp: string, protocolo: string, tipo: string }[]>([]);

    const [dispositivos, setDispositivos] = useState<Dispositivo[]>([]); //listar

    // Pegando os dois últimos caracteres  75 = aberto / 76 = fechado
    //const status_cancela = resposta.slice(-2);

    // Usando os dois últimos caracteres na condição
    //const isVisible = status_cancela === '75' ? '' : 'hidden';

    async function handlerEnvia(tipo_comando: string, nome: string , local: string, ip: string, porta_udp: string, porta_tcp: string, protocolo: string, tipo: string): 
                                                Promise<{messag: string, nome:string, local: string, ip:string, porta_udp:string, porta_tcp: string, protocolo: string, tipo: string}> {
        
      /*
        # 504c0d libera passa dois lados / resposta: 450D 
        # 454c0d libera entrada / lado esquerdo para direito
        # 534c0d libera saida / lado direto para esquerdo                                           
        # 52530d / comando para Reset
    */
        try {
            let comando_ = "";
            if (tipo === "CANCELA" && tipo_comando === "ENVIA"){
                if (protocolo === "UDP"){
                    comando_ = "55AA0306060000000101"; //envia comando de abertura/fechamento cancela
                }
            }
            if (tipo === "CANCELA" && tipo_comando === "SOLICITA"){
                if (protocolo === "UDP"){
                    comando_ = "55AA0200"; //solicita status cancela
                }
            }
            if (tipo === "CATRACA" && tipo_comando === "ENVIA"){
                if (protocolo === "TCP"){
                    comando_ = "504c0d" //envia comando de liberação para dois lado catraca
                }
            }
            
            if (tipo === "CATRACA" && tipo_comando === "SOLICITA"){
                if (protocolo === "TCP"){
                    comando_ = "55AA0200"; //solicita status catraca
                }
            }

            // Faz a requisição POST para a API e aguarda a resposta
            let protocol_ = protocolo === "UDP" ? "UDP" : protocolo === "TCP" ? "TCP" : "";

            const response = await api.post('/'+protocol_+'/envia', {
                comandoHex: comando_,
                nome: nome,
                local: local,
                ip: ip,
                porta_udp: porta_udp,
                porta_tcp: porta_tcp,
                protocolo: protocolo,
                tipo: tipo 
            })

            // Se a resposta for sucesso (status 200)
            if (response.status === 200) {
                const mensagem = response.data.message; // Mensagem da resposta UDP
                return {messag: mensagem, nome: response.data.nome, local: response.data.local, ip: response.data.ip, porta_udp: response.data.porta_udp, porta_tcp: response.data.porta_tcp, protocolo: response.data.protocolo, tipo: response.data.tipo};
            }
            if (response.status === 408 ){
                const mensagem = response.data.message; // Mensagem da resposta UDP
                return {messag: mensagem, nome: response.data.nome, local: response.data.local, ip: response.data.ip, porta_udp: response.data.porta_udp, porta_tcp: response.data.porta_tcp, protocolo: response.data.protocolo, tipo: response.data.tipo};
            } else {
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
                return {messag: 'Erro ao enviar o comando - Tente mais tarde ou entre em contato com o Administrador.', nome: nome, local: local, ip: ip, porta_udp: porta_udp, porta_tcp: porta_tcp, protocolo: protocolo, tipo: tipo}
            }
        }
    }
    
     // Função para consultar o status da cancela automaticamente
     const consultaStatusCancela = async () => {

        /*

        CONTINUAR NO ERRO DA CATRACA CHAMANDO METODO UDP SOLICITA STATUS

        */
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
            const resultados = await Promise.all(
                dispositivos.map(async (dispositivo) => {
                    const strNome = String(dispositivo.nome);
                    const strLocal = String(dispositivo.local);
                    const strIp = String(dispositivo.ip).trim();
                    const strUDPport = String(dispositivo.UDPport).trim();
                    const strTCPport = String(dispositivo.TCPport).trim();
                    const strProtocolo = String(dispositivo.protocolo).trim();
                    const strTipo = String(dispositivo.tipo).trim();

                    return await handlerEnvia('SOLICITA', strNome, strLocal, strIp, strUDPport, strTCPport, strProtocolo, strTipo);
                   
                })
            ); 

            setRespostas([...resultados]);

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
                if (dispositivos.length > 0 ) {
                    const interval = setInterval(consultaStatusCancela, 5000);
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
                            <div className="mt-4 text-gray-800 dark:text-white" >{ resposta.tipo }</div>
                            <div className="w-full  text-gray-800 text-xl font-semibold dark:text-white">{ resposta.local } </div>
                            <div className="mt-4 text-gray-800 dark:text-white" >{ resposta.nome }</div>                            

                            {/* Representação da cancela */}
                            <div className="flex items-center mt-10 ml-4">
                                <div className={`relative w-8 h-20 bg-gray-400 rounded-sm rounded-tr-2xl }`}>
                                    {/*aqui tenho que ficar consultando a api para atuliazar em tela o status da cancela*/}
                                    <div className={`absolute left-4 -top-8 w-2 h-16 bg-orange-500 -rotate-0 rounded-r ${resposta.messag.slice(-2) == '75' || resposta.messag.slice(-2) == '7f' || resposta.messag.slice(-2) == '7d' ? '' : 'hidden'}`}></div>
                                    <div className={`absolute left-11 top-0 w-2 h-16 bg-orange-500 -rotate-90 rounded-l ${resposta.messag.slice(-2) == '76' || resposta.messag.slice(-2) == '77' || resposta.messag.slice(-2) == '7e' ? '' : 'hidden'}`}></div>
                                    
                                </div>
                                <div className="w-36 h-1/6 mt-14 ml-1   flex items-center justify-center ">
                                    <div className={`w-40 h-1/3 bg-green-500 ${resposta.messag.slice(-2) == '7e' || resposta.messag.slice(-2) == '7f' || resposta.messag.slice(-2) == '7d' ? 'bg-red-500' : 'bg-green-500'}`}></div>
                                    {/*<div className={`w-6 h-2 bg-red-500 ${true ? '' : 'hidden'}`}></div> */}
                                    <span className="absolute text-black text-xs font-bold dark:text-gray-300  ">X</span>
                                </div>
                             
                            </div>
                            

                            {/* botao cancela */}
                            <div className="flex items-center justify-between w-full mt-4">
                                <input type="submit" 
                                            value={`${resposta.messag.slice(-2) == '75' || resposta.messag.slice(-2) == '7f' || resposta.messag.slice(-2) == '7d' ? 'Fechar' : 'Abrir'}`}
                                            onClick={() => handlerEnvia('ENVIA',resposta.nome, resposta.local ,resposta.ip,resposta.porta_udp, resposta.porta_tcp, resposta.protocolo, resposta.tipo)}
                                            className="cursor-pointer w-full p-2 bg-green-500 text-gray-700 rounded font-bold" />
                               
                            </div>

                            <div className="mt-4">
                                <h2 className="text-lg font-semibold text-black dark:text-white">Status</h2>
                                <p className="text-black dark:text-white">{resposta.messag.substring(0,4) == '55aa' ? 'OK':'ERRO'}</p>
                                <p className="text-black dark:text-white">{resposta.messag}</p>
                            </div>
                     
                        {/* fim do card cancela */}
                        </div>
                        ))}

                    </div>
                     ) : (
                        <p className="text-gray-800 dark:text-white">Nenhum dispositivo encontrado.</p>
                        )
                    }
   
                    {/*
                    <div className="flex flex-col items-center p-4">
                    <h2 className="text-lg font-bold mb-4">Status das Cancelas</h2>
                        <div className="grid grid-cols-1 gap-4 w-full max-w-md">
                            {respostas.map((resposta, index) => (
                                <div key={index} className="p-4 bg-gray-100 rounded shadow-md">
                                    <h3 className="font-semibold text-gray-700">Cancela {index + 1}:</h3>
                                    <p className="text-gray-800">{resposta.messag}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    */}


            <Table 
            striped 
            bordered 
            hover 
            responsive 
            className="table-auto w-full border-collapse text-sm text-gray-800 dark:text-gray-200"
          >
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-700 text-left text-sm font-semibold text-gray-600 dark:text-gray-200 uppercase tracking-wide">
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">TIPO</th>
                <th className="px-4 py-2">Dispositivo</th>
                <th className="px-4 py-2">Local</th>
                <th className="px-4 py-2">IP</th>
                <th className="px-4 py-2">Porta UDP</th>
                <th className="px-4 py-2">Porta TCP</th>
                <th className="px-4 py-2">Protocolo</th>
                <th className="px-4 py-2"></th>
                <th className="px-4 py-2 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
              {dispositivos.map((item) => (
                <tr 
                  key={item.id} 
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <td className="px-4 py-3">{item.id}</td>
                  <td className="px-4 py-2">{item.tipo}</td>
                  <td className="px-4 py-3">{item.nome}</td>
                  <td className="px-4 py-3">{item.local}</td>
                  <td className="px-4 py-3">{item.ip}</td>
                  <td className="px-4 py-3">{item.UDPport}</td>
                  <td className="px-4 py-3">{item.TCPport}</td>
                  <td className="px-4 py-3">{item.protocolo}</td>
                  <td className="px-4 py-3">{item.ativo ? 'Ativo':'Inativo'}</td>
                  
                 
                </tr>
              ))}
            </tbody>
          </Table>
                </section>
            </main>
        </div>
    )
}