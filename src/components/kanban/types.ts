export interface Card {
  id: string;
  title: string;
}

export interface Column {
  id: string;
  title: string;
  color: string;
  cards: Card[];
}