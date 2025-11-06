#!/usr/bin/env python3
"""
Script CLI para transcrever áudio usando Whisper LOCAL (sem API).
Uso: python3 scripts/transcribe_cli_local.py <caminho_audio> [--output-dir <diretorio>]

Requisitos:
  pip install openai-whisper
  (ou pip install git+https://github.com/openai/whisper.git)
"""
import sys
import os
import argparse
from pathlib import Path
from datetime import datetime

try:
    import whisper
except ImportError:
    print("Erro: Biblioteca 'openai-whisper' não instalada.")
    print("Instale com: pip install openai-whisper")
    print("Ou: pip install git+https://github.com/openai/whisper.git")
    sys.exit(1)


class WhisperLocal:
    def __init__(self, model_size: str = "base"):
        """
        Inicializa o Whisper local.
        
        Modelos disponíveis (ordenados por tamanho e qualidade):
        - tiny: 39M parâmetros (mais rápido, menos preciso)
        - base: 74M parâmetros (balanceado)
        - small: 244M parâmetros (melhor qualidade)
        - medium: 769M parâmetros (muito bom)
        - large: 1550M parâmetros (melhor qualidade, mais lento)
        """
        self.model_size = model_size
        print(f"Carregando modelo Whisper '{model_size}'...")
        print("(Primeira execução pode demorar para baixar o modelo)")
        try:
            self.model = whisper.load_model(model_size)
            print(f"✓ Modelo '{model_size}' carregado com sucesso!")
        except Exception as e:
            raise Exception(f"Erro ao carregar modelo Whisper: {str(e)}")
    
    def transcribe_file(self, audio_file_path: str, language: str = "pt") -> str:
        """
        Transcreve um arquivo de áudio usando Whisper local.
        """
        if not os.path.exists(audio_file_path):
            raise FileNotFoundError(f"Arquivo de áudio não encontrado: {audio_file_path}")
        
        try:
            print(f"Transcrevendo arquivo: {audio_file_path}")
            result = self.model.transcribe(
                audio_file_path,
                language=language,
                task="transcribe"
            )
            return result["text"].strip()
        except Exception as e:
            raise Exception(f"Erro ao transcrever áudio: {str(e)}")


def get_output_filename(input_path: str, output_dir: str) -> str:
    input_name = Path(input_path).stem
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_filename = f"{input_name}_transcription_{timestamp}.txt"
    return os.path.join(output_dir, output_filename)


def transcribe_audio(
    audio_path: str, 
    output_dir: str = "transcriptions", 
    language: str = "pt",
    model_size: str = "base"
):
    try:
        whisper_local = WhisperLocal(model_size=model_size)
        
        transcription = whisper_local.transcribe_file(audio_path, language=language)
        
        os.makedirs(output_dir, exist_ok=True)
        output_path = get_output_filename(audio_path, output_dir)
        
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(transcription)
        
        print(f"\n✓ Transcrição concluída!")
        print(f"✓ Arquivo salvo em: {output_path}")
        print(f"\n--- Transcrição ---")
        print(transcription)
        print(f"\n--- Fim da Transcrição ---")
        
        return output_path
        
    except FileNotFoundError as e:
        print(f" {e}")
        sys.exit(1)
    except Exception as e:
        print(f" Erro ao transcrever: {e}")
        sys.exit(1)


def main():
    parser = argparse.ArgumentParser(
        description="Transcreve arquivo de áudio usando Whisper LOCAL (sem API)",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Exemplos:
  python3 scripts/transcribe_cli_local.py audio.mp3
  python3 scripts/transcribe_cli_local.py audio.mp3 --output-dir ./resultados
  python3 scripts/transcribe_cli_local.py audio.mp3 --model small
  python3 scripts/transcribe_cli_local.py /caminho/completo/audio.wav --model large

Modelos disponíveis (--model):
  tiny   - 39M  (mais rápido, menos preciso)
  base   - 74M  (balanceado, padrão)
  small  - 244M (melhor qualidade)
  medium - 769M (muito bom)
  large  - 1550M (melhor qualidade, mais lento)
        """
    )
    
    parser.add_argument(
        "audio_path",
        type=str,
        help="Caminho do arquivo de áudio a ser transcrito"
    )
    
    parser.add_argument(
        "--output-dir",
        type=str,
        default="transcriptions",
        help="Diretório onde salvar a transcrição (padrão: transcriptions)"
    )
    
    parser.add_argument(
        "--language",
        type=str,
        default="pt",
        help="Código do idioma (padrão: pt)"
    )
    
    parser.add_argument(
        "--model",
        type=str,
        default="base",
        choices=["tiny", "base", "small", "medium", "large"],
        help="Tamanho do modelo Whisper (padrão: base)"
    )
    
    args = parser.parse_args()
    
    if not os.path.exists(args.audio_path):
        print(f" Arquivo não encontrado: {args.audio_path}")
        sys.exit(1)
    
    if not os.path.isfile(args.audio_path):
        print(f" Caminho não é um arquivo: {args.audio_path}")
        sys.exit(1)
    
    transcribe_audio(args.audio_path, args.output_dir, args.language, args.model)


if __name__ == "__main__":
    main()

