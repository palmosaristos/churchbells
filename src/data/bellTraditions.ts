export interface BellTradition {
  id: string;
  name: string;
  description?: string;
  tradition: string;
  audioSample?: string;
}

export const bellTraditions: BellTradition[] = [
  {
    id: "cathedral-bell",
    name: "Cathedral Bell",
    tradition: "Cathédrale",
    audioSample: "/audio/CATHEDRAL_3.mp3"
  },
  {
    id: "village-bell",
    name: "Village Bell",
    tradition: "Village",
    audioSample: "/audio/VILLAGE_3.mp3"
  },
  {
    id: "carillon-bell",
    name: "Carillon Bells",
    tradition: "Carillon",
    audioSample: "/audio/freemium-carillon.mp3"
  }
];
