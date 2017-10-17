import React from 'react';
import DayPicker from 'react-day-picker';
import moment from 'moment';

import 'react-day-picker/lib/style.css';
import '../../styles/index.css';

export default function Calender(props) {
  const m = moment(new Date(props.value));
  const endOfWeekDate = m.add(6, 'days')._d;

  const range = {
    from: props.value,
    to: endOfWeekDate
  };

  const modifiers = {
    disabled: { daysOfWeek: [1, 2, 3, 4, 5, 6] }
  };

  return <DayPicker selectedDays={range} onDayClick={props.onDayClick} modifiers={modifiers} />;
}
