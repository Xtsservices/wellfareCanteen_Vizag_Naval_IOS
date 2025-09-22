import React, {useState} from 'react';
import {
    Button,
    View,
    ActivityIndicator,
    Text,
    StyleSheet,
    Alert,
    TouchableOpacity,
    Linking,
} from 'react-native';
import {createCashfreeOrder} from './paymentServices';

const CashfreePaymentScreen = () => {
    const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const initiatePayment = async () => {
        console.log('Initiating payment...');
        setLoading(true);
        setError(null);
        setPaymentUrl(null);

        try {
            const paymentData = {
                linkId: 'test_link_209',
                description: 'Test Payment',
                currency: 'INR',
                amount: 100,
                customerName: 'John Doe',
                customerEmail: 'john@example.com',
                customerPhone: '9876543210',
            };

            const result = await createCashfreeOrder(paymentData);
            console.log('API Response:', result);

            if (result?.data?.paymentLink) {
                console.log('Payment URL:', result.data.paymentLink);
                setPaymentUrl(result.data.paymentLink);
            } else {
                throw new Error('Payment link not found in the response');
            }
        } catch (err) {
            console.error('Payment initiation error:', err);
            const errorMessage =
                (err instanceof Error ? err.message : 'Failed to initiate payment') ||
                'Failed to initiate payment';
            setError(errorMessage);
            Alert.alert('Payment Error', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const openPaymentUrl = async () => {
        if (paymentUrl) {
            const supported = await Linking.canOpenURL(paymentUrl);
            if (supported) {
                await Linking.openURL(paymentUrl);
            } else {
                Alert.alert('Error', 'Unable to open the payment URL');
            }
        }
    };

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : error ? (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                    <Button title="Try Again" onPress={initiatePayment} />
                </View>
            ) : paymentUrl ? (
                <TouchableOpacity onPress={openPaymentUrl}>
                    <Text style={styles.linkText}>Click here to complete payment</Text>
                </TouchableOpacity>
            ) : (
                <Button title="Pay with Cashfree" onPress={initiatePayment} />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    errorContainer: {
        alignItems: 'center',
    },
    errorText: {
        color: 'red',
        marginBottom: 20,
        fontSize: 16,
        textAlign: 'center',
    },
    linkText: {
        color: 'blue',
        textDecorationLine: 'underline',
        fontSize: 16,
        textAlign: 'center',
    },
});

export default CashfreePaymentScreen;
