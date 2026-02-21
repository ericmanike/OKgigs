
import Loader from "@/components/ui/loading";
export default function Loading() {
  return (
    <div className="min-h-[100vh] flex flex-col items-center justify-center pt-24 md:pt-28 pb-20 px-6">
      <Loader />
    </div>
  );
}
