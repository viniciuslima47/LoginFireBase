import { Ionicons } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signOut, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword 
} from "firebase/auth";
import { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
  TextInput,
  Image,
  Alert
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

// 1. Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC3iEmAtXSYFTO_BtVD_Tk6ARafskIzW18",
  authDomain: "app-teste-2dabd.firebaseapp.com",
  projectId: "app-teste-2dabd",
  storageBucket: "app-teste-2dabd.firebasestorage.app",
  messagingSenderId: "20656501737",
  appId: "1:20656501737:web:692778d2471ecdd644d178",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen 
            name="Login" 
            component={ScreenLogin} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="Cadastrar" 
            component={ScreenCadastrar} 
            options={{ title: 'Criar Conta' }}
          />
          <Stack.Screen
            name="Main"
            component={ScreenMain}
            options={({ navigation }) => ({
              headerTitle: "Painel de Cotações",
              headerRight: () => (
                <TouchableOpacity
                  onPress={() => {
                    signOut(auth).then(() => navigation.replace("Login"));
                  }}
                  style={{ marginRight: 15 }}
                >
                  <Ionicons name="exit-outline" size={24} color="black" />
                </TouchableOpacity>
              ),
            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

function ScreenLogin({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => navigation.replace("Main"))
      .catch((error) => Alert.alert("Erro", "E-mail ou senha inválidos."));
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Image
        style={styles.loginLogo}
        source={{ uri: "https://marketplace.canva.com/A5alg/MAESXCA5alg/1/tl/canva-user-icon-MAESXCA5alg.png" }}
      />
      <View style={styles.container_inputs}>
        <Text style={styles.label}>E-mail</Text>
        <TextInput 
          style={styles.input} 
          value={email} 
          onChangeText={setEmail} 
          autoCapitalize="none" 
          placeholder="exemplo@email.com" 
        />
        <Text style={styles.label}>Senha</Text>
        <TextInput 
          style={styles.input} 
          value={password} 
          onChangeText={setPassword} 
          secureTextEntry 
          placeholder="******" 
        />
      </View>
      <View style={styles.container_btn}>
        <TouchableOpacity style={styles.botao} onPress={handleLogin}>
          <Text style={styles.texto}>Entrar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Cadastrar")}>
          <Text style={{ textAlign: 'center', color: '#2b3066', marginTop: 15 }}>Não tem conta? Cadastre-se</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// 4. Tela de Cadastro
function ScreenCadastrar({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        Alert.alert("Sucesso", "Conta criada!");
        navigation.navigate("Login");
      })
      .catch((error) => Alert.alert("Erro", error.message));
  };

  return (
    <View style={styles.container}>
      <View style={styles.container_inputs}>
        <Text style={styles.label}>E-mail</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} autoCapitalize="none" />
        <Text style={styles.label}>Senha</Text>
        <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />
      </View>
      <View style={styles.container_btn}>
        <TouchableOpacity style={styles.botaosalvar} onPress={handleSignup}>
          <Text style={styles.texto}>Finalizar Cadastro</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// 5. Tela Principal (Cotações)
function ScreenMain() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("https://economia.awesomeapi.com.br/json/all");
      const json = await res.json();
      const moedasInteresse = ['USD', 'EUR', 'LTC'];

      const formatted = Object.keys(json)
        .filter((key) => moedasInteresse.includes(key))
        .map((key) => ({
          id: key,
          name: json[key].name.split("/")[0],
          value: json[key].bid,
        }));

      setData(formatted);
    } catch (err) {
      Alert.alert("Erro", "Falha ao carregar cotações.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.topHeader}>
        <Text style={styles.headerTitle}>
          Conversor de{"\n"}Moedas <Text style={{ color: '#E9AD8C' }}>Pro</Text>
        </Text>
        <View style={styles.statusCard}>
          <Text style={styles.statusTitle}>Cotação Atual</Text>
          <Text style={styles.statusSubtitle}>
            {loading ? "Atualizando..." : "Baseado em dados em tempo real"}
          </Text>
        </View>
      </View>

      <View style={{ flex: 1, width: '100%' }}>
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.itemMoeda}>
              <View>
                <Text style={styles.siglaMoeda}>{item.id} / BRL</Text>
                <Text style={styles.nomeMoeda}>1 {item.name}</Text>
              </View>
              <Text style={styles.valorMoeda}>
                R$ {parseFloat(item.value).toFixed(2)}
              </Text>
            </View>
          )}
          contentContainerStyle={{ paddingTop: 80, paddingBottom: 100 }}
        />
      </View>

      <TouchableOpacity 
        style={[styles.updateButton, { opacity: loading ? 0.7 : 1 }]} 
        onPress={load}
        disabled={loading}
      >
        <Ionicons name="refresh" size={20} color="white" style={{ marginRight: 10 }} />
        <Text style={styles.updateButtonText}>
          {loading ? "Carregando..." : "Atualizar Cotações"}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  loginLogo: { width: 80, height: 80, marginBottom: 30, borderRadius: 40 },
  label: { alignSelf: 'flex-start', color: '#333', fontWeight: 'bold', marginTop: 10 },
  input: {
    backgroundColor: "#f9f9f9",
    width: '100%',
    height: 50,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 10,
  },
  botao: { backgroundColor: "#2b3066", padding: 15, borderRadius: 10, alignItems: "center", width: '100%' },
  botaosalvar: { backgroundColor: "#28a745", padding: 15, borderRadius: 10, alignItems: "center", width: '100%' },
  texto: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  container_btn: { marginTop: 20, width: '100%', maxWidth: 300 },
  container_inputs: { width: '100%', maxWidth: 300 },

  mainContainer: { flex: 1, backgroundColor: '#F2F2F2' },
  topHeader: {
    backgroundColor: "#2b3066",
    height: 180,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    alignItems: 'center',
    paddingTop: 30,
    zIndex: 1,
  },
  headerTitle: { fontSize: 28, color: "#fff", fontWeight: 'bold', textAlign: 'center' },
  statusCard: {
    backgroundColor: "#fff",
    width: "85%",
    padding: 18,
    borderRadius: 20,
    position: 'absolute',
    bottom: -35,
    alignItems: 'center',
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  statusTitle: { fontSize: 18, fontWeight: 'bold', color: '#2b3066' },
  statusSubtitle: { fontSize: 12, color: '#888' },

  itemMoeda: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    marginHorizontal: 20,
    marginVertical: 8,
    borderRadius: 15,
    elevation: 2,
  },
  siglaMoeda: { fontSize: 18, fontWeight: "bold", color: "#2b3066" },
  nomeMoeda: { fontSize: 12, color: "#888" },
  valorMoeda: { fontSize: 18, fontWeight: "600", color: "#28a745" },

  updateButton: {
    backgroundColor: '#5BA092',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 18,
    borderRadius: 30,
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    elevation: 5,
  },
  updateButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});
