export interface BellTradition {
  id: string;
  nameKey: string; // Translation key for bell name
  description?: string;
  tradition: string;
  audioSample?: string;
}

export const bellTraditions: BellTradition[] = [
  {
    id: "cathedral-bell",
    nameKey: "bells.cathedral",
    tradition: "Cathédrale",
    audioSample: "/audio/cathedral_3.mp3"
  },
  {
    id: "village-bell",
    nameKey: "bells.village",
    tradition: "Village",
    audioSample: "/audio/village_3.mp3"
  },
  {
    id: "carillon-bell",
    nameKey: "bells.carillon",
    tradition: "Carillon",
    audioSample: "/audio/CARILLON_3_1763739187183.mp3"
  }
];
