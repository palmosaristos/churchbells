export interface BellTradition {
  id: string;
  name: string;
  description: string;
  tradition: string;
  audioSample?: string;
}

export const bellTraditions: BellTradition[] = [
  {
    id: "cathedral-bell",
    name: "Classic Bell (in C)",
    description: "La majesté et la profondeur d'une grande cloche traditionnelle en note Do, évoquant la grandeur spirituelle.",
    tradition: "Cathédrale",
    audioSample: "/audio/freemium-cathedral.mp3"
  },
  {
    id: "village-bell",
    name: "Village Bell (in E)",
    description: "Le son authentique et chaleureux d'une cloche de village, rappelant les traditions rurales et la simplicité de la vie communautaire.",
    tradition: "Village",
    audioSample: "/audio/freemium-village.mp3"
  },
  {
    id: "carillon-bell",
    name: "Carillon Bells",
    description: "Un système de trois cloches produisant un carillon harmonieux, créant une mélodie sacrée qui élève l'âme.",
    tradition: "Carillon",
    audioSample: "/audio/freemium-carillon.mp3"
  },
  {
    id: "angelus-bell",
    name: "Angélus Bell",
    description: "Le son puissant de l'Angélus, trois séries de trois coups suivis d'un carillon, marquant les moments de prière traditionnels.",
    tradition: "Angélus",
    audioSample: "/audio/freemium-angelus.mp3"
  }
];
