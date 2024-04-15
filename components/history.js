import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, FlatList, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from "jwt-decode";
import axios from 'axios';

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
        <Text style={styles.heading}>Appointment History</Text>
        <ScrollView>
          <FlatList
            data={workers}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.workerItem} onPress={() => handleWorkerPress(item.id)}>
                <Text style={styles.workerName}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </ScrollView>
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
  },
  workerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 12,
  },
  workerName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    padding:10,
  },
});
