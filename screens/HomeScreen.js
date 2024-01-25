import React, { useEffect, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import styles from '../components/Style';
import { getAccessToken } from '../helpers/AccessTokenHelper';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import { Dimensions } from 'react-native';
import { ActivityRowChecked, ActivityRowNotChecked, ActivityRowStatic } from '../components/ActivityRow';
import { localiseAndFormatDBDate } from '../helpers/DateTimeHelper';
const { height } = Dimensions.get('screen');


export default function HomeScreen({ navigation: { navigate }, props }){
    const [accessToken, setAccessToken] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [markedDatesArray, setMarkedDatesArray] = useState([]);
    const [markedDates, setMarkedDates] = useState({});
    const [fetchTaskIds, setFetchTaskIds] = useState(false);
    const [dateToId, setDateToId] = useState({});
      

    useEffect(() => {
        //initial load from login
        getAccessToken().then(accessToken => {
            setAccessToken(accessToken);
        })
    }, []);


    useEffect(() => {
        if (accessToken !== '') {
            fetchCurrentMonthTasksIds();
        }
    }, [accessToken])

    useEffect(() => {
        if (fetchTaskIds) {
            //reset marked dates and ids
            setMarkedDates({});
            setMarkedDatesArray([]);
            setDateToId({})
            //mark selected Date and then fetch ids for the month - reduce lag time for selection
            markSelectedDate();
            fetchCurrentMonthTasksIds();
            setFetchTaskIds(false);
        }
    }, [selectedDate, fetchTaskIds])

    useEffect((() => {
        //mark selected Date for normal select
        markSelectedDate();
        let dateId = dateToId[selectedDate]
        //means there are entries to fetch
        if (dateId !== undefined) {
            console.log(dateId)
        }
    }), [selectedDate])

    /* Date Formatting */
    const inputDate = new Date(selectedDate);
    const options = { day: "numeric", month: "short", year: "numeric" };
    const formattedDate = inputDate.toLocaleDateString("en-GB", options);


    //mark the current selected date
    function markSelectedDate() {
        let isCurrentDateMarked = false;
        if (markedDatesArray.includes(selectedDate)) {
          isCurrentDateMarked = true;  
        }
        const newEntry = {
            [selectedDate]: {marked: isCurrentDateMarked, selected: true},
        };
        setMarkedDates((prevMarkedDates) => {
            return {
                ...prevMarkedDates,
                ...newEntry,
            };
        })
    }


    //fetch all of the days that have taskday table row and their ids
    function fetchCurrentMonthTasksIds() {
        const dateArray = selectedDate.split('-');
        //extract the month 
        const monthNumber = parseInt(dateArray[1], 10);
        const yearNumber = parseInt(dateArray[0], 10)
        const data = {
            month: monthNumber,
            year: yearNumber
        }
        searchParams = new URLSearchParams(data).toString();

        let url = process.env.EXPO_PUBLIC_API_URL + 'api/tasks/get-user-taskdays?' + searchParams; 
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
            if (response.ok) {
                return response.json();
            } else {
                Alert.alert('unkown error occurred');
            }
        })
        .then(async (jsonResponse) => {
            if (jsonResponse !== undefined) {
                console.log(jsonResponse)
                //iterate through results to extract all the dates to taskdays id
                //mark days with tasks / journal entries (backend queires taskdays that have at least 1 entry in either tasks or journals table for the date)
                for (const task of jsonResponse.result) {             
                    let taskDate = localiseAndFormatDBDate( task.date);
                    let taskId = task.id;
                    const isCurrentDateSelected = taskDate === selectedDate;

                    const newEntry = {
                        [taskDate]: { marked: true , selected: isCurrentDateSelected},
                    };
                    //for direct direct placement in marked dates
                    setMarkedDates((prevMarkedDates) => {
                        return {
                            ...prevMarkedDates,
                            ...newEntry,
                        };
                    });
                    //for onSelect iteration 
                    setMarkedDatesArray((prevMarkedDates) => 
                        [...prevMarkedDates,
                            taskDate,]
                    );
                    const dateAndId = {[taskDate]: taskId}
                    //for api call to that day
                    setDateToId((prevDateToId) => {
                        return {
                            ...prevDateToId,
                            ...dateAndId,
                        };
                    });
                }
            }
        })
        .catch((err) => {
            console.error('Fetch error:', err);
        });
    }



    return (
        
        <SafeAreaView style={styles.container}>
            <View style={[styles.mainView, styles.columnFlex]}>

                {/*Top half  */}
                <View style={[styles.flex8]}>
                    <Calendar
                        //on calendar day click
                        onDayPress={day => {
                            let selectedDate = day.dateString;
                            setSelectedDate(selectedDate);
                            //reset marked dates
                            setMarkedDates({})
                            // reset and update the curret list of marked days
                            for (const taskDate of markedDatesArray) {
                                const isCurrentDateSelected = taskDate === selectedDate;
                                const newEntry = {
                                    [taskDate]: { marked: true , selected: isCurrentDateSelected},
                                };
                                setMarkedDates((prevMarkedDates) => {
                                    return {
                                        ...prevMarkedDates,
                                        ...newEntry,
                                    };
                                });
                            }
                        }}
                        //on switching between months
                        onMonthChange={month => {
                            let selectedMonth = month.month;
                            //vaidate month string format
                            if (selectedMonth < 10) {
                                selectedMonth = "0" + selectedMonth;
                            }
                            let year = month.year;
                            let newSelect = year + "-" + selectedMonth + "-01";
                            setFetchTaskIds(true);
                            //set to the first day of the month
                            setSelectedDate(newSelect);
                        }}
                        style={{
                            borderWidth: 1,
                            borderColor: 'white',
                            height: (height * 2/5) -30,
                        }}
                        markedDates={{
                            ...markedDates
                        }}

                    /> 
                </View>

                {/* bottom half */}
                <View style={[styles.flex7, styles.backgroundLightBlue]}>
                <View style={[styles.flex2, styles.justifyVerticalCenter, styles.rowFlex, styles.justifyHorizontalCenter]}>
                    <View style={[styles.flex1, styles.justifyHorizontalCenter]}>
                        <Text style={[styles.text15, styles.fontBold]}>{formattedDate}</Text>
                    </View>
                    <TouchableOpacity style={[styles.positionAbsolute, { right: 10 }]}>
                        <Text style={[styles.text15]}>View All →</Text>
                    </TouchableOpacity>
                </View>
                    <View style={[styles.flex6, styles.backgroundWhite]}>
                    <ScrollView style={[styles.flex1]}>
                        <ActivityRowStatic
                                    props={{
                                    onPress: () => console.log('hello'),
                                    activity: 'testt',
                                    time: 'test time'
                                }}
                        />
                        <ActivityRowNotChecked
                            props={{
                                    onPress: () => console.log('hello'),
                                    onPressCheck: () => console.log('hey'),
                                    activity: 'testt',
                                    time: 'test time'
                                }}
                        />
                        <ActivityRowChecked
                            props={{
                                    onPress: () => console.log('hello'),
                                    activity: 'testt',
                                    time: 'test time'
                                }}
                        />
                    </ScrollView>
                    </View>
                    <View style={[styles.flex1]}>
                    
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}
