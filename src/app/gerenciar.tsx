import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuestio } from '../contexto/QuestioContexto';
import { cores } from '../estilos/cores';

export default function Gerenciar() {
  const router = useRouter();
  const { perguntas, excluir } = useQuestio();
  const [excluindoId, setExcluindoId] = useState<number | null>(null);

  function confirmarExclusao(id: number) {
    excluir(id);
    setExcluindoId(null);
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
        <Pressable onPress={() => router.back()} style={styles.voltar}>
          <Text style={styles.voltarTexto}>VOLTAR AO JOGO</Text>
        </Pressable>

        <Pressable onPress={() => router.push('/editar')} style={styles.adicionar}>
          <Text style={styles.adicionarTexto}>+ ADICIONAR PERGUNTA</Text>
        </Pressable>

        {perguntas.length === 0 && (
          <Text style={styles.vazio}>Nenhuma pergunta cadastrada.</Text>
        )}

        {perguntas.map((item, indice) => (
          <View key={item.id} style={styles.item}>
            <Text style={styles.numero}>PERGUNTA {indice + 1}</Text>
            <Text style={styles.perguntaTexto}>{item.texto}</Text>
            <View style={styles.acoes}>
              <Pressable
                onPress={() => router.push({ pathname: '/editar', params: { id: String(item.id) } })}
                style={styles.acao}
              >
                <Text style={styles.acaoTexto}>EDITAR</Text>
              </Pressable>
              <Pressable onPress={() => setExcluindoId(item.id)} style={styles.acao}>
                <Text style={[styles.acaoTexto, { color: cores.vermelho }]}>EXCLUIR</Text>
              </Pressable>
            </View>
            {excluindoId === item.id && (
              <View style={styles.confirmacao}>
                <Text style={styles.aviso}>Excluir esta pergunta?</Text>
                <Pressable onPress={() => setExcluindoId(null)} style={styles.confirmacaoBotao}>
                  <Text style={styles.confirmacaoTexto}>CANCELAR</Text>
                </Pressable>
                <Pressable onPress={() => confirmarExclusao(item.id)} style={styles.confirmacaoBotao}>
                  <Text style={[styles.confirmacaoTexto, { color: cores.vermelho }]}>CONFIRMAR</Text>
                </Pressable>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { padding: 20, paddingBottom: 40, maxWidth: 750, width: '100%', alignSelf: 'center' },
  voltar: { marginBottom: 20, alignSelf: 'flex-start', paddingVertical: 7 },
  voltarTexto: { color: cores.cinza, fontFamily: 'Rajdhani_500Medium', fontSize: 17, letterSpacing: 0.5 },
  adicionar: { backgroundColor: cores.azul, alignItems: 'center', padding: 14, marginBottom: 12 },
  adicionarTexto: { color: cores.branco, fontFamily: 'Inter_700Bold', fontSize: 14 },
  item: { backgroundColor: cores.branco, padding: 16, marginTop: 12 },
  numero: { color: cores.azul, fontFamily: 'Rajdhani_600SemiBold', fontSize: 17, letterSpacing: 0.4 },
  perguntaTexto: { color: cores.preto, fontFamily: 'Inter_700Bold', fontSize: 16, marginTop: 6 },
  acoes: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 15, gap: 20 },
  acao: { paddingVertical: 8, paddingHorizontal: 3 },
  acaoTexto: { color: cores.azul, fontFamily: 'Inter_700Bold', fontSize: 11 },
  vazio: { fontFamily: 'Inter_400Regular', color: cores.cinza, textAlign: 'center', marginTop: 30 },
  confirmacao: { flexDirection: 'row', alignItems: 'center', gap: 9, marginTop: 10, flexWrap: 'wrap' },
  aviso: { fontSize: 12, fontFamily: 'Inter_600SemiBold', color: cores.preto, marginRight: 6 },
  confirmacaoBotao: { paddingVertical: 7, paddingHorizontal: 3 },
  confirmacaoTexto: { fontSize: 11, fontFamily: 'Inter_700Bold', color: cores.azul },
});
