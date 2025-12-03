"use client";

import React, { useState, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Search,
  Image,
  Upload,
  Link2,
  Loader2,
  Check,
  X,
  History,
  Star,
} from "lucide-react";
import { Label } from "@/components/ui/label";

type MediaLibraryProps = {
  onSelect: (url: string, alt?: string) => void;
  trigger?: React.ReactNode;
};

type UnsplashImage = {
  id: string;
  urls: {
    small: string;
    regular: string;
    full: string;
  };
  alt_description: string;
  user: {
    name: string;
    username: string;
  };
  width: number;
  height: number;
};

// Mock Unsplash search (in production, use actual API)
const searchUnsplash = async (query: string): Promise<UnsplashImage[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Return mock data based on query
  const mockImages: UnsplashImage[] = Array.from({ length: 12 }, (_, i) => ({
    id: `${query}-${i}`,
    urls: {
      small: `https://picsum.photos/seed/${query}${i}/300/200`,
      regular: `https://picsum.photos/seed/${query}${i}/800/600`,
      full: `https://picsum.photos/seed/${query}${i}/1920/1080`,
    },
    alt_description: `${query} image ${i + 1}`,
    user: {
      name: "Photographer Name",
      username: "photographer",
    },
    width: 1920,
    height: 1080,
  }));

  return mockImages;
};

// Popular search terms
const popularSearches = [
  "business",
  "technology",
  "nature",
  "office",
  "team",
  "abstract",
  "minimal",
  "gradient",
];

// Icon library
const iconCategories = [
  {
    name: "General",
    icons: ["home", "search", "settings", "user", "mail", "phone", "star", "heart"],
  },
  {
    name: "Arrows",
    icons: [
      "arrow-up",
      "arrow-down",
      "arrow-left",
      "arrow-right",
      "chevron-up",
      "chevron-down",
    ],
  },
  {
    name: "Social",
    icons: ["facebook", "twitter", "instagram", "linkedin", "youtube", "github"],
  },
];

