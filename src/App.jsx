import './App.css'
import Tamagotchi from "./Components/Tamogotchi/Tamogotchi.jsx"; // Импортируем компонент Tamagotchi

function App() {
    return (
        <div style={{
            display: 'flex', // Используем флексбокс для выравнивания
            flexDirection: 'column', // Выстраиваем элементы вертикально
            alignItems: 'center', // Центрируем элементы по горизонтали
            justifyContent: 'center', // Центрируем элементы по вертикали
            minHeight: '100vh', // Чтобы минимальная высота была 100% от высоты экрана
            maxWidth: '1280px', // Ограничиваем максимальную ширину экрана
            margin: 'auto' // Автоматические отступы для центрирования
        }}>
            <h2 style={{margin: 0}} className='game-title'>
                Мой котёнок
            </h2>
            {/* Вставляем компонент Tamagotchi */}
            <Tamagotchi></Tamagotchi>
        </div>
    )
}

export default App
