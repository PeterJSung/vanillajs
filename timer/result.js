
// list data info
/**
 * minute
 * second
 * mils
 */

const RUNNING_MODE = 'RUNNING' // RUN -> STOP OR Record
const STOPPED_MODE = 'STOPPED'
const IDLE_MODE = 'IDLE' // -> RUN 

const INC_INTERVAL = 10
 
const minTimerEl = document.querySelector('#postTestMin')
const secTimerEl = document.querySelector('#postTestSec')
const milSecTimerEl = document.querySelector('#postTestMilisec')

const recoreListEl = document.querySelector('#testRecordList')

const leftBtnEl = document.querySelector('#leftBtn')
const rightBtnEl = document.querySelector('#rightBtn')

const recordList = []

let currentMode;
const currentTimeObj = {
    timeId: null,
    timeValue: {
        sec: 0,
        min: 0,
        mil: 0
    }
};

const getTimeStr = (timeVal) => {
    return timeVal >= 10 ? `${timeVal}` : `0${timeVal}`
}

const updateTime = () => {
    minTimerEl.innerHTML = getTimeStr(currentTimeObj.timeValue.min)
    secTimerEl.innerHTML = getTimeStr(currentTimeObj.timeValue.sec)
    milSecTimerEl.innerHTML = getTimeStr(currentTimeObj.timeValue.mil)
}

const run = () => {
    if(currentTimeObj.timeId) {
        return
    }

    currentTimeObj.timeId = setInterval(() => {
        currentTimeObj.timeValue.mil++;
        if(currentTimeObj.timeValue.mil === 100) {
            currentTimeObj.timeValue.mil = 0
            currentTimeObj.timeValue.sec++
        }
        if(currentTimeObj.timeValue.sec === 60) {
            currentTimeObj.timeValue.sec = 0
            currentTimeObj.timeValue.min++
        }
        updateTime();
    }, INC_INTERVAL)
}

const timeStop = (tempStop) => {
    if(currentTimeObj.timeId) {
        clearInterval(currentTimeObj.timeId)
        currentTimeObj.timeId = 0;
        
    }
    if(!tempStop) {
        currentTimeObj.timeValue.mil = 0
        currentTimeObj.timeValue.min = 0
        currentTimeObj.timeValue.sec = 0
        currentTimeObj.timeId = 0;
        updateTime();
    }
}

const start = () => {
    run();
    currentMode = RUNNING_MODE;
    leftBtnEl.innerHTML = `RECORD`;
}

const tempStop = () => {
    timeStop(true);
    currentMode = STOPPED_MODE;
    leftBtnEl.innerHTML = `RESUME`;
}

const compStop = (isRecord) => {
    isRecord && addNewRecord()
    timeStop(false);
    currentMode = IDLE_MODE;
    leftBtnEl.innerHTML = `START`;
}

const addNewRecord = () => {
    recordList.push({
        ...currentTimeObj.timeValue
    })
    const timeVal = recordList[recordList.length - 1]
    const liEl = document.createElement('li')
    const divEl = document.createElement('span')
    const timeStr = `${getTimeStr(timeVal.min)}:${getTimeStr(timeVal.sec)}:${getTimeStr(timeVal.mil)}`
    divEl.innerHTML = timeStr
    liEl.appendChild(divEl)
    recoreListEl.appendChild(liEl)
}

const registEventListner = () => {
    leftBtnEl.addEventListener('click', () => {
        // left button text
        // IDLE => Start(Running)
        // STOPPED() => resume(Running)
        // Running => record(Stoped)
        switch(currentMode) {
            case RUNNING_MODE: compStop(true); break;
            case STOPPED_MODE:
            case IDLE_MODE:
                start();
                break;
        }
    })

    rightBtnEl.addEventListener('click', () => {
        // right button text
        // IDLE => Stop(IDLE)
        // STOPPED => Stop(IDLE)
        // Running => Stop(Stop)
        switch(currentMode) {
            case RUNNING_MODE: tempStop(); break;
            case STOPPED_MODE: compStop(false); break;
            case IDLE_MODE:
                break;
        }
    })
}

const init = () => {
    // setup
    currentMode = IDLE_MODE;
    // add Event
    registEventListner();
}

init();