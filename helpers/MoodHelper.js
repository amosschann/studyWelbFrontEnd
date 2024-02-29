/**
 * calculate mood level and mood points
 * 
 * @function 
 * @param {object} jsonResponse - completed task response from completed task fetch
 * @param {function} setMoodLevel - sets mood level state
 * @param {function} setCurrentMoodPoint - sets current mood point state 
 * @param {function} fetchWellnessActivities - function to fetch wellness activity
 * @param {function} setCurrentMoodPoint - function that fades out welllness task (if there are currently any)
 * @param {function} setWellnessTasks - sets wellness task list state
 */
export function calculateMood(jsonResponse, setMoodLevel, setCurrentMoodPoint, fetchWellnessActivities, fadeOut, setWellnessTasks) {
    //calculation for mood 
    let moodLevelCalc = 50;
    let moodPointsCalc = 0;
    let moodCheckPoint = 0;
    for (const result of jsonResponse.result) {
        if (result.mood == 0 && result.wellnessCheckpoint !== 0) { //happy & wellness
            moodLevelCalc += 20; //positive change in mood level
            moodPointsCalc += 0
        } else if (result.mood == 0) { //happy
            //positive change in mood level
            moodLevelCalc += 10; 
            //+2 mood point and everyhour = 2points 
            moodPointsCalc += (2 + 2 * calculateTimeDifference(result.start_time, result.end_time))
        } else if (result.mood == 1) { //neutral
            //no change in mood level
            moodLevelCalc += 0; 
            //+4 mood point and everyhour = 2points 
            moodPointsCalc += (4 + 2 * calculateTimeDifference(result.start_time, result.end_time))
        } else { //sad
            console.log(calculateTimeDifference(result.start_time, result.end_time))
            //negative change in mood level
            moodLevelCalc -= 10; 
            //+6 mood point and everyhour = 2points 
            moodPointsCalc += (6 + 2 * calculateTimeDifference(result.start_time, result.end_time))
        }
        //check last checkpoint wellness (if any)
        if (result.wellnessCheckpoint !== 0) {
            if (result.wellnessCheckpoint  >= moodCheckPoint) {
                moodCheckPoint = result.wellnessCheckpoint;
            }
        }
    }
    //update state 
    setMoodLevel(moodLevelCalc);
    setCurrentMoodPoint(moodPointsCalc);
    //get wellness task if moodcheckpoint > 10 from current point calc
    if (moodPointsCalc - moodCheckPoint > 10) {
        fetchWellnessActivities();
    } else {
        fadeOut();
        setWellnessTasks([]);
    }
}

/**
 * calculate time (in hours) between 2 date time strings
 * 
 * @function 
 * @param {string} start - start date time string
 * @param {string} end - end date time string
 */
function calculateTimeDifference(start, end) {
    //parse time strings into Date objects
    const startTime = new Date(`2000-01-01T${start}`);
    const endTime = new Date(`2000-01-01T${end}`);

    //time diff in mili seconds 
    let timeDifference = endTime - startTime;

    //milliseconds to hours
    let hours = timeDifference / (1000 * 60 * 60);

    //round up minutes
    const minutes = Math.ceil((hours - Math.floor(hours)) * 60);

    //round up hours
    hours = Math.floor(Math.floor(hours) + (minutes / 60));

    return hours;
}