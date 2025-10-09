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
    audioSample: "https://dtleakeiowgwlunabkrm.supabase.co/storage/v1/object/public/CHURCH%20BELL%20SOUNDS/SOL%20trois%20fois%20de%20suite.mp3"
  },
  {
    id: "village-bell",
    name: "Village Bell (in E)",
    description: "Le son authentique et chaleureux d'une cloche de village, rappelant les traditions rurales et la simplicité de la vie communautaire.",
    tradition: "Village",
    audioSample: "https://dtleakeiowgwlunabkrm.supabase.co/storage/v1/object/public/CHURCH%20BELL%20SOUNDS/cloche%20en%20DO%20TROIS%20FOIS%20avec%20fondu%20sur%20les%20deux%20tiers%20en%20fermeture.mp3"
  },
  {
    id: "carillon-bell",
    name: "Carillon Bells",
    description: "Un système de trois cloches produisant un carillon harmonieux, créant une mélodie sacrée qui élève l'âme.",
    tradition: "Carillon",
    audioSample: "https://dtleakeiowgwlunabkrm.supabase.co/storage/v1/object/public/CHURCH%20BELL%20SOUNDS/CARILLON%20raccourci%20avec%20fondu.mp3"
  }
];
