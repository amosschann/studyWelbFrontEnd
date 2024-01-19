import React, { useState, useEffect } from 'react';
import { Text, View, Dimensions, TouchableOpacity } from 'react-native';
import styles from './Style';
const { width } = Dimensions.get('screen');
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


export function SubmitButton ({props}) {
    return (
        <TouchableOpacity style={[styles.flex1]} onPress={props.onPress}>
            <View style={[styles.flex1, styles.rowFlex]}>
                <View style={[styles.flex1]}/>
                <View style={[styles.flex8, styles.backgroundDarkBlue, styles.justifyHorizontalCenter, styles.justifyVerticalCenter, styles.borderRadius20Black]}>
                    <Text style={[styles.colourWhite, styles.text20]}>{props.text}</Text>
                </View>
                <View style={[styles.flex1]}/>
            </View>
        </TouchableOpacity>
    )
};
