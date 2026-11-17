import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuestio } from '../contexto/QuestioContexto';
import { cores } from '../estilos/cores';

const letras = ['A', 'B', 'C', 'D', 'E'];

export default function Editar() {
  const router = useRouter();
  const parametros = useLocalSearchParams<{ id?: string }>();
  const { perguntas, salvar } = useQuestio();
  const id = parametros.id ? Number(parametros.id) : null;
  const perguntaExistente = perguntas.find((item) => item.id === id);

  const [texto, setTexto] = useState('');
  const [alternativas, setAlternativas] = useState(['', '', '', '', '']);
  const [correta, setCorreta] = useState(0);
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (perguntaExistente) {
      setTexto(perguntaExistente.texto);
      setAlternativas([...perguntaExistente.alternativas]);
      setCorreta(perguntaExistente.correta);
    }
  }, [id]);

  function alterarAlternativa(indice: number, valor: string) {
    setAlternativas((anteriores) =>
      anteriores.map((item, posicao) => (posicao === indice ? valor : item))
    );
  }

  function guardar() {
    if (!texto.trim() || alternativas.some((item) => !item.trim())) {
      setErro('Preencha a pergunta e as cinco alternativas.');
      return;
    }

    if (id !== null && !perguntaExistente) {
      setErro('Essa pergunta foi excluída. Volte para a lista.');
      return;
    }

    setErro('');
    salvar(id, texto.trim(), alternativas.map((item) => item.trim()), correta);
    router.back();
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
          <Pressable onPress={() => router.back()} style={styles.voltar}>
            <Text style={styles.voltarTexto}>VOLTAR</Text>
          </Pressable>
          <Text style={styles.titulo}>{id === null ? 'NOVA PERGUNTA' : 'EDITAR PERGUNTA'}</Text>

          <Text style={styles.rotulo}>ENUNCIADO</Text>
          <TextInput
            value={texto}
            onChangeText={setTexto}
            placeholder="Digite a pergunta"
            placeholderTextColor="#81818A"
            multiline
            style={[styles.input, styles.inputPergunta]}
          />

          <Text style={styles.rotulo}>ALTERNATIVAS</Text>
          {alternativas.map((alternativa, indice) => (
            <View key={indice} style={styles.linha}>
              <Text style={styles.letra}>{letras[indice]}</Text>
              <TextInput
                value={alternativa}
                onChangeText={(valor) => alterarAlternativa(indice, valor)}
                placeholder={`Alternativa ${letras[indice]}`}
                placeholderTextColor="#81818A"
                style={[styles.input, styles.inputAlternativa]}
              />
              <Pressable
                onPress={() => setCorreta(indice)}
                accessibilityLabel={`Alternativa ${letras[indice]} é a correta`}
                style={[styles.circulo, correta === indice && styles.circuloMarcado]}
              />
            </View>
          ))}
          <Text style={styles.dica}>Selecione o círculo da alternativa correta.</Text>

          {erro !== '' && <Text style={styles.erro}>{erro}</Text>}
          <Pressable onPress={guardar} style={styles.salvarBotao}>
            <Text style={styles.salvarTexto}>SALVAR PERGUNTA</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { padding: 20, paddingBottom: 48, maxWidth: 680, width: '100%', alignSelf: 'center' },
  voltar: { alignSelf: 'flex-start', paddingVertical: 7, marginBottom: 20 },
  voltarTexto: { color: cores.cinza, fontSize: 17, fontFamily: 'Rajdhani_500Medium', letterSpacing: 0.5 },
  titulo: { color: cores.branco, fontSize: 40, fontFamily: 'Rajdhani_600SemiBold', letterSpacing: 0.5, marginBottom: 22 },
  rotulo: { color: cores.branco, fontSize: 18, fontFamily: 'Rajdhani_600SemiBold', letterSpacing: 0.5, marginBottom: 9 },
  input: { fontFamily: 'Inter_400Regular', backgroundColor: cores.branco, color: cores.preto, fontSize: 15, padding: 13 },
  inputPergunta: { minHeight: 74, textAlignVertical: 'top', marginBottom: 20 },
  linha: { flexDirection: 'row', alignItems: 'center', marginBottom: 9, gap: 9 },
  letra: { color: cores.branco, fontSize: 18, fontFamily: 'Inter_700Bold', width: 21 },
  inputAlternativa: { flex: 1, minHeight: 46 },
  circulo: { width: 29, height: 29, borderRadius: 15, borderColor: cores.branco, borderWidth: 2 },
  circuloMarcado: { backgroundColor: cores.azul, borderColor: cores.azul },
  dica: { fontFamily: 'Inter_400Regular', color: cores.cinza, fontSize: 12, marginTop: 5 },
  erro: { color: '#FF909A', marginTop: 17, fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  salvarBotao: { marginTop: 24, backgroundColor: cores.azul, padding: 15, alignItems: 'center' },
  salvarTexto: { color: cores.branco, fontFamily: 'Inter_700Bold', fontSize: 14 },
});
