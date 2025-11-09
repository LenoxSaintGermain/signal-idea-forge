import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const IdeaCardSkeleton = () => {
  return (
    <Card className="border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-2">
          <Skeleton className="h-5 w-16" />
          <div className="text-right space-y-1">
            <Skeleton className="h-4 w-20 ml-auto" />
            <Skeleton className="h-3 w-24 ml-auto" />
          </div>
        </div>
        
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-1 mb-4">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-14" />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-12" />
          </div>
          <Skeleton className="h-4 w-32" />
        </div>
      </CardContent>
    </Card>
  );
};

export default IdeaCardSkeleton;
