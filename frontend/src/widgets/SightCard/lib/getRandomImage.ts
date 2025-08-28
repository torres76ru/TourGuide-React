const URLS = [
  "https://i.pinimg.com/1200x/07/4d/55/074d55957e3fc5d4d63dbba6325f2e6c.jpg",
  "https://i.pinimg.com/1200x/b8/6a/7b/b86a7bb76e78a7750d7d518bf4e9f338.jpg",
  "https://i.pinimg.com/736x/ba/2b/0a/ba2b0a2a512b4b3d689560d3c1a25adf.jpg",
  "https://i.pinimg.com/1200x/46/51/a5/4651a529db739b0c92ed516b9366da83.jpg",
  "https://i.pinimg.com/736x/18/0f/c1/180fc1ecea16aa8e346dc380f5b342c1.jpg",
  "https://i.pinimg.com/1200x/b0/c9/17/b0c9174cbb05fe56b4df4fcc76f9d79c.jpg",
  "https://i.pinimg.com/1200x/53/12/3a/53123acedeecc4daa69b423ae7999c65.jpg",
  "https://i.pinimg.com/736x/63/76/24/637624da060301a5bcfba1fbb6b45834.jpg",
];

export const getRandomImage = () => {
  const index = Math.floor(Math.random() * URLS.length);
  return URLS[index];
};
