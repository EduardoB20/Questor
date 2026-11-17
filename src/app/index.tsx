import { useEffect, useRef, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { cores } from '../estilos/cores';
import { useQuestio } from '../contexto/QuestioContexto';
import VideoFinal from '../componentes/VideoFinal';

const letras = ['A', 'B', 'C', 'D', 'E'];

export default function HomeScreen() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const horizontal = width > height;
  const { perguntas, saldo, pendentes, responder, reiniciar } = useQuestio();
  const [perguntaMostrada, setPerguntaMostrada] = useState<number | null>(null);
  const [selecionada, setSelecionada] = useState<number | null>(null);
  const [confirmando, setConfirmando] = useState(false);
  const tempo = useRef<ReturnType<typeof setTimeout> | null>(null);

  const proximaPergunta = perguntas.find((item) => !item.concluida);
  const pergunta = perguntas.find((item) => item.id === perguntaMostrada) || proximaPergunta;
  const terminou = perguntas.length > 0 && pendentes === 0 && perguntaMostrada === null;

  useEffect(() => {
    return () => {
      if (tempo.current) clearTimeout(tempo.current);
    };
  }, []);

  function escolherResposta(resposta: number) {
    if (!pergunta || confirmando || pergunta.concluida) return;
    setSelecionada(resposta);
  }

  function confirmarResposta() {
    if (!pergunta || selecionada === null || confirmando || pergunta.concluida) return;

    setPerguntaMostrada(pergunta.id);
    setConfirmando(true);
    responder(pergunta.id, selecionada);

    tempo.current = setTimeout(() => {
      setSelecionada(null);
      setConfirmando(false);
      setPerguntaMostrada(null);
      tempo.current = null;
    }, 800);
  }

  function jogarNovamente() {
    setPerguntaMostrada(null);
    setSelecionada(null);
    setConfirmando(false);
    reiniciar();
  }

  const tamanhoTitulo = horizontal ? Math.min(65, width * 0.068) : Math.min(49, width * 0.12);
  const alturaOpcao = horizontal ? 45 : 55;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
      <View style={[styles.saldoArea, { width: Math.min(345, width * 0.5) }]} pointerEvents="none">
        <Text style={styles.saldoTexto}>${saldo}</Text>
      </View>

      <Pressable
        onPress={() => router.push('/gerenciar')}
        style={[styles.gerenciarBotao, !horizontal && { top: 49 }]}
        accessibilityLabel="Gerenciar perguntas"
      >
        <Text style={styles.gerenciarTexto}>GERENCIAR</Text>
      </Pressable>

      {perguntas.length === 0 ? (
        <View style={styles.centro}>
          <Text style={styles.tituloFinal}>SEM PERGUNTAS</Text>
          <Text style={styles.mensagemFinal}>Abra Gerenciar e adicione uma pergunta.</Text>
        </View>
      ) : terminou ? (
        <View style={styles.centro}>
          <Text style={[styles.tituloFinal, { fontSize: tamanhoTitulo }]}>VOCÊ GANHOU</Text>
          <Text style={styles.valorFinal}>${saldo}</Text>
          <VideoFinal />
          <Pressable onPress={jogarNovamente} style={styles.reiniciarBotao}>
            <Text style={styles.reiniciarTexto}>JOGAR NOVAMENTE</Text>
          </Pressable>
        </View>
      ) : pergunta ? (
        <ScrollView
          style={styles.areaJogo}
          contentContainerStyle={[
            styles.conteudoJogo,
            { paddingTop: horizontal ? Math.max(92, height * 0.235) : 118 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <Text
            style={[
              styles.titulo,
              {
                fontSize: tamanhoTitulo,
                lineHeight: tamanhoTitulo * 1.06,
                marginBottom: horizontal ? 56 : 40,
              },
            ]}
          >
            {pergunta.texto}
          </Text>

          <View style={styles.alternativas}>
            {pergunta.alternativas.map((alternativa, indice) => {
              const foiSelecionada = selecionada === indice;
              const correta = confirmando && pergunta.correta === indice;

              return (
                <Pressable
                  key={`${pergunta.id}-${indice}`}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: foiSelecionada, disabled: confirmando }}
                  onPress={() => escolherResposta(indice)}
                  disabled={confirmando}
                  style={[styles.alternativa, { height: alturaOpcao }]}
                >
                  <View style={styles.letraArea}>
                    <Text style={styles.letra}>{letras[indice]}</Text>
                  </View>
                  <Text style={styles.alternativaTexto} numberOfLines={2}>{alternativa}</Text>
                  <View
                    style={[
                      styles.circulo,
                      foiSelecionada && styles.circuloSelecionado,
                      confirmando && foiSelecionada && !correta && styles.circuloErrado,
                      correta && styles.circuloCorreto,
                    ]}
                  />
                </Pressable>
              );
            })}
          </View>

        </ScrollView>
      ) : null}

      {pergunta && !terminou && (
        <Pressable
          onPress={confirmarResposta}
          disabled={selecionada === null || confirmando}
          accessibilityRole="button"
          accessibilityLabel="Confirmar resposta"
          accessibilityState={{ disabled: selecionada === null || confirmando }}
          style={[styles.confirmarBotao, (selecionada === null || confirmando) && styles.confirmarDesativado]}
        >
          <Text style={styles.confirmarTexto}>{confirmando ? 'CONFIRMADO' : 'CONFIRMAR'}</Text>
        </Pressable>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  saldoArea: {
    position: 'absolute',
    top: 0,
    alignSelf: 'center',
    backgroundColor: cores.azul,
    height: 43,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  saldoTexto: {
    fontSize: 27,
    fontFamily: 'Inter_700Bold',
    color: cores.branco,
  },
  gerenciarBotao: {
    position: 'absolute',
    right: 14,
    top: 12,
    zIndex: 3,
    padding: 6,
  },
  gerenciarTexto: {
    fontSize: 17,
    letterSpacing: 1.1,
    color: '#C1C1C5',
    fontFamily: 'BebasNeue_400Regular',
  },
  areaJogo: {
    flex: 1,
  },
  conteudoJogo: {
    paddingBottom: 95,
  },
  titulo: {
    color: cores.branco,
    textAlign: 'center',
    fontFamily: 'BebasNeue_400Regular',
    paddingHorizontal: 14,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  alternativas: {
    gap: 16,
  },
  alternativa: {
    backgroundColor: cores.branco,
    borderWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 0,
  },
  letraArea: {
    backgroundColor: cores.azul,
    width: 63,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  letra: {
    fontSize: 25,
    fontFamily: 'BebasNeue_400Regular',
    color: cores.branco,
  },
  alternativaTexto: {
    flex: 1,
    paddingHorizontal: 18,
    color: cores.preto,
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
  },
  circulo: {
    width: 35,
    height: 35,
    borderWidth: 2.5,
    borderColor: cores.preto,
    borderRadius: 18,
    marginHorizontal: 8,
  },
  circuloSelecionado: {
    backgroundColor: cores.azul,
    borderColor: cores.azul,
  },
  circuloErrado: {
    backgroundColor: cores.vermelho,
    borderColor: cores.vermelho,
  },
  circuloCorreto: {
    backgroundColor: cores.verde,
    borderColor: cores.verde,
  },
  confirmarBotao: {
    position: 'absolute',
    bottom: 18,
    right: 18,
    backgroundColor: cores.azul,
    minWidth: 155,
    minHeight: 45,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 4,
  },
  confirmarDesativado: {
    opacity: 0.48,
  },
  confirmarTexto: {
    color: cores.branco,
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    letterSpacing: 0.8,
  },
  centro: {
    flex: 1,
    padding: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tituloFinal: {
    color: cores.branco,
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 44,
    textAlign: 'center',
  },
  mensagemFinal: {
    color: cores.branco,
    fontFamily: 'Inter_400Regular',
    marginTop: 16,
    textAlign: 'center',
  },
  valorFinal: {
    color: cores.azul,
    fontFamily: 'Inter_700Bold',
    fontSize: 62,
    marginBottom: 12,
  },
  reiniciarBotao: {
    backgroundColor: cores.azul,
    marginTop: 18,
    paddingHorizontal: 30,
    paddingVertical: 13,
  },
  reiniciarTexto: {
    color: cores.branco,
    fontFamily: 'Inter_600SemiBold',
  },
});
