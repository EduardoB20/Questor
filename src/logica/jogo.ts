import { Pergunta, valorPorAcerto } from '../dados/perguntas';

export function calcularSaldo(perguntas: Pergunta[]) {
  let saldo = 0;

  for (const pergunta of perguntas) {
    if (pergunta.concluida && pergunta.resposta === pergunta.correta) {
      saldo += valorPorAcerto;
    }
  }

  return saldo;
}

export function contarConcluidas(perguntas: Pergunta[]) {
  return perguntas.filter((item) => item.concluida).length;
}

export function responderPergunta(perguntas: Pergunta[], id: number, resposta: number) {
  return perguntas.map((item) => {
    if (item.id === id && !item.concluida && resposta >= 0 && resposta < item.alternativas.length) {
      return { ...item, concluida: true, resposta };
    }

    return item;
  });
}

export function mudarConclusao(perguntas: Pergunta[], id: number) {
  return perguntas.map((item) => {
    if (item.id === id) {
      return { ...item, concluida: !item.concluida, resposta: null };
    }

    return item;
  });
}

export function excluirPergunta(perguntas: Pergunta[], id: number) {
  return perguntas.filter((item) => item.id !== id);
}

export function reiniciarPerguntas(perguntas: Pergunta[]) {
  return perguntas.map((item) => ({ ...item, concluida: false, resposta: null }));
}

export function salvarPergunta(
  perguntas: Pergunta[],
  id: number | null,
  texto: string,
  alternativas: string[],
  correta: number
) {
  if (id !== null) {
    return perguntas.map((item) => {
      if (item.id === id) {
        return { ...item, texto, alternativas, correta, concluida: false, resposta: null };
      }
      return item;
    });
  }

  const proximoId = Math.max(0, ...perguntas.map((item) => item.id)) + 1;
  const novaPergunta: Pergunta = {
    id: proximoId,
    texto,
    alternativas,
    correta,
    concluida: false,
    resposta: null,
  };

  return [...perguntas, novaPergunta];
}
