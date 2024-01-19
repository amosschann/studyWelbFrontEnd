// styles.js
import { StyleSheet, Dimensions } from 'react-native';
const { width, height } = Dimensions.get('screen');


const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      width: width,
    },
    mainView: {
      flex: 1,
      width: width,
    },
    //flex
    rowFlex: {
      flexDirection: 'row'
    },
    columnFlex: {
      flexDirection: 'column'
    },
    flex1: {
      flex: 1
    },
    flex2: {
      flex: 2
    },
    flex3: {
      flex: 3
    },
    flex4: {
      flex: 4
    },
    flex5: {
      flex: 5
    },
    flex6: {
      flex: 6
    },
    flex7: {
      flex: 7
    },
    flex8: {
      flex: 8
    },
    flex9: {
      flex: 9
    },
    flex10: {
      flex: 10
    },
    //widths
    width: {
      width: width
    },
    //height
    height: {
    height: height
    },
    //backgroundcolour 
    backgroundBlue: {
      backgroundColor: '#4677B0'
    },
    backgroundDarkBlue: {
      backgroundColor: '#3E4756'
    },
    //colur
    colourWhite: {
      color: 'white'
    },
    //align content
    justifyBottom: {
      justifyContent: 'flex-end'
    },
    justifyVerticalCenter: {
      justifyContent: 'center'
    },
    justifyVerticalBottom: {
      justifyContent: 'flex-end'
    },
    justifyVerticalTop: {
      justifyContent: 'flex-start'
    },
    justifyHorizontalCenter: {
      alignItems: 'center'
    },
    justifyHorizontalStart: {
      alignItems: 'flex-start'
    },
    justifyHorizontalEnd: {
      alignItems: 'flex-end'
    },
    //text
    text20: {
      fontSize: 20
    },
    text15: {
      fontSize: 15
    },
    textAlignCenter: {
      textAlign: 'center'
    },
    fontBold: {
      fontWeight: 'bold'
    },
    //border
    borderRadius20Black: {
      overflow: 'hidden',
      borderRadius: 20,
      borderColor: "#000000",
      borderWidth: 1,
    },
    //image object fit
    objectFitContain: {
      objectFit: 'contain'
    },
    objectFitFill: {
      objectFit: 'fill'
    },
    objectFitCover: {
      objectFit: 'cover'
    },
  
});

export default styles;