export function generateTimeArray() {
  var timeArray = [];
  var currentTime: any = new Date(2000, 0, 1, 0, 0, 0);
  var endTime = new Date(currentTime);
  endTime.setDate(endTime.getDate() + 1); // Menambahkan 1 hari dari waktu saat ini

  while (currentTime < endTime) {
    var hours = currentTime.getHours();
    var minutes = currentTime.getMinutes();
    var seconds = currentTime.getSeconds();

    // Menambahkan nol di depan jika angka kurang dari 10
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    var timeString = hours + ':' + minutes + ':' + seconds;
    timeArray.push(timeString);

    // Menambahkan 15 menit ke waktu saat ini
    currentTime.setMinutes(currentTime.getMinutes() + 30);
  }

  return timeArray;
}
