import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, FlatList, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from "jwt-decode";
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';
export default function History() {
  const [workers, setWorkers] = useState([]);
  const [uid, setUid] = useState();
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      await retrieveToken();
    };
    fetchData();
  }, []);

  const retrieveToken = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      if (token) {
        console.log('Token retrieved successfully');
        const decodedToken = jwt_decode(token);
        setUid(decodedToken.userId);
      } else {
        console.log('Token not found');
      }
    } catch (error) {
      console.error('Failed to retrieve token', error);
    }
  };

  useEffect(() => {
    const fetchWorkers = async () => {
      console.log('id', uid);
      try {
        if (uid) {
          const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/user/chat/workers`, {
            userId: uid,
          });
          console.log('successful', response.data.workers);
          setWorkers(response.data.workers);
        }
      } catch (error) {
        console.error('Error fetching workers:', error);
      }
    };

    fetchWorkers();
  }, [uid]);

  const handleWorkerPress = (workerId) => {
    // Navigate to the "Bidding" page with worker ID as parameter
    navigation.navigate('bidding', { workerId });
  };

  return (
    <View style={styles.container}>
      <View style={styles.workerListContainer}>
         
     
          <FlatList
            data={workers}
            renderItem={({ item }) => (
              
              <TouchableOpacity style={styles.workerItem} onPress={() => handleWorkerPress(item.id)}>
                <Icon name="account-circle" size={24} color="#781C68" style={{ marginRight: 8 }} />
                <Text style={styles.workerName}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
         
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  workerListContainer: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#fff',
    padding: 16,
    marginTop: -20,
    color:'#781C68'
  },
  workerItem: {
    flexDirection: 'row', 
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 12,
   
  },
  workerName: {
    fontSize: 16,
    fontWeight: 'bold',
    
    color:'grey',
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    padding:10,
    
    color:'#781C68'
  },
});
