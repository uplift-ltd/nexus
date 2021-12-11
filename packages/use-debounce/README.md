# @uplift-ltd/use-debounce

## Installation

    yarn add @uplift-ltd/use-debounce

## API

### useDebounce

Debounce a state variable or prop.

```ts
import { useDebounce } from "@uplift-ltd/use-debounce";

function MyComponent() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
}
```
