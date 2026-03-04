import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
    LayoutAnimation,
    Platform,
    UIManager
} from 'react-native';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import Icon from 'react-native-vector-icons/Ionicons';

if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

const FAQItem = ({ question, answer }) => {
    const [expanded, setExpanded] = useState(false);

    const toggleExpand = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded(!expanded);
    };

    return (
        <View style={styles.faqCard}>
            <TouchableOpacity style={styles.faqHeader} onPress={toggleExpand} activeOpacity={0.7}>
                <Text style={styles.questionText}>{question}</Text>
                <Icon name={expanded ? "chevron-up" : "chevron-down"} size={20} color="#888" />
            </TouchableOpacity>
            {expanded && (
                <View style={styles.faqContent}>
                    <Text style={styles.answerText}>{answer}</Text>
                </View>
            )}
        </View>
    );
};

const FAQs = ({ navigation }) => {
    const faqs = [
        {
            id: '1',
            question: "Are the trainer's employees of Stern's Gym Trainers Connect?",
            answer: "No, our trainers are independent professionals vetted by our team to ensure the highest quality of service."
        },
        {
            id: '2',
            question: "About Loynie and His Father's Legacy",
            answer: "Loynie carries forward a legacy of strength and discipline started by his father in 1946."
        },
        {
            id: '3',
            question: "About Stern's Gym?",
            answer: "Stern's Gym has been a landmark of physical excellence and traditional training since 1946."
        },
        {
            id: '4',
            question: "How can I get in contact with Stern's Gym Trainers Connect?",
            answer: "You can reach us through the contact form in the settings or via email at support@sternsgym.com."
        },
        {
            id: '5',
            question: "What type of training options can I find through the app?",
            answer: "We offer personal training, group sessions, nutritional plans, and specialized athletic coaching."
        },
        {
            id: '6',
            question: "Are all trainers on the app verified and qualified?",
            answer: "Yes, every trainer undergoes a rigorous background check and certification verification process."
        },
        {
            id: '7',
            question: "Can I communicate with trainers before making a decision?",
            answer: "Absolutely! You can use the built-in chat feature to message trainers and ask questions."
        },
        {
            id: '8',
            question: "What should I do if I have a negative experience with a trainer?",
            answer: "Please report any issues through the app's help center. We take user feedback very seriously."
        }
    ];

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
                    <Icon name="arrow-back" size={28} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>FAQ</Text>
                <View style={{ width: 28 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {faqs.map(item => (
                    <FAQItem key={item.id} question={item.question} answer={item.answer} />
                ))}
            </ScrollView>
        </SafeAreaView>
    );
};

export default FAQs;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#161616',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    headerTitle: {
        color: '#fff',
        fontSize: responsiveFontSize(2.8),
        fontWeight: 'bold',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
        paddingTop: 10,
    },
    faqCard: {
        backgroundColor: '#1E1E1E',
        borderRadius: 15,
        marginBottom: 15,
        overflow: 'hidden',
    },
    faqHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
    },
    questionText: {
        color: '#fff',
        fontSize: responsiveFontSize(1.8),
        fontWeight: '600',
        flex: 1,
        marginRight: 10,
    },
    faqContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    answerText: {
        color: '#aaa',
        fontSize: responsiveFontSize(1.6),
        lineHeight: 22,
    }
});
