"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { RefreshCw, Trash2, Info } from "lucide-react";
import { staticListsCache } from "@/lib/staticListsCache";
import { toast } from "sonner";
import { useI18n } from "@/hooks/useI18n";

export function CacheManagement() {
  const { t } = useI18n("admin");
  const [cacheStats, setCacheStats] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadStats = () => {
    const stats = staticListsCache.getStats();
    setCacheStats(stats);
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleClearAll = () => {
    staticListsCache.clearAll();
    toast.success(t("entities.cache.cleared"));
    loadStats();
  };

  const handleClearNamespace = (namespace: string) => {
    staticListsCache.clearNamespace(namespace);
    toast.success(`Cache cleared for: ${namespace}`);
    loadStats();
  };

  const handleRefreshStats = () => {
    setRefreshing(true);
    setTimeout(() => {
      loadStats();
      setRefreshing(false);
      toast.success("Stats refreshed");
    }, 500);
  };

  const formatAge = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{t("entities.cache.title")}</h2>
          <p className="text-muted-foreground">
            {t("entities.cache.subtitle")}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshStats}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh Stats
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleClearAll}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {t("entities.cache.clearAll")}
          </Button>
        </div>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Info className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold">Cache Overview</h3>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="p-4 border rounded-lg">
            <div className="text-sm text-muted-foreground">Total Namespaces</div>
            <div className="text-2xl font-bold">{cacheStats?.size || 0}</div>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="text-sm text-muted-foreground">Cache Duration</div>
            <div className="text-2xl font-bold">5 min</div>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="text-sm text-muted-foreground">Total Items</div>
            <div className="text-2xl font-bold">
              {cacheStats?.entries?.reduce((sum: number, e: any) => sum + e.itemCount, 0) || 0}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium">Cached Namespaces</h4>
          {cacheStats?.entries?.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              No cache entries. Cache will be populated when static lists are loaded.
            </p>
          ) : (
            <div className="space-y-2">
              {cacheStats?.entries?.map((entry: any) => (
                <div
                  key={entry.namespace}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{entry.namespace}</span>
                      {entry.isExpired && (
                        <Badge variant="secondary" className="text-xs">
                          Expired
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {entry.itemCount} items • Age: {formatAge(entry.age)}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleClearNamespace(entry.namespace)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      <Card className="p-6 bg-muted/50">
        <h3 className="font-semibold mb-2">How Caching Works</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• Static lists are cached for 5 minutes to reduce database calls</li>
          <li>• Cache is automatically refreshed when expired</li>
          <li>• Clear cache when you update static lists to see changes immediately</li>
          <li>• Each namespace is cached independently</li>
        </ul>
      </Card>
    </div>
  );
}
