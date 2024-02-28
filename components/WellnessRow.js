import React, { useState, useEffect } from 'react';
import { Text, View, Dimensions, TouchableOpacity } from 'react-native';
import styles from './Style';
const { height, width } = Dimensions.get('screen');

/**
 * wellness Row - comes with flex row below (space)
 * 
 * @component
 * @param {object} props - component props
 * @param {object} props.wellness - wellness data for title and description
 * @param {function} props.onPress - onPress action for whole row
 */

export function WellnessRow ({props}) {
    return (
        <>
            <View style={[styles.flex5, styles.paddingLeftRight10, styles.backgroundBlue]}>
                <TouchableOpacity style={[styles.flex1, styles.rowFlex, styles.backgroundWhite, styles.borderRadius10]} onPress={props.onPress}>
                    <View style={[styles.flex4, styles.justifyVerticalCenter]}>
                        <Text style={[styles.text20, styles.textAlignLeft, styles.paddingLeftRight20]}>{props.wellness.title}</Text>
                    </View>
                    <View style={[styles.flex1, styles.justifyVerticalCenter]}>
                        <Text style={[styles.text15, styles.textAlignCenter, styles.colourGray]}>ⓘ</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <View style={[styles.flex1, styles.backgroundBlue]} />
        </>
    )
};