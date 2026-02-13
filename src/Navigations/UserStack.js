import {useSelector} from 'react-redux';
import MainStack from './MainStack';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import CompleteProfileUser from '../Screens/userScreens/CompleteProfile';
const Stack = createNativeStackNavigator();
const UserStack = () => {
  const authData = useSelector(state => state?.Auth?.data);

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {authData?.isProfileComplete ? (
        <>
          <Stack.Screen name="MainStack" component={MainStack} />
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
