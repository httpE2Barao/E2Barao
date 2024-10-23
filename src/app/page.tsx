import { Modelo3D } from "@/components/home/3d-model";
import BoxIntro from "@/components/home/box-intro";

export default function Home() {
  return (
    <main className="max-md:px-4">
      <BoxIntro />
      <Modelo3D />
    </main>
  );
}
