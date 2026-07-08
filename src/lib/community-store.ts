// Community-Übungen — sync mit Lovable Cloud
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type {
  Exercise,
  Subcategory,
  Difficulty,
} from "@/lib/kondition-store";

export type CommunityStatus = "pending" | "approved" | "rejected";
export type CommunityCategory = "kondition" | "stationenkarten";

export const COMMUNITY_CATEGORIES: { value: CommunityCategory; label: string }[] = [
  { value: "kondition", label: "Kondition" },
  { value: "stationenkarten", label: "Stationenkarten" },
];

export type CommunityExercise = Exercise & {
  status: CommunityStatus;
  category: CommunityCategory;
  createdBy: string;
  authorName?: string | null;
  isCommunity: true;
};


type Row = {
  id: string;
  created_by: string;
  status: CommunityStatus;
  category: CommunityCategory | null;

  title: string;
  subcategory: string;
  short_description: string;
  goal: string;
  steps: unknown;
  duration: string;
  duration_minutes: number;
  group_size: string;
  material: string | null;
  age_group: string;
  age_min: number;
  age_max: number;
  difficulty: string;
  images: unknown;
  video_url: string | null;
  author_name: string | null;
  created_at: string;
};

function rowToExercise(r: Row): CommunityExercise {
  const steps = Array.isArray(r.steps) ? (r.steps as string[]) : [];
  const images = Array.isArray(r.images) ? (r.images as string[]) : [];
  return {
    id: r.id,
    title: r.title,
    subcategory: r.subcategory as Subcategory,
    shortDescription: r.short_description,
    goal: r.goal,
    steps,
    duration: r.duration,
    durationMinutes: r.duration_minutes,
    groupSize: r.group_size,
    material: r.material ?? "",
    ageGroup: r.age_group,
    ageMin: r.age_min,
    ageMax: r.age_max,
    difficulty: r.difficulty as Difficulty,
    images,
    videoUrl: r.video_url ?? undefined,
    createdAt: new Date(r.created_at).getTime(),
    status: r.status,
    category: (r.category as CommunityCategory | null) ?? "kondition",
    createdBy: r.created_by,
    authorName: r.author_name,
    isCommunity: true,

  };
}

// ---------------- Hooks ----------------

export function useCommunityExercises(): {
  list: CommunityExercise[];
  loading: boolean;
  refresh: () => Promise<void>;
} {
  const [list, setList] = useState<CommunityExercise[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const { data, error } = await supabase
      .from("community_exercises")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error("community_exercises load", error);
      setList([]);
    } else {
      setList((data as Row[]).map(rowToExercise));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
    const chName = `community_exercises_changes_${Math.random().toString(36).slice(2, 10)}`;
    const ch = supabase
      .channel(chName)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "community_exercises" },
        () => refresh(),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(ch);
    };
  }, [refresh]);

  return { list, loading, refresh };
}

export function useIsAdmin(): boolean {
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    let alive = true;
    (async () => {
      const { data: session } = await supabase.auth.getSession();
      const uid = session.session?.user.id;
      if (!uid) {
        if (alive) setIsAdmin(false);
        return;
      }
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", uid)
        .eq("role", "admin")
        .maybeSingle();
      if (alive) setIsAdmin(!!data);
    })();
    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      // re-check
      (async () => {
        const { data: session } = await supabase.auth.getSession();
        const uid = session.session?.user.id;
        if (!uid) {
          if (alive) setIsAdmin(false);
          return;
        }
        const { data } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", uid)
          .eq("role", "admin")
          .maybeSingle();
        if (alive) setIsAdmin(!!data);
      })();
    });
    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, []);
  return isAdmin;
}

export function useCurrentUserId(): string | null {
  const [uid, setUid] = useState<string | null>(null);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUid(data.session?.user.id ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setUid(s?.user.id ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);
  return uid;
}

// Cloud-Favoriten (Fallback: leer, wenn nicht eingeloggt)
export function useCloudFavorites(): {
  favs: Set<string>;
  toggle: (id: string) => Promise<void>;
} {
  const [favs, setFavs] = useState<Set<string>>(new Set());

  const load = useCallback(async () => {
    const { data: session } = await supabase.auth.getSession();
    const uid = session.session?.user.id;
    if (!uid) {
      setFavs(new Set());
      return;
    }
    const { data } = await supabase
      .from("exercise_favorites")
      .select("exercise_id")
      .eq("user_id", uid);
    setFavs(new Set((data ?? []).map((r) => r.exercise_id)));
  }, []);

  useEffect(() => {
    load();
    const { data: sub } = supabase.auth.onAuthStateChange(() => load());
    return () => sub.subscription.unsubscribe();
  }, [load]);

  const toggle = useCallback(
    async (id: string) => {
      const { data: session } = await supabase.auth.getSession();
      const uid = session.session?.user.id;
      if (!uid) return;
      if (favs.has(id)) {
        await supabase.from("exercise_favorites").delete().eq("user_id", uid).eq("exercise_id", id);
        setFavs((prev) => {
          const n = new Set(prev);
          n.delete(id);
          return n;
        });
      } else {
        await supabase.from("exercise_favorites").insert({ user_id: uid, exercise_id: id });
        setFavs((prev) => new Set(prev).add(id));
      }
    },
    [favs],
  );

  return { favs, toggle };
}

// ---------------- Actions ----------------

export async function uploadExerciseImage(file: File): Promise<string> {
  const { data: session } = await supabase.auth.getSession();
  const uid = session.session?.user.id;
  if (!uid) throw new Error("Nicht eingeloggt");
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${uid}/${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage
    .from("exercise-uploads")
    .upload(path, file, { contentType: file.type, upsert: false });
  if (error) throw error;
  const { data } = supabase.storage.from("exercise-uploads").getPublicUrl(path);
  return data.publicUrl;
}

export type SubmitCommunityInput = {
  category: CommunityCategory;
  title: string;
  subcategory: string;
  shortDescription: string;
  goal: string;
  steps: string[];
  duration: string;
  durationMinutes: number;
  groupSize: string;
  material: string;
  ageGroup: string;
  ageMin: number;
  ageMax: number;
  difficulty: string;
  images: string[];
  videoUrl?: string;
  authorName?: string;
};

export async function submitCommunityExercise(input: SubmitCommunityInput): Promise<string> {
  const { data: session } = await supabase.auth.getSession();
  const uid = session.session?.user.id;
  if (!uid) throw new Error("Bitte zuerst einloggen.");
  const { data, error } = await supabase
    .from("community_exercises")
    .insert({
      created_by: uid,
      status: "pending",
      category: input.category,
      title: input.title,
      subcategory: input.subcategory,
      short_description: input.shortDescription,
      goal: input.goal,
      steps: input.steps,
      duration: input.duration,
      duration_minutes: input.durationMinutes,
      group_size: input.groupSize,
      material: input.material,
      age_group: input.ageGroup,
      age_min: input.ageMin,
      age_max: input.ageMax,
      difficulty: input.difficulty,
      images: input.images,
      video_url: input.videoUrl ?? null,
      author_name: input.authorName ?? null,
    })
    .select("id")
    .single();

  if (error) throw error;
  return data.id;
}

export async function setCommunityStatus(id: string, status: CommunityStatus): Promise<void> {
  const { error } = await supabase
    .from("community_exercises")
    .update({ status })
    .eq("id", id);
  if (error) throw error;
}

export async function deleteCommunityExercise(id: string): Promise<void> {
  const { error } = await supabase.from("community_exercises").delete().eq("id", id);
  if (error) throw error;
}
