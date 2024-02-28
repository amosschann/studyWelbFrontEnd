import React, { useState, useEffect } from 'react';
import { Text, View, Dimensions, TouchableOpacity } from 'react-native';
import styles from './Style';
const { width } = Dimensions.get('screen');
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

/**
 * global Submit Button Component for Form Submissions
 * 
 * @component
 * @param {object} props - component props
 * @param {string} props.text - title of the button
 * @param {function} props.onPress - onPress action for submission
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

/**
 * button Component for Wellness Task Start and Stop
 * 
 * @component
 * @param {object} props - component props
 * @param {string} props.text - title of the button
 * @param {function} props.onPress - onPress action for the button
 * @param {string} props.backgroundColour - background color of the button
 * @param {string} props.colour - text color of the button
 */

export function StartStopButton ({props}) {
    return (
        <TouchableOpacity style={[styles.flex1]} onPress={props.onPress}>
            <View style={[styles.flex1, styles.rowFlex]}>
                <View style={[styles.flex2]}/>
                <View style={[styles.flex8, styles.justifyHorizontalCenter, styles.justifyVerticalCenter, styles.borderRadius10, {backgroundColor: props.backgroundColour}]}>
                    <Text style={[styles.text20, {color: props.colour}]}>{props.text}</Text>
                </View>
                <View style={[styles.flex2]}/>
            </View>
        </TouchableOpacity>
    )
};