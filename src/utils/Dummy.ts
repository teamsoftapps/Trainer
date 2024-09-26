import axiosBaseURL from '../services/AxiosBaseURL';
import {Images} from './Images';

export const UserImages = [
  {
    image: Images.trainer,
    name: 'Alex Morgan',
  },
  {
    image: Images.trainer2,
    name: 'Nick Dias',
  },
  {
    image: Images.trainer3,
    name: 'Ruben Neves',
  },
  {
    image: Images.trainer,
    name: 'Alex Morgan',
  },
  {
    image: Images.trainer2,
    name: 'Nick Dias',
  },
  {
    image: Images.trainer3,
    name: 'Ruben Neves',
  },
];
export const upcoming = [
  {
    id: 1,
    name: 'Alex Morgan',
    distance: '0.43 miles away',
    rate: '$20',
    expertise: 'Body Building',
    image: Images.trainer2,
    rating: 5,
    reviews: 65,
  },
  {
    id: 2,
    name: 'Barbra Michelle',
    distance: '1.2 miles away',
    rate: '$70',
    expertise: 'Boxing',
    image: Images.trainer,
    rating: 4.5,
    reviews: 50,
  },
  {
    id: 3,
    name: 'Mathues Pablo',
    distance: '2.5 miles away',
    rate: '$30',
    expertise: 'Aerobics',
    image: Images.trainer3,
    rating: 4,
    reviews: 45,
  },
];
export const TrainerProfile = [
  {
    id: 0,
    ProfileImage: Images.trainer4,
    cate: 'Crossfit',
    ProfileName: 'Alex Morgan',
    location: `${0.43} mi away`,
    rating: 4,
    isFollow: true,
  },
  {
    id: 1,
    ProfileImage: Images.trainer4,
    cate: 'Crossfit',
    ProfileName: 'Alex Morgan',
    location: `${0.43} mi away`,
    rating: 5,
    isFollow: false,
  },
  {
    id: 2,
    ProfileImage: Images.trainer4,
    cate: 'Crossfit',
    ProfileName: 'Alex Morgan',
    location: `${0.43} mi away`,
    rating: 2.8,
    isFollow: true,
  },
  {
    id: 3,
    ProfileImage: Images.trainer4,
    cate: 'Crossfit',
    ProfileName: 'Alex Morgan',
    location: `${0.43} mi away`,
    rating: 3.5,
    isFollow: false,
  },
];
export const availableTimes = [
  '08:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '03:00 PM',
  '4:00 PM',
];
export const Specialities = [
  {key: 1, value: 'Strength Training'},
  {key: 2, value: 'Yoga'},
  {key: 3, value: 'Cardio Fitness'},
  {key: 4, value: 'Weight Loss Coaching'},
  {key: 5, value: 'Bodybuilding'},
  {key: 6, value: 'Crossfit'},
];
export const TimeSlots = [
  '08:00 AM',
  '09:00 AM',
  '10:00 AM',
  '11:00 PM',
  '12:00 PM',
  '1:00 PM',
  '2:00 PM',
  '3:00 PM',
  '4:00 PM',
];
import {
  format,
  startOfMonth,
  endOfMonth,
  addMonths,
  eachDayOfInterval,
  isWeekend,
} from 'date-fns';

export const generateDatesToMark = () => {
  const today = new Date();

  const startCurrentMonth = startOfMonth(today);
  const endCurrentMonth = endOfMonth(today);

  const startNextMonth = startOfMonth(addMonths(today, 1));
  const endNextMonth = endOfMonth(addMonths(today, 1));

  const allDates = [
    ...eachDayOfInterval({start: today, end: endCurrentMonth}),
    ...eachDayOfInterval({start: startNextMonth, end: endNextMonth}),
  ];

  const datesToMark = allDates
    .filter(date => !isWeekend(date))
    .map(date => format(date, 'yyyy-MM-dd'));

  return datesToMark;
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const options = {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: '2-digit',
  };

  const formattedDate = date.toLocaleDateString('en-GB', options);
  const [weekday, day, month, year] = formattedDate.split(' ');
  return `${weekday} ${day} ${month}, ${year}`;
};

export const fetchPaymentSheetparams = async (CustomerID: string, amount) => {
  const response = await axiosBaseURL.post('/Common/InitializePaymentIntent', {
    customerID: CustomerID,
    amount: amount,
  });
  const {ephemeralKey, paymentIntent, customer} = await response.data.data;
  return {
    ephemeralKey,
    paymentIntent,
    customer,
  };
};
export const fetchSetupSheetparams = async (stripeId: string) => {
  console.log('helloo stripe: ', stripeId);
  const response = await axiosBaseURL.post('/Common/InitializeSetupIntent', {
    customerID: stripeId,
  });
  const {ephemeralKey, setupIntents} = await response.data.data;
  console.log('is data going:', response.data);
  return {
    ephemeralKey,
    setupIntents,
  };
};
export const Seartrainer = [
  {
    id: 1,
    name: 'Alex Morgan',
    location: '0.43 mi',
    rate: '$20',
    expertise: 'Training',
    image: Images.trainer4,
    rating: 5,
    reviews: 65,
    claender: Images.calendar,
    days: 'MON-FRI',
    time: Images.clock,
    timing: '10:00-18:00',
  },
  {
    id: 2,
    name: 'Alex Morgan',
    location: '0.43 mi',
    rate: '$20',
    expertise: 'Training',
    image: Images.Trainerpost1,
    rating: 2,
    reviews: 65,
    claender: Images.calendar,
    days: 'MON-FRI',
    time: Images.clock,
    timing: '10:00-18:00',
  },
  {
    id: 3,
    name: 'Alex Morgan',
    location: '0.43 mi',
    rate: '$20',
    expertise: 'Training',
    image: Images.trainerpost,
    rating: 1,
    reviews: 65,
    claender: Images.calendar,
    days: 'MON-FRI',
    time: Images.clock,
    timing: '10:00-18:00',
  },
];
