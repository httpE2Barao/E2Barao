import { Modelo3D } from "@/components/home/3d-model";
import BoxIntro from "@/components/home/apresentacao";

export default function Home() {
  return (
    <main className="flex max-xl:flex-col flex-row w-full max-h-[80vh] xl:items-center xl:justify-center">
      <BoxIntro />
      <Modelo3D />
    </main>
  );
}
