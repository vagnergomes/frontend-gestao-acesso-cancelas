import { useEffect, useState, useRef, FormEvent} from 'react'
import { FiTrash, FiEdit } from 'react-icons/fi'
import api from '../services/api'
import { Table, Button } from 'react-bootstrap'
import { Dispositivo }  from '../types/Dispositivo'
import Alert from '../components/Alert'
import Header from '../components/Menu/Header'

export default function CadastroDispositivo() {

  const [dispositivos, setDispositivos] = useState<Dispositivo[]>([]); //listar
  const nomeRef = useRef<HTMLInputElement | null>(null); //cadastrar
  const localRef = useRef<HTMLInputElement | null>(null); //cadastrar
  const ipRef = useRef<HTMLInputElement | null>(null); //cadastrar
  const UDPportRef = useRef<HTMLInputElement | null>(null); //cadastrar
  const TCPportRef = useRef<HTMLInputElement | null>(null); //cadastrar
  const protocoloRef = useRef<HTMLSelectElement | null>(null); //cadastrar
  const tipoRef = useRef<HTMLSelectElement | null>(null); //cadastrar
  const ativoRef = useRef<HTMLInputElement | null>(null); //cadastrar

  const [dispId, setDispId] = useState<any>(null);
  const [dispNome, setDispNome] = useState<any>('');
  const [dispLocal, setDispLocal] = useState<any>('');
  const [dispIp, setDispIp] = useState<any>('');
  const [dispUDPport, setDispUDPport] = useState<any>('');
  const [dispTCPport, setDispTCPport] = useState<any>('');
  const [dispProtocolo, setDispProtocolo] = useState<any>('');
  const [dispTipo, setDispTipo] = useState<any>('');
  const [dispAtivo, setDispAtivo] = useState<any>(false);

  const [dispEdit, setDispEdit] = useState<boolean>(false);

  const [alertVisible, setAlertVisible] = useState<boolean>(false);
  const [alertMensage, setAlertMensage] = useState<string>('');
  const [alertType, setAlertType] = useState<string>('');
 
  useEffect(() => {
    loadDispositivos();
  }, []);

  async function loadDispositivos(){
   
    const response = await api.get("/dispositivo");
    setDispositivos(response.data[0]);
 
    
  };

  //continuar na função update, ja está preenchedo os campos, precisa identificar quando
  //é novo cadastro ou atualização e chamar a api correta.
  async function handleSubmit(event: FormEvent){
    event.preventDefault();

    if(!nomeRef.current?.value || !localRef.current?.value || !ipRef.current?.value || !protocoloRef.current?.value || !tipoRef.current?.value || (!UDPportRef.current?.value || !TCPportRef.current?.value)) {
        setAlertVisible(true);
        setAlertType('info');
        setAlertMensage(`Preencha todos os campos necessários.`); 
        return
    };
    try{
      if(dispEdit) {
    
        await api.put(`/dispositivo/${dispId}`, {
          nome: nomeRef.current?.value,
          local: localRef.current?.value,
          ip: ipRef.current?.value,
          UDPport: UDPportRef.current?.value,
          TCPport: TCPportRef.current?.value,
          protocolo: protocoloRef.current?.value,
          tipo: tipoRef.current?.value,
          ativo: ativoRef.current?.checked
        });
        setDispEdit(false); 
      }else {
        await api.post("/dispositivo", {
          nome: nomeRef.current?.value,
          local: localRef.current?.value,
          ip: ipRef.current?.value,
          UDPport: UDPportRef.current?.value,
          TCPport: TCPportRef.current?.value,
          protocolo: protocoloRef.current?.value,
          tipo: tipoRef.current?.value,
          ativo: ativoRef.current?.checked
        });
        setAlertVisible(true);
      };
      setAlertVisible(true);
      setAlertType('success');
      setAlertMensage('Salvo com sucesso.');
      
        //limpar referencia ao cadastrar
        nomeRef.current.value = '';
        localRef.current.value = '';
        ipRef.current.value = '';
        UDPportRef.current.value = '';

        //limpa campos usados no Update
        setDispNome('');
        setDispLocal('' );
        setDispIp('');
        setDispUDPport('');
        setDispTCPport('');
        setDispProtocolo('');
        setDispTipo('');
        setDispAtivo(false);
    } catch (error){
        setAlertVisible(true);
        setAlertType('error');
        setAlertMensage(`Ocorreu algum erro ao salvar: ${error} - Tente mais tarde ou entre em contato com o Administrador.`);    
    }

    
    //atualiza lista de usuario depois de salvar
    //setUsers(allUsers => [...allUsers, response.data])
    loadDispositivos();
  }

  async function handlerDelete(dispId: number){
    try{
    await api.delete(`/dispositivo/${dispId}`);
      const allDisp = dispositivos.filter((user) => user.id !== dispId);
      setDispositivos(allDisp);
      setAlertVisible(true);
      setAlertType('success');
      setAlertMensage('Sucesso ao remover.'); 
      //setUsers(users.filter(user => user.id !== userId));
    } catch (error) {
      setAlertVisible(true);
      setAlertType('error');
      setAlertMensage(`Erro ao remover: ${error} - Tente mais tarde ou entre em contato com o Administrador.`); 
      //setUsers(users.filter(user => user.id !== userId));
    }
    
  }

  async function handleChangeDispositivo(disp: Dispositivo){ 
      
      setDispId(disp?.id );
      setDispNome(disp?.nome?.trim());
      setDispLocal(disp?.local );
      setDispIp(disp?.ip );
      setDispUDPport(disp?.UDPport);
      setDispTCPport(disp?.TCPport);
      setDispProtocolo(disp?.protocolo);
      setDispTipo(disp?.tipo);
      setDispAtivo(disp?.ativo);

      setDispEdit(true);

  }

  const handleCloseAlert = () => {
    setAlertVisible(false);
  };


  return (
     
    <div className="Flex  min-h-screen bg-slate-100 dark:bg-slate-900 flex justify-around px-4">
        
      <Header />
      
      
      {alertVisible  && (
      <Alert
        message={alertMensage}
        type={alertType}
        onClose={handleCloseAlert}
      />
      )}

      <main className=" mt-28 w-full bg-slate-100 dark:bg-slate-900 md:max-w-2xl">
  
        <h1 className="text-4xl font-medium text-black dark:text-white ">Dispositivos</h1>

        <form className="flex flex-col my-5" onSubmit={handleSubmit}>
          <label className="font-medium text-black dark:text-white" >Nome:</label>
          <input type="text"
                  placeholder="Digite seu nome."
                  className="w-full mb-5 p-2 rounded" 
                  ref={nomeRef}
                  value={dispNome} //atualiza campo ao editar
                  onChange={(event) => setDispNome(event.target.value)} //permite alteração no campo ao editar
                  />


          <label className="font-medium text-black dark:text-white" >Local: </label>
          <input type="text"
                  placeholder="Digite o local."
                  className="w-full mb-5 p-2 rounded"
                  ref={localRef}
                  value={dispLocal} //atualiza campo ao editar
                  onChange={(event) => setDispLocal(event.target.value)} //permite alteração no campo ao editar
                  />
          
          <label className="font-medium text-black dark:text-white" >IP: </label>
          <input type="text"
                  placeholder="Digite o IP."
                  className="w-full mb-5 p-2 rounded"
                  ref={ipRef}
                  value={dispIp} //atualiza campo ao editar
                  onChange={(event) => setDispIp(event.target.value)} //permite alteração no campo ao editar
                  />

            <label className="font-medium text-black dark:text-white" >Porta UDP: </label>
            <input type="text"
                  placeholder="Digite a porta UDP."
                  className="w-full mb-5 p-2 rounded"
                  ref={UDPportRef}
                  value={dispUDPport} //atualiza campo ao editar
                  onChange={(event) => setDispUDPport(event.target.value)} //permite alteração no campo ao editar
                  />
              
              <label className="font-medium text-black dark:text-white" >Porta TCP: </label>
              <input type="text"
                  placeholder="Digite a porta UDP."
                  className="w-full mb-5 p-2 rounded"
                  ref={TCPportRef}
                  value={dispTCPport} //atualiza campo ao editar
                  onChange={(event) => setDispTCPport(event.target.value)} //permite alteração no campo ao editar
                  />

            <label className="font-medium text-black dark:text-white">Protocolo principal: </label>
            <select
                className="w-full mb-5 p-2 rounded bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600"
                ref={protocoloRef}
                value={dispProtocolo} // Atualiza o campo ao editar
                onChange={(event) => setDispProtocolo(event.target.value)} // Permite alteração no campo ao editar
            >
                <option value="">Selecione um protocolo</option>
                <option value="TCP">TCP</option>
                <option value="UDP">UDP</option>
            </select>

            <label className="font-medium text-black dark:text-white">Tipo de Dispositivo: </label>
            <select
                className="w-full mb-5 p-2 rounded bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600"
                ref={tipoRef}
                value={dispTipo} // Atualiza o campo ao editar
                onChange={(event) => setDispTipo(event.target.value)} // Permite alteração no campo ao editar
            >
                <option value="">Selecione um protocolo</option>
                <option value="CANCELA">CANCELA</option>
                <option value="CATRACA">CATRACA</option>
            </select>


            <label className="flex items-center font-medium mb-5 text-black dark:text-white">
              Ativo:
              <input
                type="checkbox"
                className="ml-2"
                ref={ativoRef}
                checked={dispAtivo}
                onChange={(event) => setDispAtivo(event.target.checked)}
              />
            </label>

          <input type="submit" 
                  value="Cadastrar"
                  className="cursor-pointer w-full p-2  bg-green-500 rounded font-medium" />
        </form>

        <section>
          <h1 className='text-black dark:text-white'>Dados da API</h1>

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
                  
                  <td className="px-4 py-3 text-center flex justify-center gap-2">
                    <Button 
                      variant="danger" 
                      className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded-md transition"
                      onClick={() => handlerDelete(item.id)}
                    >
                      <FiTrash size={18} />
                    </Button>
                    <Button 
                      variant="primary" 
                      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded-md transition"
                      onClick={() => handleChangeDispositivo(item)}
                    >
                      <FiEdit size={15} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </section>

{/*
        <section className="flex flex-col gap-4">
          
          {dispositivos.map( (disp) => (
            <article
            key={disp.id}
            className="w-full bg-white rounded p-2 relative hover:scale-105 duration-200">
            <p><span className="font-medium">Nome:</span> {disp.nome}</p>
            <p><span className="font-medium">Local:</span> {disp.local}</p>
            <p><span className="font-medium">IP:</span> {disp.ip} </p>
            <p><span className="font-medium">Porta UDP: </span> {disp.UDPport}</p>
            <p><span className="font-medium">Ativo: </span> {disp.ativo ? 'Sim':'Não'}</p>

            <button  className='bg-gray-500 w-7 h-7 flex items-center justify-center rounded-lg absolute right-14 -top-2'
                    onClick={() => handleChangeDispositivo(disp)} >
                    <FiEdit size={15} color='#FFF' />
            </button>

            <button className='bg-red-500 w-7 h-7 flex items-center justify-center rounded-lg absolute right-5 -top-2'
                    onClick={ () => handlerDelete(disp.id)}>
              <FiTrash size={18} color='#FFF' />
            </button>

            
          </article>
          ))}

        </section>
        */}
        
      </main>

    </div>
  )
}
