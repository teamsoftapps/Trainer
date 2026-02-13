// import React, {useEffect} from 'react';
// import {View, ActivityIndicator} from 'react-native';
// import {useSelector} from 'react-redux';
// import {useNavigation} from '@react-navigation/native';

// const TrainerFlow = () => {
//   const trainer = useSelector(state => state.Auth.data);

//   console.log('Trainer data in trainer flow:', trainer);
//   const navigation = useNavigation();

//   //   useEffect(() => {
//   //     if (!trainer) return;

//   //     const isProfileComplete = trainer?.isProfileComplete;

//   //     console.log('isProfileComplete', isProfileComplete);

//   //     const isSubscriptionValid =
//   //       trainer?.subscription?.isActive &&
//   //       trainer?.subscription?.endDate &&
//   //       new Date(trainer.subscription.endDate) > new Date();

//   //     // CASE 1 — Profile Incomplete
//   //     if (!isProfileComplete) {
//   //       navigation.replace('CompleteProfile');
//   //     }

//   //     // CASE 2 — Subscription Not Active
//   //     else if (!isSubscriptionValid) {
//   //       navigation.replace('Subscription');
//   //     }

//   //     // CASE 3 — Everything OK
//   //     else {
//   //       navigation.replace('TrainerBttomStack');
//   //     }
//   //   }, [trainer]);

//   useEffect(() => {
//     if (!trainer) return;

//     if (!trainer.token) return;

//     const isProfileComplete = trainer.isProfileComplete === true;

//     const isSubscriptionValid =
//       trainer.subscription?.isActive === true &&
//       trainer.subscription?.endDate &&
//       new Date(trainer.subscription.endDate) > new Date();

//     console.log('Decision running...');

//     if (!isProfileComplete) {
//       console.log('Navigating to CompleteProfile');
//       navigation.reset({
//         index: 0,
//         routes: [{name: 'CompleteProfile'}],
//       });
//       return;
//     }

//     if (!isSubscriptionValid) {
//       console.log('Navigating to Subscription');
//       navigation.reset({
//         index: 0,
//         routes: [{name: 'Subscription'}],
//       });
//       return;
//     }

//     console.log('Navigating to Home');
//     navigation.reset({
//       index: 0,
//       routes: [{name: 'TrainerBttomStack'}],
//     });
//   }, [trainer]);

//   return (
//     <View
//       style={{
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: '#000',
//       }}>
//       <ActivityIndicator size="large" color="#9FED3A" />
//     </View>
//   );
// };

// export default TrainerFlow;

import React, {useEffect, useState} from 'react';
import {View, ActivityIndicator} from 'react-native';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

const TrainerFlow = () => {
  const trainer = useSelector(state => state.Auth.data);
  const navigation = useNavigation();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!trainer || checked) return;

    if (!trainer.token) return;

    const isProfileComplete = trainer.isProfileComplete === true;

    const isSubscriptionValid =
      trainer.subscription?.isActive === true &&
      trainer.subscription?.endDate &&
      new Date(trainer.subscription.endDate) > new Date();

    setChecked(true); // prevent infinite loop

    if (!isProfileComplete) {
      navigation.reset({
        index: 0,
        routes: [{name: 'CompleteProfile'}],
      });
      return;
    }

    if (!isSubscriptionValid) {
      navigation.reset({
        index: 0,
        routes: [{name: 'Subscription'}],
      });
      return;
    }

    navigation.reset({
      index: 0,
      routes: [{name: 'TrainerBttomStack'}],
    });
  }, [trainer, checked]);

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator size="large" color="#9FED3A" />
    </View>
  );
};

export default TrainerFlow;
