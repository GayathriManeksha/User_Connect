import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Text, Image, Animated, Easing } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from "jwt-decode";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useGlobalContext } from '../GlobalContext';

const handleHomePress = () => {
  // Handle navigation to home
};

const Feed = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [location, setLocation] = useState('');
  const { globalState, updateGlobalState } = useGlobalContext();
  const { address } = globalState;
  const [uid, setUid] = useState('');

  const handleCategoryPress = (category) => {
    navigation.navigate('category', { category });
  };
  
  const handleProfilePress = () => {
    navigation.navigate('profile');
  };

  const handleCreatePress = () => {
    navigation.navigate('active'); 
  };

  const retrieveToken = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      if (token) {
        console.log('Token retrieved successfully');
        const decodedToken = jwt_decode(token);
        const { username, password } = decodedToken;
        console.log(username);
        setUsername(username);
        setUid(decodedToken.userId);
        return { username, password };
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
      const { username, password } = await retrieveToken();
      console.log(username);
    };
    fetchData();
  }, []);

  const handleLocation = () => {
    navigation.navigate('map', { address });
  };
  
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        if (uid) {
          const location = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/user/location/${uid}`);
          console.log(location.data);
          setLocation(location.data.location);
          updateGlobalState({address: location.data.address});
          console.log('hello ', address, 'hhi');
        }
      }
      catch (error) {
        console.log("Error fetching location", error);
      }
    };
    fetchLocation();
  }, [uid]);

  const truncateAddress = (address) => {
    if (address.length > 30) {
      return address.substring(0, 30) + '...';
    }
    return address;
  };
  
  return (
    <View style={styles.container}>
       <View style={styles.header}>
        <Ionicons name="location" size={24} color="#781C68" style={{ marginLeft: 10 }} onPress={handleLocation} />
        <View style={styles.locationContainer}>
          <Text style={styles.locationLabel}>Location:</Text>
          <Text style={styles.locationText}>{truncateAddress(address)}</Text>
        </View>
        <TouchableOpacity style={styles.profileButton} onPress={handleProfilePress}>
          <Text style={styles.profileButtonText}>{username}</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.categoryContainer}>
          <TouchableOpacity style={styles.categoryCard} onPress={() => handleCategoryPress("plumber")}>
            <Image source={require('../assets/plumber.jpg')} style={styles.categoryImage} resizeMode="cover" />
            <Text style={styles.categoryLabel}>Plumber</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryCard} onPress={() => handleCategoryPress("electrician")}>
            <Image source={require('../assets/electrician.jpg')} style={styles.categoryImage} resizeMode="cover" />
            <Text style={styles.categoryLabel}>Electrician</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryCard} onPress={() => handleCategoryPress("baby care")}>
            <Image source={require('../assets/babycare.jpg')} style={styles.categoryImage} resizeMode="cover" />
            <Text style={styles.categoryLabel}>Baby Care</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryCard} onPress={() => handleCategoryPress("cleaning")}>
            <Image source={require('../assets/cleaning.jpeg')} style={styles.categoryImage} resizeMode="cover" />
            <Text style={styles.categoryLabel}>Cleaning</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryCard} onPress={() => handleCategoryPress("home nurse")}>
            <Image source={require('../assets/homenurse.jpg')} style={styles.categoryImage} resizeMode="cover" />
            <Text style={styles.categoryLabel}>Home Nurse</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryCard} onPress={() => handleCategoryPress("house keeping")}>
            <Image source={require('../assets/housekeeping.jpg')} style={styles.categoryImage} resizeMode="cover" />
            <Text style={styles.categoryLabel}>House Keeping</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.navbar}>
        <TouchableOpacity style={styles.navbarButton} onPress={handleHomePress}>
          <Ionicons name="home-outline" size={24} color="#781C68" />
          <Text style={styles.navbarLabel}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navbarButton} onPress={handleCreatePress}>
          <Ionicons name="create-outline" size={24} color="#781C68" />
          <Text style={styles.navbarLabel}>Active</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navbarButton} onPress={handleProfilePress}>
          <Ionicons name="person-outline" size={20} color="#781C68" />
          <Text style={styles.navbarLabel}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    marginBottom: 10,
    marginTop: 20,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  navbarLabel: {
    fontSize: 12,
    color: '#781C68',
  },
  categoryText2: {
    fontSize: 16,
    fontWeight: 'normal',
    color: '#781C68',
    marginLeft: 10,
  },
  categoryTextsmall: {
    fontSize: 12,
    fontWeight: 'normal',
    color: 'grey',
    marginLeft: 7,
    marginTop: 0,
  },
  button: {
    borderRadius: 50,
    backgroundColor: '#781C68',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
    width: 30,
    height: 30,
    marginLeft: 'auto',
    marginRight: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  scrollContent: {
    alignItems: 'center',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  categoryCard: {
    width: 150,
    height: 220,
    marginBottom: 20,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: 'white',
    elevation: 4,
    shadowColor: '#781C68',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 3.9,
    marginRight: 10, // Add marginRight to create space between cards
    marginLeft: 10, 
  },
  categoryImage: {
    width: '100%',
    height: '70%',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  categoryLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginTop: 10,
    color:"#781C68"
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    height: 60,
    alignItems: 'center',
    padding:10
  },
  navbarButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 10,
    marginTop: 20,
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#781C68',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    borderTopColor:"white"
  },
  locationContainer: {
    flex: 1,
    marginLeft: 20,
  },
  locationLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#781C68',
  },
  locationText: {
    fontSize: 12,
    color: 'grey',
  },
  profileButton: {
    borderRadius: 50,
    backgroundColor: '#781C68',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  profileButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default Feed;
