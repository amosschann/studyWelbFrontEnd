import React from 'react';
import { View, Text, TouchableOpacity, ScrollView,Dimensions, Button } from 'react-native';
import Modal from "react-native-modal";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from '../components/Style';
import { StartStopButton } from './Buttons';
const { height, width } = Dimensions.get('screen');


// pop up modal for todo activities 
/*
props:
isVisible - show modal if true
toggleModal - function to toggle visibility useEffect
task - main list of activities to get details from
onEdit - navigation callback function 
onDelete - delete callback function
*/
export const ToDoTaskModal = ({ isVisible, toggleModal, task, onEdit, onDelete }) => {
    //check for to do tasks
    if (task !== undefined) {
        // Extract task data
        const { task_title, start_time, end_time, task_description } = task;
        const popUpTime = `${start_time?.substring(0, start_time.length - 3)} - ${end_time?.substring(0, end_time.length - 3)}`;

        return (
            <Modal isVisible={isVisible}>
                <View style={[styles.flex1, styles.columnFlex]}>
                    <View style={[styles.flex1]}/>
                    
                    <View style={[styles.flex3, styles.backgroundWhite, styles.borderRadius20, styles.paddingAll20]}>
                        <View style={[styles.flex1, styles.justifyHorizontalEnd]}>
                            <TouchableOpacity style={[styles.flex1, styles.justifyHorizontalCenter, styles.justifyVerticalCenter]} onPress={toggleModal}>
                                <MaterialCommunityIcons name="close-circle-outline" size={height/25} color="black" />
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.flex1]}>
                            <Text style={[styles.text20, styles.textAlignCenter, styles.fontBold, styles.backgroundBlue, styles.colourWhite]}>Title</Text>
                        </View>
                        <View style={[styles.flex1]}>
                            <Text style={[styles.text15, styles.textAlignCenter, styles.fontBold]}>{task_title}</Text>
                        </View>
                        <View style={[styles.flex1]}>
                            <Text style={[styles.text20, styles.textAlignCenter, styles.fontBold, styles.backgroundBlue, styles.colourWhite]}>Time</Text>
                        </View>
                        <View style={[styles.flex1]}>
                            <Text style={[styles.text15, styles.textAlignCenter, styles.fontBold]}>{popUpTime}</Text>
                        </View>
                        <View style={[styles.flex1]}>
                            <Text style={[styles.text20, styles.textAlignCenter, styles.fontBold, styles.backgroundBlue, styles.colourWhite]}>Description</Text>
                        </View>
                        <View style={[styles.flex3]}>
                            <ScrollView style={[styles.flex1]}>
                                <Text style={[styles.text15, styles.textAlignLeft, styles.paddingLeftRight10, styles.fontBold]}>{task_description}</Text>
                            </ScrollView>
                        </View>
                        <View style={[styles.flex2, styles.rowFlex]}>
                            <TouchableOpacity 
                                style={[styles.flex1, styles.columnFlex, styles.justifyHorizontalCenter, styles.justifyVerticalCenter]}
                                onPress={() => {
                                    onEdit(task);
                                    toggleModal();
                                }}
                            >
                                <View style={[styles.flex3]}>
                                    <MaterialCommunityIcons name="pencil-circle-outline" size={height/15} color="green" />
                                </View>
                                <View style={[styles.flex1]}>
                                    <Text style={[styles.text15, styles.textAlignCenter, styles.fontBold]}>Edit</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.flex1, styles.columnFlex, styles.justifyHorizontalCenter, styles.justifyVerticalCenter]} onPress={onDelete}>
                                <View style={[styles.flex3]}>
                                    <MaterialCommunityIcons name="delete-circle-outline" size={height/15} color="red" />
                                </View>
                                <View style={[styles.flex1]}>
                                    <Text style={[styles.text15, styles.textAlignCenter, styles.fontBold]}>Delete</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={[styles.flex1]}/>
                </View>
            </Modal>
        );
    }
};

