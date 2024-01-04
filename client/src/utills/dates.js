export const formatTime = (dateString) => {
    const parsedDate = new Date(dateString);
  
    let hours = parsedDate.getHours();
    const minutes = parsedDate.getMinutes();
  
  
    const amOrPm = hours >= 12 ? "pm" : "am";
  
    
    hours = hours % 12 || 12;
  
    const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
  
    return `${formattedHours}:${formattedMinutes}${amOrPm}`;
  };
  

  export const formatWorkDuration = (checkInTimeString, checkOutTimeString) => {
    const checkInTime = new Date(checkInTimeString);
    const checkOutTime = new Date(checkOutTimeString);
  
    const timeDifferenceInMilliseconds = checkOutTime - checkInTime;
  

    const totalMinutes = Math.floor(timeDifferenceInMilliseconds / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
  
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };