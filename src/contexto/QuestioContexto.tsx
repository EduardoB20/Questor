import { createContext, ReactNode, useContext, useState } from 'react';
import { Pergunta, perguntasIniciais } from '../dados/perguntas';
import {
  calcularSaldo,
  contarConcluidas,
  excluirPergunta,
  mudarConclusao,
  reiniciarPerguntas,
  responderPergunta,
  salvarPergunta,
} from '../logica/jogo';

type QuestioContextoTipo = {
  perguntas: Pergunta[];
  saldo: number;
  concluidas: number;
  pendentes: number;
  responder: (id: number, resposta: number) => void;
  concluir: (id: number) => void;
  excluir: (id: number) => void;
  salvar: (id: number | null, texto: string, alternativas: string[], correta: number) => void;
  reiniciar: () => void;
};

const QuestioContexto = createContext<QuestioContextoTipo | null>(null);

export function QuestioProvider({ children }: { children: ReactNode }) {
  const [perguntas, setPerguntas] = useState<Pergunta[]>(perguntasIniciais);

  function responder(id: number, resposta: number) {
    setPerguntas((anteriores) => responderPergunta(anteriores, id, resposta));
  }

  function concluir(id: number) {
    setPerguntas((anteriores) => mudarConclusao(anteriores, id));
  }

  function excluir(id: number) {
    setPerguntas((anteriores) => excluirPergunta(anteriores, id));
  }

  function salvar(id: number | null, texto: string, alternativas: string[], correta: number) {
    setPerguntas((anteriores) => salvarPergunta(anteriores, id, texto, alternativas, correta));
  }

  function reiniciar() {
    setPerguntas((anteriores) => reiniciarPerguntas(anteriores));
  }

  const concluidas = contarConcluidas(perguntas);

  return (
    <QuestioContexto.Provider
      value={{
        perguntas,
        saldo: calcularSaldo(perguntas),
        concluidas,
        pendentes: perguntas.length - concluidas,
        responder,
        concluir,
        excluir,
        salvar,
        reiniciar,
      }}
    >
      {children}
    </QuestioContexto.Provider>
  );
}

export function useQuestio() {
  const contexto = useContext(QuestioContexto);

  if (!contexto) {
    throw new Error('O contexto do Questio não foi encontrado.');
  }

  return contexto;
}
