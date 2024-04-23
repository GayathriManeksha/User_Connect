import React, { useState, useEffect, useRef } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Dimensions, TextInput, ScrollView, Pressable ,Image ,TouchableWithoutFeedback } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';
import { useNavigation } from '@react-navigation/native';
import socket from "../utils/socket";

const { width } = Dimensions.get('window');

const Bidding = ({ route }) => {
  const scrollViewRef = useRef();
  const { workerId } = route.params;
  const navigation = useNavigation();
  const [userId, setUserId] = useState('');
  const [uid, setUId] = useState('');
  const [username, setUserName] = useState('');
  const [message, setMessage] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [roomId, setRoomId] = useState('');
  const [workername, setWorkerName] = useState('');
  const [messages, setMessages] = useState([]);
  const [label, setLabel] = useState("");
  const [selfaccepted, setSelfAccepted] = useState(false);
  const [workeraccepted, setWorkerAccepted] = useState(false);
  const [amount, setAmount] = useState("");
  const [timer, setTimer] = useState(300); // 5 minutes in seconds
  const [bidId, setBidId] = useState(null);
  const [sub, setSub] = useState(false);
  const [status, setStatus] = useState(-1);
  const [showTooltip, setShowTooltip] = useState(false);
  const generateID = () => Math.random().toString(36).substring(2, 10);

  const retrieveToken = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      if (token) {
        console.log('Token retrieved successfully');
        const decodedToken = jwt_decode(token);
        console.log(userId)
        const { username, password } = decodedToken;
        setUserId(username);
        setUId(decodedToken.userId)
        console.log("uid", uid)
        console.log("username", username);
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
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      const { username, password } = await retrieveToken();
      console.log(username);
      setUserName(username);
    };
    fetchData();
  }, []);


  useEffect(() => {
    console.log("Hey from socket");
    socket.on('newMessage', (newMessage) => {
      console.log('Received message in the room:', newMessage);
      // Handle the received message, e.g., display it in the UI
      setMessages(prevMessages => [...prevMessages, newMessage]);
    });

    // Cleanup function to unsubscribe from socket
    return () => {
      socket.off('newMessage');
    };
  }, []);

  useEffect(() => {
    socket.on('accepted', (BidData) => {
      console.log('Bid accepted', BidData);
      if (BidData.sender.role === 'worker')
        setWorkerAccepted(true);
      else setSelfAccepted(true);
      setLabel(BidData.amount);
      setBidId(BidData._id);
    });

    // Cleanup function to unsubscribe from socket
    return () => {
      socket.off('accepted');
    };
  }, []);


  useEffect(() => {
    async function fetchData() {
      try {
        if (uid) {
          const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/user/chat`, {
            userId: uid,
            workerId,
          });
          console.log('Chat opened successfully',response.data);
          setRoomId(response.data.chatId);
          setWorkerName(response.data.workerName)
          console.log('name',response.data.workerName);
          setMessages(response.data.messages)
          // socket.emit("createRoom", response.data.chatId);
        }

      } catch (error) {
        console.error('Error adding request:', error);
      }
    }
    fetchData();
  }, [uid])

  useEffect(() => {
    async function check() {
      try {
        if (uid) {
          const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/user/bid`, {
            userId: uid,
            workerId,
          });
          console.log(response.data)
          setLabel(response.data.amount)
          setBidId(response.data._id)
          setStatus(response.data.approval)
          console.log("approval value",response.data.approval)

          if (response.data && response.data.approval===0) {
            if (response.data.sender.role === "user") {
              setSelfAccepted(true)
            }
            if (response.data.sender.role === "worker") {
              setWorkerAccepted(true)
            }
          }
        }
      }
      catch (error) {
        console.log(error)
      }
    }
    check();
  }, [uid])

  const closeBid = () => { };
  // Function to get current time
  const getCurrentTime = () => {
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours}:${minutes}`;
  };

  // Function to handle sending message
  const sendMessage = () => {
    console.log("message", message)
    if (message.trim() !== '') {
      const currentTime = getCurrentTime();
      const newMessage = {
        id: generateID(),
        sender: { role: 'user' },
        contentType: 'text',
        content: { text: message },
        timestamp: currentTime
      };
      socket.emit('message', { room_id: roomId, newMessage })
      setMessages([...messages, newMessage]);
      console.log(messages)
      setMessage('');
    }

  };
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleCreateRoom = () => {
    console.log({ amount });
    setLabel(`Amount: $${amount}`);
  };

  const handleAccept = (amt, id) => {
    // setSelfAccepted(true);
    setLabel(amt);
    const currentTime = getCurrentTime();
    const BidData = {
      amount: parseInt(amt),
      timestamp: currentTime,
      //chatId: id,
      userId: uid,
      workerId,
      sender: { role: 'user' },
    };
    console.log(BidData)
    // Emit the bid message via socket
    socket.emit('accept', { room_id: roomId, BidData });

    console.log(selfaccepted);
    setVisible(false);
  }

  const handleReject = () => {
    navigation.navigate('bidding', { workerId });
    setSelfAccepted(false);
  }
  const handleConfirm = () => {
    console.log("bidId", bidId)
    if (bidId !== null) {
      navigation.navigate('details', { bidId, workerId });
      //  navigation.navigate('active')
    }
  }

  setInterval(() => {
    setCurrentTime(getCurrentTime());
  }, 60000);
  const [visible, setVisible] = useState(false);

  const handleCreateBid = () => {
    console.log({ amount });
    setLabel(`Amount: $${amount}`);
    setSub(true);
    const currentTime = getCurrentTime();
    const newBidMessage = {
      id: generateID(),
      sender: { role: 'user' },
      contentType: 'bid',
      content: { bidAmount: parseInt(amount) },
      timestamp: currentTime
    };
    // Emit the bid message via socket
    socket.emit('message', { room_id: roomId, newMessage: newBidMessage },);
    // Add the bid message to the messages state
    setMessages([...messages, newBidMessage]);
    // Reset the input field and close the modal
    setMessage('');
    setVisible(false);
  };
  const onClose = () => { }
  const closeModal = () => setVisible(false);
  return (
    <View style={styles.container}>  
      
      {
      // then there is no active or in-progress bookings
      (status === -1 ) &&
        <View style={styles.head}>
          <Text style={styles.heading}>Chat With {workername}</Text>
          <View>
        <TouchableWithoutFeedback
          onPressIn={() => setShowTooltip(true)}
          onPressOut={() => setShowTooltip(false)}
        >
          <TouchableOpacity style={styles.sendButton} onPress={() => setVisible(true)} disabled={selfaccepted || workeraccepted}>
            <Text style={styles.sendButtonText}>Bid</Text>
          </TouchableOpacity>
        </TouchableWithoutFeedback>
        {showTooltip && (
          <View style={styles.tooltip}>
            <Text style={styles.tooltipText}>Click to place a bid</Text>
          </View>
        )}
      </View>
        </View>
        }

      { //Active bookings (Confirmed)
        status === 1 &&
        <View style={styles.head}>
          <Text style={styles.heading}>Chat With {workername}</Text>
          <TouchableOpacity style={styles.sendButton} onPress={() => navigation.navigate('active')} >
            <Text style={styles.sendButtonText}>Active booking details</Text>
          </TouchableOpacity>
        </View>
      }

      <View>

        {/* <View style={styles.profileIcon}>
          <Text>Profile Icon</Text>
        </View> */}

        {
          selfaccepted &&
          <View style={styles.popuplabelContainer}>
            <Image source={require('../assets/pop.jpg')} style={styles.image} />
            <Text style={styles.whiteText}>You have accepted the Request</Text>
            <Text style={styles.whiteText}>click to Confirm</Text>
            <Text style={styles.labelText}> Rs.{label}</Text>
            <View style={styles.acceptRejectContainer}>
              <Pressable style={styles.acceptButton} onPress={handleConfirm}>
                <Text style={styles.modaltext1} >CONFIRM</Text>
              </Pressable>
              <Pressable style={styles.acceptButton} onPress={handleReject}>
                <Text style={styles.modaltext1}>CLOSE</Text>
              </Pressable>
            </View>
          </View>

        }
        {
          workeraccepted &&
          <View style={styles.popuplabelContainer}>
             <Image source={require('../assets/pop.jpg')} style={styles.image} />
            <Text style={styles.whiteText}>Worker has accepted the Request</Text>
            <Text style={styles.labelText}> {label}</Text>
            <View style={styles.acceptRejectContainer}>
              <Pressable style={styles.acceptButton} onPress={handleConfirm}>
                <Text style={styles.modaltext1} >CONFIRM</Text>
              </Pressable>
              <Pressable style={styles.acceptButton} onPress={handleReject}>
                <Text style={styles.modaltext1}>CLOSE</Text>
              </Pressable>
            </View>
          </View>

        }
        <ScrollView style={styles.chatContainer} ref={scrollViewRef}>
          {messages?.map((msg) => (
            <View key={msg.id} style={[styles.messageContainer, msg.sender.role === 'user' ? styles.UserContainer : styles.WorkerContainer]}>
              <View style={styles.profileIcon}>
                {/* Profile Icon */}
                {/* You can place your profile icon component here */}
                {/* <Text>Profile Icon</Text> */}
              </View>
              {msg.contentType === "text" ? (
                <View style={[styles.messageContent, msg.sender.role === 'user' ? styles.UserContainer : styles.WorkerContainer]}>
                  {/* Time */}
                  <Text style={styles.timeText}>{msg.timestamp}</Text>
                  {/* Message Text */}
                  <Text style={msg.sender.role === "user" ? styles.messageUserText : styles.messageWorkerText}>
                    {msg.content.text}
                  </Text>
                </View>
              ) : (
                <View style={[
                  styles.labelContainer,
                  { backgroundColor: msg.sender.role === 'user' ? '#E6D1E0' : 'white' }
                ]}>
                  <Text style={styles.labelText}>{msg.content.bidAmount}</Text>
                   
                  {msg.sender.role !== "user" ? (
                    <View style={styles.acceptRejectContainer}>
                      <Pressable style={styles.acceptButton} onPress={() => handleAccept(msg.content.bidAmount, msg._id)}>
                        <Text style={styles.modaltext}>ACCEPT</Text>
                      </Pressable>
                      <Pressable style={styles.rejectButton} onPress={handleReject}>
                        <Text style={styles.modaltext}>REJECT</Text>
                      </Pressable>
                    </View>) :
                    (<View style={styles.acceptRejectContainer}>
                      <Pressable style={styles.acceptButton}  >
                        <Text style={styles.modaltext}>WAITING</Text>
                      </Pressable>
                    </View>)
                  }
                </View>
              )}
            </View>
          ))}
        </ScrollView>

        {/* Bidding Chat Messages */}

        {visible ?
          // <Modal setVisible={setVisible} roomId={roomId} /> 
          <View style={styles.modalContainer}>
            <Text style={styles.modalsubheading}>Enter the Amount</Text>
            <TextInput
              style={styles.modalinput}
              placeholder='Amount...'
              onChangeText={(value) => setAmount(value)}
            />

            <View style={styles.modalbuttonContainer}>
              <Pressable style={styles.modalbutton} onPress={handleCreateBid}>
                <Text style={styles.modaltext}>CREATE</Text>
              </Pressable>
              <Pressable
                style={[styles.modalbutton, { backgroundColor: "grey" }]}
                onPress={closeModal}
              >
                <Text style={styles.modaltext}>CANCEL</Text>
              </Pressable>
            </View>
          </View>
          : ""}

        {/* Message Input and Send Button */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type your message..."
            value={message}
            onChangeText={setMessage}
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
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
    
    color:'#781C68',
    fontWeight: 'bold',
    fontSize: 18,
    padding: 5,
  },
  profileIcon: {
    marginRight: 10,
    // Profile icon styles
  },
  chatContainer: {
    flex: 1,
    marginBottom: 10, 
     
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'flex-start',
    marginLeft: 20, // Add margin to messages to avoid overlap with label
  },
  messageContent: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginRight: 20,
  },
  messageWorkerText: {

    backgroundColor:  '#954C85'    ,
    padding: 10,
    borderRadius: 10,
    color:'#E6D1E0',
  },
  messageUserText: {

    backgroundColor: '#E6D1E0'    ,
    padding: 10,
    borderRadius: 10,
    color:'#781C68',
   

  },

  timeText: {
    marginTop: 0,
    fontSize: 12,
    color: '#888',
    padding: 5,
    borderRadius: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    bottom: '18%',
    padding: '4%',
    marginTop: 60,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    color: ' #781C68',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#781C68',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  labelContainer: {
    marginTop: 20, // Adjusted margin top to create space between label and messages
    alignItems: "center",
    borderRadius: 10,
    borderColor: '#781C68',
    borderWidth: 1,
    paddingVertical: 10,
    margin: 10,

  },
  labelText: {
    fontSize: 24,
    marginBottom: 10,
    fontWeight: 'bold',
    color: '#781C68', // Adjust color as needed
    padding: 20
  },
  timerText: {
    fontSize: 16,
    marginBottom: 10,
  },
  acceptRejectContainer: {
    flexDirection: "row",
  },
  acceptButton: {
    backgroundColor: "#781C68",
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  rejectButton: {
    backgroundColor: "grey",
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  modaltext: {
    color: "#FFF",
    fontSize: 16,
  },
  modaltext1: {
    color: "white",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalsubheading: {
    fontSize: 18,
    marginBottom: 10,
  },
  modalinput: {
    height: 40,
    width: 250,
    borderColor: "grey",
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  modalbuttonContainer: {
    flexDirection: "row",
  },
  modalbutton: {
    backgroundColor: "#954C85",
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  modaltext: {
    color: "#FFF",
    fontSize: 16,
  },
  popuplabelContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    margin: 10,
    height: '50%',
    marginTop: '65%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  whiteText: {
    color: 'grey',
    fontSize: 16,
    padding: 10
    // Additional styles if needed
  },
  WorkerContainer: {
    alignSelf: 'flex-end',
  },
  UserContainer: {
    alignSelf: 'flex-start',
  },
  image: {
    height:100,
     resizeMode: 'contain', // Adjust the image to fit inside the container
     marginBottom:100
   },
   tooltip: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 5,
    padding: 5,
    top: 40, // Adjust this value to position the tooltip relative to the button
    left: 20, // Adjust this value to position the tooltip relative to the button
  },
  tooltipText: {
    color: '#fff',
    fontSize: 14,
  },
});

export default Bidding;
