"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";

export function DeleteSiteButton({ siteId }: { siteId: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    const approved = window.confirm(
      "Bu siteyi silmek istediğinize emin misiniz? Bu işlem geri alınamaz."
    );

    if (!approved) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/sites/${siteId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.refresh();
      } else {
        alert("Site silinirken bir hata oluştu.");
      }
    } catch {
      alert("Site silinirken bir hata oluştu.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={deleting}
      className="flex-1 sm:flex-initial p-2 rounded-lg hover:bg-red-50 text-ink-muted hover:text-red-600 transition-colors flex items-center justify-center gap-1 disabled:opacity-60 disabled:cursor-not-allowed"
      aria-label="Siteyi sil"
    >
      {deleting ? (
        <Loader2 className="w-4 h-4 sm:w-4.5 sm:h-4.5 animate-spin" />
      ) : (
        <Trash2 className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
      )}
      <span className="text-xs sm:hidden">{deleting ? "Siliniyor" : "Sil"}</span>
    </button>
  );
}
