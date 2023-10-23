export const convertISODate = (isoDateString: string) => {
    const date = new Date(isoDateString);
    const day = date.getDate();

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const month = monthNames[date.getMonth()];
  
    const year = date.getFullYear();
  
    return day + "th " + month + ", " + year;
}

export const getDateAndTimeFromISODate = (isoDateString: string) => {
    const date = new Date(isoDateString);
    const day = date.getDate();

    const month = date.getMonth();

    const year = date.getFullYear();

    // Format the time as HH:MM
    const time = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true, // Include AM/PM
    });

    return `${day}/${month}/${year}, ${time}`;
}