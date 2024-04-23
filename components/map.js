import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, Button ,TouchableOpacity} from 'react-native';
import MapView, { UrlTile, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from "jwt-decode";
import { useGlobalContext } from '../GlobalContext';


export default function App({route}) {
    const [location, setLocation] = useState(null);
    const [markerPosition, setMarkerPosition] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [errorMsg, setErrorMsg] = useState(null);
    const [uid, setUId] = useState('');
    // const [address,setAddress]=useState(route.params.address);
    const { globalState, updateGlobalState } = useGlobalContext();
    // Access the global state
    const { address } = globalState;
    const mapRef = useRef(null);

    const retrieveToken = async () => {
        try {
            const token = await AsyncStorage.getItem('token');

            if (token) {
                console.log('Token retrieved successfully');
                const decodedToken = jwt_decode(token);
                const { username, password } = decodedToken;
                console.log(username);
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
            try {
                const { username, password } = await retrieveToken();
                console.log(username);
                setUId(username);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        (async () => {
            try {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    setErrorMsg('Permission to access location was denied');
                    return;
                }

                let currentLocation = await Location.getCurrentPositionAsync({});
                console.log(currentLocation);
                setLocation(currentLocation);
                mapRef.current.animateToRegion({
                    latitude: currentLocation.coords.latitude, 
                    longitude: currentLocation.coords.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                });
                setMarkerPosition({
                    latitude: currentLocation.coords.latitude,
                    longitude: currentLocation.coords.longitude,
                });
                console.log("1", markerPosition);
            } catch (error) {
                console.error('Error getting current location:', error);
            }
        })();
    }, []);

    const fetchAddress = async (loc_coord) => {
        try {
            const response = await Location.reverseGeocodeAsync(loc_coord);
            console.log(response)
            return response[0].formattedAddress
        }
        catch (error) {
            console.log(error)
            return ""
        }
    }

    const handleMarkerPress = (e) => {
        console.log("pressed",e.nativeEvent.coordinate);
        setMarkerPosition(e.nativeEvent.coordinate);
        handleLocationUpdate();
    };

    // useEffect(() => {
        const handleLocationUpdate = async () => {
            try {
                const { username, password } = await retrieveToken();
                setUId(username);

                if (markerPosition) {
                    const loc_address = await fetchAddress(markerPosition)
                    // setAddress(loc_address)
                    updateGlobalState({address:loc_address})
                    const requestBody = {
                        userId: uid,
                        location: {
                            latitude: markerPosition.latitude,
                            longitude: markerPosition.longitude,
                        },
                        address: loc_address
                    };
                    console.log({requestBody});
                    const r = JSON.stringify(requestBody);
                    console.log(r);

                    axios.post(`${process.env.EXPO_PUBLIC_API_URL}/user/savelocation`, requestBody)
                        .then(response => {
                            console.log(response.data);
                        })
                        .catch(error => {
                            console.log('Error:', error);
                        });
                }
            } catch (error) {
                console.error('Error handling location update:', error);
            }
        };

    //     handleLocationUpdate();
    // }, [markerPosition]);

    const handleSearch = async () => {
        try {
            const response = await Location.geocodeAsync(searchText);
            if (response.length > 0) {
                const { latitude, longitude } = response[0];
                setMarkerPosition({ latitude, longitude });
                mapRef.current.animateToRegion({
                    latitude,
                    longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                });
            }
        } catch (error) {
            console.error('Error performing geocoding:', error);
        }
    };

    let displayText = 'Waiting..';
    if (errorMsg) {
        displayText = errorMsg;
    } else if (location) {
        const latitude = location.coords .latitude
        const longitude = location.coords.longitude
        displayText = 'Map Loaded';
    }

    return (
        <View style={styles.container}>
            <MapView
                ref={mapRef}
                style={styles.map}
                
                initialRegion={{
                    latitude: location?.coords.latitude || 0,
                    longitude: location?.coords.longitude || 0,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            >
                <UrlTile urlTemplate="http://c.tile.openstreetmap.org/{z}/{x}/{y}.png" maximumZ={19} />
                {markerPosition && (
                    <Marker
                        coordinate={markerPosition}
                        title="Set Location"
                        onPress={handleMarkerPress}
                        draggable
                    />
                )}
            </MapView>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Enter a place"
                    value={searchText}
                    onChangeText={(text) => setSearchText(text)}
                />
                <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                    <Text style={styles.searchButtonText}>Search</Text>
                </TouchableOpacity>
            </View>
                <Text style={styles.lastSavedLocation}>Last saved location: {address}</Text>
            </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
        marginBottom: 20,
        padding:10,
        
      },
      input: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        borderColor: '#781C68',
        borderRadius: 10,
        paddingHorizontal: 10,
        marginRight: 10,
        color:'#781C68'
      },
      searchButton: {
        backgroundColor: '#781C68',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
      },
      searchButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
        
      },
      lastSavedLocation: {
        alignSelf: 'center', 
        fontSize: 14,
        color: 'grey',
        padding:10, 
        marginBottom:40
      }
});
