import { User } from "../context/userContext";
import { useTaskContext } from "../context/taskContext";
import { ReactNode } from "react";
import {
  Scheduler,
  DayView,
  ViewState,
  Appointments
} from "@devexpress/dx-react-scheduler";
import { useNavigate } from "react-router-dom";

interface ChildScheduleProps {
  child: User;
}

const ChildSchedule = ({ child }: ChildScheduleProps) => {
  const { tasks } = useTaskContext();

  const navigate = useNavigate();

  const ChildScheduleRoot = () => {
    return <ChildSchedule child={child} />;
  };

  const DayViewLayout = () => {
    return (
      <div className="container-fluid">
        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>Appointment</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task._id}>
                <td>{task.startTime} - {task.endTime}</td>
                <td>{task.text}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const TimeScaleLabel = () => {
    return (
      <span className="time-scale-label">Time Scale</span>
    );
  };

  const TimeScaleLayout = () => {
    const startTime = new Date();
    startTime.setHours(7);

    const endTime = new Date();
    endTime.setHours(21);

    const timeIntervals: Date[] = [];

    while (startTime <= endTime) {
      timeIntervals.push(new Date(startTime));
      startTime.setTime(startTime.getTime() + 60 * 60 * 1000);
    }

    return (
      <tbody>
        {timeIntervals.map((interval, index) => (
          <tr key={tasks[index].text}>
            {interval.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </tr>
        ))}
      </tbody>
    );
  };

  const TimeScaleTickCell = ({ startDate, endDate }: DayView.TimeScaleTickCellProps) => {
    return (
      <div className="time-scale-ticks container">
        {tasks.map(task => <span key={task._id}>
          {`${task.startTime} - ${task.endTime}`}
        </span>)}
        {`${startDate?.toLocaleString()} - ${endDate?.toLocaleString()}`}
      </div>
    );
  };

  const DayScaleLayout = ({
    cellsData,
    cellComponent,
    rowComponent,
    formatDate
  }: DayView.DayScaleLayoutProps) => {
    const currentDayAppointments = tasks.filter(task => {
      return (
        task.startDate <= new Date() && task.endDate >= new Date()
      );
    });

    return (
      <div className="day-scale-layout container-fluid">
        {currentDayAppointments.map(appointment => (
          <div
            key={appointment.text}
            className={`appointment ${appointment.flexible ? "flexible" : ""}`}
          >
            {appointment.text}
            {formatDate(appointment.startDate.toLocaleString(), {
              hour: "2-digit",
              hour12: true,
              day: "2-digit"
            })}
            cell data: {cellsData.map(dataItems => dataItems.map(data => {
              <p key={data.startDate.toString()}>start date/time: {data.startDate.toString()}</p>;
              <p key={data.endDate.toString()}>end date/time: {data.endDate.toString()}</p>;
              <p key={data.today ? "is today" : "not today"}>this appointment is {
                data.today ? "for today" : "not for today"
              }</p>;
            }))}
            Row component name: {rowComponent.displayName}
            Cell component name: {cellComponent.displayName}
          </div>
        ))}
      </div>
    );
  };

  const DayScaleEmptyCell = () => {
    return (
      <div className="empty-cell"></div>
    );
  };

  const TimeTableLayout = ({ cellsData }: DayView.TimeTableLayoutProps) => {
    return (
      <div className="container-fluid">
        {cellsData.map(outerItem => (
          outerItem.map((innerItem, innerIndex) => (
            <p className="cell-info" key={innerIndex}>{innerItem.startDate.toLocaleString()}</p>
          ))
        ))}
        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>Appointment</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task.text}>
                <td>{task.startTime} - {task.endTime}</td>
                <td>{task.text}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  interface DayScaleCellProps {
    startDate: Date;
  }

  const DayScaleCell = ({ startDate }: DayScaleCellProps) => {
    const formattedDate = startDate.toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric"
    });

    return (
      <div className="day-scale-cell">
        {formattedDate}
      </div>
    );
  };

  const DayScaleRow = () => {
    const formattedDate = tasks.map(task => {
      return task.startDate.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric"
      });
    });

    return (
      <div className="day-scale-row">
        {formattedDate.map(date => (
          <span key={date} className="time">{date}</span>
        ))}
      </div>
    );
  };

  interface TimeTableCellProps {
    children?: ReactNode;
  }

  const TimeTableCell = ({ children }: TimeTableCellProps) => {
    return (
      <div className="container-fluid time-table-cell">
        {children}
      </div>
    );
  };

  const TimeTableRow = ({ children }: DayView.RowProps) => {
    return (
      <div className="time-table-row container">
        {children}
      </div>
    );
  };

  const AppointmentLayer = () => {
    return (
      <div className="appointment-layer">
        {tasks.map(task => {
          for (const [key, value] of Object.entries(task)) {
            if (Array.isArray(value)) {
              return (
                <ul>
                  {value.map((element, index) => (
                    <li key={index}>{element}</li>
                  ))}
                </ul>);
            } else if (typeof value === "object") {
              for (const [innerKey, innerValue] of Object.entries(value)) {
                <p>{`${innerKey}: ${innerValue}`}</p>;
              }
            }
            return <p key={key}>{`${key}: ${value.toString()}`}</p>;
          }
        }
        )}
      </div>
    );
  };

  const AppointmentContent = ({ children, data }: Appointments.AppointmentContentProps) => {
    return (
      <div className="container-fluid">
        <p className="title">{data.title}</p>
        <p>{data.allDay && " This is an all-day appointment"}</p>
        <p>{data.endDate && `${data.startDate.toLocaleString()} - ${data.endDate.toLocaleString()}`}</p>
        {children}
      </div>
    );
  };

  const RepeatIcon = () => {
    return (
      <div className="repeat-icon">
        <i className="fa-solid fa-repeat"></i>
      </div>
    );
  };

  const formatDate = (nextDate: Date | string | number | undefined,
    nextOptions: Intl.DateTimeFormatOptions = {
      month: "2-digit",
      day: "2-digit",
      year: "numeric"
    }) => {
    return new Intl.DateTimeFormat("en-US", nextOptions).format(nextDate as Date);
  };

  const AppointmentComponent = () => {
    return (
      <>
        {tasks.map(task => {
          return (
            <AppointmentContent
              key={task._id}
              data={task}
              durationType={task.endDate.getTime() - task.startDate.getTime() === 3600000 ?
                "long" : "short"}
              recurringIconComponent={RepeatIcon}
              resources={[{
                fieldName: "flexible",
                title: "Flexible",
                id: 1,
                isMain: false,
                color: "#FF0000",
                text: "don't delay this task because the timer starts early",
                allowMultiple: true
              }, {
                fieldName: "scheduled",
                title: "Scheduled",
                id: 2,
                isMain: true,
                color: "#00FF00",
                text: "task will occur at a specified time each day; please complete it on time",
                allowMultiple: true
              }, {
                fieldName: "isRecurring",
                title: "Recurring",
                id: 3,
                isMain: false,
                color: "#0000FF",
                text: "task will occur at a specified time each day; please complete it on time",
                allowMultiple: true
              }]}
              type="horizontal"
              formatDate={formatDate}
            />
          );
        })}
      </>
    );
  };

  const AppointmentContainer = () => {
    return (
      <div className="container-fluid">
        <AppointmentComponent />
      </div>
    );
  };

  const SplitIndicator = () => {
    return (
      <div className="split-indicator">
        <i className="fa-solid fa-arrows-split-up-and-left"></i>
      </div>
    );
  };

  return (
    <div className="container-fluid">
      <i className="fa-solid fa-angle-left" onClick={() => navigate("/")}></i>
      <h2>{child.firstName}&apos;s Schedule</h2>
      <Scheduler
        rootComponent={ChildScheduleRoot}
        data={tasks}
        locale="en-US"
        height={500}
        firstDayOfWeek={0}
      >
        <ViewState currentDate={new Date()} />
        <DayView
          layoutComponent={DayViewLayout}
          timeScaleLabelComponent={TimeScaleLabel}
          timeScaleLayoutComponent={TimeScaleLayout}
          timeScaleTickCellComponent={TimeScaleTickCell}
          dayScaleLayoutComponent={DayScaleLayout}
          dayScaleEmptyCellComponent={DayScaleEmptyCell}
          timeTableLayoutComponent={TimeTableLayout}
          dayScaleCellComponent={DayScaleCell}
          dayScaleRowComponent={DayScaleRow}
          timeTableCellComponent={TimeTableCell}
          timeTableRowComponent={TimeTableRow}
          appointmentLayerComponent={AppointmentLayer}
        />
        <Appointments
          appointmentComponent={AppointmentComponent}
          appointmentContentComponent={AppointmentContent}
          splitIndicatorComponent={SplitIndicator}
          recurringIconComponent={RepeatIcon}
          containerComponent={AppointmentContainer}
        />
      </Scheduler>
    </div>
  );
};

export default ChildSchedule;