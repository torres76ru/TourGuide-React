import { getRandomImage } from "./getRandomImage";

const mockSights = [
  {
    name: "Эйфелева башня",
    description: "Одна из самых известных достопримечательностей Парижа.",
  },
  {
    name: "Колизей",
    description: "Античный амфитеатр в Риме.",
  },
  {
    name: "Мачу-Пикчу",
    description: "Древний город инков в Перу.",
  },
  {
    name: "Тадж-Махал",
    description: "Мавзолей в Агре, Индия.",
  },
  {
    name: "Статуя Свободы",
    description: "Символ свободы в Нью-Йорке.",
  },
];

export const getRandomSight = () => {
  const sight = mockSights[Math.floor(Math.random() * mockSights.length)];
  return {
    ...sight,
    image: getRandomImage(),
    prices: `${Math.floor(Math.random() * 50000) + 10000}`,
    rating: (Math.random() * 1 + 4).toFixed(1), // от 4.0 до 5.0
  };
};
