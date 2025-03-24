import React, {useEffect, useState} from "react";
import "./game.css";

import happyCat from './assets/happy.webp'
import neutralCat from './assets/neutral.webp'
import sadCat from './assets/sad.webp'
import ModalWindow from "./ModalWindow.jsx";

// Объект с изображениями кошек для разных состояний
const cats = {
    sad: sadCat,
    neutral: neutralCat,
    happy: happyCat,
};

// Уровни с их параметрами (цвет, множитель и стоимость)
const levels = {
    1: {
        level: 1,
        multiplicator: 1,
        color: '#5A3E1B', // Деревянный (стартовый)
        cost: 100,
        shadow: '0 0 20px 5px rgba(90, 62, 27, 0.8)'
    },
    2: {
        level: 2,
        multiplicator: 5,
        color: '#A6A6A6', // Серебряный блеск
        cost: 500,
        shadow: '0 0 20px 5px rgba(166, 166, 166, 0.8)'
    },
    3: {
        level: 3,
        multiplicator: 10,
        color: '#FFD700', // Королевское золото
        cost: 2500,
        shadow: '0 0 20px 5px rgba(255, 215, 0, 0.8)'
    },
    4: {
        level: 4,
        multiplicator: 20,
        color: '#007F5F', // Изумрудный свет
        cost: 7500,
        shadow: '0 0 20px 5px rgba(0, 127, 95, 0.8)'
    },
    5: {
        level: 5,
        multiplicator: 35,
        color: '#6D3E91', // Аметистовый блеск
        cost: 20000,
        shadow: '0 0 20px 5px rgba(109, 62, 145, 0.8)'
    },
    6: {
        level: 6,
        multiplicator: 50,
        color: '#FF512F', // Лава & розовый неон
        cost: 50000,
        shadow: '0 0 20px 5px rgba(255, 81, 47, 0.8)'
    },
    7: {
        level: 7,
        multiplicator: 75,
        color: '#1E3C72', // Сапфировая глубина
        cost: 125000,
        shadow: '0 0 20px 5px rgba(30, 60, 114, 0.8)'
    },
    8: {
        level: 8,
        multiplicator: 100,
        color: '#D31027', // Рубиновый закат
        cost: 250000,
        shadow: '0 0 20px 5px rgba(211, 16, 39, 0.8)'
    },
    9: {
        level: 9,
        multiplicator: 150,
        color: '#E5E4E2', // Платиновый блеск
        cost: 500000,
        shadow: '0 0 20px 5px rgba(229, 228, 226, 0.8)'
    },
    10: {
        level: 10,
        multiplicator: 250,
        color: '#4CA1AF', // Ледяной алмаз
        cost: 1_000_000,
        shadow: '0 0 20px 5px rgba(76, 161, 175, 0.8)'
    },
    11: {
        level: 11,
        multiplicator: 400,
        color: '#6A3093', // Космический фиолет
        cost: 2_500_000,
        shadow: '0 0 20px 5px rgba(106, 48, 147, 0.8)'
    },
    12: {
        level: 12,
        multiplicator: 600,
        color: '#FF7E5F', // Оранжевый закат
        cost: 5_000_000,
        shadow: '0 0 20px 5px rgba(255, 126, 95, 0.8)'
    },
    13: {
        level: 13,
        multiplicator: 900,
        color: '#0575E6', // Электрический шторм
        cost: 10_000_000,
        shadow: '0 0 20px 5px rgba(5, 117, 230, 0.8)'
    },
    14: {
        level: 14,
        multiplicator: 1200,
        color: '#7F00FF', // Магическая аура
        cost: 25_000_000,
        shadow: '0 0 20px 5px rgba(127, 0, 255, 0.8)'
    },
    15: {
        level: 15,
        multiplicator: 2000,
        color: '#F7971E', // Легендарный солнечный
        cost: 'max',
        shadow: '0 0 20px 5px rgba(247, 151, 30, 0.8)'
    }
};

