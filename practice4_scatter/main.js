// get csv file
d3.csv('../data/movies.csv', type).then(
    res => {
        ready(res)
        // console.log(res)
    }
);
// Data utilities
const parseNA = string => (string === 'NA' ? undefined : string);
const parseDate = string => d3.timeParse('%Y-%m-%d')(string);
function type(d) {
    const date = parseDate(d.release_date);
    return {
        budget: +d.budget,
        genre: parseNA(d.genre),
        genres: JSON.parse(d.genres).map(d => d.name),
        homepage: parseNA(d.homepage),
        id: +d.id,
        imdb_id: parseNA(d.imdb_id),
        original_language: parseNA(d.original_language),
        overview: parseNA(d.overview),
        popularity: +d.popularity,
        poster_path: parseNA(d.poster_path),
        production_countries: JSON.parse(d.production_countries),
        release_date: date,
        release_year: date.getFullYear(),
        revenue: +d.revenue,
        runtime: +d.runtime,
        tagline: parseNA(d.tagline),
        title: parseNA(d.title),
        vote_average: +d.vote_average,
        vote_count: +d.vote_count,
    }
}
// Data selection
function filterData(data) {
    return data.filter(
        d => {
            return (
                d.release_year > 1999 && d.release_year < 2010 &&
                d.revenue > 0 &&
                d.budget > 0 &&
                d.genre &&
                d.title
            );
        }
    );
}

// 資料清理
function ready(movies) {
    const moviesClean = filterData(movies);
    // console.log(moviesClean);
    const scatterData = prepareScatterData(moviesClean);
    console.log(scatterData);
    setupCanvas(scatterData);
}
// prepare bar chart
function prepareScatterData(data) {
    // console.log(data);
    return data.sort((a,b)=>b.budget-a.budget).filter((d,i)=>i<100);
}
// 刻度顯示格式轉換
function formatTicks(d){
    return d3.format('~s')(d)
    .replace('M','mil')
    .replace('G','bil')
    .replace('T','tri')
    }
function addLabel(axis,label,x,y){
    axis.selectAll('.tick:last-of-type text')
    .clone()
    .text(label)
    .attr('x',x).attr('y',y)
    .style('text-anchor','start')
    .style('font-weight','bold')
    .style('fill','#555')
}

// setup canvas function
function setupCanvas(scatterData) {
    const svg_width = 500;
    const svg_height = 500;
    const chart_margin = { top: 80, right: 60, bottom: 40, left: 80 };
    const chart_width = svg_width - (chart_margin.left + chart_margin.right);
    const chart_height = svg_height - (chart_margin.top + chart_margin.bottom);

    const this_svg = d3.select('.scatter-plot-container').append('svg')
        .attr('width', svg_width).attr('height', svg_height).append('g')
        .attr('transform', `translate(${chart_margin.left},${chart_margin.top})`);

    // scale
    // d3.extent find the max & min in revenue
    const xExtent = d3.extent(scatterData, d=>d.budget);
    const xScale = d3.scaleLinear().domain(xExtent).range([0, chart_width]);
    
    // 垂直空間的分配 -> 平均分配給各種類
    const yExtent = d3.extent(scatterData, d=>d.revenue)
    const yScale = d3.scaleLinear().domain(yExtent).range([chart_height,0]);
    // 營收最小的放下面，與座標相反

    // draw scatters
    this_svg.selectAll('.scatter')
            .data(scatterData)
            .enter()
            .append('circle')
            .attr('class','scatter')
            .attr('cx', d=>xScale(d.budget))
            .attr('cy', d=>yScale(d.revenue))
            .attr('r',3)
            .style('fill','dodgerblue')
            .style('fill-opacity', 0.5)
    // draw header
    const header = this_svg.append('g').attr('class','bar-header')
                        .attr('transform',`translate(0,${-chart_margin.top/2})`)
                        .append('text');
    header.append('tspan').text('Budget vs. Revenue in $US');
    header.append('tspan').text('Top 100 films by budget,2000-2009').attr('x',0).attr('y',20)
            .style('fill','#555').style('font-size','0.8em');

    // tickSizeInner : the length of the tick lines
    // tickSizeOuter : the length of the square ends of the domain path
    const xAxis = d3.axisBottom(xScale).ticks(5)
                    .tickFormat(formatTicks)
                    .tickSizeInner(-chart_height) // 預設往上長, 加 - 往下長
                    .tickSizeOuter(0);
    const xAxisDraw = this_svg.append('g').attr('class','x axis')
    .attr('transform',`translate(-10,${chart_height+10})`).call(xAxis).call(addLabel,'Budget',25,0);
    xAxisDraw.selectAll('text').attr('dy','2em')
    const yAxis = d3.axisLeft(yScale).ticks(5).tickFormat(formatTicks)
                .tickSizeInner(-chart_height).tickSizeOuter(0);
    const yAxisDraw = this_svg.append('g').attr('class','y axis').attr('transform',`translate(-10,10)`)
    .call(yAxis).call(addLabel,'Revenue',-30,-30);
    yAxisDraw.selectAll('text').attr('dx','-2em')
}
