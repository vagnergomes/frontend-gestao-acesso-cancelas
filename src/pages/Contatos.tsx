import { useState } from "react";

import Navbar from "../components/Menu/Navbar";

const contacts = [
  { nome: "João Silva", telefone: "(11) 1234-5678", celular: "(11) 91234-5678", descricao: "Amigo de trabalho", cidade: "São Paulo" },
  { nome: "Maria Oliveira", telefone: "(21) 8765-4321", celular: "(21) 99876-5432", descricao: "Prima", cidade: "Rio de Janeiro" },
  { nome: "Carlos Souza", telefone: "(31) 4002-8922", celular: "(31) 94002-8922", descricao: "Cliente importante", cidade: "Belo Horizonte" },
  { nome: "Ana Costa", telefone: "(11) 2345-6789", celular: "(11) 98765-4321", descricao: "Amiga de infância", cidade: "São Paulo" },
  { nome: "Ricardo Pereira", telefone: "(21) 2345-6789", celular: "(21) 98765-4321", descricao: "Colega de faculdade", cidade: "Rio de Janeiro" },
  { nome: "Patricia Lima", telefone: "(31) 2345-6789", celular: "(31) 98765-4321", descricao: "Consultora", cidade: "Belo Horizonte" },
  { nome: "Lucas Almeida", telefone: "(11) 3456-7890", celular: "(11) 97654-3210", descricao: "Amigo de trabalho", cidade: "São Paulo" },
  { nome: "Fernanda Rocha", telefone: "(21) 3456-7890", celular: "(21) 97654-3210", descricao: "Cliente", cidade: "Rio de Janeiro" },
  { nome: "Roberto Silva", telefone: "(31) 3456-7890", celular: "(31) 97654-3210", descricao: "Amigo de trabalho", cidade: "Belo Horizonte" },
];

type Contact = typeof contacts[0];
type ContactKeys = keyof Contact;


export default function ContactList() {
  const [search, setSearch] = useState("");
  const [visibleFields, setVisibleFields] = useState<Record<ContactKeys, boolean>>({
    nome: true,
    telefone: true,
    celular: true,
    descricao: true,
    cidade: true,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sidebarVisivel, setSidebarVisivel] = useState(true);

  // Filtra os contatos pela pesquisa
  const filteredContacts = contacts.filter(contact =>
    Object.values(contact).some(value => value.toLowerCase().includes(search.toLowerCase()))
  );

  // Paginação
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentContacts = filteredContacts.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);

  const toggleField = (field: ContactKeys) => {
    setVisibleFields(prevFields => ({ ...prevFields, [field]: !prevFields[field] }));
  };

  const handlePagination = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };


  return (
    <div className="Flex  min-h-screen bg-slate-100 dark:bg-slate-900 flex justify-around px-4">
      <nav className="absolute z-20 w-full ">
        <Navbar sidebarVisivel={ sidebarVisivel } setSidebarVisivel={ setSidebarVisivel }/>
      </nav>  
      <main className="mt-16 w-full bg-white dark:bg-slate-800 shadow-lg rounded-lg">
        <div className="p-6 max-w-4xl mx-auto">
          <h1 className="text-3xl font-semibold text-center text-gray-800 dark:text-white mb-6">Lista de Contatos</h1>
          <input
            type="text"
            placeholder="Pesquisar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-6 p-3 border border-gray-300 rounded-lg w-full text-lg focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex flex-wrap gap-4 mb-6">
            {(Object.keys(visibleFields) as ContactKeys[]).map((field) => (
              <label key={field} className="flex items-center gap-2 text-lg text-gray-700 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={visibleFields[field]}
                  onChange={() => toggleField(field)}
                  className="w-5 h-5 dark:bg-gray-50"
                />
                <span>{field.toUpperCase()}</span>
              </label>
            ))}
          </div>

          

          <div className="overflow-x-auto rounded-lg shadow-lg">
            <table className="w-full border-collapse table-auto dark:text-gray-200 ">
              <thead>
                <tr className="bg-gray-200 dark:bg-gray-900 text-gray-700 dark:text-white">
                  {(Object.keys(visibleFields) as ContactKeys[]).map(
                    (field) => visibleFields[field] && <th key={field} className="border-b px-4 py-2 text-left">{field.toUpperCase()}</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {currentContacts.map((contact, index) => (
                  <tr key={index} className={`border-b ${index % 2 === 0 ? "bg-gray-50 dark:bg-gray-700" : "bg-white dark:bg-gray-500"}`}>
                    {(Object.keys(visibleFields) as ContactKeys[]).map(
                      (field) => visibleFields[field] && <td key={field} className="px-4 py-2">{contact[field]}</td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginação */}
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={() => handlePagination(currentPage - 1)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              disabled={currentPage === 1}
            >
              Anterior
            </button>
            {/* Seletor de itens por página */}
            <span className="text-lg text-gray-700 dark:text-gray-300">
              Página {currentPage} de {totalPages}
              
          
            <span className="text-lg text-gray-700 "> </span>
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="p-2 border border-gray-300 rounded-lg dark:text-black"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          
            </span>
            <button
              onClick={() => handlePagination(currentPage + 1)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              disabled={currentPage === totalPages}
            >
              Próxima
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
