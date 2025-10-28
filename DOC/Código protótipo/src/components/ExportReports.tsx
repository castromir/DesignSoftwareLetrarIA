import { useState } from 'react';
import { ChevronLeft, Download, Mail, Calendar } from 'lucide-react';
import svgPaths from '../imports/svg-ud1jof4hiy';

interface Student {
  id: number;
  name: string;
  age: number;
}

interface ExportReportsProps {
  student: Student;
  onBack: () => void;
}

function StudentAvatar() {
  return (
    <div className="relative w-[39px] h-[39px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 81 81">
        <g>
          <path d={svgPaths.p24b65b80} stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
          <path d={svgPaths.pa0f6400} stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
          <path d={svgPaths.p35ddc000} stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
        </g>
      </svg>
    </div>
  );
}

export default function ExportReports({ student, onBack }: ExportReportsProps) {
  const [reportType, setReportType] = useState<'general' | 'individual'>('general');
  const [format, setFormat] = useState<'pdf' | 'csv'>('pdf');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleExport = (method: 'email' | 'download') => {
    console.log('Exporting report:', {
      student: student.name,
      reportType,
      format,
      startDate,
      endDate,
      method,
    });
    // Aqui você implementaria a lógica real de exportação
  };

  return (
    <div className="bg-[#f0f0f0] min-h-screen">
      {/* Header */}
      <div className="bg-[#f0f0f0] sticky top-0 z-10">
        <div className="relative px-4 py-3 flex items-center">
          <button
            onClick={onBack}
            className="p-3 hover:bg-black/5 rounded-lg transition-colors -ml-3"
          >
            <ChevronLeft className="h-6 w-6 text-black" />
          </button>
          <h1 className="flex-1 text-center text-[19px] font-semibold text-black pr-12">
            Exportar relatórios
          </h1>
        </div>
        <div className="h-px bg-black/30" />
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Student Selection */}
        <div>
          <h2 className="text-[20px] font-semibold text-black mb-4">
            Selecione o aluno:
          </h2>
          <div className="bg-white rounded-[10px] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.25)] p-4 flex items-center gap-3">
            <StudentAvatar />
            <p className="text-[16px] font-semibold text-black">{student.name}</p>
          </div>
        </div>

        {/* Report Type */}
        <div>
          <h2 className="text-[20px] font-semibold text-black mb-4">
            Tipo de relatório
          </h2>
          <div className="space-y-3">
            <button
              onClick={() => setReportType('general')}
              className="w-full bg-white rounded-[22px] border border-[#c7c7c7] h-[63px] px-5 flex items-center gap-3 hover:bg-gray-50 transition-colors"
            >
              <div className="w-[23px] h-[23px] rounded-full border-2 border-[#418DF0] flex items-center justify-center flex-shrink-0">
                {reportType === 'general' && (
                  <div className="w-[11px] h-[11px] rounded-full bg-[#0672FF]" />
                )}
              </div>
              <span className="text-[15px] font-medium text-black">
                Progresso geral do aluno
              </span>
            </button>
            <button
              onClick={() => setReportType('individual')}
              className="w-full bg-white rounded-[22px] border border-[#c7c7c7] h-[63px] px-5 flex items-center gap-3 hover:bg-gray-50 transition-colors"
            >
              <div className="w-[23px] h-[23px] rounded-full border-2 border-[#418DF0] flex items-center justify-center flex-shrink-0">
                {reportType === 'individual' && (
                  <div className="w-[11px] h-[11px] rounded-full bg-[#0672FF]" />
                )}
              </div>
              <span className="text-[15px] font-medium text-black">
                Métricas de gravações individuais
              </span>
            </button>
          </div>
        </div>

        {/* Period */}
        <div>
          <h2 className="text-[20px] font-semibold text-black mb-2">Período</h2>
          
          {/* Start Date */}
          <div className="mb-4">
            <label className="block text-[13px] font-semibold text-[#3f3f3f] mb-2">
              Data de início
            </label>
            <div className="relative">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full h-[55px] px-4 pr-12 bg-white border border-[#c7c7c7] rounded-[22px] text-[14px] font-semibold text-black focus:outline-none focus:border-[#418DF0] transition-colors"
                placeholder="DD/MM/AAAA"
              />
              <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 h-[31px] w-[33px] text-[#979797] pointer-events-none" />
            </div>
          </div>

          {/* End Date */}
          <div>
            <label className="block text-[13px] font-semibold text-[#3f3f3f] mb-2">
              Data de término
            </label>
            <div className="relative">
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full h-[55px] px-4 pr-12 bg-white border border-[#c7c7c7] rounded-[22px] text-[14px] font-semibold text-black focus:outline-none focus:border-[#418DF0] transition-colors"
                placeholder="DD/MM/AAAA"
              />
              <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 h-[31px] w-[33px] text-[#979797] pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Format */}
        <div>
          <h2 className="text-[20px] font-semibold text-black mb-4">Formato</h2>
          <div className="space-y-3">
            <button
              onClick={() => setFormat('pdf')}
              className="w-full bg-white rounded-[22px] border border-[#c7c7c7] h-[56px] px-5 flex items-center gap-3 hover:bg-gray-50 transition-colors"
            >
              <div className="w-[23px] h-[23px] rounded-full border-2 border-[#0672FF] flex items-center justify-center flex-shrink-0">
                {format === 'pdf' && (
                  <div className="w-[11px] h-[11px] rounded-full bg-[#0672FF]" />
                )}
              </div>
              <span className="text-[15px] font-medium text-black">PDF</span>
            </button>
            <button
              onClick={() => setFormat('csv')}
              className="w-full bg-white rounded-[22px] border border-[#c7c7c7] h-[56px] px-5 flex items-center gap-3 hover:bg-gray-50 transition-colors"
            >
              <div className="w-[23px] h-[23px] rounded-full border-2 border-[#0672FF] flex items-center justify-center flex-shrink-0">
                {format === 'csv' && (
                  <div className="w-[11px] h-[11px] rounded-full bg-[#0672FF]" />
                )}
              </div>
              <span className="text-[15px] font-medium text-black">CSV</span>
            </button>
          </div>
        </div>

        {/* Share */}
        <div>
          <h2 className="text-[20px] font-semibold text-black mb-4">Compartilhar</h2>
          <div className="flex gap-3">
            <button
              onClick={() => handleExport('email')}
              className="flex-1 bg-white border border-[#c2c2c2] rounded-[15px] h-[74px] flex flex-col items-center justify-center gap-1 hover:bg-gray-50 transition-colors"
            >
              <Mail className="h-[28px] w-[29px] text-[#1D8FD7]" />
              <span className="text-[15px] font-semibold text-black">
                Enviar por e-mail
              </span>
            </button>
            <button
              onClick={() => handleExport('download')}
              className="flex-1 bg-white border border-[#c2c2c2] rounded-[15px] h-[74px] flex flex-col items-center justify-center gap-1 hover:bg-gray-50 transition-colors"
            >
              <Download className="h-[30px] w-[31px] text-[#1D8FD7]" />
              <span className="text-[15px] font-semibold text-black">
                Fazer download
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
