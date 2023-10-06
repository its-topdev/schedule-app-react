/* eslint-disable linebreak-style */
import { useTaskContext } from "../context/taskContext";
import { UserContext } from "src/context/userContext";
import { useState, useContext } from "react";
import { useTimer } from "react-timer-hook";
import ProgressBar from "@ramonak/react-progress-bar";
import addPadding from "../addPadding";
import Pet from "./Pet";
import NextTwoTasks from "./NextTwoTasks";

interface TaskTimerProps {
  expiryTimestamp: Date;
  isUpcomingTask: boolean;
}

const TaskTimer = ({ expiryTimestamp, isUpcomingTask }: TaskTimerProps) => {
  const [message, setMessage] = useState("");
  const timerSettings = {
    expiryTimestamp,
    onExpire: () => {
      if (isUpcomingTask) {
        setMessage("Start preparing for this task now!");
      } else {
        setMessage(
          "You are taking too long to complete this task! It is taking time away from the next one"
        );
      }
    },
  };

  const { hours, minutes, seconds, totalSeconds } = useTimer(timerSettings);
  const totalTimeInSeconds = expiryTimestamp.getTime() - new Date().getTime() / 1000;
  const remainingTimeInSeconds = Math.max(totalTimeInSeconds - totalSeconds, 0);
  const progressPercentage = (remainingTimeInSeconds / totalTimeInSeconds) * 100;

  const hourStr = hours.toString().length < 2 ?
    addPadding(hours.toString()) :
    hours.toString()
  ;
  const minuteStr = minutes.toString().length < 2 ?
    addPadding(minutes.toString()) :
    minutes.toString()
  ;
  const secondStr = seconds.toString().length < 2 ?
    addPadding(seconds.toString()) :
    seconds.toString()
  ;

  return (
    <div className="container-fluid">
      <>
        <p>
          <span className="timer-label">{`${hours > 0 ? `${hourStr}:` : ""+
            `${minuteStr}:${secondStr}`}`}
          </span>
        </p>

        <ProgressBar
          completed={progressPercentage}
          bgColor="#f44336"
          baseBgColor="#e0x0de"
          height="2px"
          isLabelVisible={false}
          className="progress-bar"
        />

        {message && <p className="text-danger">{message}</p>}
        {(message && isUpcomingTask) && <p className="text-warning">{message}</p>}
      </>
    </div>
  );
};

const CurrentTask = () => {
  const { currentTask, upcomingTask, updateTask } = useTaskContext();
  const { state } = useContext(UserContext);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showOverlay, setShowOverlay] = useState(new Date() === state.currentUser?.wakeTime as Date);

  const handleOverlayToggle = () => {
    setShowOverlay(!showOverlay);
  };

  return (
    <div className="current-task container-fluid d-flex justify-content-center align-items-center">
      <div className="container-fluid text-center">
        {currentTask && (
          <>
            <Pet isInGreeting={false} />
            <br />
            <br />
            <br />
            {currentTask.title}
            <TaskTimer expiryTimestamp={currentTask.endDate} isUpcomingTask={false} />
            <button
              type="button"
              title="task completion button"
              className="icon-button"
              onClick={() => {
                setIsCompleted(!isCompleted);
                currentTask._id && updateTask(currentTask._id, {
                  ...currentTask,
                  isCompleted
                });
              }}
            >
              <i className="fa-solid fa-circle-check"></i>
            </button>
            <NextTwoTasks />
          </>
        )}{(upcomingTask && !currentTask) && (
          <>
            <Pet isInGreeting={false} />
            <br />
            <br />
            <br />
            {upcomingTask.title}
            <TaskTimer expiryTimestamp={upcomingTask.startDate} isUpcomingTask={true} />
            <button
              type="button"
              title="task completion button"
              className="icon-button"
              onClick={() => {
                setIsCompleted(!isCompleted);
                upcomingTask._id && updateTask(upcomingTask._id, {
                  ...upcomingTask,
                  isCompleted
                });
              }}
            >
              <i className="fa-solid fa-circle-check"></i>
            </button>
            <NextTwoTasks />
          </>
        )}{showOverlay && (
          <div className="overlay">
            <Pet isInGreeting={true} />
            <br />
            <br />
            <br />
            <h3>Good morning</h3>
            <button
              type="button"
              title="task completion button"
              className="icon-button"
              onClick={handleOverlayToggle}
            >
              <i className="fa-solid fa-circle-check"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrentTask;