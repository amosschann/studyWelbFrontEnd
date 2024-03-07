import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Alert, TextInput, TouchableOpacity, ImageBackground, KeyboardAvoidingView, Text, Keyboard, TouchableWithoutFeedback, ScrollView,  Dimensions } from 'react-native';
import styles from '../components/Style';
import { getAccessToken } from '../helpers/AccessTokenHelper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { formatTimestampToDate, localiseAndFormatDBDate } from '../helpers/DateTimeHelper';
import { ActivityRowStaticHalf } from '../components/ActivityRow';
const { height, width } = Dimensions.get('screen');

export default function WellnessStasticScreen ({ navigation: { goBack, navigate }, route }){
    const [accessToken, setAccessToken] = useState('');
    const [selectedDay, setSelectedDay] = useState('Monday');
    const [selectedDayIndex, setSelectedDayIndex] = useState(0);
    const [dayMoods, setDayMoods] = useState([]);
    const [taskCompleted, setTaskCompleted] = useState(0);
    const [taskNotCompleted, setTaskNotCompleted] = useState(0);
    const [journalDescription, setJournalDescription] = useState('No journal record for the day');
    const [uncompletedTasks, setUncompletedTasks] = useState([]);
    const [completedTasksHappyMood, setCompletedTasksHappyMood] = useState([]);
    const [completedTasksNeutralMood, setCompletedTasksNeuralMood] = useState([]);
    const [completedTasksSadMood, setCompletedTasksSadMood] = useState([]);

    const daysOfTheWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const daysOfTheWeekFull = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    //date formating
    const date = new Date(route.params.selectedDate);
    // Get the day of the week, 0 == sunday, 7 == monday
    const day = date.getDay(); 
    //clone day
    const startOfWeek = new Date(date);
    //set the start of the week day to monday
    startOfWeek.setDate(date.getDate() - day + (day === 0 ? -6 : 1)); 
    //clone start of the week day
    const endOfWeek = new Date(startOfWeek); 
    //set end of the week
    endOfWeek.setDate(startOfWeek.getDate() + 6);

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
            fetchWeekStatistics();
        }
    }, [accessToken])

    //fetch journal stats and overall stats after weekstatistics (mood) has been fetched
    useEffect(() => {
        if (accessToken !== '') {
            fetchMoodDescription();
            fetchTasks();
        }
        
    }, [dayMoods]);

    //fetch journal stats and overall stats on day selection
    useEffect(() => {
        if (accessToken !== '') {
            fetchMoodDescription();
            fetchTasks();
        }
    }, [selectedDayIndex])

    function fetchWeekStatistics() {
        const data = {
            start_date: formatTimestampToDate(startOfWeek),
            end_date: formatTimestampToDate(endOfWeek)
        }
        searchParams = new URLSearchParams(data).toString();

        let url = process.env.EXPO_PUBLIC_API_URL + 'api/journals/get-journal-overallmood?' + searchParams; 
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
                // console.log(jsonResponse)
                if (jsonResponse.result.length > 0) {
                    setDayMoods(jsonResponse.result);
                }
            }
        })
        .catch((err) => {
            console.error('Fetch error:', err);
        });
    }

    function fetchMoodDescription() {
        //reset journal mood description
        setJournalDescription('No journal record for the day');

        //day does not have any taskDays Id
        if (dayMoods[selectedDayIndex].taskDaysId === null) {
            return;
        }

        const data = {
            tasksDayId: dayMoods[selectedDayIndex].taskDaysId
        }
        searchParams = new URLSearchParams(data).toString();

        let url = process.env.EXPO_PUBLIC_API_URL + 'api/journals/get-journal-mood-description?' + searchParams; 
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
                if (jsonResponse.result.length > 0) {
                    setJournalDescription(jsonResponse.result[0].mood);
                }
            }
        })
        .catch((err) => {
            console.error('Fetch error:', err);
        });
    }


    function fetchTasks() {
        //reset tasks statistics
        setTaskCompleted(0);
        setTaskNotCompleted(0);
        setCompletedTasksHappyMood([]);
        setCompletedTasksNeuralMood([]);
        setCompletedTasksSadMood([]);
        setUncompletedTasks([]);

        //day does not have any taskDays Id
        if (dayMoods[selectedDayIndex].taskDaysId === null) {
            return;
        }

        const data = {
            taskDaysId: dayMoods[selectedDayIndex].taskDaysId
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
                if (jsonResponse.result.length > 0) {
                    //filter tasks 
                    const uncompletedTasksResponse = jsonResponse.result.filter(task => task.mood === null);
                    const completedTasksHappyMoodResponse = jsonResponse.result.filter(task => task.mood === 0);
                    const completedTasksNeutralMoodResponse = jsonResponse.result.filter(task => task.mood === 1);
                    const completedTasksSadMoodResponse = jsonResponse.result.filter(task => task.mood === 2);

                    //update overall task states
                    setTaskCompleted(completedTasksHappyMoodResponse.length + completedTasksNeutralMoodResponse.length + completedTasksSadMoodResponse.length);
                    setTaskNotCompleted(uncompletedTasksResponse.length);

                    setUncompletedTasks(uncompletedTasksResponse);
                    setCompletedTasksHappyMood(completedTasksHappyMoodResponse);
                    setCompletedTasksNeuralMood(completedTasksNeutralMoodResponse);
                    setCompletedTasksSadMood(completedTasksSadMoodResponse);

                }
            }
        })
        .catch((err) => {
            console.error('Fetch error:', err);
        });
    }

    //mood and day emoji component
    const renderDayEmoji = (resp, index) => {
        const moodIcon = () => {
            switch (resp.overallMood) {
                case 0:
                    return <MaterialCommunityIcons name="emoticon-happy-outline" size={height/18} color="green" />;
                case 1:
                    return <MaterialCommunityIcons name="emoticon-neutral-outline" size={height/18} color="orange" />;
                case 2:
                    return <MaterialCommunityIcons name="emoticon-sad-outline" size={height/18} color="red" />;
                default:
                    return <MaterialCommunityIcons name="help-circle-outline" size={height/18} color="grey" />;
            }
        };
    
        return (
            <TouchableOpacity key={'daymood'+index} style={[styles.flex1, styles.justifyHorizontalCenter, styles.justifyVerticalCenter]} onPress={() => {setSelectedDay(daysOfTheWeekFull[index]); setSelectedDayIndex(index)}}>
                {moodIcon()}
                <Text style={[styles.text15, styles.textAlignCenter, selectedDay === daysOfTheWeekFull[index] && styles.text20, selectedDay === daysOfTheWeekFull[index] && styles.fontBold,
                             { color: selectedDay === daysOfTheWeekFull[index] ? 'green' : 'black' }]}>
                    {daysOfTheWeek[index]}
                </Text>
            </TouchableOpacity>
        );
    };

    // completedTasksSection component
    const CompletedTasksSection = ({ tasks, icon, color }) => {
    return (
      <View style={[styles.justifyVerticalCenter, styles.paddingAll10, styles.justifyHorizontalCenter]}>
        <MaterialCommunityIcons name={icon} size={height/18} color={color} />
        {tasks.length > 0 ?
          tasks.map((resp, index) =>
            <ActivityRowStaticHalf
              key={`activityrowCompleted${index}`}
              props={{
                activity: resp.task_title,
                time: `${resp.start_time.substring(0, resp.start_time.length-3)} - ${resp.end_time.substring(0, resp.end_time.length-3)}`,
              }}
            />
          )
          :
          <ActivityRowStaticHalf
            key={`activityrowCompletedNoResult`}
            props={{
              activity: `no ${icon.toLowerCase().split('-')[1]} tasks`,
              time: '',
            }}
          />
        }
      </View>
    );
  };
  
  // uncompletedTasksSection component
  const UncompletedTasksSection = ({ tasks }) => {
    return (
      <View style={[styles.justifyVerticalCenter, styles.paddingAll10, styles.justifyHorizontalCenter]}>
        <MaterialCommunityIcons name="cancel" size={height/18} color="grey" />
        {tasks.length > 0 ?
          tasks.map((resp, index) =>
            <ActivityRowStaticHalf
              key={`activityrowNotCompleted${index}`}
              props={{
                activity: resp.task_title,
                time: `${resp.start_time.substring(0, resp.start_time.length-3)} - ${resp.end_time.substring(0, resp.end_time.length-3)}`,
              }}
            />
          )
          :
          <ActivityRowStaticHalf
            key={`activityrowNotCompletedNoResult`}
            props={{
              activity: 'no uncompleted tasks',
              time: '',
            }}
          />
        }
      </View>
    );
  };

    return (
        <SafeAreaView style={styles.container} >
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'position' : 'height'}
            >
            
                <View style={[styles.mainView, styles.columnFlex]}>

                    <View style={[styles.flex2, styles.backgroundBlue, styles.justifyVerticalCenter, styles.justifyHorizontalCenter]}>
                        <Text style={[styles.text20, styles.fontBold, styles.colourWhite]}>Week {(startOfWeek.toLocaleDateString())} to {endOfWeek.toLocaleDateString()}</Text>
                    </View>
                    
                    <View style={[styles.flex4, styles.paddingLeftRight10, styles.backgroundBlue]}>
                        <View style={[styles.flex1, styles.backgroundWhite, styles.borderRadius10]}>
                            <View style={[styles.flex3, styles.paddingLeftRight10, styles.justifyVerticalCenter, styles.rowFlex]}>
                            {dayMoods.map((resp, index) => renderDayEmoji(resp, index))}
                            </View>
                        </View>
                    </View>

                    <View style={[styles.flex1, styles.backgroundBlue]} />

                    <View style={[styles.flex2, styles.backgroundGreen]}>
                            <View style={[styles.justifyVerticalCenter, styles.paddingAll10]}>
                                <Text style={[styles.text20, styles.textAlignCenter, styles.colourWhite, styles.fontBold]}>
                                    {selectedDay} {dayMoods[selectedDayIndex]?.date !== undefined? localiseAndFormatDBDate(dayMoods[selectedDayIndex].date) : ''}
                                </Text>
                            </View>
                    </View>

                    <View style={[styles.flex1, styles.backgroundBlue]} />

                    <View style={[styles.flex15, styles.backgroundBlue]}>
                        <ScrollView style={[styles.flex1, styles.backgroundWhite]}>
                            <View style={[styles.justifyVerticalCenter, styles.paddingAll10]}>
                                <Text style={[styles.text20, styles.textAlignCenter, styles.fontBold]}>Overall Statistics</Text>
                            </View>
                            <View style={[styles.paddingLeftRight10]}>
                                <Text style={[styles.text15, styles.textAlignLeft]}>Task Completed: {taskCompleted}</Text>
                                <Text style={[styles.text15, styles.textAlignLeft]}>Task Not Completed: {taskNotCompleted}</Text>
                            </View>
                            {/* Completed tasks sections */}
                            <CompletedTasksSection tasks={completedTasksHappyMood} icon="emoticon-happy-outline" color="green" />
                            <CompletedTasksSection tasks={completedTasksNeutralMood} icon="emoticon-neutral-outline" color="orange" />
                            <CompletedTasksSection tasks={completedTasksSadMood} icon="emoticon-sad-outline" color="red" />
                            {/* Uncompleted tasks section */}
                            <UncompletedTasksSection tasks={uncompletedTasks} />
                        </ScrollView>
                    </View>


                    <View style={[styles.flex1, styles.backgroundBlue]} />
                    
                    <View style={[styles.flex4, styles.backgroundBlue]}>
                        <ScrollView style={[styles.flex1, styles.backgroundWhite]}>
                            <View style={[styles.justifyVerticalCenter, styles.paddingAll10]}>
                                <Text style={[styles.text20, styles.textAlignCenter, styles.fontBold]}>Journal Mood Description</Text>
                            </View>
                            <View style={[styles.paddingLeftRight10]}>
                                <Text style={[styles.text15, styles.textAlignCenter]}>{journalDescription}</Text>
                            </View>
                        </ScrollView>
                    </View>

                    <View style={[styles.flex1, styles.backgroundBlue]}/>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
