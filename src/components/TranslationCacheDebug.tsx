"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { getCacheStats, clearTranslationCache } from "@/lib/translate";
import { Trash2, RefreshCw } from "lucide-react";

export default function TranslationCacheDebug() {
  const [stats, setStats] = useState({ size: 0, maxSize: 0, version: "" });

  const updateStats = () => {
    setStats(getCacheStats());
  };

  useEffect(() => {
    updateStats();
  }, []);

  const handleClearCache = () => {
    if (confirm("Вы уверены, что хотите очистить кеш переводов?")) {
      clearTranslationCache();
      updateStats();
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Translation Cache</span>
          <Button variant="ghost" size="sm" onClick={updateStats}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Cached items:</span>
            <span className="font-mono">{stats.size}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Max size:</span>
            <span className="font-mono">{stats.maxSize}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Version:</span>
            <span className="font-mono">{stats.version}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Usage:</span>
            <span className="font-mono">
              {((stats.size / stats.maxSize) * 100).toFixed(1)}%
            </span>
          </div>
        </div>

        <Button
          variant="destructive"
          className="w-full"
          onClick={handleClearCache}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Clear Cache
        </Button>

        <p className="text-xs text-muted-foreground">
          Кеш сохраняется в localStorage и автоматически загружается при
          следующем посещении. Переводы кешируются для ускорения работы.
        </p>
      </CardContent>
    </Card>
  );
}
