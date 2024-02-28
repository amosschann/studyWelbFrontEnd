import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, KeyboardAvoidingView, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from '../components/Style';
import { getAccessToken } from '../helpers/AccessTokenHelper';
import { SubmitButton } from '../components/Buttons';
import { WellnessRow } from '../components/WellnessRow';
import Modal from "react-native-modal";
import { useNavigationState } from '@react-navigation/native';
const { height, width } = Dimensions.get('screen');

export default function WellnessScreen({ navigation: { navigate }, props }){
    const pageIndex = useNavigationState(state => state.index);
    const [accessToken, setAccessToken] = useState('');
    const [wellnessTasks, setWellnessTasks] = useState([
        {id: '', title: 'Wellness Task 1', description: 'test'},
        {id: '', title: 'Wellness Task 2', description: 'test'},
        {id: '', title: 'Wellness Task 3', description: 'test'},
        {id: '', title: 'Wellness Task 4', description: 'test'},
        {id: '', title: 'Wellness Task 5', description: 'test'},
    ])
    const [moreOptionsVisible, setMoreOptionsVisible] = useState(false);
    const [currentlySelectedIndex, setCurrentlySelectedIndex] = useState('');

    useEffect(() => {
        // initial load from login
        getAccessToken().then(accessToken => {
            setAccessToken(accessToken);
        })
    }, []);

    //initial fetch after access token
    useEffect(() => {
        if (accessToken !== '') {
            fetchWellnessActivities();
        }
    }, [accessToken])

    useEffect(() => { 
        //reload data once back from manageWellness
        if (accessToken !== '') {
            if (pageIndex === 0) {
                fetchWellnessActivities();
            }
        }
    }, [pageIndex])

    //fetch all of the days that have taskday table row and their ids
    function fetchWellnessActivities() {

        let url = process.env.EXPO_PUBLIC_API_URL + 'api/wellness/get-wellness'; 
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
                const wellnessTasks = jsonResponse.result.map(task => ({
                    id: task.id,
                    title: task.title,
                    description: task.description
                }));
                setWellnessTasks(wellnessTasks);     
            }
        })
        .catch((err) => {
            console.error('Fetch error:', err);
        });
    }

    //toggle function for todo task pop up modal
    function toggleMoreOptions () {
        setMoreOptionsVisible(!moreOptionsVisible);
    };


    //pop up modal for todo tasks 
    function MoreOptionsPopUpToDo() {
        //process data strings
        let popUpTitle = wellnessTasks[currentlySelectedIndex]?.title;
        let popUpDescription = wellnessTasks[currentlySelectedIndex]?.description;
        let popUpId = wellnessTasks[currentlySelectedIndex]?.id;

        return (
            <Modal isVisible={moreOptionsVisible}>
                <View style={[styles.flex1, styles.columnFlex]}>
                    <View style={[styles.flex1]}/>
                    
                    <View style={[styles.flex3, styles.backgroundWhite, styles.borderRadius20, styles.paddingAll20]}>
                        <View style={[styles.flex1, styles.justifyHorizontalEnd]}>
                            <TouchableOpacity style={[styles.flex1, styles.justifyHorizontalCenter, styles.justifyVerticalCenter]} onPress={() => toggleMoreOptions()}>
                                <MaterialCommunityIcons name="close-circle-outline" size={height/25} color="black" />
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.flex1]}>
                            <Text style={[styles.text20, styles.textAlignCenter, styles.fontBold, styles.backgroundBlue, styles.colourWhite]} >Title</Text>
                        </View>
                        <View style={[styles.flex1]}>
                            <Text style={[styles.text15, styles.textAlignCenter, styles.fontBold]} >{popUpTitle} </Text>
                        </View>
                        <View style={[styles.flex1]}>
                            <Text style={[styles.text20, styles.textAlignCenter, styles.fontBold, styles.backgroundBlue, styles.colourWhite]} >Description</Text>
                        </View>
                        <View style={[styles.flex3]}>
                            <ScrollView style={[styles.flex1]}>
                                <Text style={[styles.text15, styles.textAlignLeft, styles.paddingLeftRight10, styles.fontBold]} >{popUpDescription} </Text>
                            </ScrollView>
                        </View>
                        <View style={[styles.flex2, styles.rowFlex]}>
                            <TouchableOpacity 
                                style={[styles.flex1, styles.columnFlex, styles.justifyHorizontalCenter, styles.justifyVerticalCenter]}
                                onPress= {() => {
                                        toggleMoreOptions();
                                        navigate('ManageWellnessScreen', 
                                        { 
                                            id: popUpId,
                                            title: popUpTitle,
                                            description: popUpDescription
                                        }) 
                                    }
                                }
                            >
                                <View style={[styles.flex3]}>
                                    <MaterialCommunityIcons name="pencil-circle-outline" size={height/15} color="green" />
                                </View>
                                <View style={[styles.flex1]}>
                                    <Text style={[styles.text15, styles.textAlignCenter, styles.fontBold]} >Edit</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={[styles.flex1]}/>
                </View>
            </Modal>
        )
    }
    

    return (
        <SafeAreaView style={styles.container} >
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'position' : 'height'}
            >
                {MoreOptionsPopUpToDo()}
                <View style={[styles.mainView, styles.columnFlex]}>

                    <View style={[styles.flex4, styles.backgroundBlue, styles.justifyVerticalCenter, styles.justifyHorizontalCenter]}>
                        <Text style={[styles.text20, styles.fontBold, styles.colourWhite]}>Wellness Tasks</Text>
                    </View>

                    {
                        wellnessTasks.map((resp, index) => (
                            <WellnessRow
                                key={'wellnessrow' + index}
                                props={{
                                        onPress: () => {
                                            setCurrentlySelectedIndex(index);
                                            toggleMoreOptions();
                                            console.log('toggling')
                                        },
                                        wellness: resp
                                    }}
                                />
                        ))
                    }
                    
                    <View style={[styles.flex6, styles.paddingLeftRight10, styles.backgroundBlue]}>
                            <View style={[styles.flex1, styles.justifyVerticalCenter, styles.paddingAll10]}>
                                <Text style={[styles.text20, styles.textAlignCenter, styles.colourWhite, styles.fontBold]}>Wellness Statistics</Text>
                            </View>
                            <View style={[styles.flex1, styles.paddingLeftRight10, styles.backgroundWhite, styles.borderRadius10, styles.justifyVerticalCenter, styles.justifyHorizontalCenter]}>
                                <Text style={[styles.text15, styles.textAlignCenter]}>choose date placeholder</Text>
                            </View>
                    </View>

                    <View style={[styles.flex1, styles.backgroundBlue]} />

                    <View style={[styles.flex3, styles.backgroundBlue]}>
                        <SubmitButton
                            props={{
                                text: 'View Statistics', 
                                onPress: () => console.log('test')
                            }}
                        />
                    </View>
                    <View style={[styles.flex2, styles.backgroundBlue]}/>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}