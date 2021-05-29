const today = new Date();

const recycleType = ['플라스틱', '종이', '비닐', '불연성'];

const recycleData = [
    {
        day: '월요일',
        type: `${recycleType[0]}`
    },
    {
        day: '화요일',
        type: `${recycleType[1]}, ${recycleType[3]}`
    },
    {
        day: '수요일',
        type: `${recycleType[0]}`
    },
    {
        day: '목요일',
        type: `${recycleType[1]}, ${recycleType[2]}`
    },
    {
        day: '금요일',
        type: `${recycleType[0]}`
    },
    {
        day: '토요일',
        type: `${recycleType[1]}, ${recycleType[3]}`
    },
    {
        day: '일요일',
        type: `${recycleType[0]}, ${recycleType[2]}`
    }
]

export const dayName = today.toLocaleDateString('ko-KR', {
    weekday: 'long'
})

export const filterByDate = () => (recycleData.filter(data => data.day === dayName));
