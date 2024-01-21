import React, { useEffect, useState } from 'react';
import { ImageBackground, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import styles from '../components/Style';
import { getAccessToken } from '../helpers/AccessTokenHelper';
import { useAuth } from '../components/Auth';
import * as SecureStore from 'expo-secure-store';
import * as Haptics from 'expo-haptics';


export default function SettingsScreen({ navigation: { navigate }, props }){
    const {signOut} = useAuth();

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
                    <View style={[styles.flex1, styles.justifyVerticalCenter, styles.justifyHorizontalCenter]}>

                    </View>
                    <View style={[styles.flex1, styles.justifyVerticalCenter, styles.justifyHorizontalCenter]}>

                    </View>
                </View>

                {/* bottom half */}
                <View style={[styles.flex4, styles.backgroundLightBlue]}>
                    <TouchableOpacity style={[styles.flex1]}>
                        <View style={[styles.flex1, styles.borderBlacknoBottom, styles.justifyHorizontalCenter, styles.justifyVerticalCenter]}>
                            <Text style={[styles.text20]}>Update Profile Info</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.flex1]}>
                        <View style={[styles.flex1, styles.borderBlacknoBottom, styles.justifyHorizontalCenter, styles.justifyVerticalCenter]}>
                            <Text style={[styles.text20]}>Update Profile Photo</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.flex1]}>
                        <View style={[styles.flex1, styles.borderBlacknoBottom, styles.justifyHorizontalCenter, styles.justifyVerticalCenter]}>
                            <Text style={[styles.text20]}>More Settings</Text>
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
                        <View style={[styles.flex1, styles.borderBlack, styles.justifyHorizontalCenter, styles.justifyVerticalCenter]}>
                            <Text style={[styles.text20]}>Sign Out</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}