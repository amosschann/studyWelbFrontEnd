import React, { useState, useEffect } from 'react';
import { Text, View, Dimensions, TouchableOpacity } from 'react-native';
import styles from './Style';
const { width } = Dimensions.get('screen');
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

//global submit button for form submissions
/*
props:
text - button title
onPress - onPress action for submission
*/
export function SubmitButton ({props}) {
    return (
        <TouchableOpacity style={[styles.flex1]} onPress={props.onPress}>
            <View style={[styles.flex1, styles.rowFlex]}>
                <View style={[styles.flex1]}/>
                <View style={[styles.flex8, styles.backgroundDarkBlue, styles.justifyHorizontalCenter, styles.justifyVerticalCenter, styles.borderRadius10]}>
                    <Text style={[styles.colourWhite, styles.text20]}>{props.text}</Text>
                </View>
                <View style={[styles.flex1]}/>
            </View>
        </TouchableOpacity>
    )
};

//button for wellness task start and stop
/*
props:
text - button title
onPress - onPress action for submission
*/
export function StartStopButton ({props}) {
    return (
        <TouchableOpacity style={[styles.flex1]} onPress={props.onPress}>
            <View style={[styles.flex1, styles.rowFlex]}>
                <View style={[styles.flex1]}/>
                <View style={[styles.flex8, styles.backgroundDarkBlue, styles.justifyHorizontalCenter, styles.justifyVerticalCenter, styles.borderRadius10]}>
                    <Text style={[styles.colourWhite, styles.text20]}>{props.text}</Text>
                </View>
                <View style={[styles.flex1]}/>
            </View>
        </TouchableOpacity>
    )
};