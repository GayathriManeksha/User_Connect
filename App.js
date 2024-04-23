import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import home from './components/home';
import login from './components/login';
import category from './components/category';
import signin from "./components/signin"
import history from './components/history'    
import feed from "./components/feed"
import profile from './components/profile';  
import ListingPage from "./components/list"
import map from "./components/map"
import feedback from "./components/feedback"
import details from "./components/details"
const Stack = createNativeStackNavigator(); 
import Bidding from "./components/bidding"
import Active from './components/active';
import Activedetails from './components/activedetails';
import { GlobalProvider } from './GlobalContext';
import Instructions from  "./components/instructions"
const MyStack = () => {
  return (
    <GlobalProvider>
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="home" component={home} options={{title: 'Home'}}/>
        <Stack.Screen name="login" component={login} options={{title:'Login'}}/>
        <Stack.Screen name="history" component={history} options={{title:'Appointment History'}}/>   
        <Stack.Screen name='feed' component={feed}  options={{ title: 'Category' }}/>
        <Stack.Screen name='profile' component={profile} options={{title:'Profile'}}/>  
        <Stack.Screen name="category" component={category}  />
        <Stack.Screen name="ListingPage" component={ListingPage} />
        <Stack.Screen name="signin" component={signin} options={{title:''}}/>
        <Stack.Screen name="map" component={map} options={{ title: 'Map' }} />
        <Stack.Screen name="bidding" component={Bidding} options={{ title: 'Chat' }} />
        <Stack.Screen name="details" component={details} options={{ title: 'Details' }} />
        <Stack.Screen name="feedback" component={feedback} options={{ title: 'Feedback' }} />
        <Stack.Screen name="active" component={Active} options={{ title: 'Active Appointments' }} />
        <Stack.Screen name="activedetails" component={Activedetails} options={{ title: 'Worker Details' }} />
        <Stack.Screen name="instructions" component={Instructions} options={{ title: 'Instructions' }} />
      </Stack.Navigator>
    </NavigationContainer>
    </GlobalProvider>   
  );
};
export default MyStack