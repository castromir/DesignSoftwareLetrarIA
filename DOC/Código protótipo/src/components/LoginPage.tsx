import { useState } from 'react';
import svgPaths from '../imports/svg-luvo32n1y5';
import imgAccountMale from 'figma:asset/6fc471d91da85fe4fda398eb3bf23ec06bafe9a5.png';
import imgImageWithFallback from 'figma:asset/188c677e9a5f499b73df2e014e7a30d6c55091cb.png';

interface LoginPageProps {
  onLogin: (user: { email: string; type: 'admin' | 'professional'; name: string }) => void;
}

// Credenciais mockadas para demonstração
const MOCK_CREDENTIALS = {
  admin: {
    username: 'admin',
    password: 'admin123',
    name: 'Administrador',
    type: 'admin' as const,
  },
  professional: {
    username: 'maria.silva',
    password: 'prof123',
    name: 'Maria Silva',
    type: 'professional' as const,
  },
};

export function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simula delay de autenticação
    setTimeout(() => {
      // Verifica credenciais
      if (
        username === MOCK_CREDENTIALS.admin.username &&
        password === MOCK_CREDENTIALS.admin.password
      ) {
        onLogin({
          email: `${MOCK_CREDENTIALS.admin.username}@letraria.com`,
          type: MOCK_CREDENTIALS.admin.type,
          name: MOCK_CREDENTIALS.admin.name,
        });
      } else if (
        username === MOCK_CREDENTIALS.professional.username &&
        password === MOCK_CREDENTIALS.professional.password
      ) {
        onLogin({
          email: `${MOCK_CREDENTIALS.professional.username}@letraria.com`,
          type: MOCK_CREDENTIALS.professional.type,
          name: MOCK_CREDENTIALS.professional.name,
        });
      } else {
        setError('Credenciais inválidas. Verifique seu username e senha.');
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="bg-white min-h-screen flex flex-col lg:flex-row relative">
      {/* Lado esquerdo - Imagem de fundo com gradiente */}
      <div className="hidden lg:flex lg:w-[775.5px] relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800">
        <div className="absolute inset-0 opacity-30">
          <img 
            src={imgImageWithFallback}
            alt="Educação e tecnologia"
            className="w-full h-full object-cover pointer-events-none"
          />
        </div>
        <div className="relative z-10 w-full flex flex-col justify-center items-center text-white px-12 text-center h-full">
          <div className="max-w-md space-y-6">
            <h1 className="text-[48px] leading-[48px]">
              Transforme a alfabetização com IA
            </h1>
            <p className="text-[20px] leading-[28px] text-blue-100">
              Ferramentas inteligentes para acelerar o processo de aprendizagem e tornar a educação mais eficiente e personalizada.
            </p>
          </div>
        </div>
      </div>

      {/* Lado direito - Formulário de autenticação */}
      <div className="flex-1 flex items-center justify-center bg-[#fdfdfd] p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-[448px]">
          {/* Card de Login */}
          <div className="bg-white rounded-[14px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] p-4 sm:p-6">
            {/* Header com ícone */}
            <div className="relative h-[188px] mb-6 sm:mb-8">
              <div className="absolute left-1/2 -translate-x-1/2 top-6 w-10 h-10">
                {/* Ícone do livro */}
                <svg className="w-10 h-10" fill="none" viewBox="0 0 40 40">
                  <path 
                    d="M20 11.6667V35" 
                    stroke="#155DFC" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="3.33333" 
                  />
                  <path 
                    d={svgPaths.p25dbd80}
                    stroke="#155DFC" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="3.33333" 
                  />
                </svg>
                {/* Estrela */}
                <svg className="absolute -top-1 left-7 w-4 h-4" fill="none" viewBox="0 0 16 16">
                  <g clipPath="url(#clip0_10_134)">
                    <path 
                      d={svgPaths.p2b60d00}
                      stroke="#F0B100" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="1.33333" 
                    />
                    <path 
                      d="M13.3333 1.33333V4" 
                      stroke="#F0B100" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="1.33333" 
                    />
                    <path 
                      d="M14.6667 2.66667H12" 
                      stroke="#F0B100" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="1.33333" 
                    />
                    <path 
                      d={svgPaths.p22966600}
                      stroke="#F0B100" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="1.33333" 
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_10_134">
                      <rect fill="white" height="16" width="16" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
              <h1 className="absolute top-[78px] left-1/2 -translate-x-1/2 text-[24px] sm:text-[30px] leading-[30px] sm:leading-[36px] text-center">
                Letrar IA
              </h1>
              <p className="absolute top-[141px] left-1/2 -translate-x-1/2 text-[14px] sm:text-[16px] leading-5 sm:leading-6 text-[#717182] text-center px-4 max-w-full">
                Sua plataforma inteligente de alfabetização
              </p>
            </div>

            {/* Formulário */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              {/* Campo Username */}
              <div className="space-y-2">
                <label className="text-[14px] leading-[14px] text-neutral-950">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute left-[11px] top-[8px] w-5 h-5">
                    <img src={imgAccountMale} alt="" className="w-full h-full object-contain" />
                  </div>
                  <input
                    type="text"
                    placeholder="username"
                    className="w-full h-9 bg-[#f3f3f5] rounded-lg pl-10 pr-3 py-1 text-[14px] text-neutral-950 placeholder:text-[#717182] border-0 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Campo Senha */}
              <div className="space-y-2">
                <label className="text-[14px] leading-[14px] text-neutral-950">
                  Senha
                </label>
                <div className="relative">
                  <svg className="absolute left-[12.75px] top-[10px] w-4 h-4" fill="none" viewBox="0 0 16 16">
                    <path 
                      d={svgPaths.p18f7f580}
                      stroke="#99A1AF" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="1.33333" 
                    />
                    <path 
                      d={svgPaths.p4317f80}
                      stroke="#99A1AF" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="1.33333" 
                    />
                  </svg>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full h-9 bg-[#f3f3f5] rounded-lg pl-10 pr-3 py-1 text-[14px] text-neutral-950 placeholder:text-[#717182] border-0 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Lembrar-me e Esqueceu a senha */}
              <div className="flex items-center justify-between px-2.5 h-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-[0.5px] border-black" 
                  />
                  <span className="text-[16px] leading-6 text-[#4a5565]">Lembrar de mim</span>
                </label>
                <a href="#" className="text-[14px] leading-5 text-[#155dfc]">
                  Esqueceu a senha?
                </a>
              </div>

              {/* Botão Entrar */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-[42px] bg-[#030213] text-white rounded-lg text-[14px] leading-5 hover:bg-[#030213]/90 transition-colors disabled:opacity-50 text-center"
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
              </button>

              {/* Credenciais de teste */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm space-y-2">
                <p className="text-blue-900">
                  <strong>Credenciais para teste:</strong>
                </p>
                <div className="space-y-1 text-blue-700">
                  <p>👤 Admin: admin / admin123</p>
                  <p>👨‍🏫 Professor: maria.silva / prof123</p>
                </div>
              </div>
            </form>
          </div>

          {/* Footer */}
          <p className="text-center text-[12px] sm:text-[14px] leading-4 sm:leading-5 text-[#6a7282] mt-6 sm:mt-8">
            © 2025 Letrar IA. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}
