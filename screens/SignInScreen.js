import React, { useState } from 'react';
import { SafeAreaView, Text, View, TouchableOpacity, Alert, TextInput, ImageBackground, KeyboardAvoidingView } from 'react-native';
import styles from '../components/Style';
import { useAuth } from '../components/Auth';
import * as SecureStore from 'expo-secure-store';
import * as Haptics from 'expo-haptics';
import { SubmitButton } from '../components/Buttons';

// import { Cell, Section, TableView } from 'react-native-tableview-simple';
// const { width } = Dimensions.get('screen');

export default function SignInScreen ({ navigation: { navigate }, props }){
    const {signIn} = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')


    function submitSignIn() {
        let url = process.env.EXPO_PUBLIC_API_URL + 'api/auth/signIn'; 

        //empty check
        if (
            email === '' ||
            password === '' 
        ) {
            alert('incorrect username or password');
            return;
        }

        let postData = {
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
                Alert.alert('connection error');
            }
        })
        .then(async (jsonResponse) => {
            if (jsonResponse !== undefined) {
                //store key
                try {
                    await SecureStore.setItemAsync('accessToken', jsonResponse.accessToken);
                } catch (e) {
                    Alert.alert('connection error');
                return;
                }
                Haptics.notificationAsync(
                    Haptics.NotificationFeedbackType.Success
                );
                signIn();
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
                <View style={[styles.mainView, styles.columnFlex]}>
                    {/*Top half  */}
                    <View style={[styles.flex3, styles.backgroundBlue]}>
                        <View style={[styles.flex3]}>
                            <View style={[styles.flex1]}/>
                            <ImageBackground 
                                source={require('../assets/icon-studywelb1.png')} 
                                style={[styles.flex5]} 
                                imageStyle= {[styles.objectFitCover, styles.objectFitContain]}
                            />
                        </View>
                        <View style={[styles.flex1, styles.justifyVerticalCenter, styles.justifyHorizontalCenter]}>
                            <Text style={[styles.text20, styles.fontBold, styles.colourWhite]}>STUDY WELB</Text>
                        </View>
                    </View>
                    {/* bottom half */}
                    <View style={[styles.flex4]}>

                        <View style={[styles.flex3]}/>
                        <View style={[styles.flex2, styles.rowFlex]}>
                            <View style={[styles.flex1]}/>
                            <TextInput
                                style={[styles.flex8, styles.borderRadius20Black, styles.justifyHorizontalCenter, styles.justifyVerticalCenter, styles.textAlignCenter, styles.text15]}
                                placeholder="Email"
                                inputMode='email'
                                placeholderTextColor="#000000"
                                onChangeText={(email) => setEmail(email)}
                            /> 
                            <View style={[styles.flex1]}/>
                        </View>

                        <View style={[styles.flex1]}/>
                        <View style={[styles.flex2, styles.rowFlex]}>
                            <View style={[styles.flex1]}/>
                            <TextInput
                                style={[styles.flex8, styles.borderRadius20Black, styles.justifyHorizontalCenter, styles.justifyVerticalCenter, styles.textAlignCenter, styles.text15]}
                                placeholder="Password"
                                placeholderTextColor="#003f5c"
                                secureTextEntry={true}
                                maxLength={16}
                                onChangeText={(password) => setPassword(password)}
                            />
                            <View style={[styles.flex1]}/>
                        </View>

                        <View style={[styles.flex1]}/>
                        <View style={[styles.flex2]}>
                            <SubmitButton props={{text: "Sign In", onPress: submitSignIn}}/>
                        </View>

                        <View style={[styles.flex1]}/>
                        <View style={[styles.flex2, styles.rowFlex]}>
                            <View style={[styles.flex1]}/>
                            <TouchableOpacity onPress={() => {navigate('SignUpScreen')}}>
                                <Text style={[styles.text15]}>Sign Up</Text>
                            </TouchableOpacity>
                            <View style={[styles.flex1]}/>
                        </View>

                        <View style={[styles.flex1]}/>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
