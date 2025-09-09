"use client";

import React, { useEffect, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Trash2,
  Edit3,
  Plus,
  Eye,
  EyeOff,
  Calendar,
  ExternalLink,
  ImageIcon,
  Smartphone,
  Tablet,
  Monitor,
} from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";

type BannerForm = {
  title?: string;
  pcImageUrl: string;
  pcAltText?: string;
  tabletImageUrl?: string;
  tabletAltText?: string;
  mobileImageUrl?: string;
  mobileAltText?: string;
  url?: string;
  isActive?: boolean;
};

export default function AdminHeroBanners() {
  const allBanners = useQuery(api.heroBanners.getAll) as any[] | null;
  const create = useMutation(api.heroBanners.create);
  const update = useMutation(api.heroBanners.update);
  const remove = useMutation(api.heroBanners.remove);
  const softDelete = useMutation(api.heroBanners.softDelete);

  const [form, setForm] = useState<BannerForm>({ pcImageUrl: "" });
  const [editingId, setEditingId] = useState<Id<"heroBanners"> | null>(null);
  const [saving, setSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");

  useEffect(() => {
    if (!editingId) {
      setForm({ pcImageUrl: "" });
    } else {
      const doc = (allBanners || []).find(
        (d) => String(d._id) === String(editingId)
      );
      if (doc) {
        setForm({
          title: doc.title,
          pcImageUrl: doc.pcImageUrl,
          pcAltText: doc.pcAltText,
          tabletImageUrl: doc.tabletImageUrl,
          tabletAltText: doc.tabletAltText,
          mobileImageUrl: doc.mobileImageUrl,
          mobileAltText: doc.mobileAltText,
          url: doc.url,
          isActive: doc.isActive,
        });
      }
    }
  }, [editingId, allBanners]);

  const handleChange = (k: keyof BannerForm, v: any) => {
    setForm((s) => ({ ...s, [k]: v }));
  };

  const handleSave = async () => {
    if (!form.pcImageUrl.trim()) {
      alert("PC image URL is required.");
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        await update({ id: editingId as Id<"heroBanners">, ...form });
      } else {
        await create(form);
      }
      setEditingId(null);
      setForm({ pcImageUrl: "" });
      setIsDialogOpen(false);
    } catch (e) {
      console.error(e);
      alert("Failed to save. Check console for details.");
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async (id: Id<"heroBanners">) => {
    await remove({ id });
  };

  const handleSoftDelete = async (id: Id<"heroBanners">) => {
    await softDelete({ id });
  };

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return "—";
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const openEditDialog = (banner?: any) => {
    if (banner) {
      setEditingId(banner._id);
    } else {
      setEditingId(null);
      setForm({ pcImageUrl: "" });
    }
    setIsDialogOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 mt-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hero Banners</h1>
          <p className="text-muted-foreground mt-1">
            Manage hero banners displayed on your homepage
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openEditDialog()} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Banner
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {editingId ? (
                  <Edit3 className="h-5 w-5" />
                ) : (
                  <Plus className="h-5 w-5" />
                )}
                {editingId ? "Edit Banner" : "Create New Banner"}
              </DialogTitle>
              <DialogDescription>
                Configure your hero banner settings and responsive images
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Basic Info */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Banner Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter banner title (optional)"
                    value={form.title ?? ""}
                    onChange={(e) => handleChange("title", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="url">Call-to-Action URL</Label>
                  <Input
                    id="url"
                    placeholder="https://example.com"
                    value={form.url ?? ""}
                    onChange={(e) => handleChange("url", e.target.value)}
                  />
                </div>
              </div>

              <Separator />

              {/* Image Settings */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Responsive Images
                </h3>

                {/* Desktop Image */}
                <div className="space-y-3 p-4 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Monitor className="h-4 w-4" />
                    <Label className="font-medium">
                      Desktop Image (Required)
                    </Label>
                  </div>
                  <Input
                    placeholder="Desktop image URL"
                    value={form.pcImageUrl}
                    onChange={(e) => handleChange("pcImageUrl", e.target.value)}
                  />
                  <Input
                    placeholder="Alt text for accessibility"
                    value={form.pcAltText ?? ""}
                    onChange={(e) => handleChange("pcAltText", e.target.value)}
                  />
                  {form.pcImageUrl && (
                    <div className="mt-2">
                      <img
                        src={form.pcImageUrl}
                        alt="Desktop preview"
                        className="w-full h-24 object-cover rounded border"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Tablet Image */}
                <div className="space-y-3 p-4 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Tablet className="h-4 w-4" />
                    <Label className="font-medium">
                      Tablet Image (Optional)
                    </Label>
                  </div>
                  <Input
                    placeholder="Tablet image URL"
                    value={form.tabletImageUrl ?? ""}
                    onChange={(e) =>
                      handleChange("tabletImageUrl", e.target.value)
                    }
                  />
                  <Input
                    placeholder="Alt text for accessibility"
                    value={form.tabletAltText ?? ""}
                    onChange={(e) =>
                      handleChange("tabletAltText", e.target.value)
                    }
                  />
                </div>

                {/* Mobile Image */}
                <div className="space-y-3 p-4 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4" />
                    <Label className="font-medium">
                      Mobile Image (Optional)
                    </Label>
                  </div>
                  <Input
                    placeholder="Mobile image URL"
                    value={form.mobileImageUrl ?? ""}
                    onChange={(e) =>
                      handleChange("mobileImageUrl", e.target.value)
                    }
                  />
                  <Input
                    placeholder="Alt text for accessibility"
                    value={form.mobileAltText ?? ""}
                    onChange={(e) =>
                      handleChange("mobileAltText", e.target.value)
                    }
                  />
                </div>
              </div>

              <Separator />

              {/* Settings */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">
                      Active Status
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Toggle banner visibility on the website
                    </p>
                  </div>
                  <Switch
                    checked={!!form.isActive}
                    onCheckedChange={(v) => handleChange("isActive", v)}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingId(null);
                    setForm({ pcImageUrl: "" });
                    setIsDialogOpen(false);
                  }}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={saving}>
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Update Banner"
                      : "Create Banner"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Banners List */}
      <Card>
        <CardHeader>
          <CardTitle>All Banners ({(allBanners || []).length})</CardTitle>
        </CardHeader>
        <CardContent>
          {!allBanners ? (
            <div className="text-center py-8">
              <div className="animate-pulse">Loading banners...</div>
            </div>
          ) : allBanners.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No banners yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first hero banner to get started
              </p>
              <Button
                onClick={() => openEditDialog()}
                variant="outline"
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Your First Banner
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {allBanners.map((banner) => (
                <Card key={String(banner._id)} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex gap-6 p-6">
                      {/* Banner Preview */}
                      <div className="flex-shrink-0">
                        <div className="relative">
                          <img
                            src={banner.pcImageUrl}
                            alt={banner.pcAltText ?? banner.title}
                            className="w-48 h-24 object-cover rounded-lg border"
                          />
                          {banner.url && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity rounded-lg">
                              <ExternalLink className="h-6 w-6 text-white" />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Banner Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <h3 className="font-semibold text-lg">
                                {banner.title || "Untitled Banner"}
                              </h3>
                              <Badge
                                variant={
                                  banner.isActive ? "default" : "secondary"
                                }
                              >
                                {banner.isActive ? (
                                  <>
                                    <Eye className="h-3 w-3 mr-1" />
                                    Active
                                  </>
                                ) : (
                                  <>
                                    <EyeOff className="h-3 w-3 mr-1" />
                                    Inactive
                                  </>
                                )}
                              </Badge>
                            </div>

                            {banner.url && (
                              <a
                                href={banner.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                              >
                                {banner.url}
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            )}

                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              {banner.startAt && (
                                <span>Start: {formatDate(banner.startAt)}</span>
                              )}
                              {banner.endAt && (
                                <span>End: {formatDate(banner.endAt)}</span>
                              )}
                            </div>

                            {/* Device Support Indicators */}
                            <div className="flex items-center gap-2">
                              <Monitor
                                className="h-4 w-4 text-green-600"
                                title="Desktop image available"
                              />
                              <Tablet
                                className={`h-4 w-4 ${banner.tabletImageUrl ? "text-green-600" : "text-gray-300"}`}
                                title={
                                  banner.tabletImageUrl
                                    ? "Tablet image available"
                                    : "No tablet image"
                                }
                              />
                              <Smartphone
                                className={`h-4 w-4 ${banner.mobileImageUrl ? "text-green-600" : "text-gray-300"}`}
                                title={
                                  banner.mobileImageUrl
                                    ? "Mobile image available"
                                    : "No mobile image"
                                }
                              />
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => openEditDialog(banner)}
                              className="gap-1"
                            >
                              <Edit3 className="h-4 w-4" />
                              Edit
                            </Button>

                            {banner.isActive ? (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="gap-1"
                                  >
                                    <EyeOff className="h-4 w-4" />
                                    Deactivate
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Deactivate Banner
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This banner will no longer be visible on
                                      your website. You can reactivate it later.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() =>
                                        handleSoftDelete(
                                          banner._id as Id<"heroBanners">
                                        )
                                      }
                                    >
                                      Deactivate
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            ) : (
                              <Badge variant="outline" className="text-xs">
                                Inactive
                              </Badge>
                            )}

                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="gap-1 text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  Delete
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Delete Banner Permanently
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. The banner
                                    will be permanently deleted from your
                                    system.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() =>
                                      handleRemove(
                                        banner._id as Id<"heroBanners">
                                      )
                                    }
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Delete Permanently
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
