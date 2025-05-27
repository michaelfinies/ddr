"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Package,
  Loader2,
  Plus,
  Trash2,
  PencilPackage,
  Pencil,
  Coins,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

export default function StoreEditPage() {
  const user = useAuthStore((s) => s.user);
  const schoolId = user?.schoolId;

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState({
    id: null,
    title: "",
    description: "",
    price: "",
    quantity: "",
  });
  const [saving, setSaving] = useState(false);
  const [addingNew, setAddingNew] = useState(false);

  useEffect(() => {
    if (!schoolId) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch only items for the current school
        const itemsRes = await fetch(`/api/store-items?schoolId=${schoolId}`);
        const itemsData = await itemsRes.json();
        setItems(itemsData.items || []);
      } catch (err) {
        toast.error("Failed to load store data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [schoolId]);

  function openEdit(item) {
    setEditingItem(item);
    setForm({
      id: item.id,
      title: item.title,
      description: item.description,
      price: item.price,
      quantity: item.quantity,
    });
    setAddingNew(false);
  }

  function openAddNew() {
    setEditingItem(null);
    setForm({
      id: null,
      title: "",
      description: "",
      price: "",
      quantity: "",
    });
    setAddingNew(true);
  }

  function handleFormChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      let res, newItem;
      if (form.id) {
        // Editing existing item
        res = await fetch(`/api/store-items/${form.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: form.title,
            description: form.description,
            price: form.price,
            quantity: form.quantity,
          }),
        });
        if (!res.ok) throw new Error();
        newItem = await res.json();
        setItems((prev) =>
          prev.map((it) => (it.id === newItem.id ? newItem : it))
        );
        toast.success("Item updated!");
      } else {
        // Adding new item
        res = await fetch("/api/store-items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: form.title,
            description: form.description,
            price: form.price,
            quantity: form.quantity,
            schoolId,
          }),
        });
        if (!res.ok) throw new Error();
        newItem = await res.json();
        setItems((prev) => [...prev, newItem]);
        toast.success("Item added!");
      }
      setEditingItem(null);
      setAddingNew(false);
    } catch (err) {
      toast.error("Error saving item.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this item?")) return;
    try {
      const res = await fetch(`/api/store-items/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      setItems((prev) => prev.filter((it) => it.id !== id));
      toast.success("Item deleted.");
    } catch (err) {
      toast.error("Delete failed.");
    }
  }

  const bannerUrl = "/store2.png";

  // Don't render anything until schoolId is available
  if (!schoolId) {
    return (
      <div className="flex justify-center items-center min-h-screen text-lg">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/40 to-background pb-20">
      {/* Banner */}
      <div className="relative w-full h-48 md:h-64 mb-8">
        <img
          src={bannerUrl}
          alt="Store Banner"
          className="w-full h-full object-cover rounded-b-3xl shadow-lg"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent rounded-b-3xl flex items-end px-10 pb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white drop-shadow-2xl tracking-tight">
            Edit Store Items
          </h1>
        </div>
      </div>

      {/* Add New Button */}
      <div className=" flex justify-end px-4 mb-6">
        <Button
          onClick={openAddNew}
          className="rounded-2xl px-6 py-2 font-bold shadow-md flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add New Item
        </Button>
      </div>

      {/* Store Grid */}
      <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-4">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Card
              key={i}
              className="h-64 rounded-2xl bg-gray-200 animate-pulse border-0 shadow-xl"
            >
              <CardContent className="p-8 flex flex-col gap-6">
                <div className="h-7 w-2/3 bg-muted rounded-xl mb-3" />
                <div className="h-4 w-full bg-muted rounded mb-1" />
                <div className="h-4 w-1/2 bg-muted rounded mb-4" />
                <div className="flex gap-3">
                  <div className="h-8 w-20 bg-muted rounded-xl" />
                  <div className="h-8 w-14 bg-muted rounded-xl" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : items.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center text-muted-foreground py-16">
            <Package className="w-14 h-14 mb-4 opacity-60" />
            <span className="text-lg font-medium">
              No items in the store yet.
            </span>
            <Button
              onClick={openAddNew}
              className="mt-6 px-5 py-2 rounded-2xl"
              variant="secondary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add your first item
            </Button>
          </div>
        ) : (
          items.map((item) => (
            <Card
              key={item.id}
              className="group bg-gray-200 opacity-80 hover:scale-[1.02] hover:shadow-2xl  transition-all border-0 rounded-2xl shadow-lg flex flex-col justify-between min-h-[18rem] overflow-hidden"
            >
              <CardContent className="p-4 pb-0 flex flex-col gap-4 h-full">
                {/* Title & icon */}
                <div className="flex items-center gap-3">
                  <Package className="w-7 h-7 text-primary drop-shadow" />
                  <span className="font-bold text-xl tracking-tight text-foreground">
                    {item.title}
                  </span>
                </div>
                {/* Description */}
                <div className="flex-1 text-muted-foreground text-base line-clamp-2 mb-2">
                  {item.description}
                </div>
                {/* Price and quantity */}
                <div className="flex items-center gap-3 mt-auto">
                  <span className="flex items-center gap-1 text-lg font-bold text-primary drop-shadow-sm">
                    <Coins className="w-5 h-5 text-yellow-500" />
                    {item.price}
                    <span className="ml-1 text-xs font-normal text-muted-foreground">
                      tokens
                    </span>
                  </span>
                  <span className="ml-auto text-xs px-2 py-1 rounded-xl bg-muted/80 font-semibold text-muted-foreground">
                    {item.quantity} left
                  </span>
                </div>
                {/* Action buttons */}
                <div className="flex gap-2 mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl font-semibold flex items-center gap-1 shadow"
                    onClick={() => openEdit(item)}
                  >
                    <Pencil className="w-4 h-4" /> Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="rounded-xl font-semibold flex items-center gap-1 shadow"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Edit/Add Modal */}
      <Dialog
        open={!!editingItem || addingNew}
        onOpenChange={() => {
          setEditingItem(null);
          setAddingNew(false);
        }}
      >
        <DialogContent className="w-full max-w-lg rounded-2xl shadow-2xl p-10 border-0 bg-background/95 backdrop-blur-md">
          <DialogHeader className="pb-4 border-b mb-6">
            <DialogTitle className="flex items-center gap-3 text-2xl font-bold">
              {editingItem ? (
                <>
                  <Pencil className="w-5 h-5 text-primary" /> Edit Item
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5 text-primary" /> Add New Item
                </>
              )}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground mt-1">
              {editingItem
                ? "Update the details for this item."
                : "Fill out the details for the new item."}
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
            className="flex flex-col gap-7"
          >
            <div className="grid grid-cols-1 gap-5">
              <div>
                <Label htmlFor="title" className="mb-1 text-base font-medium">
                  Title
                </Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Item Title"
                  value={form.title}
                  onChange={handleFormChange}
                  required
                  className="rounded-xl"
                />
              </div>
              <div>
                <Label
                  htmlFor="description"
                  className="mb-1 text-base font-medium"
                >
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe the item"
                  value={form.description}
                  onChange={handleFormChange}
                  className="min-h-[70px] rounded-xl"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <Label
                    htmlFor="price"
                    className="mb-1 text-base font-medium flex items-center gap-1"
                  >
                    <Coins className="w-4 h-4 text-yellow-500" /> Price
                  </Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    min={0}
                    placeholder="Tokens"
                    value={form.price}
                    onChange={handleFormChange}
                    required
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="quantity"
                    className="mb-1 text-base font-medium"
                  >
                    Quantity
                  </Label>
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    min={0}
                    placeholder="Amount"
                    value={form.quantity}
                    onChange={handleFormChange}
                    required
                    className="rounded-xl"
                  />
                </div>
              </div>
            </div>
            <DialogFooter className="mt-4 flex flex-col gap-2 w-full">
              <Button
                type="submit"
                disabled={saving}
                className="text-lg font-semibold py-2 rounded-xl w-1/2 shadow"
              >
                {saving && <Loader2 className="animate-spin w-4 h-4 mr-2" />}
                {editingItem ? "Save Changes" : "Add Item"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="rounded-xl w-1/2"
                onClick={() => {
                  setEditingItem(null);
                  setAddingNew(false);
                }}
              >
                Cancel
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
