import React, { useEffect, useState } from 'react';
import { ImageBackground, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import styles from '../components/Style';
import { getAccessToken } from '../helpers/AccessTokenHelper';
import { useAuth } from '../components/Auth';
import * as SecureStore from 'expo-secure-store';
import * as Haptics from 'expo-haptics';


export default function SettingsScreen({ navigation: { navigate }, props }){
    const {signOut} = useAuth();
    const [accessToken, setAccessToken] = useState('');
    const [userName, setUserName] = useState('')
    const [email, setEmail] = useState('');

    useEffect(() => {
        //initial load from login
        getAccessToken().then(accessToken => {
            setAccessToken(accessToken);
        })
        
    }, []);

    useEffect((() => {
        if (accessToken !== '') {
            getUserProfileDetails();
        }
    }),[accessToken])

    function getUserProfileDetails() {
        
        let url = process.env.EXPO_PUBLIC_API_URL + 'api/users/user-profile-detail'; 
        fetch(url, {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization' : accessToken
            },
            redirect: 'follow',
            referrer: 'client',
        })
        .then((response) => {
            return response.json();
        })
        .then((jsonResponse) => {
            setUserName(jsonResponse.result[0].name);
            setEmail(jsonResponse.result[0].email);
        })
        .catch((err) => {
            console.error('Fetch error:', err);
        });
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={[styles.mainView, styles.columnFlex]}>

                {/*Top half  */}
                <View style={[styles.flex3, styles.backgroundBlue]}>
                    <View style={[styles.flex5]}>
                        <View style={[styles.flex1]}/>
                        <ImageBackground
                            source={require('../assets/profile-pic.png')} 
                            style={[styles.flex5]} 
                            imageStyle= {[styles.objectFitCover, styles.objectFitContain]}
                        />
                    </View>
                    <View style={[styles.flex1, styles.justifyVerticalBottom, styles.justifyHorizontalCenter]}>
                        <Text style={[styles.text20, styles.colourWhite, styles.fontBold]}>{userName}</Text>
                    </View>
                    <View style={[styles.flex1, styles.justifyVerticalCenter, styles.justifyHorizontalCenter]}>
                    <Text style={[styles.text15, styles.colourWhite]}>{email}</Text>
                    </View>
                </View>

                {/* bottom half */}
                <View style={[styles.flex4]}>
                    <TouchableOpacity style={[styles.flex1]}>
                        <View style={[styles.flex1, styles.borderGreynoBottom, styles.justifyHorizontalCenter, styles.justifyVerticalCenter]}>
                            <Text style={[styles.text15, styles.fontBold]}>Update Profile Info</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.flex1]}>
                        <View style={[styles.flex1, styles.borderGreynoBottom, styles.justifyHorizontalCenter, styles.justifyVerticalCenter]}>
                            <Text style={[styles.text15, styles.fontBold]}>Update Profile Photo</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.flex1]}>
                        <View style={[styles.flex1, styles.borderGreynoBottom, styles.justifyHorizontalCenter, styles.justifyVerticalCenter]}>
                            <Text style={[styles.text15, styles.fontBold]}>More Settings</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.flex1]} onPress={async () => {
                         try {
                                await SecureStore.deleteItemAsync('accessToken');
                            } catch (error) {
                                console.error('Error clearing AsyncStorage data:', error);
                            }
                            Haptics.notificationAsync(
                                Haptics.NotificationFeedbackType.Success
                            );
                            signOut();

                    }}>
                        <View style={[styles.flex1, styles.borderGrey, styles.justifyHorizontalCenter, styles.justifyVerticalCenter]}>
                            <Text style={[styles.text15, styles.fontBold]}>Sign Out</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}