// pop up modal for completed activities 
/*
props:
isVisible - show modal if true
toggleModal - function to toggle visibility useEffect
completedTasks - main list of activities to get details from
submitUndoComplete - undo complete callback function 
*/
export const CompletedTaskModal = ({ isVisible, toggleModal, completedTasks, submitUndoComplete }) => {
    // check for completed tasks
    if (completedTasks !== undefined) {
        // Extract task data
        const { task_title, start_time, end_time, task_description } = completedTasks;
        const popUpTime = start_time?.substring(0, start_time.length - 3) + ' - ' + end_time?.substring(0, end_time.length - 3);

        return (
            <Modal isVisible={isVisible}>
                <View style={[styles.flex1, styles.columnFlex]}>
                    <View style={[styles.flex2]} />
                    <View style={[styles.flex3, styles.backgroundWhite, styles.borderRadius20, styles.paddingAll20]}>
                        <View style={[styles.flex1, styles.justifyHorizontalEnd]}>
                            <TouchableOpacity style={[styles.flex1, styles.justifyHorizontalCenter, styles.justifyVerticalCenter]} onPress={toggleModal}>
                                <MaterialCommunityIcons name="close-circle-outline" size={height / 25} color="black" />
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.flex1]}>
                            <Text style={[styles.text20, styles.textAlignCenter, styles.fontBold, styles.backgroundBlue, styles.colourWhite]}>Title</Text>
                        </View>
                        <View style={[styles.flex1]}>
                            <Text style={[styles.text15, styles.textAlignCenter, styles.fontBold]}>{task_title} </Text>
                        </View>
                        <View style={[styles.flex1]}>
                            <Text style={[styles.text20, styles.textAlignCenter, styles.fontBold, styles.backgroundBlue, styles.colourWhite]}>Time</Text>
                        </View>
                        <View style={[styles.flex1]}>
                            <Text style={[styles.text15, styles.textAlignCenter, styles.fontBold]}>{popUpTime} </Text>
                        </View>
                        <View style={[styles.flex1]}>
                            <Text style={[styles.text20, styles.textAlignCenter, styles.fontBold, styles.backgroundBlue, styles.colourWhite]}>Description</Text>
                        </View>
                        <View style={[styles.flex3]}>
                            <ScrollView style={[styles.flex1]}>
                                <Text style={[styles.text15, styles.textAlignLeft, styles.paddingLeftRight10, styles.fontBold]}>{task_description} </Text>
                            </ScrollView>
                        </View>
                        <View style={[styles.flex2, styles.rowFlex]}>
                            <TouchableOpacity style={[styles.flex1, styles.justifyHorizontalCenter, styles.justifyVerticalCenter]}>
                                <Button
                                    title="Undo Complete"
                                    color="red"
                                    onPress={submitUndoComplete}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={[styles.flex1]} />
                </View>
            </Modal>
        );
    }
};

