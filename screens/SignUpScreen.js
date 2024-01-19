import React, { useState } from 'react';
import { SafeAreaView, View, Alert, TextInput, ImageBackground, KeyboardAvoidingView} from 'react-native';
import styles from '../components/Style';
import * as Haptics from 'expo-haptics';

export default function SignUpScreen ({ navigation }){
    const [profileName, setProfileName] = useState('')
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')


    function submitSignUp() {
        let url = process.env.EXPO_PUBLIC_API_URL + 'api/users/signup';

        //empty check
        if (
            profileName === '' ||
            email === '' ||
            password === '' ||
            confirmPassword === ''
        ) {
            alert('missing field');
            return;
        }

        //password check
        if (password !== confirmPassword) {
            alert('mismatched password');
            return;
        }

        let postData = {
            'profileName': profileName,
            'email': email.toLowerCase(),
            'password': password
        };

        fetch(url, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            redirect: 'follow',
            referrer: 'client',
            body: JSON.stringify(postData)
        })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else if (response.status === 500) {
                return response.json().then((error) => {
                    Alert.alert( error.message);
                });
            } else {
                Alert.alert('unkown error occurred');
            }
        })
        .then((jsonResponse) => {
            if (jsonResponse !== undefined) {
                alert('Sign Up Success')
                Haptics.notificationAsync(
                    Haptics.NotificationFeedbackType.Success
                );
                navigation.goBack();
            }
        })
        .catch((err) => {
            console.error('Fetch error:', err);
        });

    }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior="position"
            >
                <View style={[styles.mainView, styles.flexColumn]}>
                    
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
