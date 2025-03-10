import { useEffect, useState, useRef, FormEvent} from 'react'
import  api from '../services/api'
import Alert from '../components/Alert'
import { useNavigate } from 'react-router-dom';
import { jwtDecode, JwtPayload } from 'jwt-decode';

interface CustomJwtPayload extends JwtPayload {
  id_usuario: string;
  username?: string;
}

export default function Login() {
  const navigate = useNavigate();
  const emailRef = useRef<HTMLInputElement | null>(null); //cadastrar
  const senhaRef = useRef<HTMLInputElement | null>(null); //cadastrar

  const [userEmail, setUserEmail] = useState<any>('');
  const [userSenha, setUserSenha] = useState<any>('');


  const [alertVisible, setAlertVisible] = useState<boolean>(false);
  const [alertMensage, setAlertMensage] = useState<string>('');
  const [alertType, setAlertType] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState(false);
 
  useEffect(() => {

  }, []);


  //continuar na função update, ja está preenchedo os campos, precisa identificar quando
  //é novo cadastro ou atualização e chamar a api correta.
  async function handleLogin(event: FormEvent){
    setIsSubmitting(true);
    event.preventDefault();

    if(!emailRef.current?.value || !senhaRef.current?.value) {
        setIsSubmitting(false);
        setAlertVisible(true);
        setAlertType('info');
        setAlertMensage(`É necessário preencher todos os campos.`); 
        return
    };
    try{
        const result = await api.post(`/user/login`, {
          email: emailRef.current?.value,
          senha: senhaRef.current?.value
        });
        
        localStorage.setItem("authToken", result.data.token);
        
        const decoded = jwtDecode<CustomJwtPayload>(result.data.token);
        localStorage.setItem("userId", decoded.id_usuario);
        
        const username = emailRef.current?.value.split("@")[0];
        localStorage.setItem("userName", username ?? "");

         //limpar referencia ao cadastrar
        emailRef.current.value = '';
        senhaRef.current.value = '';
        //limpa campos usados no Update
        //setUserEmail('');
        //setUserSenha('')  
        setAlertVisible(true);
        setAlertType('success');
        setAlertMensage(result.data.mensagem);     
        navigate("/")
    } catch (error){

         // Erro
        let errorMessage = "Erro desconhecido. Por favor, tente novamente.";
        if (error.response) {
            errorMessage = error.response.data.mensagem || `Erro do servidor: ${error.response.status}`;
        } else if (error.request) {
            errorMessage = "Não foi possível conectar ao servidor. Verifique sua conexão.";
        } else {
            errorMessage = `${error}`;
        }
        setAlertVisible(true);
        setAlertType('error');
        setAlertMensage(errorMessage);
    } finally {
      setIsSubmitting(false);
    }

  }

  //function handleLogout() {
  //  localStorage.removeItem("authToken");
  //  navigate('/login');
  //}


  const handleCloseAlert = () => {
    setAlertVisible(false);
  };

  return (
     
    <div className="flex min-h-screen bg-gradient-to-br from-gray-200 to-gray-100 flex-col  items-center px-4">
    {alertVisible && (
      <Alert
        message={alertMensage}
        type={alertType}
        onClose={handleCloseAlert}
      />
    )}

  <main className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md mt-40 ">
    <div className="flex justify-center mb-6">
          <img src="/imgs/logo_mini.png" alt="Logo" className="w-16 h-16 object-contain" />
    </div>

  
    <form onSubmit={handleLogin} className="flex flex-col gap-4">
      <label className="font-medium text-gray-600" htmlFor="email">
        E-mail
      </label>
      <input
        id="email"
        type="email"
        placeholder="Digite seu e-mail"
        className="w-full p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
        ref={emailRef}
        value={userEmail}
        onChange={(event) => setUserEmail(event.target.value)}
      />
      <label className="font-medium text-gray-600" htmlFor="password">
        Senha
      </label>
      <input
        id="password"
        type="password"
        placeholder="Digite sua senha"
        className="w-full p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
        ref={senhaRef}
        value={userSenha}
        onChange={(event) => setUserSenha(event.target.value)}
      />
      <button
        type="submit"
        className="w-full py-3 bg-purple-800 text-white font-medium rounded hover:bg-purple-700 transition"
        disabled={isSubmitting}
      >
        { isSubmitting ? 'Enviando':'Entrar' }
      </button>
    </form>
    {/*
    <div className="mt-6 text-center">
      <p className="text-sm text-gray-500">
        Ainda não tem uma conta?{' '}
        <a
          href="#"
          className="text-blue-500 hover:underline font-medium"
        >
          Cadastre-se
        </a>
      </p>
      
    </div>*/}
  </main>
</div>

  )
}
