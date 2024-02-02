import React, { useEffect, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import styles from '../components/Style';
import { getAccessToken } from '../helpers/AccessTokenHelper';
import {Calendar} from 'react-native-calendars';
import { Dimensions } from 'react-native';
import { ActivityRowStatic } from '../components/ActivityRow';
import { localiseAndFormatDBDate } from '../helpers/DateTimeHelper';
import { useNavigationState } from '@react-navigation/native';
const { height } = Dimensions.get('screen');


export default function HomeScreen({ navigation: { navigate }, props }){
    const pageIndex = useNavigationState(state => state.index);
    const [accessToken, setAccessToken] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [markedDatesArray, setMarkedDatesArray] = useState([]);
    const [markedDates, setMarkedDates] = useState({});
    const [fetchTaskIds, setFetchTaskIds] = useState(false);
    const [dateToId, setDateToId] = useState({});
    const [tasks, setTasks] = useState([]);
    const [journalAvailable, setJournalAvailable] = useState(false);

    /* Overview 
    start:
    get accesstoken 
    fetch taskdays 
    mark currently selected day
    mark days with tasks 
    fetch selected day tasks
    fetch selected day journals - count

    onDayChange:
    mark currently selected day
    fetch task with taskday id for the day (if none - means nothing on the day - dont fetch)
    fetch selected day journals - count

    onMonthChange:
    change selected day to first of the month
    reset all marked dates
    mark currently selected day
    fetch taskdays 
    mark days with tasks 
    fetch task for selected day
    fetch selected day journals - count

    for marked days to not clash with selected day:
    reset all marked days and check if it is on selected day
    iterate with markedDatesArray

    fetches:
    - taskdays GET request
    - tasks GET request
    - journal count GET request

    */
      
    //access token
    useEffect(() => {
        //initial load from login
        getAccessToken().then(accessToken => {
            setAccessToken(accessToken);
        })
    }, []);

    //initial fetch after access token
    useEffect(() => {
        if (accessToken !== '') {
            fetchCurrentMonthTasksIds();
        }
    }, [accessToken])

    //reset and fetch taskids for the month on month change
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

    //fetch tasks and (journal count) on date selection
    useEffect((() => {
        //mark selected Date for normal select
        markSelectedDate();
        //reset tasks and journal available
        setTasks([]);
        setJournalAvailable(false);
        let taskDaysId = dateToId[selectedDate]
        //means there are entries to fetch
        if (taskDaysId !== undefined) {
            fetchSelectedDayTasks(taskDaysId);
            fetchSelectedDayJornal(taskDaysId);
        }
    }), [selectedDate])

    //to fetch tasks and journals after fetchCurrentMonthTasksIds is completed and dateToId is completed
    useEffect(() => {
        let taskDaysId = dateToId[selectedDate]
        //means there are entries to fetch
        if (taskDaysId !== undefined) {
            fetchSelectedDayTasks(taskDaysId);
            fetchSelectedDayJornal(taskDaysId);
        }
    }, [dateToId])

    useEffect(() => { 
        //reload data once back from daytasks
        if (accessToken !== '') {
            if (pageIndex === 0) {
                fetchCurrentMonthTasksIds();
            }
        }
    }, [pageIndex])


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

        let url = process.env.EXPO_PUBLIC_API_URL + 'api/taskDays/get-user-taskdays?' + searchParams; 
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
                console.log(response)
            }
        })
        .then((jsonResponse) => {
            if (jsonResponse !== undefined) {
                console.log(jsonResponse);
        
                //placeholders for state updates
                let newMarkedDates = {};
                let newMarkedDatesArray = [];
                let newDateToId = {};
        
                //iterate through results to extract all the dates to taskdays id
                //mark days with tasks / journal entries (backend queries taskdays that have at least 1 entry in either tasks or journals table for the date)
                for (const task of jsonResponse.result) {             
                    let taskDate = localiseAndFormatDBDate(task.date);
                    let taskId = task.id;
                    const isCurrentDateSelected = taskDate === selectedDate;
        
                    // Update placeholders
                    newMarkedDates = {
                        ...newMarkedDates,
                        [taskDate]: { marked: true, selected: isCurrentDateSelected },
                    };
                    newMarkedDatesArray = [...newMarkedDatesArray, taskDate];
                    newDateToId = {
                        ...newDateToId,
                        [taskDate]: taskId,
                    };
                }
        
                //update states after the loop
                setMarkedDates((prevMarkedDates) => ({ ...prevMarkedDates, ...newMarkedDates }));
                setMarkedDatesArray((prevMarkedDates) => [...prevMarkedDates, ...newMarkedDatesArray]);
                setDateToId((prevDateToId) => ({ ...prevDateToId, ...newDateToId }));
            }
        })
        .catch((err) => {
            console.error('Fetch error:', err);
        });
    }

    //fetch all of the days that have taskday table row and their ids
    function fetchSelectedDayTasks(taskDaysId) {
        const data = {
            taskDaysId: taskDaysId
        }
        searchParams = new URLSearchParams(data).toString();

        let url = process.env.EXPO_PUBLIC_API_URL + 'api/tasks/get-tasks?' + searchParams; 
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
                console.log(response)
            }
        })
        .then(async (jsonResponse) => {
            if (jsonResponse !== undefined) {
                console.log(jsonResponse)
                setTasks(jsonResponse.result)
            
            }
        })
        .catch((err) => {
            console.error('Fetch error:', err);
        });
    }

    //fetch and check if selected day has journal entry
    function fetchSelectedDayJornal(taskDaysId) {
        const data = {
            taskDaysId: taskDaysId
        }
        searchParams = new URLSearchParams(data).toString();

        let url = process.env.EXPO_PUBLIC_API_URL + 'api/journals/get-journal-available?' + searchParams; 
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
                console.log(response)
            }
        })
        .then(async (jsonResponse) => {
            if (jsonResponse !== undefined) {
                console.log(jsonResponse.result[0].journalCount)
                if (jsonResponse.result[0].journalCount > 0) {
                    setJournalAvailable(true);
                } else {
                    setJournalAvailable(false);
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
                            //placeholders for state updates
                            let newMarkedDates = {};    
                            //reset and update the current list of marked days
                            for (const taskDate of markedDatesArray) {
                                const isCurrentDateSelected = taskDate === selectedDate;
                                const newEntry = {
                                    [taskDate]: { marked: true, selected: isCurrentDateSelected },
                                };

                                // Create a placeholder for state update
                                newMarkedDates = {
                                    ...newMarkedDates,
                                    ...newEntry,
                                };
                            }
                            //update the state after the loop
                            setMarkedDates((prevMarkedDates) => ({ ...prevMarkedDates, ...newMarkedDates }));

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
                <View style={[styles.flex7]}>
                    <View style={[styles.flex2, styles.justifyVerticalCenter, styles.rowFlex, styles.justifyHorizontalCenter, styles.backgroundBlue]}>
                        <View style={[styles.flex1, styles.justifyHorizontalCenter]}>
                            <Text style={[styles.text15, styles.fontBold, styles.colourWhite]}>{formattedDate}</Text>
                        </View>
                    </View>
                    <View style={[styles.flex6, styles.backgroundWhite]}>
                    <ScrollView style={[styles.flex1]}>
                        {/* <ActivityRowStatic
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
                        /> */}
                        {
                            tasks.length > 0 ?
                            tasks.map((resp, index) => (
                                <ActivityRowStatic
                                    key={'activityrow' + index}
                                    props={{
                                            onPress: () => console.log('hello'),
                                            activity: resp.task_title,
                                            time: resp.start_time.substring(0, resp.start_time.length-3) 
                                            + " - " 
                                            + resp.end_time.substring(0, resp.start_time.length-3),
                                        }}
                                    />
                            )) : 
                            <ActivityRowStatic
                                    props={{
                                    onPress: () => console.log('hello'),
                                    activity: 'no tasks for the day',
                                    time: 'add a task'
                                }}
                            />
                        }
                    </ScrollView>
                    </View>
                    <View style={[styles.flex2, styles.rowFlex]}>
                        <TouchableOpacity style={[styles.flex1, styles.justifyVerticalCenter, styles.borderLightBlue, styles.backgroundBlue]} onPress= {() => navigate('JournalScreen', { selectedDate: selectedDate  })}>
                            {
                                journalAvailable?
                                <Text style={[styles.text15, styles.colourWhite, styles.textAlignCenter, styles.fontBold]}>View Journal (1)</Text> :
                                <Text style={[styles.text15, styles.colourWhite, styles.textAlignCenter, styles.fontBold]}>View Journal (0)</Text>
                            } 
                            
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.flex1, styles.justifyVerticalCenter, styles.borderLightBlue, styles.backgroundBlue]} onPress= {() => navigate('DayTasksScreen', { selectedDate: selectedDate })}>
                            <Text style={[styles.text15, styles.colourWhite, styles.textAlignCenter, styles.fontBold]}>{'View Tasks (' + tasks.length + ')'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}
