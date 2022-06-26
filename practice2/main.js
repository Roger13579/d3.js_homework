// get csv file
d3.csv('../data/harry_potter.csv').then(
    res => {
        console.log('Local CSV:',res)
    }
);
// get json file
d3.json('../data/harry_potter.json').then(
    res => {
        console.log('Local json:',res)
    }
);
d3.csv('https://raw.githubusercontent.com/ryanchung403/dataset/main/Housing_Dataset_Sample.csv').then(
    res => {
        console.log('API csv:',res)
    }
);
d3.json('https://api.chucknorris.io/jokes/random').then(
    res => {
        console.log('API json:',res)
    }
);

// 取得多檔
const potter = d3.csv('../data/harry_potter.csv');
const rings = d3.csv('../data/lord_of_the_rings.csv');

Promise.all([potter, rings]).then(
    res =>{
        console.log('potter:',res[0]);
        console.log('rings:',res[1]);
    }
)
// 合併多檔
Promise.all([potter, rings]).then(
    res =>{
        console.log('Multiple Request:',res);
        console.log('Concat:',[...res[0],...res[1]]);
    }
)
