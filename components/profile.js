import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, TextInput ,Image} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';
import axios from 'axios';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next'; 
const Profile = () => { 
  const [uid, setUid] = useState();
  const navigation = useNavigation();
 const [userDetails,setUserDetails]=useState([]);
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
    const  fetchUserDetails = async () => {
      console.log('id', uid);
      try {
        if (uid) {
          const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/user/details/${uid}`);
          console.log('successfully fetched userdetails', response.data);
          setUserDetails(response.data);
        }
      } catch (error) {
        console.error('Error fetching ', error);
      }
    };

    fetchUserDetails();
  }, [uid]);
 
  // if (!user) {
  //   return (
  //     <View style={styles.container}>
  //       <Text>Loading...</Text>
  //     </View>
  //   );
  // }
  const handleEdit=()=>{

  }
 const handleHistory=()=>{
  navigation.navigate('history');
 }
  return (
    <View style={styles.container}> 
     
      <View style={styles.profileContainer}>
        <Image
          source={require('./profile.png')}  
          style={styles.profileImage}
        />
        <Text style={styles.userName}>{userDetails.username}</Text>  
      </View>  
      <View style={styles.bottom}>
      <View style={styles.detailContainer}>
            <View>
              <Text style={styles.semilight}>Address</Text>
              <Text style={styles.light}>{userDetails.address}</Text>
            </View>
            <View style={styles.horizontalLine} />
            <View>
              <Text style={styles.semilight}>ID</Text>
              <Text style={styles.light}>{userDetails._id}</Text>
            </View>
            <View style={styles.horizontalLine} />
            <View>
              <Text style={styles.semilight}>Email</Text>
              <Text style={styles.light}>{userDetails.email}</Text>
            </View>
            <View style={styles.horizontalLine} />
            <View>
              <Text style={styles.semilight}>Phone</Text>
              <Text style={styles.light}>{userDetails.phone}</Text>
            </View>
            <View style={styles.horizontalLine} />
            <View>  
            <TouchableOpacity style={styles.button} onPress={handleHistory}>
                <Text style={styles.buttonText}>History</Text>
            </TouchableOpacity>
            </View>
          </View>
      </View>
        
    </View>
  );
};

const styles = StyleSheet.create({ container: {
  flex: 1,
  alignItems: 'center',
  backgroundColor: '#F5F5F5',
},
head: {
  backgroundColor: 'white',
  width: '100%',
  height: 40,
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal: 20,
},
heading: {
  color: '#781C68',
  fontWeight: 'bold',
  fontSize: 18,
  padding: 10,
}, 
profileContainer: {
  alignItems: 'center',
  margin:10
},
profileImage: {
  width: 150,
  height: 150,
  borderRadius: 75,
  marginBottom: 20, 
  tintColor: '#781C68',
  padding:5
}, 
userName: {
  fontSize: 24,
  fontWeight: 'bold',
  color:'#781C68', 
},
userInfo: {
  fontSize: 16,
  marginBottom: 10,
},
bottom:{
  marginTop:50,
},
Item: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderBottomWidth: 1,
  borderBottomColor: '#781C68',
  paddingVertical: 12,
  fontSize: 16,
  fontWeight: 'bold',
  width:300
},
detailContainer: {
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'left',
  paddingHorizontal: 20,
},
horizontalLine: {
  borderBottomColor: '#ccc',
  borderBottomWidth: 1,
  width: '100%',
  marginVertical: 10,
},
semilight: {
  fontSize: 16,
  fontWeight: '200',
  marginBottom: 4,
  color: '#333',
},
light: {
  fontSize: 12,
  fontWeight: '400',
  marginBottom: 10,
  color: '#781C68',
},
button: {
  backgroundColor: '#333',
  padding: 10,
  borderRadius: 5,
  marginTop: 0,
  marginBottom: 0,
  alignItems: 'center',
  backgroundColor:'#781C68'
},
buttonText: {
  color: 'white',
  fontSize: 16,
  fontWeight: 'bold',
},
});
export default Profile;