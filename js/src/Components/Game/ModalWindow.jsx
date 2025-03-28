import legendphoto from './assets/legendphoto.jpg'
import axios from "axios";
import {useState} from "react";
import AlertModal from "./AlertModal.jsx";

const API_URL = 'http://127.0.0.1:8000'
const curs = 1000000000

export default function ModalWindow({coins, setOpen, setCoins}) {

    const [isAlertOpen, setAlertOpen] = useState(false); // Для открытия/закрытия модалки с сообщением
    const [wallet, setWallet] = useState('') // Хранение введённого кошелька
    const [message, setMessage] = useState('') // Сообщение для модалки

    // Функция для обновления состояния кошелька
    function handleE(e) {
        setWallet(e.target.value)
    }

    async function handle() {
        const quotient = Math.floor(coins / curs); // Считаем, сколько монет можно обменять

        if (quotient > 0) {
            setCoins(coins - curs * quotient); // Вычитаем обмененные монеты
            setMessage(`Успех. ${quotient} монет обменено. Ожидайте пополнения`)
            setAlertOpen(true) // Открываем уведомление
            try {
                // Отправляем запрос на сервер с данными о кошельке и обмене монет
                const response = await axios.post('http://127.0.0.1:8000/cripton', {
                    wallet: wallet,
                    coins: String(quotient),
                });
                console.log(response) // Логируем ответ
            } catch (error) {
                console.error('Ошибка при обмене:', error); // Логируем ошибку
            }
        } else {
            setMessage('Не хватает монет');
            setAlertOpen(true) // Показываем ошибку, если монет недостаточно
        }
    }

    return (
        <div style={{
            display: 'flex',
            width: '90vw',
            flexDirection: 'column',
            maxWidth: '500px',
            alignItems: 'center',
        }}>
            {isAlertOpen && (
                <AlertModal
                    message={message}
                    onClose={() => {
                        setOpen(false) // Закрыть окно
                    }}
                />
            )}
            <p style={{
                margin: '3px',
            }}>Введите свой криптокошелёк</p>
            <input style={{borderRadius: '15px', margin: '10px', marginBottom: '20px'}} type="text"
                   defaultValue='' onChange={handleE}></input>
            <p>100 LexinCoin - {curs} 🪙</p>
            <p>У вас {coins}🪙</p>
            <button onClick={handle}>Отправить монеты</button>
            <img src={legendphoto} alt='Благотворительность' className='legend' style={{maxHeight: '400px'}}/>
            <p style={{fontStyle: 'italic'}}>Кошелёк приюта </p>
            <p>...</p>
            <button style={{marginBottom: '20px'}} onClick={() => {
                setOpen(false) // Закрыть окно
            }}>Назад
            </button>
        </div>
    )
}
