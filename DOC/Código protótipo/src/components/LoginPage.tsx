import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { getAuthData } from '../services/api';
import svgPaths from '../imports/svg-luvo32n1y5';
import imgAccountMale from 'figma:asset/6fc471d91da85fe4fda398eb3bf23ec06bafe9a5.png';
import imgImageWithFallback from 'figma:asset/188c677e9a5f499b73df2e014e7a30d6c55091cb.png';

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
      await login(email, password);
      const { user } = getAuthData();
      if (user && user.role === 'admin') {
        navigate('/admin', { replace: true });
      } else if (user && user.role === 'professional') {
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
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3" role="alert">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              {/* Campo Email */}
              <div className="space-y-2">
                <label className="text-[14px] leading-[14px] text-neutral-950" htmlFor="email">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute left-[11px] top-[8px] w-5 h-5 pointer-events-none" aria-hidden="true">
                    <img src={imgAccountMale} alt="" className="w-full h-full object-contain" />
                  </div>
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

              {/* Campo Senha */}
              <div className="space-y-2">
                <label className="text-[14px] leading-[14px] text-neutral-950" htmlFor="password">
                  Senha
                </label>
                <div className="relative">
                  <svg className="absolute left-[12.75px] top-[10px] w-4 h-4 pointer-events-none" fill="none" viewBox="0 0 16 16" aria-hidden="true">
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

              {/* Lembrar-me e Esqueceu a senha */}
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

              {/* Botão Entrar */}
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

          {/* Footer */}
          <p className="text-center text-[12px] sm:text-[14px] leading-4 sm:leading-5 text-[#6a7282] mt-6 sm:mt-8">
            © 2025 Letrar IA. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}
