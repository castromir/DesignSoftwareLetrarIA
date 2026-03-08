import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function LoginPage() {
  const { login, isLoading: authLoading, error: authError } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { role } = await login(email, password);
      if (role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/professional', { replace: true });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao fazer login';
      setError(message || authError || 'Credenciais inválidas. Verifique seu email e senha.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen flex flex-col lg:flex-row relative" role="main">
      {/* Lado esquerdo - gradiente */}
      <div className="hidden lg:flex lg:w-[775.5px] relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800">
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

      {/* Lado direito - Formulário */}
      <div className="flex-1 flex items-center justify-center bg-[#fdfdfd] p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-[448px]">
          <div className="bg-white rounded-[14px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] p-4 sm:p-6">
            {/* Header */}
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
                    d="M5 8.33333C5 6.49238 6.49238 5 8.33333 5H20V35H8.33333C6.49238 35 5 33.5076 5 31.6667V8.33333Z"
                    stroke="#155DFC"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3.33333"
                  />
                  <path
                    d="M35 8.33333C35 6.49238 33.5076 5 31.6667 5H20V35H31.6667C33.5076 35 35 33.5076 35 31.6667V8.33333Z"
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
                      d="M8 1.33333L9.66667 6H14.6667L10.6667 8.66667L12.3333 13.3333L8 10.6667L3.66667 13.3333L5.33333 8.66667L1.33333 6H6.33333L8 1.33333Z"
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
                  </g>
                  <defs>
                    <clipPath id="clip0_10_134">
                      <rect fill="white" height="16" width="16" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
              <h1 className="absolute top-[78px] left-1/2 -translate-x-1/2 text-[24px] sm:text-[30px] leading-[30px] sm:leading-[36px] text-center whitespace-nowrap">
                Letrar IA
              </h1>
              <p className="absolute top-[141px] left-1/2 -translate-x-1/2 text-[14px] sm:text-[16px] leading-5 sm:leading-6 text-[#717182] text-center px-4 max-w-full whitespace-nowrap">
                Sua plataforma inteligente de alfabetização
              </p>
            </div>

            {/* Formulário */}
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3" role="alert">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              {/* Email */}
              <div className="space-y-2">
                <label className="text-[14px] leading-[14px] text-neutral-950" htmlFor="email">
                  Email
                </label>
                <div className="relative">
                  <svg className="absolute left-[11px] top-[10px] w-5 h-5 pointer-events-none" fill="none" viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M10 10a3 3 0 100-6 3 3 0 000 6z" stroke="#99A1AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M3.465 16.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 20c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" stroke="#99A1AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    className="w-full h-9 bg-[#f3f3f5] rounded-lg pl-10 pr-3 py-1 text-[14px] text-neutral-950 placeholder:text-[#717182] border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus-visible:ring-2"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    aria-label="Endereço de email"
                  />
                </div>
              </div>

              {/* Senha */}
              <div className="space-y-2">
                <label className="text-[14px] leading-[14px] text-neutral-950" htmlFor="password">
                  Senha
                </label>
                <div className="relative">
                  <svg className="absolute left-[12.75px] top-[10px] w-4 h-4 pointer-events-none" fill="none" viewBox="0 0 16 16" aria-hidden="true">
                    <path
                      d="M3.33333 7.33333H12.6667V13.3333C12.6667 13.687 12.5262 14.0261 12.2761 14.2761C12.0261 14.5262 11.687 14.6667 11.3333 14.6667H4.66667C4.31304 14.6667 3.97391 14.5262 3.7239 14.2761C3.47381 14.0261 3.33333 13.687 3.33333 13.3333V7.33333Z"
                      stroke="#99A1AF"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.33333"
                    />
                    <path
                      d="M5.33333 7.33333V4.66667C5.33333 3.95942 5.61428 3.28115 6.11438 2.78105C6.61448 2.28095 7.29275 2 8 2C8.70724 2 9.38552 2.28095 9.88562 2.78105C10.3857 3.28115 10.6667 3.95942 10.6667 4.66667V7.33333"
                      stroke="#99A1AF"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.33333"
                    />
                  </svg>
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="w-full h-9 bg-[#f3f3f5] rounded-lg pl-10 pr-3 py-1 text-[14px] text-neutral-950 placeholder:text-[#717182] border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus-visible:ring-2"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    aria-label="Senha"
                  />
                </div>
              </div>

              {/* Lembrar-me */}
              <div className="flex items-center justify-between px-2.5 h-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    id="remember"
                    className="w-4 h-4 rounded border-[0.5px] border-black focus:ring-2 focus:ring-blue-500 focus-visible:ring-2"
                    aria-label="Lembrar de mim"
                  />
                  <span className="text-[16px] leading-6 text-[#4a5565]">Lembrar de mim</span>
                </label>
                <a href="#" className="text-[14px] leading-5 text-[#155dfc] focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1" aria-label="Esqueceu a senha">
                  Esqueceu a senha?
                </a>
              </div>

              {/* Botão */}
              <button
                type="submit"
                disabled={isLoading || authLoading}
                className="w-full h-[42px] bg-[#030213] text-white rounded-lg text-[14px] leading-5 hover:bg-[#030213]/90 transition-colors disabled:opacity-50 text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus-visible:ring-2"
                aria-label={isLoading || authLoading ? "Entrando..." : "Fazer login"}
              >
                {(isLoading || authLoading) ? 'Entrando...' : 'Entrar'}
              </button>
            </form>
          </div>

          <p className="text-center text-[12px] sm:text-[14px] leading-4 sm:leading-5 text-[#6a7282] mt-6 sm:mt-8">
            © 2025 Letrar IA. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}
