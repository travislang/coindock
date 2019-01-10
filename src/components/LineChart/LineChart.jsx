import React, { Component } from 'react';
import { ResponsiveLine } from '@nivo/line'

function LineChart(props) {
    const klines = props.klines;
    const klineData = klines.map( (item, i) => {
        return {
            x: i,
            y: item[4]
        }
    })
    const data = [{
        id: 'crypto',
        color: '#03a9f4',
        data: klineData
    }]
    return (
        <ResponsiveLine
            data={data}
            // margin={{
            //     "top": 50,
            //     "right": 110,
            //     "bottom": 50,
            //     "left": 60
            // }}
            colorBy={function (c) { return c.color }}
            lineWidth={2}
            curve="monotoneX"
            // areaBaselineValue={5}
            height={100}
            yScale={{
                "type": 'linear',
                "min": "auto",
                "max": "auto"
            }}
            enableGridX={false}
            enableGridY={false}
            isInteractive={false}
            enableDots={false}
            enableArea={true}
        />
    )
}

export default LineChart;