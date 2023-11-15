import moment from 'moment';


export function formatCreatedAtMessage(created_at) {
  const createdAt = moment(created_at);
  const currentTime = moment();
  let formattedCreatedAt = '';
  // Tính khoảng thời gian giữa createdAt và thời gian hiện tại
  if (createdAt.isSame(currentTime, 'day')) {
    // Trường hợp createdAt vẫn còn trong ngày, format thành giờ và phút
    formattedCreatedAt = createdAt.format('HH:mm');
  } else if (createdAt.isSame(currentTime, 'week')) {
    // If createdAt is within the current week, format as dddd HH:mm
    formattedCreatedAt = createdAt.format('dddd HH:mm');
  } else {
    // Trường hợp còn lại, format theo định dạng 'HH:mm, DD MMM YYYY'
    formattedCreatedAt = createdAt.format('HH:mm, DD[/]MM[/]YYYY');
  }
  return formattedCreatedAt;
}