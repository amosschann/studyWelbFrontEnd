import React, { useEffect, useState } from 'react';
import { SafeAreaView, View } from 'react-native';
import styles from '../components/Style';
import { getAccessToken } from '../helpers/AccessTokenHelper';


export default function WellnessScreen({ navigation: { navigate }, props }){
    const [accessToken, setAccessToken] = useState('');

    useEffect(() => {
        //initial load from login
        // getAccessToken().then(accessToken => {
        //     setAccessToken(accessToken);
        // })
    }, []);



    return (
        <SafeAreaView style={styles.container}>
            <View style={[styles.mainView, styles.flexColumn]}>
                
            </View>
        </SafeAreaView>
    );
}