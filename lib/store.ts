import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type State = { favorites: string[]; ratings: Record<string, number>; };
type Actions = { toggleFavorite: (id: string) => void; rate: (id: string, v: number) => void; };

export const useRecipeStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      favorites: [],
      ratings: {},
      toggleFavorite: (id) => {
        const { favorites } = get();
        const newFavorites = favorites.includes(id) ? favorites.filter((x) => x !== id) : [...favorites, id];
        set({ favorites: newFavorites });
      },
      rate: (id, v) => {
        const { ratings } = get();
        set({ ratings: { ...ratings, [id]: v } });
      }
    }),
    { name: "recipe-store", storage: createJSONStorage(() => localStorage) }
  )
);
