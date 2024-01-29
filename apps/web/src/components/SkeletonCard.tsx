import { Skeleton } from '@/components/ui/skeleton';

export function SkeletonCard() {
  const skeletons = Array(8).fill(0);
  return { skeletons }.skeletons.map((_, index) => (
    <div className="flex flex-col space-y-3" key={index}>
      <Skeleton className="h-[125px] w-[250px] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  ));
}
