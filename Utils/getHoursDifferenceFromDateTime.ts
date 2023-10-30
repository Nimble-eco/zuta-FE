export function calculateTotalHours(startDate: string, endDate: string) {
    const startDateTime = new Date(startDate).getTime();
    const endDateTime = new Date(endDate).getTime();
  
    const timeDifference = endDateTime - startDateTime;
    
    const totalHours = timeDifference / (1000 * 60 * 60); // Convert milliseconds to hours
  
    return totalHours;
}