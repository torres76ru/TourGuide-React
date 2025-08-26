import type { Attraction } from 'entities/attraction/model/types';
import { SightTiny } from 'entities/sight-tiny';

interface SearchListProps {
  attractions?: Attraction[];
}

export const SearchList = ({ attractions }: SearchListProps) => {
  if (!attractions || attractions.length === 0) {
    return <div>Ничего не найдено</div>;
  }
  return (
    <div>
      {attractions &&
        attractions.map((sight, index) => (
          <SightTiny
            key={index}
            id={sight.id}
            img_url={sight.main_photo_url}
            title={sight.name}
            town={sight.city}
          />
        ))}
    </div>
  );
};
