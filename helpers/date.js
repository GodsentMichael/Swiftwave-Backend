const timeDifference = {
    "1hr": 3600,
    "2m": 120,
  };
  
  const getSecondsBetweenTime = (time) => {
    const currentTime = new Date().getTime();
  
    const diff = currentTime - time;
  
    const seconds = Math.floor(diff / 1000); // for seconds
  
    return seconds;
  };
  
  module.exports = { timeDifference, getSecondsBetweenTime };
  