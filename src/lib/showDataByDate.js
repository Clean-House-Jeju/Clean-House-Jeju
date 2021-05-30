const today = new Date();

const recycleType = ['플라스틱', '종이', '비닐', '불연성'];

export const recycleData = [
    {
        day: '월요일',
        type: `${recycleType[0]}`,
        color: '#FF87D2'
    },
    {
        day: '화요일',
        type: `${recycleType[1]}, ${recycleType[3]}`,
        color: '#FAFA96'
    },
    {
        day: '수요일',
        type: `${recycleType[0]}`,
        color: '#FFEFD5'
    },
    {
        day: '목요일',
        type: `${recycleType[1]}, ${recycleType[2]}`,
        color: '#E1AE68',
    },
    {
        day: '금요일',
        type: `${recycleType[0]}`,
        color: '#FF98FE'
    },
    {
        day: '토요일',
        type: `${recycleType[1]}, ${recycleType[3]}`,
        color: '#5BFFB0'
    },
    {
        day: '일요일',
        type: `${recycleType[0]}, ${recycleType[2]}`,
        color: '#46FFFF'
    }
]

const dayName = today.toLocaleDateString('ko-KR', {
    weekday: 'long'
})

export const filterByDate = () => (recycleData.filter(data => data.day === dayName));
