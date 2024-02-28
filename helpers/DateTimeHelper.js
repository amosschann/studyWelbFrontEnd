import { format, parseISO } from 'date-fns';

// convert date from db to dd/mm/yy format
export function localiseAndFormatDBDate(inputDateStr) {
    const parsedDate = parseISO(inputDateStr);
    const options = { timeZone: 'UTC' };
    const formattedDate = format(parsedDate, 'yyyy-MM-dd', options);
    return formattedDate;
}

//converts datestring to format that can be saved in db
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
    console.log(time)
    const hour = ('0' + time.getHours()).slice(-2);
    const minute = ('0' + time.getMinutes()).slice(-2);
    return `${hour}:${minute}`;
  };