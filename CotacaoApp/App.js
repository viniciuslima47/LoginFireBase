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
  Alert,
  ActivityIndicator
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
              headerShown: false
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

// 5. Tela Principal 
function ScreenMain() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [clickTime, setClickTime] = useState(null);

  const paises = {
    USD: "us",
    USDT: "us",
    EUR: "eu",
    BRL: "br",
    GBP: "gb",
    ARS: "ar",
    CAD: "ca",
    AUD: "au",
    JPY: "jp",
    CNY: "cn",
  };

  async function load() {
    setLoading(true);
    try {
      const now = new Date();
      setClickTime(
        now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      );

      const res = await fetch("https://economia.awesomeapi.com.br/json/all");
      const json = await res.json();

      const formatted = Object.keys(json).map((key) => {
        const currency = key.split("-")[0];

        return {
          id: key,
          currency,
          name: json[key].name.split("/")[0],
          value: json[key].bid,
          flag: `https://flagcdn.com/w40/${paises[currency] || "un"}.png`,
          flagbr: "https://flagcdn.com/w40/br.png",
        };
      });

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
          Conversor de{"\n"}Moedas{" "}
          <Text style={{ color: "#E9AD8C" }}>Pro</Text>
        </Text>

        <View style={styles.statusCard}>
          <Text style={styles.statusTitle}>Cotação Atual</Text>
          <Text style={styles.statusSubtitle}>
            {loading
              ? "Atualizando..."
              : `Última atualização: ${clickTime}`}
          </Text>
        </View>
      </View>

      <View style={{ flex: 1, width: "100%" }}>
        {loading && data.length === 0 ? (
          <ActivityIndicator size="large" />
        ) : (
          <FlatList
            data={data}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{
              paddingTop: 80,
              paddingBottom: 100,
            }}
            renderItem={({ item }) => (
              <View style={styles.itemMoeda}>
                {/* LADO ESQUERDO */}
                <View style={{ flexDirection: "row", alignItems: "center" }}>

                  {/* BANDEIRAS SOBREPOSTAS */}
                  <View style={{ width: 50, height: 45, marginRight: 10 }}>

                    <View style={styles.flagMain}>
                      <Image
                        source={{ uri: item.flag }}
                        style={styles.flagImage}
                      />
                    </View>

                    <View style={styles.flagSecondary}>
                      <Image
                        source={{ uri: item.flagbr }}
                        style={styles.flagImage}
                      />
                    </View>

                  </View>

                  {/* TEXTO */}
                  <View>
                    <Text style={styles.siglaMoeda}>
                      {item.currency} / BRL
                    </Text>
                    <Text style={styles.nomeMoeda}>
                      1 {item.name}
                    </Text>
                  </View>
                </View>

                {/* VALOR */}
                <Text style={styles.valorMoeda}>
                  R$ {parseFloat(item.value).toFixed(2)}
                </Text>
              </View>
            )}
          />
        )}
      </View>

      <TouchableOpacity
        style={[
          styles.updateButton,
          { opacity: loading ? 0.7 : 1 },
        ]}
        onPress={load}
        disabled={loading}
      >
        <Ionicons
          name="refresh"
          size={20}
          color="white"
          style={{ marginRight: 10 }}
        />
        <Text style={styles.updateButtonText}>
          {loading ? "Carregando..." : "Atualizar Cotações"}
        </Text>
      </TouchableOpacity>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="logo-usd" size={22} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="swap-horizontal" size={22} color="#aaa" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="stats-chart" size={22} color="#aaa" />
        </TouchableOpacity>
      </View>
    </SafeAreaView >
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
    bottom: 70,
    left: 20,
    right: 20,
    elevation: 5,
  },

  updateButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  flagMain: {
    width: 34,
    height: 34,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },

  flagSecondary: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },

  flagImage: {
    width: 34,
    height: 34,
    borderRadius: 17,
  },

  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: "#ffffff",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },

  navItem: {
    padding: 10,
  },

});
