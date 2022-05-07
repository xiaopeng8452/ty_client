export function getDate(type) {
	let date = new Date();
	if(type == 'next'){
		date = new Date(new Date().getTime() + 24*60*60*1000);
	}else if(type == 'last'){
		date = new Date(new Date().getTime() - 24*60*60*1000);
	}
	let year = date.getFullYear();
	let month = date.getMonth() + 1;
	let day = date.getDate();
	let hours = date.getHours();
	let minutes = date.getMinutes();
	let seconds = date.getSeconds();
	let week = "星期" + "日一二三四五六".charAt(date.getDay());



	month = month > 9 ? month : '0' + month;;
	day = day > 9 ? day : '0' + day;
	hours = hours > 9 ? hours : '0' + hours;
	minutes = minutes > 9 ? minutes : '0' + minutes;
	seconds = seconds > 9 ? seconds : '0' + seconds;

	switch (type) {
		case 'dateTime':
			return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
			break;
		case 'week':
			return `${week}`;
			break;
		default:
			return `${year}-${month}-${day}`;
			break;
	}
}
