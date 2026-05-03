"use client";

import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";

type ListingImageItem = {
  id: string;
  url: string;
  isCover: boolean;
  sortOrder: number;
};

type AmenityItem = {
  id: string;
  name: string;
};

type ListingSourceItem = {
  id: string;
  sourceType: "AIRBNB";
  icalUrl: string;
  externalListingName: string | null;
  isActive: boolean;
  lastSyncedAt: string | null;
};

type Props = {
  listing: {
    id: string;
    slug: string;
    title: string;
    shortDescription: string | null;
    description: string | null;
    city: string | null;
    district: string | null;
    guestCapacity: number;
    bedroomCount: number | null;
    bedCount: number | null;
    bathroomCount: number | null;
    basePrice: string;
    cleaningFee: string | null;
    isActive: boolean;
    images: ListingImageItem[];
    sources: ListingSourceItem[];
    locationMapUrl: string | null;
    checkInTime: string | null;
    checkOutTime: string | null;
    allowSmoking: boolean;
    allowPets: boolean;
    allowEvents: boolean;
    cancellationPolicy: string | null;
    amenities: {
      id: string;
      amenityId: string;
      amenity: {
        id: string;
        name: string;
      };
    }[];
  };
  amenities: AmenityItem[];
};

function slugify(value: string) {
  return value
    .toLocaleLowerCase("tr-TR")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function AdminEditListingForm({ listing, amenities }: Props) {
  const router = useRouter();

  const [title, setTitle] = useState(listing.title);
  const [slug, setSlug] = useState(listing.slug);
  const [shortDescription, setShortDescription] = useState(
    listing.shortDescription || "",
  );
  const [description, setDescription] = useState(listing.description || "");
  const [city, setCity] = useState(listing.city || "");
  const [district, setDistrict] = useState(listing.district || "");
  const [guestCapacity, setGuestCapacity] = useState(
    String(listing.guestCapacity),
  );
  const [bedroomCount, setBedroomCount] = useState(
    listing.bedroomCount ? String(listing.bedroomCount) : "",
  );
  const [bedCount, setBedCount] = useState(
    listing.bedCount ? String(listing.bedCount) : "",
  );
  const [bathroomCount, setBathroomCount] = useState(
    listing.bathroomCount ? String(listing.bathroomCount) : "",
  );
  const [basePrice, setBasePrice] = useState(listing.basePrice);
  const [cleaningFee, setCleaningFee] = useState(listing.cleaningFee || "");
  const [isActive, setIsActive] = useState(listing.isActive);
  const [locationMapUrl, setLocationMapUrl] = useState(
    listing.locationMapUrl || "",
  );
  const [checkInTime, setCheckInTime] = useState(listing.checkInTime || "");
  const [checkOutTime, setCheckOutTime] = useState(listing.checkOutTime || "");
  const [allowSmoking, setAllowSmoking] = useState(listing.allowSmoking);
  const [allowPets, setAllowPets] = useState(listing.allowPets);
  const [allowEvents, setAllowEvents] = useState(listing.allowEvents);
  const [cancellationPolicy, setCancellationPolicy] = useState(
    listing.cancellationPolicy || "",
  );
  const [images, setImages] = useState<ListingImageItem[]>(
    listing.images || [],
  );
  const [selectedAmenityIds, setSelectedAmenityIds] = useState<string[]>(
    listing.amenities.map((item) => item.amenityId),
  );

  const airbnbSource = listing.sources.find(
    (source) => source.sourceType === "AIRBNB",
  );

  const [airbnbIcalUrl, setAirbnbIcalUrl] = useState(
    airbnbSource?.icalUrl || "",
  );
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(
    airbnbSource?.lastSyncedAt || null,
  );

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [syncingCalendar, setSyncingCalendar] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const isDisabled = !title || !slug || !guestCapacity || !basePrice || loading;

  const sortedImages = useMemo(
    () =>
      [...images].sort((a, b) => {
        if (a.isCover && !b.isCover) return -1;
        if (!a.isCover && b.isCover) return 1;
        return a.sortOrder - b.sortOrder;
      }),
    [images],
  );

  const handleToggleAmenity = (amenityId: string) => {
    setSelectedAmenityIds((prev) =>
      prev.includes(amenityId)
        ? prev.filter((id) => id !== amenityId)
        : [...prev, amenityId],
    );
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      const res = await fetch(`/api/admin/listings/${listing.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slug,
          title,
          shortDescription,
          description,
          city,
          district,
          guestCapacity: Number(guestCapacity),
          bedroomCount: bedroomCount ? Number(bedroomCount) : null,
          bedCount: bedCount ? Number(bedCount) : null,
          bathroomCount: bathroomCount ? Number(bathroomCount) : null,
          basePrice,
          cleaningFee: cleaningFee || null,
          isActive,
          amenityIds: selectedAmenityIds,
          locationMapUrl,
          checkInTime,
          checkOutTime,
          allowSmoking,
          allowPets,
          allowEvents,
          cancellationPolicy,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        setErrorMessage(data.message || "Bir hata oluştu.");
        return;
      }

      setSuccessMessage("Villa başarıyla güncellendi.");
      router.push(`/admin/listings`);
    } catch {
      setErrorMessage("Villa güncellenemedi.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAndSyncIcal = async () => {
    try {
      setSyncingCalendar(true);
      setErrorMessage("");
      setSuccessMessage("");

      if (!airbnbIcalUrl.trim()) {
        setErrorMessage("Lütfen bir Airbnb iCal bağlantısı girin.");
        return;
      }

      const saveRes = await fetch(`/api/admin/listings/${listing.id}/source`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sourceType: "AIRBNB",
          icalUrl: airbnbIcalUrl.trim(),
        }),
      });

      const saveData = await saveRes.json();

      if (!saveRes.ok || !saveData.ok) {
        setErrorMessage(saveData.message || "iCal bağlantısı kaydedilemedi.");
        return;
      }

      const syncRes = await fetch(
        `/api/admin/listings/${listing.id}/sync-airbnb`,
        {
          method: "POST",
        },
      );

      const syncData = await syncRes.json();

      if (!syncRes.ok || !syncData.ok) {
        setErrorMessage(syncData.message || "Takvim senkronlanamadı.");
        return;
      }

      setLastSyncedAt(new Date().toISOString());
      setSuccessMessage(
        `Airbnb takvimi başarıyla senkronlandı. ${syncData?.data?.syncedCount ? `${syncData.data.syncedCount} gün işlendi.` : ""}`,
      );
      router.refresh();
    } catch {
      setErrorMessage("Takvim senkronlanamadı.");
    } finally {
      setSyncingCalendar(false);
    }
  };

  const handleUpload = async (file: File) => {
    try {
      setUploading(true);
      setErrorMessage("");
      setSuccessMessage("");

      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();

      if (!uploadRes.ok || !uploadData.ok) {
        setErrorMessage(uploadData.message || "Görsel yüklenemedi.");
        return;
      }

      const imageRes = await fetch(`/api/admin/listings/${listing.id}/images`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: uploadData.url,
          isCover: images.length === 0,
        }),
      });

      const imageData = await imageRes.json();

      if (!imageRes.ok || !imageData.ok) {
        setErrorMessage(imageData.message || "Görsel kaydedilemedi.");
        return;
      }

      setImages((prev) => [...prev, imageData.data]);
      setSuccessMessage("Görsel başarıyla eklendi.");
    } catch {
      setErrorMessage("Görsel yüklenemedi.");
    } finally {
      setUploading(false);
    }
  };

  const handleSetCover = async (imageId: string) => {
    try {
      setUploading(true);
      setErrorMessage("");
      setSuccessMessage("");

      const res = await fetch(
        `/api/admin/listings/${listing.id}/images/${imageId}`,
        {
          method: "PATCH",
        },
      );

      const data = await res.json();

      if (!res.ok || !data.ok) {
        setErrorMessage(data.message || "Kapak görseli güncellenemedi.");
        return;
      }

      setImages((prev) =>
        prev.map((img) => ({
          ...img,
          isCover: img.id === imageId,
        })),
      );
      setSuccessMessage("Kapak görseli güncellendi.");
    } catch {
      setErrorMessage("Kapak görseli güncellenemedi.");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    try {
      setUploading(true);
      setErrorMessage("");
      setSuccessMessage("");

      const res = await fetch(
        `/api/admin/listings/${listing.id}/images/${imageId}`,
        {
          method: "DELETE",
        },
      );

      const data = await res.json();

      if (!res.ok || !data.ok) {
        setErrorMessage(data.message || "Görsel silinemedi.");
        return;
      }

      setImages((prev) => prev.filter((img) => img.id !== imageId));
      setSuccessMessage("Görsel silindi.");
    } catch {
      setErrorMessage("Görsel silinemedi.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-[0_18px_50px_rgba(0,0,0,0.08)]">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Villa başlığı"
          className="w-full rounded-xl border border-black/5 bg-white px-4 py-3 text-sm text-[#4B5563] outline-none"
        />

        <input
          type="text"
          value={slug}
          onChange={(e) => setSlug(slugify(e.target.value))}
          placeholder="Slug"
          className="w-full rounded-xl border border-black/5 bg-white px-4 py-3 text-sm text-[#4B5563] outline-none"
        />

        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Şehir"
          className="w-full rounded-xl border border-black/5 bg-white px-4 py-3 text-sm text-[#4B5563] outline-none"
        />

        <input
          type="text"
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          placeholder="İlçe"
          className="w-full rounded-xl border border-black/5 bg-white px-4 py-3 text-sm text-[#4B5563] outline-none"
        />

        <input
          type="number"
          value={guestCapacity}
          onChange={(e) => setGuestCapacity(e.target.value)}
          placeholder="Kapasite"
          className="w-full rounded-xl border border-black/5 bg-white px-4 py-3 text-sm text-[#4B5563] outline-none"
        />

        <input
          type="number"
          value={bedroomCount}
          onChange={(e) => setBedroomCount(e.target.value)}
          placeholder="Yatak odası"
          className="w-full rounded-xl border border-black/5 bg-white px-4 py-3 text-sm text-[#4B5563] outline-none"
        />

        <input
          type="number"
          value={bedCount}
          onChange={(e) => setBedCount(e.target.value)}
          placeholder="Yatak sayısı"
          className="w-full rounded-xl border border-black/5 bg-white px-4 py-3 text-sm text-[#4B5563] outline-none"
        />

        <input
          type="number"
          value={bathroomCount}
          onChange={(e) => setBathroomCount(e.target.value)}
          placeholder="Banyo sayısı"
          className="w-full rounded-xl border border-black/5 bg-white px-4 py-3 text-sm text-[#4B5563] outline-none"
        />

        <input
          type="number"
          value={basePrice}
          onChange={(e) => setBasePrice(e.target.value)}
          placeholder="Gecelik fiyat"
          className="w-full rounded-xl border border-black/5 bg-white px-4 py-3 text-sm text-[#4B5563] outline-none"
        />

        <input
          type="number"
          value={cleaningFee}
          onChange={(e) => setCleaningFee(e.target.value)}
          placeholder="Temizlik ücreti"
          className="w-full rounded-xl border border-black/5 bg-white px-4 py-3 text-sm text-[#4B5563] outline-none"
        />
      </div>

      <div className="mt-4 space-y-4">
        <input
          type="text"
          value={shortDescription}
          onChange={(e) => setShortDescription(e.target.value)}
          placeholder="Kısa açıklama"
          className="w-full rounded-xl border border-black/5 bg-white px-4 py-3 text-sm text-[#4B5563] outline-none"
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Detaylı açıklama"
          rows={6}
          className="w-full resize-none rounded-xl border border-black/5 bg-white px-4 py-3 text-sm text-[#4B5563] outline-none"
        />

        <label className="flex items-center gap-3 rounded-xl border border-black/5 px-4 py-3 text-sm text-[#4B5563]">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="h-4 w-4"
          />
          Aktif olarak yayınla
        </label>
      </div>
      <div className="mt-6 rounded-2xl border border-black/5 p-5">
        <div className="text-base font-semibold text-[#1F2937]">
          Konum ve Kurallar
        </div>

        <div className="mt-1 text-sm text-gray-500">
          Villa detay sayfasında gösterilecek konum, ev kuralları ve iptal
          politikasını yönetin.
        </div>

        <div className="mt-4 space-y-4">
          <label className="text-xs text-gray-500">Konum</label>
          <input
            type="text"
            value={locationMapUrl}
            onChange={(e) => setLocationMapUrl(e.target.value)}
            placeholder="Google Maps embed link"
            className="w-full rounded-xl border border-black/5 bg-white px-4 py-3 text-sm text-[#4B5563] outline-none"
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500">Giriş Saati</label>
              <input
                type="time"
                value={checkInTime}
                onChange={(e) => setCheckInTime(e.target.value)}
                className="w-full rounded-xl border border-black/5 bg-white px-4 py-3 text-sm text-[#4B5563] outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500">Çıkış Saati</label>
              <input
                type="time"
                value={checkOutTime}
                onChange={(e) => setCheckOutTime(e.target.value)}
                className="w-full rounded-xl border border-black/5 bg-white px-4 py-3 text-sm text-[#4B5563] outline-none"
              />
            </div>
          </div>
          <label className="text-xs text-gray-500">Ev Kuralları</label>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <label className="flex items-center gap-3 rounded-xl border border-black/5 px-4 py-3 text-sm text-[#4B5563]">
              <input
                type="checkbox"
                checked={allowSmoking}
                onChange={(e) => setAllowSmoking(e.target.checked)}
                className="h-4 w-4"
              />
              Sigara içilebilir
            </label>

            <label className="flex items-center gap-3 rounded-xl border border-black/5 px-4 py-3 text-sm text-[#4B5563]">
              <input
                type="checkbox"
                checked={allowPets}
                onChange={(e) => setAllowPets(e.target.checked)}
                className="h-4 w-4"
              />
              Evcil hayvan kabul edilir
            </label>

            <label className="flex items-center gap-3 rounded-xl border border-black/5 px-4 py-3 text-sm text-[#4B5563]">
              <input
                type="checkbox"
                checked={allowEvents}
                onChange={(e) => setAllowEvents(e.target.checked)}
                className="h-4 w-4"
              />
              Etkinlik yapılabilir
            </label>
          </div>
          <label className="text-xs text-gray-500">İptal Politikası</label>
          <textarea
            value={cancellationPolicy}
            onChange={(e) => setCancellationPolicy(e.target.value)}
            rows={4}
            className="w-full resize-none rounded-xl border border-black/5 bg-white px-4 py-3 text-sm text-[#4B5563] outline-none"
          />
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-black/5 p-5">
        <div className="text-base font-semibold text-[#1F2937]">
          Airbnb Takvim Senkronu
        </div>

        <div className="mt-1 text-sm text-gray-500">
          Airbnb iCal bağlantısını ekleyin. Bu bağlantı ile dolu ve bloklu
          tarihler sisteme çekilir.
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto]">
          <input
            type="text"
            value={airbnbIcalUrl}
            onChange={(e) => setAirbnbIcalUrl(e.target.value)}
            placeholder="https://www.airbnb.com/calendar/ical/..."
            className="w-full rounded-xl border border-black/5 bg-white px-4 py-3 text-sm text-[#4B5563] outline-none"
          />

          <button
            type="button"
            disabled={!airbnbIcalUrl.trim() || syncingCalendar}
            onClick={handleSaveAndSyncIcal}
            className={`rounded-xl px-4 py-3 text-sm font-medium text-white transition ${
              !airbnbIcalUrl.trim() || syncingCalendar
                ? "cursor-not-allowed bg-[#373889]/60"
                : "bg-[#373889] hover:bg-[#2c2d6e]"
            }`}
          >
            {syncingCalendar ? "Senkronlanıyor..." : "Kaydet + Senkronla"}
          </button>
        </div>

        {lastSyncedAt && (
          <div className="mt-3 text-sm text-gray-500">
            Son senkron:{" "}
            <span className="font-medium text-[#1F2937]">
              {new Date(lastSyncedAt).toLocaleString("tr-TR")}
            </span>
          </div>
        )}
      </div>

      <div className="mt-6 rounded-2xl border border-black/5 p-5">
        <div className="text-base font-semibold text-[#1F2937]">Özellikler</div>
        <div className="mt-1 text-sm text-gray-500">
          Villada bulunan imkanları seçin
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
          {amenities.map((amenity) => {
            const checked = selectedAmenityIds.includes(amenity.id);

            return (
              <label
                key={amenity.id}
                className="flex items-center gap-3 rounded-xl border border-black/5 px-4 py-3 text-sm text-[#4B5563]"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => handleToggleAmenity(amenity.id)}
                  className="h-4 w-4"
                />
                {amenity.name}
              </label>
            );
          })}
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-black/5 p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-base font-semibold text-[#1F2937]">
              Görseller
            </div>
            <div className="mt-1 text-sm text-gray-500">
              Kapak görseli ve galeri fotoğraflarını yönetin
            </div>
          </div>

          <label className="inline-flex cursor-pointer rounded-xl bg-[#373889] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#2c2d6e]">
            {uploading ? "Yükleniyor..." : "Görsel Yükle"}
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={async (e) => {
                const files = Array.from(e.target.files || []);
                for (const file of files) {
                  await handleUpload(file);
                }
                e.currentTarget.value = "";
              }}
            />
          </label>
        </div>

        {sortedImages.length > 0 ? (
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sortedImages.map((img) => (
              <div
                key={img.id}
                className="overflow-hidden rounded-2xl border border-black/5 bg-white"
              >
                <div className="relative h-44 w-full">
                  <img
                    src={img.url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                  {img.isCover && (
                    <div className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-medium text-[#373889]">
                      Cover
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 p-3">
                  <button
                    type="button"
                    onClick={() => handleSetCover(img.id)}
                    className="flex-1 rounded-xl bg-[#F5F6FA] px-3 py-2 text-sm font-medium text-[#373889] transition hover:bg-[#E9EDF5]"
                  >
                    Kapak Yap
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteImage(img.id)}
                    className="rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
                  >
                    Sil
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-5 rounded-xl bg-[#F5F6FA] px-4 py-6 text-center text-sm text-gray-500">
            Henüz görsel eklenmedi.
          </div>
        )}
      </div>

      {successMessage && (
        <div className="mt-4 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          disabled={isDisabled}
          onClick={handleSubmit}
          className={`rounded-xl px-6 py-3 text-sm font-medium text-white transition ${
            isDisabled
              ? "cursor-not-allowed bg-[#373889]/60"
              : "bg-[#373889] hover:bg-[#2c2d6e]"
          }`}
        >
          {loading ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
        </button>
      </div>
    </div>
  );
}
