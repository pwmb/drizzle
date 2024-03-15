import { API_KEY } from "@/utils/constants";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { Suspense } from "react";

type Params = {
  lat: string;
  lon: string;
};

type MainForecast = {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  sea_level: number;
  grnd_level: number;
  humidity: number;
  temp_kf: number;
};

type AggregateForecast = {
  temp: number;
  feels_like: number;
  date: string;
};

type Forecast = {
  list: {
    dt: number;
    main: MainForecast;
  }[];
  city: {
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
};

function ForecastTableRow({ row }: { row: AggregateForecast }) {
  return (
    <div className="flex justify-between w-full border-b px-6 py-5 lg:rounded-xl lg:border hover:bg-gray-50 hover:cursor-pointer">
      <div className="flex flex-col items-center justify-center">
        <p>{row.date}</p>
      </div>
      <div className="flex flex-col items-center">
        <p>
          {row.feels_like.toFixed(2)}
          <sup>o</sup>
        </p>
        <p className="text-sm lg:text-lg">Feels Like</p>
      </div>
      <div className="flex flex-col items-center">
        <p>
          {row.temp.toFixed(2)}
          <sup>o</sup>
        </p>
        <p className="text-sm lg:text-lg">Avg. Temp.</p>
      </div>
    </div>
  );
}

async function ForecastTable({ data }: { data: Forecast }) {
  const forecast = forecastAggregateByDay(data);
  return (
    <div className="flex flex-col max-w-5xl w-full items-center justify-between lg:flex">
      <div className="w-full">
        <div className="flex space-y-0 lg:space-y-5 flex-col pt-2 lg:pt-5">
          {forecast.map((f, i) => (
            <ForecastTableRow row={f} key={i}></ForecastTableRow>
          ))}
        </div>
      </div>
    </div>
  );
}

export default async function Location({ params }: { params: Params }) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?units=metric&lang=en&lat=${params.lat}&lon=${params.lon}&appid=${API_KEY}`;
  const resp = await fetch(url);
  const data: Forecast = await resp.json();

  return (
    <main className="flex min-h-screen flex-col items-center lg:p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm mb-2 lg:flex lg:mb-10">
        <Link href="/">
          <p className="flex w-full justify-center border-b p-4 lg:static lg:w-auto text-lg lg:rounded-xl lg:border">
            Sunny Weather App
          </p>
        </Link>
      </div>
      <div className="flex flex-col max-w-5xl w-full border-b text-lg items-center lg:py-5 lg:px-16 lg:rounded-xl lg:border">
        <p className="text-3xl text-center pb-5">
          {data.city.name}, {data.city.country}
        </p>
        <div>
          <div className="text-4xl from-gray-600 flex flex-col items-center">
            <div>
              {data.list[0].main.temp}
              <sup>o</sup>
            </div>
            <span className="text-lg">
              Feels like {data.list[0].main.feels_like}
              <sup>o</sup>
            </span>
          </div>
        </div>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <ForecastTable data={data}></ForecastTable>
      </Suspense>
    </main>
  );
}

function getTimeFrom(ts: number) {
  const d = new Date(ts * 1000);
  return `${d.getHours()}:${d.getMinutes()}`;
}

function forecastAggregateByDay(forecast: Forecast) {
  type O = { [k: string]: AggregateForecast };
  const output: O = {};
  forecast.list.forEach((f) => {
    const date = new Date(f.dt * 1000).toLocaleDateString("no-NO");
    if (date in output) {
      let aggregate = output[date];
      aggregate.temp = (aggregate.temp + f.main.temp) / 2;
      aggregate.feels_like = (aggregate.feels_like + f.main.feels_like) / 2;
      output[date] = aggregate;
    } else {
      output[date] = {
        feels_like: f.main.feels_like,
        temp: f.main.temp,
        date: date,
      };
    }
  });

  return Object.keys(output).map((k) => output[k]);
}
