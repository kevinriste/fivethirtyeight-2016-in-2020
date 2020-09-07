import { geoCentroid } from 'd3-geo';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Annotation,
} from 'react-simple-maps';
import csv from 'csvtojson';
import { useAsync } from 'react-async-hook';

import allStates from 'data/allstates.json';

const stateForecastsUrl = 'api/538/2020-general-data/presidential_state_toplines_2020.csv';

const fetchForecastData = async () => {
  const forecastResult = await fetch(stateForecastsUrl);
  const forecastString = await forecastResult.text();
  const forecastObject = await csv().fromString(forecastString);
  let forecastArray = Object.entries(forecastObject).map((item) => item[1]);
  const maxValueOfDate = (
    new Date(Math.max(...forecastArray.map((stateDay) => new Date(stateDay.modeldate)), 0)))
    .getTime();
  forecastArray = forecastArray
    .filter((stateDay) => (new Date(stateDay.modeldate)).getTime() === maxValueOfDate);
  return forecastArray;
};

// font urls
// https://fivethirtyeight.com/wp-content/themes/espn-fivethirtyeight/assets/fonts/decimamonopro-webfont.woff2
// https://fivethirtyeight.com/wp-content/themes/espn-fivethirtyeight/assets/fonts/2F4FDA_0_0.woff2
// https://fivethirtyeight.com/wp-content/themes/espn-fivethirtyeight/assets/fonts/AtlasGrotesk-Bold-Web.woff2
// https://fivethirtyeight.com/wp-content/themes/espn-fivethirtyeight/assets/fonts/AtlasGrotesk-Regular-Web.woff2

const geoUrl = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';

const offsets = {
  VT: [50, -8],
  NH: [34, 2],
  MA: [30, -1],
  RI: [28, 2],
  CT: [35, 10],
  NJ: [34, 1],
  DE: [33, 0],
  MD: [47, 10],
  DC: [49, 21],
};

const colors = {
  defaultBlue: '#f1f6fe',
  defaultRed: '#f1f6fe',
  incumbentColorRange: {
    0: '#2aa1ec',
    5: '#4fa9ee',
    10: '#69b2f0',
    15: '#7db9f2',
    20: '#90c2f3',
    25: '#a2cbf5',
    30: '#b2d3f7',
    35: '#c2dcf9',
    40: '#d2e4fa',
    45: '#e2edfc',
    50: '#ffe7e1',
    55: '#ffdbd2',
    60: '#ffcec4',
    65: '#ffc2b5',
    70: '#ffb4a6',
    75: '#ffa796',
    80: '#ff9987',
    85: '#ff8b78',
    90: '#ff7a68',
    95: '#fe6a59',
  },
};

const MapChartInterior = (data) => (
  <ComposableMap projection="geoAlbersUsa">
    <Geographies geography={geoUrl}>
      {({ geographies }) => (
        <>
          {geographies.map((geo) => {
            const thisState = data?.data.find(
              (stateDay) => stateDay.state === geo.properties.name,
            );
            const fillColor = thisState && colors.incumbentColorRange[
              Math.floor(
                thisState?.winstate_inc / 0.05,
              ) * 5
            ];
            return (
              <Geography
                key={geo.rsmKey}
                stroke="#FFF"
                geography={geo}
                fill={fillColor}
              />
            );
          })}
          {geographies.map((geo) => {
            const centroid = geoCentroid(geo);
            const cur = allStates.find((s) => s.val === geo.id);
            return (
              <g key={`${geo.rsmKey}-name`}>
                {cur
                    && centroid[0] > -160
                    && centroid[0] < -67
                    && (Object.keys(offsets).indexOf(cur.id) === -1 ? (
                      <Marker coordinates={centroid}>
                        <text y="2" fontSize={14} textAnchor="middle">
                          {cur.id}
                        </text>
                      </Marker>
                    ) : (
                      <Annotation
                        subject={centroid}
                        dx={offsets[cur.id][0]}
                        dy={offsets[cur.id][1]}
                      >
                        <text x={4} fontSize={14} alignmentBaseline="middle">
                          {cur.id}
                        </text>
                      </Annotation>
                    ))}
              </g>
            );
          })}
        </>
      )}
    </Geographies>
  </ComposableMap>
);

const MapChart = () => {
  const asyncData = useAsync(fetchForecastData, []);
  return (
    <div>
      {asyncData.loading && <div>{'Loading'}</div>}
      {asyncData.error && (
      <div>
        {'Error:'}
        {asyncData.error.message}
      </div>
      )}
      {asyncData.result && (
        <MapChartInterior data={asyncData.result} />
      )}
    </div>
  );
};

export default MapChart;
