import search from "shared/assets/search.svg";

interface Props {
  className?: string;
}

const Search = ({ className }: Props) => {
  return (
    <div className={className}>
      <img src={search} />
    </div>
  );
};

export default Search;
