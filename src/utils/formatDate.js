import dayjs from 'dayjs';

export const formatDate = (date, format = 'MMM D, YYYY') => {
  return dayjs(date).format(format);
};

export const formatDateTime = (date) => {
  return dayjs(date).format('MMM D, YYYY hh:mm A');
};

export const formatDateShort = (date) => {
  return dayjs(date).format('MMM D, YYYY');
};
