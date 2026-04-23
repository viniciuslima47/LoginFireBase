import { Ionicons } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const firebaseConfig = {
  apiKey: "AIzaSyC3iEmAtXSYFTO_BtVD_Tk6ARafskIzW18",
  authDomain: "app-teste-2dabd.firebaseapp.com",
  projectId: "app-teste-2dabd",
  storageBucket: "app-teste-2dabd.firebasestorage.app",
  messagingSenderId: "20656501737",
  appId: "1:20656501737:web:692778d2471ecdd644d178",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const Stack = createNativeStackNavigator();

/* <Stack.Screen
            name="Login"
            component={ScreenLogin}
            options={{ headerShown: false }}
          /> 
          <Stack.Screen name="Cadastrar" component={ScreenCadastrar} /> 
*/

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Main">
          <Stack.Screen
            name="Main"
            component={ScreenMain}
            options={({ navigation }) => ({
              headerRight: () => (
                <TouchableOpacity
                  onPress={() => {
                    Logout();
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

function Logout() {
  const auth = getAuth();
  signOut(auth)
    .then(() => {
      navigation.navigate("Login");
    })
    .catch((error) => {
      console.log(error);
    });
}

/* function ScreenLogin({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function checkAuth() {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        navigation.navigate("Main");
        const user = userCredential.user;
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      <Image
        style={styles.tinyLogo}
        source={{
          uri: "https://marketplace.canva.com/A5alg/MAESXCA5alg/1/tl/canva-user-icon-MAESXCA5alg.png",
        }}
      />

      <View style={styles.container_inputs}>
        <Text>Login</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        <Text>Senha</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <View style={styles.container_btn}>
        <TouchableOpacity style={styles.botao} onPress={checkAuth}>
          <Text style={styles.texto}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botao}
          onPress={() => navigation.navigate("Cadastrar")}
        >
          <Text style={styles.texto}>Cadastro</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
} /* 

/* function ScreenCadastrar({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function cadastrar() {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        navigation.navigate("Login");
        console.log("Cadastro realizado com sucesso!");
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });
  }

  return (
    <View style={styles.container}>
      <View style={styles.container_inputs}>
        <Text>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text>Senha</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <View style={styles.container_btn}>
        <TouchableOpacity style={styles.botao} onPress={cadastrar}>
          <Text style={styles.texto}>Cadastrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
} */

function ScreenMain() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("https://economia.awesomeapi.com.br/json/all");
        const json = await res.json();

        const formatted = Object.keys(json).map((key) => ({
          id: key,
          name: key,
          value: json[key].bid,
        }));

        setData(formatted);
      } catch (err) {
        console.log(err);
      }
    }

    load();
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "rgba(255, 254, 254, 0.93)",
          alignItems: "center",
        }}
      >
        <View style={styles.top}>
          <View style={styles.card}>
            <Text style={{ fontWeight: "bold", fontSize: 18 }}>
              Cotação Atual
            </Text>
            <Text style={{ fontSize: 14 }}>Última atualização: 10:35 AM</Text>
          </View>

          <View style={{ justifyContent: "center" }}>
            <FlatList
              data={data}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={{ padding: 10 }}>
                  <Text>{item.name}</Text>
                  <Text>R$ {item.value}</Text>
              )}/>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },

  top: {
    backgroundColor: "#2b3066",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    width: "100%",
    height: "20%",
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 15,
  },

  card: {
    backgroundColor: "#ffffff",
    width: "95%",
    height: "50%",
    borderRadius: 15,
    marginTop: 120,
    alignItems: "center",
    justifyContent: "center",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,

    elevation: 6,
  },

  tinyLogo: {
    width: 50,
    height: 50,
    marginBottom: 20,
    borderRadius: 25,
  },

  input: {
    backgroundColor: "#fff",
    height: 40,
    marginVertical: 8,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },

  botao: {
    backgroundColor: "rgb(0, 170, 255)",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },

  botaosalvar: {
    backgroundColor: "rgb(72, 234, 83)",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },

  botaoexcluir: {
    backgroundColor: "rgb(225, 42, 42)",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },

  texto: {
    color: "#fff",
    fontWeight: "bold",
  },

  container_btn: {
    gap: 10,
    marginTop: 20,
    width: 200,
  },

  container_inputs: {
    width: 200,
  },
});
