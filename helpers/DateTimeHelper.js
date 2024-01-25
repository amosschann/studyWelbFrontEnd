
// convert date from db to dd/mm/yy format
export function localiseAndFormatDBDate(inputDateStr) {
    const localDate = new Date(inputDateStr).toLocaleDateString();

    const parts = localDate.split('/');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);

    const parsedDate = new Date(year, month, day);

    //final format
    const formattedDate = `${parsedDate.getFullYear()}-${(parsedDate.getMonth() + 1).toString().padStart(2, '0')}-${parsedDate.getDate().toString().padStart(2, '0')}`;

    return formattedDate;

}