/* eslint-disable linebreak-style */
import { useState, useEffect } from "react";
import { useTaskContext, Task } from "src/context/taskContext";
import { useTimer } from "react-timer-hook";
import ProgressBar from "@ramonak/react-progress-bar";
import addPadding from "src/addPadding";

interface TaskTimerProps {
  expiryTimestamp: Date
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
        <span className="timer-label">{hours > 0 && hourStr}</span>
        {hours > 0 && ":"}
        <span className="timer-label">{minuteStr}</span>:
        <span className="timer-label">{secondStr}</span>

        <ProgressBar
          completed={progressPercentage}
          bgColor="#000000"
          baseBgColor="#ededed"
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

const NextTwoTasks = () => {
  const { tasks, currentTask } = useTaskContext();
  const [nextTwoTasks, setNextTwoTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (tasks.length > 0) {
      // Find the index of the current task
      const currentIndex = tasks.findIndex(task => task._id === currentTask?._id);

      // If the current task is found and there are at least two more tasks after it
      if (currentIndex !== -1 && currentIndex + 2 < tasks.length) {
        const nextTasks: Task[] = tasks.slice(currentIndex + 1, currentIndex + 3);
        setNextTwoTasks(nextTasks);
      }
    }
  }, [currentTask, tasks, nextTwoTasks]);

  // Render the next two tasks
  return (
    <div>
      {nextTwoTasks.map(task => (
        <div key={task._id} className="next-two-tasks contaier-fluid">
          {task.title}
          {task.flexible && (
            <TaskTimer expiryTimestamp={task.endDate} isUpcomingTask={false} />
          )}
        </div>
      ))}
    </div>
  );
};

export default NextTwoTasks;