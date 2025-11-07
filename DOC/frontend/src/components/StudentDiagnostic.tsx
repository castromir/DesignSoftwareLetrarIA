import { useState } from 'react';
import { ChevronLeft, Sparkles, ChevronDown } from 'lucide-react';
import svgPaths from '../imports/svg-dbdvpe232c';
import DiagnosticResult from './DiagnosticResult';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface Student {
  id: number;
  name: string;
  age: number;
}

interface StudentDiagnosticProps {
  student: Student;
  onBack: () => void;
}

interface DiagnosticQuestion {
  id: number;
  text: string;
  answer: number | null; // 1-5 scale
}

export default function StudentDiagnostic({ student, onBack }: StudentDiagnosticProps) {
  const [showResult, setShowResult] = useState(false);
  const [diagnosticData, setDiagnosticData] = useState<any>(null);
  const [schoolLevel, setSchoolLevel] = useState<string>('');
  const [questions, setQuestions] = useState<DiagnosticQuestion[]>([
    {
      id: 1,
      text: 'O aluno apresenta dificuldade em identificar e pronunciar certos fonemas.',
      answer: null,
    },
    {
      id: 2,
      text: 'O aluno consegue compreender o sentido geral e os detalhes de um texto lido.',
      answer: null,
    },
    {
      id: 3,
      text: 'O aluno demonstra um vocabulário limitado para a sua faixa etária.',
      answer: null,
    },
    {
      id: 4,
      text: 'O aluno consegue manter a atenção e concentração durante a leitura por um período prolongado.',
      answer: null,
    },
    {
      id: 5,
      text: 'O aluno lê de forma fluente, sem muitas pausas ou hesitações.',
      answer: null,
    },
    {
      id: 6,
      text: 'O aluno consegue ler em voz alta com expressividade e entonação adequadas.',
      answer: null,
    },
    {
      id: 7,
      text: 'O aluno consegue resumir o texto lido com suas próprias palavras.',
      answer: null,
    },
  ]);

  const handleAnswerChange = (questionId: number, value: number) => {
    setQuestions(questions.map(q => 
      q.id === questionId ? { ...q, answer: value } : q
    ));
  };

  const handleGenerateResult = () => {
    // Validar se todas as perguntas foram respondidas
    const allAnswered = questions.every(q => q.answer !== null) && schoolLevel !== '';
    
    if (!allAnswered) {
      alert('Por favor, responda todas as perguntas antes de gerar o resultado.');
      return;
    }

    // Preparar dados do diagnóstico
    const data = {
      schoolLevel,
      questions,
      completedAt: new Date(),
    };
    
    setDiagnosticData(data);
    setShowResult(true);
  };

  const scaleLabels = [
    'Discordo\nMuito',
    'Discordo\nPouco',
    'Neutro',
    'Concordo\npouco',
    'Concordo\nmuito',
  ];

  // Show result screen
  if (showResult && diagnosticData) {
    return (
      <DiagnosticResult
        student={student}
        onBack={() => setShowResult(false)}
        diagnosticData={diagnosticData}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f0f0]">
      {/* Header */}
      <header className="bg-gradient-to-br from-[#155dfc] to-[#0056b9] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-3 py-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            >
              <ChevronLeft className="h-6 w-6 text-white" />
            </button>
            <div>
              <h1 className="text-white font-semibold text-[17px] leading-tight">
                Avaliar acompanhamento
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Student Info */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative w-[81px] h-[81px] mb-3">
            <svg className="w-full h-full" fill="none" viewBox="0 0 81 81">
              <path 
                d={svgPaths.p24b65b80} 
                stroke="black" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="3"
                fill="none"
              />
              <path 
                d={svgPaths.pa0f6400} 
                stroke="black" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="3"
                fill="none"
              />
              <path 
                d={svgPaths.p35ddc000} 
                stroke="black" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="3"
                fill="none"
              />
            </svg>
          </div>
          <p className="text-[15px] font-medium text-black mb-1">{student.name}</p>
          <p className="text-[13px] text-black">{student.age} anos</p>
        </div>

        <div className="h-px bg-black/30 mb-6" />

        {/* School Level Question */}
        <div className="mb-6">
          <p className="text-[14px] font-semibold text-black mb-3">
            Qual o grau de escolaridade do aluno?
          </p>
          <Select value={schoolLevel} onValueChange={setSchoolLevel}>
            <SelectTrigger className="w-full h-[52px] bg-white rounded-[10px] shadow-[0px_4px_10px_0px_rgba(0,0,0,0.25)] border-none">
              <SelectValue placeholder="Selecione uma opção" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1ano">1º ano</SelectItem>
              <SelectItem value="2ano">2º ano</SelectItem>
              <SelectItem value="3ano">3º ano</SelectItem>
              <SelectItem value="4ano">4º ano</SelectItem>
              <SelectItem value="5ano">5º ano</SelectItem>
              <SelectItem value="6ano">6º ano</SelectItem>
              <SelectItem value="7ano">7º ano</SelectItem>
              <SelectItem value="8ano">8º ano</SelectItem>
              <SelectItem value="9ano">9º ano</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="h-px bg-black/30 mb-6" />

        {/* Diagnostic Questions */}
        <div className="space-y-8 mb-8">
          {questions.map((question) => (
            <div key={question.id}>
              <p className="text-[14px] font-semibold text-black mb-4">
                {question.text}
              </p>

              {/* Scale Labels */}
              <div className="flex justify-between mb-2 px-1">
                {scaleLabels.map((label, index) => (
                  <div 
                    key={index}
                    className="text-[10px] text-black/40 font-semibold text-center leading-tight w-[50px]"
                  >
                    {label.split('\n').map((line, i) => (
                      <div key={i}>{line}</div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Scale Buttons */}
              <div className="flex justify-between items-center">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    onClick={() => handleAnswerChange(question.id, value)}
                    className={`w-[32px] h-[32px] rounded-full transition-colors cursor-pointer ${
                      question.answer === value
                        ? 'bg-[#0056b9]'
                        : 'bg-[#D9D9D9] hover:bg-[#c0c0c0]'
                    }`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Generate Result Button */}
        <button
          onClick={handleGenerateResult}
          className="w-full bg-gradient-to-r from-[#9d02bc] to-[#470156] text-white rounded-[39px] h-[50px] flex items-center justify-center gap-3 hover:opacity-90 transition-opacity cursor-pointer"
        >
          <Sparkles className="h-6 w-6" />
          <span className="text-[14px] font-semibold">Gerar Resultado</span>
        </button>
      </div>
    </div>
  );
}
