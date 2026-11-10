import { createClient } from "@supabase/supabase-js";

type MessagePayload = {
  first_name: string;
  last_name: string;
  phone: string;
  message: string;
};

function isMessagePayload(value: unknown): value is MessagePayload {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  return (
    "first_name" in value &&
    typeof value.first_name === "string" &&
    value.first_name.length <= 80 &&
    "last_name" in value &&
    typeof value.last_name === "string" &&
    value.last_name.length <= 80 &&
    "phone" in value &&
    typeof value.phone === "string" &&
    value.phone.length <= 40 &&
    "message" in value &&
    typeof value.message === "string" &&
    value.message.trim().length > 0
  );
}

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Le formulaire envoyé est invalide." }, { status: 400 });
  }

  if (!isMessagePayload(payload)) {
    return Response.json(
      { error: "Ajoute un message avant de l’envoyer." },
      { status: 400 },
    );
  }

  const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/+$/, "");
  const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;
  if (!supabaseUrl || !supabaseSecretKey) {
    return Response.json(
      { error: "Le formulaire n’est pas encore connecté à sa base de données." },
      { status: 503 },
    );
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseSecretKey, {
      auth: {
        autoRefreshToken: false,
        detectSessionInUrl: false,
        persistSession: false,
      },
    });
    const { error } = await supabase.from("messages").insert({
      first_name: payload.first_name.trim() || null,
      last_name: payload.last_name.trim() || null,
      phone: payload.phone.trim() || null,
      message: payload.message.trim(),
    });

    if (error) {
      return Response.json(
        { error: "Le message n’a pas pu être enregistré. Réessaie dans un instant." },
        { status: 502 },
      );
    }
  } catch {
    return Response.json(
      { error: "Le service de réponses est momentanément inaccessible. Réessaie plus tard." },
      { status: 502 },
    );
  }

  return Response.json({ ok: true });
}