// pop up modal for complete to do activities 
/*
props:
isVisible - show modal if true
toggleModal - function to toggle visibility useEffect
submitCompleteTask - complete task callback function 
toDoTasks- main list of activities to get details from
*/
export const CompleteToDoTaskModal = ({ isVisible, toggleModal, submitCompleteTask, toDoTasks }) => {
    //check for to do tasks
    if (toDoTasks !== undefined) {
        // Extract task data
        const {task_title} = toDoTasks

        return (
            <Modal isVisible={isVisible}>
                <View style={[styles.flex1, styles.columnFlex]}>
                    <View style={[styles.flex1]} />
                    <View style={[styles.flex1, styles.backgroundWhite, styles.borderRadius20, styles.paddingAll20]}>
                        <View style={[styles.flex1, styles.justifyHorizontalEnd]}>
                            <TouchableOpacity style={[styles.flex1, styles.justifyHorizontalCenter, styles.justifyVerticalCenter]} onPress={toggleModal}>
                                <MaterialCommunityIcons name="close-circle-outline" size={height / 25} color="black" />
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.flex1]}>
                            <Text style={[styles.text20, styles.textAlignCenter, styles.fontBold, styles.backgroundBlue, styles.colourWhite]}>Title</Text>
                        </View>
                        <View style={[styles.flex1]}>
                            <Text style={[styles.text20, styles.textAlignCenter, styles.fontBold]}>{task_title}</Text>
                        </View>
                        <View style={[styles.flex1]}>
                            <Text style={[styles.text20, styles.textAlignCenter, styles.fontBold, styles.colourWhite, styles.backgroundBlue]}>Complete with a mood</Text>
                        </View>
                        <View style={[styles.flex2, styles.rowFlex]}>
                            <TouchableOpacity style={[styles.flex1, styles.justifyHorizontalCenter, styles.justifyVerticalTop]} onPress={() => submitCompleteTask(0)}>
                                <MaterialCommunityIcons name="emoticon-happy-outline" size={height / 12} color="green" />
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.flex1, styles.justifyHorizontalCenter, styles.justifyVerticalTop]} onPress={() => submitCompleteTask(1)}>
                                <MaterialCommunityIcons name="emoticon-neutral-outline" size={height / 12} color="orange" />
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.flex1, styles.justifyHorizontalCenter, styles.justifyVerticalTop]} onPress={() => submitCompleteTask(2)}>
                                <MaterialCommunityIcons name="emoticon-sad-outline" size={height / 12} color="red" />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={[styles.flex1]} />
                </View>
            </Modal>
        );
    }
};

// pop up modal for wellness activities 
/*
props:
isVisible - show modal if true
toggleModal - function to toggle visibility useEffect
wellnessTasks - main list of activities to get details from
submitCompleteWellness - submit complete wellness task callback function 
*/
export const WellnessTaskModal = ({ isVisible, toggleModal, wellnessTasks, submitCompleteWellness}) => {
    //check for wellnessTasks
    if (wellnessTasks !== undefined) {
        // Extract task data
        const { title, description } = wellnessTasks;

        return (
            <Modal isVisible={isVisible}>
                <View style={[styles.flex1, styles.columnFlex]}>
                    <View style={[styles.flex2]} />
                    <View style={[styles.flex3, styles.backgroundWhite, styles.borderRadius20, styles.paddingAll20]}>
                        <View style={[styles.flex1, styles.justifyHorizontalEnd]}>
                            <TouchableOpacity style={[styles.flex1, styles.justifyHorizontalCenter, styles.justifyVerticalCenter]} onPress={toggleModal}>
                                <MaterialCommunityIcons name="close-circle-outline" size={height / 25} color="black" />
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.flex1]}>
                            <Text style={[styles.text20, styles.textAlignCenter, styles.fontBold, styles.backgroundBlue, styles.colourWhite]}>Title</Text>
                        </View>
                        <View style={[styles.flex1]}>
                            <Text style={[styles.text15, styles.textAlignCenter, styles.fontBold]}>{title} </Text>
                        </View>
                        <View style={[styles.flex1]}>
                            <Text style={[styles.text20, styles.textAlignCenter, styles.fontBold, styles.backgroundBlue, styles.colourWhite]}>Description</Text>
                        </View>
                        <View style={[styles.flex3]}>
                            <ScrollView style={[styles.flex1]}>
                                <Text style={[styles.text15, styles.textAlignLeft, styles.paddingLeftRight10, styles.fontBold]}>{description} </Text>
                            </ScrollView>
                        </View>
                        <View style={[styles.flex2, styles.rowFlex]}>
                            <TouchableOpacity style={[styles.flex1, styles.justifyHorizontalCenter, styles.justifyVerticalCenter]}>
                                <StartStopButton props={{text: "Submit", onPress: submitCompleteWellness}}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={[styles.flex1]} />
                </View>
            </Modal>
        );
    }
};