import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

const utcDayjs = dayjs.utc;

export default utcDayjs;
