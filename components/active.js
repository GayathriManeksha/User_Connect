import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from "jwt-decode";
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
export default function Active() {
  const [activeWorkers, setActiveWorkers] = useState([]);
  const [uid, setUid] = useState();
  const navigation = useNavigation();

  const retrieveToken = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      if (token) {
        console.log('Token retrieved successfully');
        const decodedToken = jwt_decode(token);
        const { userId } = decodedToken;
        setUid(userId);
        return userId;
      } else {
        console.log('Token not found');
        return null;
      }
    } catch (error) {
      console.error('Failed to retrieve token', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await retrieveToken();
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchActiveWorkers = async () => {
      console.log('id', uid);
      try {
        if (uid) {
          const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/appointment/user-history/${uid}`);
          console.log('successfully listed active workers', response.data);
          setActiveWorkers(response.data);
        }
      } catch (error) {
        console.error('Error fetching active workers:', error);
      }
    };

    fetchActiveWorkers();
  }, [uid]);

  return (
    <View style={styles.container}>
      <View style={styles.workerListContainer}>
        <Text style={styles.heading}>Active Appointments</Text>

        <ScrollView>
          <FlatList
            data={activeWorkers}
            renderItem={({ item }) => (
              <View style={styles.workerContainer}>
                <TouchableOpacity style={styles.workerItem}  onPress={() => navigation.navigate('activedetails', { worker: item.worker,amt:item.amount })}>
                  <View style={styles.workerInfoContainer}>
                    <View style={styles.workerNameContainer}>
                      <Icon name="account-circle" size={24} color="#333" style={{ marginRight: 8 }} />
                      <Text style={styles.workerName}>{item.worker.username}</Text>
                      <Text style={styles.workeramount}>Rs.{item.amount}</Text>
                    </View>
                    <Text style={styles.light}>{item.worker.profession}</Text>
                    <Text style={styles.light}>ID: {item.worker._id}</Text>
                    <Text style={styles.light}>{item.date}</Text>
                    <Text style={styles.light}>{item.worker.email}</Text>
                   
                  </View>
                </TouchableOpacity>
              </View>
            )}
          />
        </ScrollView>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    padding:10,
  },
  workerListContainer: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#fff',
    padding: 16,
    marginTop: -20,
  },
  workerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 1.5)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
  },
  workerInfoContainer: {
    flex: 1,
    marginLeft: 12,
  },
  workerNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  workerName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 0,
    color: 'grey', // Darker text color
    padding:5
  },
  workeramount: {
    marginLeft:"50%",
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 1,
    color: '#d6c25a', // Darker text color
  },
  light: {
    fontSize: 14,
    fontWeight: '200',
    marginBottom: 4,
    color: '#333', // Darker text color
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
