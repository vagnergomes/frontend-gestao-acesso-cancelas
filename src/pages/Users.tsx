import { useEffect, useState, useRef, FormEvent} from 'react'
import { FiTrash, FiEdit } from 'react-icons/fi'
import api from '../services/api'
import { Table, Button } from 'react-bootstrap'
import { User } from '../types/User'
import Alert from '../components/Alert'
import Header from '../components/Menu/Header'

type Role = {
  id: number;
  nome: string;
  descricao: string
}

interface UsersRole {
  id_usuario: number;
  id_roles: number;
  nome: string
}

type RoleWithChecked = Role & { checked?: boolean };

export default function Users() {
  const [users, setUsers] = useState<User[]>([]); //listar
  const nomeRef = useRef<HTMLInputElement | null>(null); //cadastrar
  const emailRef = useRef<HTMLInputElement | null>(null); //cadastrar
  const senhaRef = useRef<HTMLInputElement | null>(null); //cadastrar
  const rolesRef = useRef<HTMLInputElement | null>(null); //cadastrar

  const [userId, setUserId] = useState<any>(null);
  const [userNome, setUserNome] = useState<any>('');
  const [userEmail, setUserEmail] = useState<any>('');
  const [setUserSenha] = useState<any>('');

  const [usersRoles, setUsersRoles] = useState<any>([])
  const [roles, setRoles] = useState<Role[]>([]); // Roles com checked
  const [rolesWithChecked, setRolesWithChecked] = useState<RoleWithChecked[]>([]);

  const [userEdit, setUserEdit] = useState<boolean>(false);

  const [alertVisible, setAlertVisible] = useState<boolean>(false);
  const [alertMensage, setAlertMensage] = useState<string>('');
  const [alertType, setAlertType] = useState<string>('');

  useEffect(() => {
    async function getRoles() {
    
    const roles_response = await api.get("/user/roles/");
    const roles: Role[] = roles_response.data[0];
 
    setRoles(roles);

    }
    loadUsers();
    getRoles();

    //iniciando lista de Roles com checkboz desmarcadas
    const rolesWithChecked = roles.map((role) => ({
      ...role,
      checked: false, // Inicialmente todas as roles são desmarcadas
    }));
    setRolesWithChecked(rolesWithChecked);
    
  }, []);

  async function loadUsers(){
    const users_response = await api.get("/user");
    const users: User[] = users_response.data[0];
    
    const users_roles_response = await api.get("/user/users-roles/");
    const users_roles: UsersRole[] = users_roles_response.data[0];

    setUsersRoles(users_roles);

    // Combina os usuários com suas respectivas roles
    const usersWithRoles = users.map((user) => {
      // Filtra as roles do usuário ESTA VINDO ZAZIO
    const userRoles = users_roles
    .filter((role) => role.id_usuario === user.id) // Garantir que ambos sejam do mesmo tipo
    .map((role) => role.nome);// Supondo que o nome da role está em role.roleName
      
      return {
        ...user,
        roles: userRoles, // Adiciona as roles como uma coluna
      };
    });
    
    setUsers(usersWithRoles)
  };

  //continuar na função update, ja está preenchedo os campos, precisa identificar quando
  //é novo cadastro ou atualização e chamar a api correta.
  async function handleSubmit(event: FormEvent){
    event.preventDefault();
    
     // Filtra as roles checkadas e mapeia para incluir o id e nome
      const selectedRoles = rolesWithChecked
      .filter((role) => role.checked) // Filtra as roles checkadas
      .map((role) => ({
        id_roles: role.id,
        nome: role.nome, // Inclui o nome da role
      }));

    try{
      if(userEdit) {
        if(!nomeRef.current?.value || !emailRef.current?.value) {
          setAlertVisible(true);
          setAlertType('info');
          setAlertMensage(`É necessário preencher os campos Nome e Email.`); 
          return
        };
        await api.put(`/user/${userId}`, { 
          nome: nomeRef.current?.value,
          email: emailRef.current?.value,
          senha: senhaRef.current?.value,
          roles: selectedRoles
        });
        setUserEdit(false); 
      }else {
        //salva usuario sem roles
        if(!nomeRef.current?.value || !emailRef.current?.value || !senhaRef.current?.value) {
          setAlertVisible(true);
          setAlertType('info');
          setAlertMensage(`É necessário preencher todos os campos.`); 
          return
        };
        await api.post("/user", {
          nome: nomeRef.current?.value,
          email: emailRef.current?.value,
          senha: senhaRef.current?.value
        });
        
        setAlertVisible(true);
      };
      setAlertVisible(true);
      setAlertType('success');
      setAlertMensage('Salvo com sucesso.');     
    } catch (error){
        setAlertVisible(true);
        setAlertType('error');
        setAlertMensage(`Ocorreu algum erro ao salvar: ${error} - Tente mais tarde ou entre em contato com o Administrador.`);    
    }
  
    // Limpar referência ao cadastrar
    if (nomeRef.current) nomeRef.current.value = "";
    if (emailRef.current) emailRef.current.value = "";
    if (senhaRef.current) senhaRef.current.value = "";
    //limpa campos usados no Update
    setUserNome('');
    setUserEmail('');
    setUserSenha('')

    const updatedRoles = rolesWithChecked.map((role) => ({
      ...role,
      checked: false, // Desmarcar todos os checkboxes
    }));
    setRolesWithChecked(updatedRoles);
    //atualiza lista de usuario depois de salvar
    //setUsers(allUsers => [...allUsers, response.data])
    loadUsers();
  }

  async function handlerDelete(userId: number){
    try{
    await api.delete(`/user/${userId}`);
      const allUsers = users.filter((user) => user.id !== userId);
      setUsers(allUsers);
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

  function handleCheckboxChange(roleId: number) {
    const updatedRoles = rolesWithChecked.map((role) =>
      role.id === roleId ? { ...role, checked: !role.checked } : role
    );
    setRolesWithChecked(updatedRoles); 
  }

  async function handleChangeUser(user: User){ 
      setUserId(user?.id );
      setUserNome(user?.nome );
      setUserEmail(user?.email );
      //setUserSenha(user?.senha );
   
      const userRoles = usersRoles.filter((ur: UsersRole) => ur.id_usuario === user.id);
      
      const updatedRoles: RoleWithChecked[] = roles.map((role: Role) => ( {
        ...role,
        checked: userRoles.some((ur: UsersRole) => ur.id_roles === role.id),
      }));
    
      setRolesWithChecked(updatedRoles)

      setUserEdit(true);
  }

  async function handleCancelChangeUser(){ 
    setUserEdit(false);
    setUserId("");
    setUserNome("");
    setUserEmail("");
    setUserSenha("");
    
    const updatedRoles = rolesWithChecked.map((role) => ({
      ...role,
      checked: false, // Desmarcar todos os checkboxes
    }));

    setRolesWithChecked(updatedRoles); // Atualiza o estado
    
}

  const handleCloseAlert = () => {
    setAlertVisible(false);
  };
  
  //configurações da tabela
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [searchTerm, setSearchTerm] = useState<string>(''); // Valor da pesquisa

  // Função para mudar a página
  const paginate = (pageNumber: number) => { setCurrentPage(pageNumber) };

  // Função para mudar a quantidade de itens por página
  const handleItemsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1); // Resetar para a primeira página quando a quantidade de itens mudar
  };

  // Função para filtrar os usuários com base no termo de pesquisa
  const filteredUsers = users.filter(
    (user) =>
      user.id?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) 
  );

  // Função para calcular os índices dos itens a serem exibidos
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  // Função para lidar com a pesquisa
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Resetar para a primeira página quando a pesquisa mudar
  };

  // Número total de páginas
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredUsers.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
     
    <div className="Flex min-h-screen bg-slate-100 dark:bg-slate-900 flex justify-around px-4">
        
      <Header />
      
      {alertVisible  && (
      <Alert
        message={alertMensage}
        type={alertType}
        onClose={handleCloseAlert}
      />
      )}

      <main className=" mt-28 w-full bg-slate-100 dark:bg-slate-900 md:max-w-2xl">
  
        <h1 className="text-4xl font-medium text-black dark:text-white ">Usuários</h1>

        <form className="flex flex-col my-5" onSubmit={handleSubmit}>
          <label className="font-medium text-black dark:text-white" >Nome:</label>
          <input type="text"
                  placeholder="Digite seu nome completo."
                  className="w-full mb-5 p-2 rounded" 
                  ref={nomeRef}
                  value={userNome} //atualiza campo ao editar
                  onChange={(event) => setUserNome(event.target.value)} //permite alteração no campo ao editar
                  />

          <label className="font-medium text-black dark:text-white" >E-mail: </label>
          <input type="email"
                  placeholder="Digite seu email."
                  className="w-full mb-5 p-2 rounded"
                  ref={emailRef}
                  value={userEmail} //atualiza campo ao editar
                  onChange={(event) => setUserEmail(event.target.value)} //permite alteração no campo ao editar
                  />
          
          <label className="font-medium text-black dark:text-white" >Senha: </label>
          <input type="password"
                  placeholder="********"
                  className="w-full mb-5 p-2 rounded"
                  ref={senhaRef}
                  //value={userSenha} 
                  //onChange={(event) => setUserSenha(event.target.value)} //permite alteração no campo ao editar//permite alteração no campo ao editar
                  />

          <label className={`${userEdit ? '' : 'hidden'}  flex items-center font-medium  text-black dark:text-white`}>
              Permissões:
          </label>
          <ul className={`${userEdit ? 'flex' : 'hidden'}  mb-5 dark:text-white`}>
          {rolesWithChecked.map((role) => (
            <li key={role.id} className="flex items-center m-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="ml-2"
                  checked={role.checked}
                  ref={rolesRef}
                  onChange={() => handleCheckboxChange(role.id)}
                />
                <span className="ml-2">{role.nome}</span>
              </label>
            </li>
          ))}
        </ul>
            
          <div className='flex ' >
          <input type="submit" 
                  value={ userEdit ? "Editar" : "Cadastrar"}
                  className="cursor-pointer w-48 p-2 bg-green-400 hover:bg-green-500 text-white rounded font-medium" />
          <Button 
                      variant="danger" 
                      className="w-32 ml-2 bg-gray-400 hover:bg-gray-500 text-white font-bold py-1 px-2 rounded-md transition"
                      onClick={() => handleCancelChangeUser()}
                    >LIMPAR
          </Button>
          </div>
        </form>

        <section>
          <h1 className='text-black dark:text-white'>Dados da API</h1>

           {/* Campo de pesquisa */}
            <div className="flex justify-end mb-2">
              <input
                type="text"
                placeholder="Pesquisar por nome ou email"
                value={searchTerm}
                onChange={handleSearchChange}
                className="border border-gray-300 rounded-md p-2 text-sm"
              />
            </div>

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
                <th className="px-4 py-2">Nome</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Permissões</th>
                <th className="px-4 py-2 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
              {currentItems.map((item) => (
                <tr 
                  key={item.id} 
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <td className="px-4 py-3">{item.id}</td>
                  <td className="px-4 py-3">{item.nome}</td>
                  <td className="px-4 py-3">{item.email}</td>
                  <td className="px-4 py-3">{item.roles?.join(", ")}</td>
                  
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
                      onClick={() => handleChangeUser(item)}
                    >
                      <FiEdit size={15} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Paginação */}
      <div className="flex justify-center items-center space-x-2 mt-4">
        {/* Seletor de quantidade de itens por página */}
        <div className="">
        <label className="mr-2 text-sm font-normal dark:text-white">Itens por página:</label>
        <select
          value={itemsPerPage}
          onChange={handleItemsPerPageChange}
          className="border border-gray-300 rounded-md p-1 text-sm"
        >
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
        </div>

        <Button
          variant="light"
          className='dark:text-white'
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          {'<'}
        </Button>

        {pageNumbers.map((number) => (
          <Button
            key={number}
            variant={currentPage === number ? 'primary' : 'secondary'}
            onClick={() => paginate(number)}
          >
            <div className='dark:text-white'>{number}</div>
          </Button>
        ))}

        <Button
          variant="light"
          className='dark:text-white'
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === pageNumbers.length}
        >
          {'>'}
        </Button>

         
        </div>
        </section>
      </main>

    </div>
  )
}
