const HOUR = 5.4e6;

export const getPreviousHour = (date: Date) => {
    const prevHour = new Date(date.getTime() - HOUR);

    return prevHour;
};
