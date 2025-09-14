export const printCurrentDateTime = () => {
  // Create a new Date object, which represents the current date and time
  const now = new Date();

  // Log the full date and time string to the console
  console.log(now);

  // You can also format the output using various methods:

  // Log only the date part
  //console.log(now.toDateString());

  // Log only the time part
  //console.log(now.toLocaleTimeString());

  // Log a localized date and time string
  //console.log(now.toLocaleString());

  // Log specific components of the date and time
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // Months are 0-indexed, so add 1
  const day = now.getDate();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  //console.log(`${year}-${month}-${day} ${hours}:${minutes}:${seconds}`);
}
