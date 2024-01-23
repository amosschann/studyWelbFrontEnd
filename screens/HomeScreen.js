import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import styles from '../components/Style';
import { getAccessToken } from '../helpers/AccessTokenHelper';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import { Dimensions } from 'react-native';
const { height } = Dimensions.get('screen');


export default function HomeScreen({ navigation: { navigate }, props }){
    const [accessToken, setAccessToken] = useState('');
    const [selectedDate, setSelectedDate] = useState(Date.now());

    useEffect(() => {
        //initial load from login
        getAccessToken().then(accessToken => {
            setAccessToken(accessToken);
        })
    }, []);

    /* Date Formatting */
    const inputDate = new Date(selectedDate);
    const options = { day: "numeric", month: "short", year: "numeric" };
    const formattedDate = inputDate.toLocaleDateString("en-GB", options);

    return (
        
        <SafeAreaView style={styles.container}>
            <View style={[styles.mainView, styles.columnFlex]}>

                {/*Top half  */}
                <View style={[styles.flex1, styles.backgroundLightBlue]}>
                    <Calendar
                        onDayPress={day => {
                            setSelectedDate(day.dateString);
                        }}
                        style={{
                            borderWidth: 1,
                            borderColor: 'white',
                            height: (height * 2/5) ,
                        }}
                        markedDates={{
                            [selectedDate]: {selected: true, disableTouchEvent: true, selectedDotColor: 'blue'}
                        }}
                        theme={{
                            backgroundColor: '#ffffff',
                            calendarBackground: '#ffffff',
                            textSectionTitleColor: '#b6c1cd',
                            selectedDayBackgroundColor: '#00adf5',
                            selectedDayTextColor: '#ffffff',
                            todayTextColor: '#3E4756',
                            dayTextColor: '#2d4150',
                            textDisabledColor: '#d9e'
                        }}
                    /> 
                </View>

                {/* bottom half */}
                <View style={[styles.flex1, styles.backgroundLightBlue]}>
                <View style={[styles.flex2, styles.justifyVerticalCenter, styles.rowFlex, styles.justifyHorizontalCenter]}>
                    <View style={[styles.flex1, styles.justifyHorizontalCenter]}>
                        <Text style={[styles.text15, styles.fontBold]}>{formattedDate}</Text>
                    </View>
                    <TouchableOpacity style={[styles.positionAbsolute, { right: 10 }]}>
                        <Text style={[styles.text15]}>View All →</Text>
                    </TouchableOpacity>
                </View>
                    <View style={[styles.flex5, styles.backgroundWhite]}>
                    
                    </View>
                    <View style={[styles.flex1]}>
                    
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}
