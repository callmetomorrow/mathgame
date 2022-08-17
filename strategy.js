/*
vol{1,2} - розрядність числа 1, 22, 333 тощо
action[ 
        0: '+',
        1: '-',
        2: '*',
        3: '/'
    ]
time - час раунда, мс (5000 мс = 5 сек)
roundNums - кількість раундів у рівні
*/

export const strategies = [
    {vol1: 1, vol2: 1, action: 0, time: 5000, roundsNum: 5},
    {vol1: 1, vol2: 1, action: 1, time: 5000, roundsNum: 5},
    
    {vol1: 2, vol2: 1, action: 0, time: 5000, roundsNum: 5},
    {vol1: 1, vol2: 2, action: 0, time: 5000, roundsNum: 5},
    {vol1: 2, vol2: 1, action: 1, time: 5000, roundsNum: 5},
    {vol1: 1, vol2: 2, action: 1, time: 5000, roundsNum: 5},

    {vol1: 1, vol2: 1, action: 0, time: 3000, roundsNum: 5},
    {vol1: 1, vol2: 1, action: 1, time: 3000, roundsNum: 5},

    {vol1: 2, vol2: 2, action: 0, time: 5000, roundsNum: 5},
    {vol1: 2, vol2: 2, action: 1, time: 5000, roundsNum: 5},
];

// export default strategies;