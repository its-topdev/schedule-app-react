/* eslint-disable linebreak-style */
import { useState, useEffect } from "react";
import { useTaskContext } from "src/context/taskContext";

interface PetProps {
  isInGreeting: boolean;
}

const Pet = ({ isInGreeting }: PetProps) => {
  const [mood, setMood] = useState("");
  const { tasks, currentTask } = useTaskContext();

  useEffect(() => {
    if (currentTask) {
      const currentTime = new Date().getTime();
      const isCurrentTaskIncomplete = !currentTask.isCompleted;
      const isCurrentTaskNearEnd = currentTask.endDate.getTime() - currentTime <= 60000; // Within 1 minute

      if (tasks.length === 0) {
        setMood("neutral"); // No tasks available
      } else if (currentTask.endDate.getTime() < currentTime) {
        setMood("happy"); // Current task is completed
      } else if (
        tasks.indexOf(currentTask) === tasks.length - 1 &&
        (isCurrentTaskIncomplete || isCurrentTaskNearEnd)
      ) {
        setMood("sad"); // Last task and either completed or near end
      } else {
        setMood("neutral"); // Default neutral mood
      }

      if (isInGreeting) {
        setMood("happy");
      }
    }
  }, [currentTask, tasks, isInGreeting]);

  return (
    <div className="container-fluid">
      <p className="pet-mood">
        The pet&apos;s mood is <span className={`${mood === "happy" ? "text-success" :
          mood === "neutral" ? "text-warning" : mood === "sad" ? "text-danger" : "not set"}`}>
        </span>
      </p>
    </div>
  );
};

export default Pet;