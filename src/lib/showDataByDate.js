const today = new Date();

const recycleType = ['플라스틱', '종이', '비닐', '불연성'];
const dayType = ['월', '화', '수', '목', '금', '토', '일'];

export const typeData = [
    {
        day: `${dayType[0]}, ${dayType[2]}, ${dayType[4]}`,
        type: `${recycleType[0]}`,
    },
    {
        day: `${dayType[1]}, ${dayType[5]}`,
        type: `${recycleType[1]}, ${recycleType[3]}`,
    },
    {
        day: `${dayType[3]}`,
        type: `${recycleType[1]}, ${recycleType[2]}`,
    },
    {
        day: `${dayType[6]}`,
        type: `${recycleType[0]}, ${recycleType[2]}`,
    }
];

export const recycleData = [
    {
        day: `${dayType[0]}요일`,
        type: `${recycleType[0]}`,
        color: '#FF87D2'
    },
    {
        day: `${dayType[1]}요일`,
        type: `${recycleType[1]}, ${recycleType[3]}`,
        color: '#FAFA96'
    },
    {
        day: `${dayType[2]}요일`,
        type: `${recycleType[0]}`,
        color: '#FFEFD5'
    },
    {
        day: `${dayType[3]}요일`,
        type: `${recycleType[1]}, ${recycleType[2]}`,
        color: '#E1AE68',
    },
    {
        day: `${dayType[4]}요일`,
        type: `${recycleType[0]}`,
        color: '#FF98FE'
    },
    {
        day: `${dayType[5]}요일`,
        type: `${recycleType[1]}, ${recycleType[3]}`,
        color: '#5BFFB0'
    },
    {
        day: `${dayType[6]}요일`,
        type: `${recycleType[0]}, ${recycleType[2]}`,
        color: '#46FFFF'
    }
]

export const dayName = today.toLocaleDateString('ko-KR', {
    weekday: 'long'
})

export const filterByDate = () => (recycleData.filter(data => data.day === dayName));
