export type Category =
  | "clinic"
  | "salon"
  | "coaching"
  | "cafe_restaurant"
  | "real_estate"
  | "gym_fitness";

export const CATEGORIES: { id: Category; label: string; tagline: string; emoji: string }[] = [
  { id: "clinic", label: "Clinic / Doctor", tagline: "Trust-building healthcare marketing", emoji: "🩺" },
  { id: "salon", label: "Salon / Beauty", tagline: "Trendy, stylish, engagement-led", emoji: "💇" },
  { id: "coaching", label: "Coaching Institute", tagline: "Motivational, education-first", emoji: "🎓" },
  { id: "cafe_restaurant", label: "Cafe / Restaurant", tagline: "Fun, food-forward promotions", emoji: "☕" },
  { id: "real_estate", label: "Real Estate", tagline: "Premium, sales-driven content", emoji: "🏡" },
  { id: "gym_fitness", label: "Gym / Fitness", tagline: "Energetic, transformation-focused", emoji: "💪" },
];

export const categoryLabel = (id: Category) =>
  CATEGORIES.find((c) => c.id === id)?.label ?? id;
