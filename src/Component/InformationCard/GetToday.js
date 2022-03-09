
export default function GetToday() {
    var week = ['일', '월', '화', '수', '목', '금', '토'];
    var today = new Date();
    var dayName = week[today.getDay()];


    if (dayName === '월' || dayName === '수' || dayName === '금')
        return '🥡 오늘은 플라스틱 버리는 날입니다.'
    else if (dayName === '화' || dayName === '목' || dayName === '토')
        return '📦 오늘은 종이 버리는 날입니다.'
}
