import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

import MainStack from './MainStack';
import CustomDrawer from '../Components/CustomDrawer';

import Store from '../Screens/userScreens/Store';
import Forum from '../Screens/userScreens/Forum';
import ExerciseLog from '../Screens/userScreens/ExerciseLog';
import CreateForumPost from '../Screens/userScreens/CreateForumPost';
import TermsAndConditions from '../Screens/userScreens/TermsAndConditions';
import PrivacyPolicy from '../Screens/userScreens/PrivacyPolicy';
import FAQs from '../Screens/userScreens/FAQs';
import Cart from '../Screens/userScreens/Cart';

const Drawer = createDrawerNavigator();

const DrawerStack = () => {
    return (
        <Drawer.Navigator
            drawerContent={props => <CustomDrawer {...props} />}
            screenOptions={{
                headerShown: false,
                drawerStyle: {
                    backgroundColor: 'transparent',
                    width: '75%',
                },
                drawerType: 'slide',
            }}>
            <Drawer.Screen name="MainStack" component={MainStack} />
            <Drawer.Screen name="Store" component={Store} />
            <Drawer.Screen name="Forum" component={Forum} />
            <Drawer.Screen name="ExerciseLog" component={ExerciseLog} />
            <Drawer.Screen name="CreateForumPost" component={CreateForumPost} />
            <Drawer.Screen name="TermsAndConditions" component={TermsAndConditions} />
            <Drawer.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
            <Drawer.Screen name="FAQs" component={FAQs} />
            <Drawer.Screen name="Cart" component={Cart} />
        </Drawer.Navigator>
    );
};

export default DrawerStack;