export function MediaLibrary({ onSelect, trigger }: MediaLibraryProps) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"unsplash" | "upload" | "url" | "icons" | "history">(
    "unsplash"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [images, setImages] = useState<UnsplashImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<UnsplashImage | null>(null);
  const [urlInput, setUrlInput] = useState("");
  const [recentImages, setRecentImages] = useState<string[]>([]);

  // Load recent images from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("pagepilot-recent-images");
    if (saved) {
      setRecentImages(JSON.parse(saved));
    }
  }, []);

  // Save to recent
  const addToRecent = useCallback((url: string) => {
    setRecentImages((prev) => {
      const updated = [url, ...prev.filter((u) => u !== url)].slice(0, 20);
      localStorage.setItem("pagepilot-recent-images", JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Search Unsplash
  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const results = await searchUnsplash(query);
      setImages(results);
    } catch (error) {
      console.error("Error searching Unsplash:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial search
  useEffect(() => {
    if (open && images.length === 0) {
      handleSearch("business");
    }
  }, [open, images.length, handleSearch]);

  // Select image
  const handleSelectImage = (image: UnsplashImage) => {
    setSelectedImage(image);
  };

  // Confirm selection
  const confirmSelection = () => {
    if (selectedImage) {
      onSelect(selectedImage.urls.regular, selectedImage.alt_description);
      addToRecent(selectedImage.urls.regular);
      setOpen(false);
      setSelectedImage(null);
    }
  };

  // Select from URL
  const handleUrlSelect = () => {
    if (urlInput.trim()) {
      onSelect(urlInput.trim());
      addToRecent(urlInput.trim());
      setOpen(false);
      setUrlInput("");
    }
  };

  // Select recent
  const handleRecentSelect = (url: string) => {
    onSelect(url);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Image className="w-4 h-4 mr-2" />
            ספריית מדיה
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Image className="w-5 h-5" />
            ספריית מדיה
          </DialogTitle>
        </DialogHeader>

        <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="unsplash">
              <Search className="w-4 h-4 mr-1" />
              Unsplash
            </TabsTrigger>
            <TabsTrigger value="upload">
              <Upload className="w-4 h-4 mr-1" />
              העלאה
            </TabsTrigger>
            <TabsTrigger value="url">
              <Link2 className="w-4 h-4 mr-1" />
              URL
            </TabsTrigger>
            <TabsTrigger value="icons">
              <Star className="w-4 h-4 mr-1" />
              אייקונים
            </TabsTrigger>
            <TabsTrigger value="history">
              <History className="w-4 h-4 mr-1" />
              אחרונים
            </TabsTrigger>
          </TabsList>

          {/* Unsplash Tab */}
          <TabsContent value="unsplash" className="space-y-4">
            {/* Search */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="חפש תמונות..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch(searchQuery)}
                  className="pl-9"
                />
              </div>
              <Button onClick={() => handleSearch(searchQuery)} disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "חפש"}
              </Button>
            </div>

            {/* Popular Searches */}
            <div className="flex gap-2 flex-wrap">
              {popularSearches.map((term) => (
                <Button
                  key={term}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery(term);
                    handleSearch(term);
                  }}
                >
                  {term}
                </Button>
              ))}
            </div>

            {/* Images Grid */}
            <ScrollArea className="h-[400px]">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-3">
                  {images.map((image) => (
                    <div
                      key={image.id}
                      className={cn(
                        "relative aspect-[4/3] rounded-lg overflow-hidden cursor-pointer group",
                        selectedImage?.id === image.id && "ring-2 ring-blue-500"
                      )}
                      onClick={() => handleSelectImage(image)}
                    >
                      <img
                        src={image.urls.small}
                        alt={image.alt_description}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
                      {selectedImage?.id === image.id && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-white text-xs truncate">
                          by {image.user.name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>

            {/* Selection Actions */}
            {selectedImage && (
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedImage.urls.small}
                    alt=""
                    className="w-12 h-12 rounded object-cover"
                  />
                  <div>
                    <p className="text-sm font-medium">
                      {selectedImage.alt_description || "תמונה נבחרה"}
                    </p>
                    <p className="text-xs text-slate-500">
                      {selectedImage.width} x {selectedImage.height}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedImage(null)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  <Button size="sm" onClick={confirmSelection}>
                    בחר תמונה
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Upload Tab */}
          <TabsContent value="upload" className="space-y-4">
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-12 text-center">
              <Upload className="w-12 h-12 mx-auto text-slate-400 mb-4" />
              <p className="text-slate-600 dark:text-slate-400 mb-2">
                גרור תמונות לכאן או לחץ לבחירה
              </p>
              <p className="text-xs text-slate-500">
                PNG, JPG, GIF עד 10MB
              </p>
              <Input
                type="file"
                accept="image/*"
                className="hidden"
                id="file-upload"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const url = URL.createObjectURL(file);
                    onSelect(url, file.name);
                    addToRecent(url);
                    setOpen(false);
                  }
                }}
              />
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                בחר קובץ
              </Button>
            </div>
          </TabsContent>

          {/* URL Tab */}
          <TabsContent value="url" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="image-url">כתובת URL של תמונה</Label>
                <Input
                  id="image-url"
                  placeholder="https://example.com/image.jpg"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                />
              </div>

              {urlInput && (
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <p className="text-sm font-medium mb-2">תצוגה מקדימה:</p>
                  <img
                    src={urlInput}
                    alt="Preview"
                    className="max-h-48 rounded"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://via.placeholder.com/400x300?text=Error";
                    }}
                  />
                </div>
              )}

              <Button onClick={handleUrlSelect} disabled={!urlInput.trim()}>
                השתמש בתמונה
              </Button>
            </div>
          </TabsContent>

          {/* Icons Tab */}
          <TabsContent value="icons" className="space-y-4">
            <ScrollArea className="h-[400px]">
              {iconCategories.map((category) => (
                <div key={category.name} className="mb-6">
                  <h3 className="text-sm font-medium mb-3">{category.name}</h3>
                  <div className="grid grid-cols-8 gap-2">
                    {category.icons.map((icon) => (
                      <button
                        key={icon}
                        className="p-3 border rounded-lg hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                        onClick={() => {
                          // In production, return actual icon component or SVG
                          onSelect(`/icons/${icon}.svg`, icon);
                          setOpen(false);
                        }}
                      >
                        <div className="w-6 h-6 mx-auto bg-slate-200 dark:bg-slate-700 rounded" />
                        <span className="text-[10px] text-slate-500 mt-1 block truncate">
                          {icon}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </ScrollArea>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-4">
            {recentImages.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>אין תמונות אחרונות</p>
              </div>
            ) : (
              <ScrollArea className="h-[400px]">
                <div className="grid grid-cols-4 gap-3">
                  {recentImages.map((url, index) => (
                    <div
                      key={index}
                      className="relative aspect-[4/3] rounded-lg overflow-hidden cursor-pointer group"
                      onClick={() => handleRecentSelect(url)}
                    >
                      <img
                        src={url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                        <Check className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