export default function Game() {
    // Используем useState для управления состоянием
    const [coins, setCoins] = useState(localStorage.getItem('coins') ? parseInt(localStorage.getItem('coins')) : 0);
    const [feed, setFeed] = useState(50); // Сытость кота по умолчанию 50%
    const [status, setStatus] = useState(1); // Статус кота (счастливый, нейтральный и т.д.)
    const [error, setError] = useState(null); // Для вывода ошибок
    const [currentCat, setCurrentCat] = useState(cats.neutral); // Кошка в нейтральном состоянии
    const [particles, setParticles] = useState([]); // Частицы для анимации
    const [level, setLevel] = useState(levels[localStorage.getItem('level')] ? levels[localStorage.getItem('level')] : levels[1]); // Уровень кота
    const [open, setOpen] = useState(false); // Для открытия модального окна

    // Функция для покупки еды для кота
    function buyFeed() {
        if (coins < 10) { // Если монет не хватает
            setError("У вас не хватает монет");
        } else if (feed + 10 > 100) { // Если кот уже сыт
            setError("Кот сыт");
        } else {
            setFeed(feed + 10); // Увеличиваем сытость
            setCoins(coins - 10); // Уменьшаем количество монет
        }
    }

    // Хук для изменения состояния кота в зависимости от сытости
    useEffect(() => {
        if (feed > 70) {
            setCurrentCat(cats.happy); // Кот счастливый
            setStatus(2); // Уровень счастья
        } else if (feed < 40) {
            setCurrentCat(cats.sad); // Кот грустный
            setStatus(0.2); // Уровень грусти
        } else {
            setCurrentCat(cats.neutral); // Кот нейтральный
            setStatus(1); // Стандартное состояние
        }
    }, [feed, coins]); // Зависимость от сытости и монет

    // Хук для уменьшения сытости кота каждые 5 секунд
    useEffect(() => {
        const hungerInterval = setInterval(() => {
            setFeed((prev) => (prev > 0 ? prev - 1 : 0)); // Каждые 5 секунд уменьшаем сытость
        }, 5000);
        return () => clearInterval(hungerInterval); // Очищаем интервал при размонтировании компонента
    });

    // Функция для зарабатывания монет
    function doMoney() {
        let mod = level.multiplicator; // Множитель в зависимости от уровня
        if (level.multiplicator * status >= 1) {
            mod = level.multiplicator * status; // Увеличиваем множитель в зависимости от состояния кота
        }
        setCoins(coins + mod); // Добавляем монеты
        const newParticle = {
            id: Date.now(), // Уникальный идентификатор для анимации частиц
            left: Math.random() * 100 + '%', // Позиция по горизонтали
            top: Math.random() * 100 + '%', // Позиция по вертикали
            number: mod // Число на частице
        };
        setError(null); // Убираем ошибку, если она была

        setParticles([...particles, newParticle]); // Добавляем новую частицу

        setTimeout(() => {
            setParticles((prevParticles) =>
                prevParticles.filter((particle) => particle.id !== newParticle.id) // Удаляем частицу через 1.5 секунды
            );
        }, 1500);
    }

    // Хук для сохранения состояния монет и уровня в localStorage
    useEffect(() => {
        localStorage.setItem('coins', coins);
        localStorage.setItem('level', level.level);
    });

    // Функция для улучшения кота
    function upLevel() {
        if (level.cost === 'max') {
            setError('Максимальный уровень'); // Если уровень максимальный
        } else if (coins >= level.cost) {
            setLevel(levels[level.level + 1]); // Переход к следующему уровню
            setCoins(coins - level.cost); // Уменьшаем количество монет
        } else {
            setError('Не хватает монет'); // Если монет не хватает
        }
    }

    return (
        <div style={{maxHeight: '80vh'}}>
            {
                open ? <ModalWindow coins={coins} setOpen={setOpen} setCoins={setCoins}></ModalWindow> :
                    <div className="game-container">
                        <div className="status-bar">
                            <p>🪙 <br/> Монетки: {coins}</p>
                            <p>🍗 <br/> Сытость: {feed}%</p>
                        </div>
                        <p style={{
                            fontSize: '20px',
                            color: level.color,
                            marginTop: '10px',
                            marginBottom: '10px'
                        }}>
                            {error ? error : 'Жми на котика'}</p>
                        <div className="cat-container">

                            <img

                                style={{
                                    minHeight: "150px",
                                    minWidth: "200px",
                                    maxHeight: "200px",
                                    maxWidth: "200px",
                                    border: '10px solid',
                                    borderRadius: '25px',
                                    marginTop: '30px',
                                    borderColor: level.color,
                                    margin: 0,
                                    boxShadow: level.shadow,
                                }}
                                src={currentCat} // Отображаем текущую кошку
                                alt="Кошечка"
                                onClick={doMoney} // При клике зарабатываем монеты
                                className="pet"
                            />
                            {particles.map((particle) => (
                                <div
                                    key={particle.id}
                                    className="particle"
                                    style={{
                                        color: level.color,
                                        left: particle.left,
                                        top: particle.top,
                                    }}
                                >
                                    {particle.number}
                                </div>
                            ))}
                        </div>
                        <div className="buttons-container">
                            <button onClick={buyFeed}>Купить покушать</button>
                            <button onClick={upLevel}>Улучшить кота ({level.cost})</button>
                        </div>
                    </div>}
        </div>
    );
}
