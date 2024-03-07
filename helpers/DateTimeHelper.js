import { format, parseISO } from 'date-fns';

/**
 * convert date from db to dd/mm/yy format
 * 
 * @function
 * @param {string} inputDateStr - datetime string
 */
export function localiseAndFormatDBDate(inputDateStr) {
    const parsedDate = parseISO(inputDateStr);
    const options = { timeZone: 'UTC' };
    const formattedDate = format(parsedDate, 'yyyy-MM-dd', options);
    return formattedDate;
}

/**
 * convert timestamp to yyyy-MM-dd format
 * 
 * @function
 * @param {string} timestamp - datetime string in ISO format
 * @returns {string} - formatted date string in yyyy-MM-dd format
 */
export function formatTimestampToDate(timestamp) {
    const date = new Date(timestamp);
    const formattedDate = date.toISOString().split('T')[0];
    return formattedDate;
}

/**
 * converts datestring to format that can be saved in db
 * 
 * @function
 * @param {string} inputDateStr - datetime string
 */
export function convertDateTimeToDBTimeFormat(inputDateStr) {
    const date = new Date(inputDateStr);

    //get time components
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    //final format
    const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    return timeString;
}

//formats the time for date time picker (android)
export function formatTime(time) {
    const hour = ('0' + time.getHours()).slice(-2);
    const minute = ('0' + time.getMinutes()).slice(-2);
    return `${hour}:${minute}`;
  };