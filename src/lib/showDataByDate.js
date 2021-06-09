import MWF from './img/월수금.svg';
import TS from './img/화토.svg';
import F from './img/목.svg';
import S from './img/일.svg';

const today = new Date();

const recycleType = ['플라스틱', '종이', '비닐', '불연성'];
const dayType = ['월', '화', '수', '목', '금', '토', '일'];

export const typeData = [
    {
        day: `${dayType[0]}, ${dayType[2]}, ${dayType[4]}`,
        type: `${recycleType[0]}`,
        img: MWF
    },
    {
        day: `${dayType[1]}, ${dayType[5]}`,
        type: `${recycleType[1]}, ${recycleType[3]}`,
        img: TS,
    },
    {
        day: `${dayType[3]}`,
        type: `${recycleType[1]}, ${recycleType[2]}`,
        img: F
    },
    {
        day: `${dayType[6]}`,
        type: `${recycleType[0]}, ${recycleType[2]}`,
        img: S
    }
];

export const recycleData = [
    {
        name: 'a',
        day: `${dayType[0]}요일`,
        type: `${recycleType[0]}`,
        img: MWF
    },
    {
        name: 'b',
        day: `${dayType[1]}요일`,
        type: `${recycleType[1]}, ${recycleType[3]}`,
        img: TS,

    },
    {
        name: 'c',
        day: `${dayType[2]}요일`,
        type: `${recycleType[0]}`,
        img: MWF,
    },
    {
        name: 'd',
        day: `${dayType[3]}요일`,
        type: `${recycleType[1]}, ${recycleType[2]}`,
        img: F,
    },
    {
        name: 'e',
        day: `${dayType[4]}요일`,
        type: `${recycleType[0]}`,
        img: MWF,
    },
    {
        name: 'f',
        day: `${dayType[5]}요일`,
        type: `${recycleType[1]}, ${recycleType[3]}`,
        img: TS,
    },
    {
        name: 'g',
        day: `${dayType[6]}요일`,
        type: `${recycleType[0]}, ${recycleType[2]}`,
        img: S
    }
]

export const dayName = today.toLocaleDateString('ko-KR', {
    weekday: 'long'
})

export const filterByDate = () => (recycleData.filter(data => data.day === dayName));
