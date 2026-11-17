export type Pergunta = {
  id: number;
  texto: string;
  alternativas: string[];
  correta: number;
  concluida: boolean;
  resposta: number | null;
};

export const valorPorAcerto = 100;

export const perguntasIniciais: Pergunta[] = [
  {
    id: 1,
    texto: 'QUAL LINGUAGEM É USADA PARA ESTILIZAR UM SITE?',
    alternativas: ['HTML', 'CSS', 'PYTHON', 'SQL', 'JAVA'],
    correta: 1,
    concluida: false,
    resposta: null,
  },
  {
    id: 2,
    texto: 'QUAL TAG CRIA UM PARÁGRAFO NO HTML?',
    alternativas: ['<div>', '<h1>', '<p>', '<img>', '<body>'],
    correta: 2,
    concluida: false,
    resposta: null,
  },
  {
    id: 3,
    texto: 'QUAL FUNÇÃO ESCREVE NO CONSOLE DO JAVASCRIPT?',
    alternativas: ['print()', 'echo()', 'alert()', 'console.log()', 'input()'],
    correta: 3,
    concluida: false,
    resposta: null,
  },
  {
    id: 4,
    texto: 'QUAL HOOK GUARDA INFORMAÇÕES NO REACT?',
    alternativas: ['useState', 'useImage', 'useScreen', 'useText', 'useColor'],
    correta: 0,
    concluida: false,
    resposta: null,
  },
  {
    id: 5,
    texto: 'QUAL COMPONENTE MOSTRA TEXTO NO REACT NATIVE?',
    alternativas: ['View', 'Image', 'Button', 'ScrollView', 'Text'],
    correta: 4,
    concluida: false,
    resposta: null,
  },
];
