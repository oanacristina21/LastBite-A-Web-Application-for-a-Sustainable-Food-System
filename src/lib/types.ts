export type User = {
  id: number;
  tip: 'client' | 'restaurant';
  nume?: string;
  denumireRestaurant?: string;
};

// src/lib/types.ts
export type StatusComanda =
  | 'Plasata'
  | 'Confirmata'
  | 'In Pregatire'
  | 'Gata de Ridicare'
  | 'Finalizata'
  | 'Anulata'
