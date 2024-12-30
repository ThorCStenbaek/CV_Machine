import React from 'react';
import { formatDistanceToNow, parseISO } from 'date-fns';

const TimeAgo = ({ timestamp }) => {
  // Parse the date string into a JavaScript Date object
  const date = parseISO(timestamp);
  
  // Calculate the time distance to now
  // It will include differences in terms of minutes if within an hour
  const timeAgo = formatDistanceToNow(date, { addSuffix: true, includeSeconds: true });

  return timeAgo;
};

export default TimeAgo;
