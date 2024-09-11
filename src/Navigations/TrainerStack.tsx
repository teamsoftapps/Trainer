import { StyleSheet } from 'react-native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from '../Screens/Home';
import Favourites from '../Screens/Favourites';

const Stack = createNativeStackNavigator();
const TrainerStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Favourites" component={Favourites} />
        </Stack.Navigator>
    );
};

export default TrainerStack;

const styles = StyleSheet.create({});
