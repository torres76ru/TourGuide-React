import { SightTiny } from "entities/sight-tiny";

const sightList = [
  {
    img_url: "",
    title: "Театр Волкова",
    town: "Ярославль",
  },
  {
    img_url: "",
    title: "Sight 2",
    town: "Town 2",
  },
];

export const SearchList = () => {
  return (
    <div>
      {sightList.map((sight, index) => (
        <SightTiny
          key={index}
          img_url={sight.img_url}
          title={sight.title}
          town={sight.town}
        />
      ))}
    </div>
  );
};
