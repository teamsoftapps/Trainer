import { useSelector } from 'react-redux';
import DrawerStack from './DrawerStack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CompleteProfileUser from '../Screens/userScreens/CompleteProfile';
const Stack = createNativeStackNavigator();
const UserStack = () => {
  const authData = useSelector(state => state?.Auth?.data);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {authData?.isProfileComplete ? (
        <>
          <Stack.Screen name="DrawerStack" component={DrawerStack} />
        </>
      ) : (
        <Stack.Screen
          name="CompleteProfileUser"
          component={CompleteProfileUser}
        />
      )}
    </Stack.Navigator>
  );
};
export default UserStack;
