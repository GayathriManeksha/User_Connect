import React, { useState } from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity, Text,ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from "jwt-decode";
import socket from "../utils/socket";

export default function SignIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const navigation = useNavigation();


  const storeToken = async (token) => {
    try {
      await AsyncStorage.setItem('token', token);
      console.log('Token stored successfully');
      console.log(token)

      // Decode the token to get user details

      // const decodedToken = jwt_decode(token);
      // const { name, id } = decodedToken;

      // Store user details in AsyncStorage
      // await AsyncStorage.setItem('userId', id);
      // await AsyncStorage.setItem('username', name);

    } catch (error) {
      console.error('Failed to store token', error);
    }
  };

  const retrieveToken = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      // const userId = await AsyncStorage.getItem('userId');
      // const username = await AsyncStorage.getItem('username');
      if (token) {
        console.log('Token retrieved successfully');
        return token;
      } else {
        console.log('Token not found');
        return null;
      }
    } catch (error) {
      console.error('Failed to retrieve token', error);
      return null;
    }
  };

  const removeToken = async () => {
    try {
      await AsyncStorage.removeItem('token');
      console.log('Token removed successfully');
    } catch (error) {
      console.error('Failed to remove token', error);
    }
  };


  const handleNameChange = (value) => {
    setUsername(value);
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
  };
  const handleEmailChange = (value) => {
    setEmail(value);
  };
  const handlePhoneChange = (value) => {
    setPhone(value);
  };
  const handleAddressChange = (value) => {
    setAddress(value);
  };

  const handleButtonPress = () => {
    // Handle the login logic and navigate to the next screen
    console.log("button pressed")
    axios.post(`${process.env.EXPO_PUBLIC_API_URL}/user/register`, { username, password,email,phone,address })
    .then(response => {
      console.log(response);
      const successMessage = 'User registered successfully';
      if (response.data.message === successMessage) {
        // Registration success logic
        console.log('Sign-in/Sign-up successful');
        const token = response.data.user._id;
        storeToken(token);
        navigation.navigate('login');
      } else {
        // Registration failure logic
        console.log('Sign-in/Sign-up unsuccessful');
      }
    })
    .catch(error => {
      console.log('Error during sign-in', error);
    });
  };
  const handleLogin = () => {
    // Handle the login logic and navigate to the next screen
    navigation.navigate('login');
  };

  return (
    <View style={styles.container}>
        
      <View style={styles.label}>
        <Text style={styles.loginText1}>Sign In</Text>
        <ScrollView>
        <TextInput
          style={styles.inputname}
          placeholder="Enter Name"
          placeholderTextColor="#781C68"
          value={username}
          onChangeText={handleNameChange}
        />
        <TextInput
          style={styles.inputname}
          placeholder="Enter Password"
          placeholderTextColor="#781C68"
          value={password}
          secureTextEntry={true}
          onChangeText={handlePasswordChange}
        />
        <TextInput
          style={styles.inputname}
          placeholder="Enter Email"
          placeholderTextColor="#781C68"
          value={email}
          onChangeText={handleEmailChange}
        />
        <TextInput
          style={styles.inputname}
          placeholder="Enter Phone no"
          placeholderTextColor="#781C68"
          value={phone}
          onChangeText={handlePhoneChange}
        />
        <TextInput
          style={styles.inputname}
          placeholder="Enter Address"
          placeholderTextColor="#781C68"
          value={address}
          onChangeText={handleAddressChange}
        />
        </ScrollView>
         <Text  style={styles.newlogin} onPress={handleLogin}>Login?</Text>
        <TouchableOpacity style={styles.loginbtn} onPress={handleButtonPress}>
          <Text style={styles.loginText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white', // Black background color
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    borderWidth: 2,
    borderColor: '#781C68', // White border color
    width: 270,
    height: 500,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputname: {
    width: 243,
    height: 41,
    borderRadius: 20,
    alignSelf: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    lineHeight: 18,
    color: '#781C68', // White text color
    padding: 10,
    fontSize: 12,
    borderWidth: 0.5,
    borderColor: '#ccc', // Slightly lighter color for borders
    marginTop: 10,
  },
  newlogin: {
    width: 243,
    height: 41,
    borderRadius: 20,
    alignSelf: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    lineHeight: 18, 
    color: '#781C68', // White text color
    padding: 10,
    fontSize: 12,  // Slightly lighter color for borders
    marginTop: 10,
    marginLeft:340,
  },
  loginbtn: {
    backgroundColor: '#781C68', // White background color
    borderRadius: 10,
    padding: 5,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
    top: -10,
  },
  loginText: {
    color: 'white', // Black text color
    fontSize: 18,
    fontWeight: 'bold',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText1: {
    top: -80,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#781C68', // White text color
  },
});
