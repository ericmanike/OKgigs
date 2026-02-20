export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center pt-24 md:pt-28 pb-20 px-6">
      <div className="w-10 h-10 rounded-xl border-2 border-[#0e0947]/20 border-t-[#0e0947] animate-spin" />
      <p className="mt-4 text-sm text-zinc-500 font-medium">     OK Gigs...</p>
    </div>
  );
}
