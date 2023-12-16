import React, { useState, useContext } from 'react';
import { Button, TextInput, View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import firebase from 'firebase/app';
// import app from '../../../backend/modal';
import { getAuth } from 'firebase/auth';
import { AuthContext } from './authContext'; // Adjust the import path as necessary

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, createUser } = useContext(AuthContext);

  // const authApp = getAuth(app);

  const authParams = {
    email: email,
    password: password
  }

  const handleLogin = async () => {
    try {
      signIn(authParams);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateUser = async () => {
    try {
      createUser(authParams);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <View style={styles.container} >
        <Text style={styles.title}>
          Welcome to Machine Health
        </Text>
        <Image source={require('../../assets/images/adaptive-icon.png')} style={styles.logo} />
        <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" secureTextEntry={false} />
        <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
        <View style={styles.separator} />
        <Text style={styles.accent}> - need and account? -</Text>
        <Button title="Create an Account" onPress={handleCreateUser} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // This centers everything in the container vertically
    alignItems: 'center',     // This centers everything in the container horizontally
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 30,         // Add some bottom margin to push the title up from the inputs
    textAlign: 'center',
  },
  accent: {
    fontSize: 11,
    fontWeight: '200',
  },
  separator: {
    marginVertical: 20,
    height: 1,
    width: '80%',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 30,
  },
  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    width: 180,
    textAlign: 'center',
    backgroundColor: 'white',
  },
  button: {
    backgroundColor: '#1E6738',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 50,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
