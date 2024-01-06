import React,{ useRef, useState, FC } from 'react';
import './App.css';
import SearchIcon from './assets/Search.png';
import ClearIcon from './assets/Clear.png';
import RainIcon from './assets/Rain.png';
import SnowIcon from './assets/Snow.png';
import CloudsIcon from './assets/Clouds.png';
import HazeIcon from './assets/Haze.png';
import SmokeIcon from './assets/Smoke.png';
import MistIcon from './assets/Mist.png';
import DrizzleIcon from './assets/Drizzle.png';
import TemperatureIcon from './assets/Temperature.png';
import Loading from './assets/Loading.png';
import NotFound from './assets/NotFound.png';


// Интерфейсы для типизации данных
interface WeatherType {
    type: string;
    img: string;
}

interface WeatherData {
    name: string;
    sys: {
        country: string;
    };
    main: {
        temp: number;
    };
}

// Ключ API для запросов к OpenWeatherMap
const Api_Key = "050b1da881ca8694c8a295bf7803f576";


const App: FC = () => {
    // Ссылка на инпут для ввода города
    const inputRef = useRef<HTMLInputElement | null>(null);

    // Состояния для данных о погоде, отображаемых иконок и состояния загрузки
    const [apiData, setApiData] = useState<WeatherData | null>(null);
    const [showWeather, setShowWeather] = useState<WeatherType[] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    // Типы погоды с соответствующими иконками
    const WeatherTypes: WeatherType[] = [
        { type: "Clear", img: ClearIcon },
        { type: "Rain", img: RainIcon },
        { type: "Snow", img: SnowIcon },
        { type: "Clouds", img: CloudsIcon },
        { type: "Haze", img: HazeIcon },
        { type: "Smoke", img: SmokeIcon },
        { type: "Mist", img: MistIcon },
        { type: "Drizzle", img: DrizzleIcon },
        { type: "Not Found", img: NotFound },
    ];

    // Функция для получения данных о погоде при вводе города или нажатии кнопки поиска
    const getWeather = async () => {
        if (inputRef.current) {
            const cityName = inputRef.current.value.trim(); // Убираем пробелы
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${Api_Key}`;
            setLoading(true);
    
            // Запрос данных о погоде с использованием fetch
            fetch(url)
                .then(res => res.json())
                .then(data => {
                    // Сброс предыдущих данных
                    setApiData(null);
    
                    // Обработка случая, если город не найден или запрос некорректен
                    if (data.cod === "404" || data.cod === "400") {
                        setShowWeather([WeatherTypes[8]]);
                    }
    
                    // Фильтрация и отображение соответствующей иконки в зависимости от погоды
                    setShowWeather(
                        WeatherTypes.filter(
                            (weather) => weather.type === data.weather[0].main
                        )
                    );
    
                    // Обновление данных о погоде
                    setApiData(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.log(err);
                    setLoading(false);
                });
        }
    };


    // Обработчик события нажатия Enter в поле ввода города
    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            getWeather();
        }
    };

    // Возвращение JSX-разметки компонента
    return (
        <div className="bg-blue-500 h-screen grid place-items-center">
            <div className="bg-white w-96 p-4 rounded-md">
                <div className="flex items-center justify-between">
                    {/* Поле ввода города с обработчиком события нажатия клавиши Enter */}
                    <input
                        type="text"
                        ref={inputRef}
                        placeholder="Search for a city"
                        className="text-xl border-b p-1 border-gray-200 font-semibold uppercase flex-1"
                        onKeyDown={handleKeyPress}
                    />
                    {/* Кнопка поиска с иконкой */}
                    <button onClick={getWeather}>
                        <img src={SearchIcon} alt="..." className="w-8 h-8" />
                    </button>
                </div>
                {/* Блок с анимацией появления и отображением данных о погоде */}
                <div className={`duration-300 delay-75 overflow-hidden ${showWeather ? "h-[27rem]" : "h-0"}`}>
                    {/* Блок загрузки или отображения данных о погоде */}
                    {loading ? (
                        <div className="grid place-items-center h-full">
                            <img
                                src={Loading}
                                alt="..."
                                className="w-14 mx-auto mb-2 animate-spin"
                            />
                        </div>
                    ) : (
                        showWeather && (
                            <div className="mt-10 text-center flex flex-col gap-6">
                                {/* Отображение названия города и страны */}
                                {apiData && (
                                    <p className="text-xl font-semibold">
                                        {apiData?.name}, {apiData?.sys.country}
                                    </p>
                                )}
                                {/* Блок с иконкой и типом погоды */}
                                <div>
                                    <img
                                        src={showWeather[0]?.img}
                                        alt="..."
                                        className="w-52 mx-auto"
                                    />
                                    <h3 className="text-2xl font-bold text-zinc-800">
                                        {showWeather[0]?.type}
                                    </h3>
                                </div>
                                {/* Блок с температурой в градусах Цельсия */}
                                <div>
                                    {apiData && (
                                        <div className='flex justify-center'>
                                            <img
                                                src={TemperatureIcon}
                                                alt="..."
                                                className="mt-1 h-9"
                                            />
                                            <h2 className="text-4xl font-extrabold">
                                                {(apiData.main.temp - 273.15).toFixed(2)}&#176;C
                                            </h2>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default App;
