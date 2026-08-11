import useSWR from "swr";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const fetcher = (url) => axios.get(url).then((r) => r.data);

export function useProducts() {
  const { data, error, isLoading } = useSWR(`${API}/products`, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  });
  return { products: data?.products || [], isLoading, error };
}

export function useProduct(handle) {
  const { data, error, isLoading } = useSWR(
    handle ? `${API}/products/${handle}` : null,
    fetcher,
    { revalidateOnFocus: false }
  );
  return { product: data || null, isLoading, error };
}

export function useProductsByActivity(activity) {
  const { products, isLoading, error } = useProducts();

  const activityTagMap = {
    pickleball: ["pickleball"],
    tennis: ["tennis"],
    cycling: ["cycling", "bike", "road cycling"],
    "mountain-biking": ["mountain biking", "mtb", "cycling"],
    golf: ["golf"],
    outdoors: ["outdoor", "hiking", "general outdoors"],
  };

  const tags = activityTagMap[activity] || [activity];

  const filtered = products.filter((p) =>
    p.tags?.some((tag) =>
      tags.some((t) => tag.toLowerCase().includes(t.toLowerCase()))
    )
  );

  return { products: filtered.length > 0 ? filtered : products, isLoading, error };
}
