import { getRandomImage } from "widgets/SightCard/lib/getRandomImage"

const mockCards = [
  {
    name: "Эйфелева башня",
    isOpen: "Сейчас открыто",
    categories: "Культурный объект, исторический",
  },
  {
    name: "Колизей",
    isOpen: "Сейчас закрыто",
    categories: "Культурный объект, исторический",
  },
  {
    name: "Мачу-Пикчу",
    isOpen: "Сейчас открыто",
    categories: "Культурный объект, исторический",
  },
  {
    name: "Тадж-Махал",
    isOpen: "Сейчас закрыто",
    categories: "Культурный объект, исторический",
  },
  {
    name: "Статуя Свободы",
    isOpen: "Сейчас открыто",
    categories: "Культурный объект, исторический",
  },
];

export const getRandomCard = () => {
  const card = mockCards[Math.floor(Math.random() * mockCards.length)];
  return {
    ...card,
    image: getRandomImage(),
    rating: (Math.random() * 1 + 4).toFixed(1), // от 4.0 до 5.0
    location: (Math.random() * 1 + 3).toFixed(1),
  };
};
